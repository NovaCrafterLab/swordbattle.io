// server/src/game/Game.js
const SAT = require('sat');
const IdPool = require('./components/IdPool');
const QuadTree = require('./components/Quadtree');
const GameMap = require('./GameMap');
const GlobalEntities = require('./GlobalEntities');
const Player = require('./entities/Player');
const helpers = require('../helpers');
const config = require('../config');
const filter = require('leo-profanity');
const Types = require('./Types');
const { getBannedIps } = require('../moderation');
const { rectangleRectangle } = require('./collisions');

const { prof } = require('../prof');


const sharedResp = new SAT.Response();

class Game {
  constructor() {
    this.entities = new Map();
    this.players = new Set();
    this.newEntities = new Set();
    this.removedEntities = new Set();
    this.idPool = new IdPool();
    this.map = new GameMap(this);
    this.globalEntities = new GlobalEntities(this);

    this.entitiesQuadtree = null;
    this.tps = 0;

    this._qtTick = 0;
  }

  initialize() {
    this.map.initialize();

    const mapBoundary = this.map;
    this.entitiesQuadtree = new QuadTree(mapBoundary, 10, 5);
  }

  tick(dt) {
    prof('entities.update', () => {
      for (const entity of this.entities.values()) {
        if (entity.type === Types.Entity.Sword) continue;
        entity.update(dt);
      }
    });

    const needRebuild = ++this._qtTick === 2 || this.newEntities.size > 0;
    if (needRebuild) {
      this._qtTick = 0;
      prof('quadtree.rebuild', () => {
        this.updateQuadtree(this.entitiesQuadtree, this.entities);
      });
      this.newEntities.clear();
    }

    prof('collisions', () => {
      for (const entity of this.entities.values()) {
        if (entity.removed) continue;
        if (entity.isGlobal) this.globalEntities.entities.set(entity.id, entity);
        this.processCollisions(entity, dt);
      }
    });

    this.map.update(dt);
  }

  processCollisions(entity, dt) {
    const candidates = this.entitiesQuadtree.get(entity.shape.boundary);

    const targetsSet = entity._targetsSet ??
      (entity._targetsSet = (Array.isArray(entity.targets)
        ? new Set(entity.targets)
        : entity.targets));

    const entityBoundary = entity.shape.boundary;
    const entityCenter = entity.shape.center;

    let depth = 0;

    for (let i = 0; i < candidates.length; i++) {
      const target = candidates[i].entity;
      if (entity === target || target.removed) continue;

      if (target.depthZone && target.depthZone.isPointInside(entityCenter.x, entityCenter.y)) {
        depth = target.id;
      }

      if (!targetsSet.has(target.type)) continue;

      if (!rectangleRectangle(entityBoundary, target.shape.boundary)) continue;

      sharedResp.clear();
      if (target.shape.collides(entity.shape, sharedResp)) {
        entity.processTargetsCollision(target, sharedResp, dt);
      }
    }

    entity.depth = depth;
  }

  processClientMessage(client, data) {
    if (data.spectate && !client.spectator.isSpectating) {
      if (
        config.recaptchaSecretKey &&
        !client.captchaVerified &&
        !data.captchaP1
      ) {
        this.addSpectator(client);
        client.captchaVerified = true;
      } else if (
        config.recaptchaSecretKey &&
        !client.captchaVerified &&
        data.captchaP1
      ) {
        this.addSpectator(client);
        client.captchaVerified = true;
      } else if (!config.recaptchaSecretKey || client.captchaVerified) {
        this.addSpectator(client);
      }

      return;
    }

    let { player } = client;
    if (data.play && (!player || player.removed)) {
      if (getBannedIps().includes(client.ip)) {
        // close connection
        console.log('disconnected reason: banned ip', client.ip);
        client.socket.close();
        return;
      }
      if (config.recaptchaSecretKey && !client.captchaVerified) {
        console.log(
          'disconnected reason: joining without recaptcha verification',
          client.ip,
        );
        client.socket.close();
      }
      player = this.addPlayer(client, data);
    }

    if (!player) return;

    if (data.inputs) {
      for (const input of data.inputs) {
        if (input.inputDown) {
          player.inputs.inputDown(input.inputType);
        } else {
          player.inputs.inputUp(input.inputType);
        }
      }
    }
    if (data.angle && !isNaN(data.angle)) {
      player.angle = Number(data.angle);
    }
    if (data.mouse) {
      if (data.mouse.force === 0) {
        player.mouse = null;
      } else {
        player.mouse = data.mouse;
      }
    }
    if (data.selectedEvolution) {
      player.evolutions.upgrade(data.selectedEvolution);
    }
    if (data.selectedBuff) {
      player.levels.addBuff(data.selectedBuff);
    }
    if (data.chatMessage && typeof data.chatMessage === 'string') {
      player.addChatMessage(data.chatMessage);
    }
  }

  createPayload(client) {
    const { spectator } = client;
    const entity = spectator.isSpectating ? spectator : client.player;
    if (!entity) return null;

    const data = {};

    if (spectator.isSpectating) {
      const spectatorData = spectator.state.get();
      if (client.fullSync) {
        data.spectator = spectatorData;
        data.mapData = this.map.getData();
      } else {
        if (spectator.state.hasChanged()) {
          data.spectator = spectator.state.getChanges();
        }
      }
    }

    if (client.fullSync) {
      client.fullSync = false;
      data.fullSync = true;
      data.selfId = entity.id;
      data.entities = this.getAllEntities(entity);
      data.globalEntities = this.globalEntities.getAll();
    } else {
      data.entities = this.getEntitiesChanges(entity);
      data.globalEntities = this.globalEntities.getChanges();
    }
    // Delete empty entities object so that we don't send empty payload.
    if (Object.keys(data.entities).length === 0) {
      delete data.entities;
    }
    if (Object.keys(data.globalEntities).length === 0) {
      delete data.globalEntities;
    }

    if (Object.keys(data).length === 0) {
      return null;
    }
    return data;
  }

  updateQuadtree(quadtree, entities) {
    quadtree.clear();
    for (const [id, entity] of entities) {
      const collisionRect = entity.shape.boundary;
      collisionRect.entity = entity;
      quadtree.insert(collisionRect);
    }
  }

  getAllEntities(player) {
    const entities = {};
    for (const entityId of player.getEntitiesInViewport()) {
      // const entity = [...this.entities].find(e => e.id === entityId);
      const entity = this.entities.get(entityId);
      if (!entity) continue;
      if (entity.isStatic) {
        entities[entity.id] = entity.state.get();
        continue;
      }
      entities[entity.id] = entity.state.get();
    }
    return entities;
  }

  getEntitiesChanges(player) {
    const changes = {};
    const previousViewport = player.viewportEntityIds;
    const currentViewport = player.getEntitiesInViewport();
    const allViewportEntities = currentViewport.concat(previousViewport);
    for (const entityId of allViewportEntities) {
      const entity = this.entities.get(entityId);
      if (!entity) {
        const removedEntity = [...this.removedEntities].find(
          (e) => e.id === entityId,
        );
        changes[entityId] = {
          removed: true,
        };
        if (
          removedEntity?.type === Types.Entity.Player &&
          removedEntity?.client?.disconnectReason
        ) {
          changes[entityId].disconnectReasonMessage =
            removedEntity.client.disconnectReason.message;
          changes[entityId].disconnectReasonType =
            removedEntity.client.disconnectReason.type;
        }
        continue;
      }
      if (entity.isStatic) continue;

      entity.state.get(); // updates state

      // If player wasn't it previous viewport, it sends as new entity
      if (previousViewport.findIndex((id) => id === entity.id) === -1) {
        changes[entity.id] = entity.state.get();
        // If entity was in previous viewport but it's not in current, it counts as removed entity
      } else if (currentViewport.findIndex((id) => id === entity.id) === -1) {
        changes[entity.id] = {
          ...entity.state.getChanges(),
          removed: true,
        };
        // If entity is in both viewports, just send changes
      } else {
        if (entity.state.hasChanged()) {
          changes[entity.id] = entity.state.getChanges();
        }
      }
    }
    return changes;
  }

  endTick() {
    this.cleanup();
  }

  addPlayer(client, data) {
    // const name = client.player
    //   ? client.player.name
    //   : (client.account ? client.account.username : this.handleNickname(data.name || ''));
    const name =
      client.account && client.account.username
        ? client.account.username
        : client.player && client.player.name
          ? client.player.name
          : this.handleNickname(filter.clean(data.name) || '');
    if (data?.name && data.name !== name) {
      data.name = name;
    }

    if (client.account && client.account.id) {
      // Make sure same account can't join twice
      for (const player of this.players) {
        if (
          player?.client?.account &&
          player.client.account?.id === client.account.id
        ) {
          return;
        }
      }
    }

    // if (this.isNameReserved(name)) return;

    const player = new Player(this, name);
    client.spectator.isSpectating = false;
    client.fullSync = true;
    client.player = player;
    player.client = client;
    if (client.account) {
      const account = client.account;
      if (account.skins && account.skins.equipped) {
        player.skin = account.skins.equipped;
        player.sword.skin = player.skin;
      } else {
      }
    }
    this.players.add(player);
    this.map.spawnPlayer(player);
    this.addEntity(player);
    return player;
  }

  isNameReserved(name) {
    for (const player of this.players) {
      if (player.name === name) {
        return true;
      }
    }
    return false;
  }

  addSpectator(client) {
    const { spectator } = client;
    spectator.isSpectating = true;
    if (!client.player) {
      spectator.initialize();
      client.fullSync = true;
    }
    return spectator;
  }

  addEntity(entity) {
    if (this.entities.has(entity?.id)) return;

    if (entity.id === null) {
      entity.id = this.idPool.take();
    }
    this.entities.set(entity.id, entity);
    this.newEntities.add(entity);
    return entity;
  }

  removeClient(client) {
    if (client.player) {
      this.removeEntity(client.player);
    }
  }

  removeEntity(entity) {
    if (!this.entities.has(entity?.id)) return;

    if (entity.sword) this.removeEntity(entity.sword);
    this.entities.delete(entity?.id);
    this.players.delete(entity);
    this.newEntities.delete(entity);
    this.removedEntities.add(entity);
    entity.removed = true;
  }

  handleNickname(nickname) {
    const nicknameLength = nickname.length >= 1 && nickname.length <= 20;
    return nicknameLength ? nickname : 'Player';
  }

  cleanup() {
    for (const [id, entity] of this.entities) {
      entity.cleanup();
    }

    this.newEntities.clear();
    this.removedEntities.clear();
    this.globalEntities.cleanup();
  }
}

module.exports = Game;
