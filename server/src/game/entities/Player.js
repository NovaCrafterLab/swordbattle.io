// server/src/game/entities/Player.js
const SAT = require('sat');
const filter = require('leo-profanity');

const Inputs = require('../components/Inputs');
const Entity = require('./Entity');
const Circle = require('../shapes/Circle');
const Sword = require('./Sword');
const Effect = require('../effects/Effect');
const SpeedEffect = require('../effects/SpeedEffect');
const SlippingEffect = require('../effects/SlippingEffect');
const BurningEffect = require('../effects/BurningEffect');
const LevelSystem = require('../components/LevelSystem');
const Property = require('../components/Property');
const Viewport = require('../components/Viewport');
const Health = require('../components/Health');
const Timer = require('../components/Timer');
const EvolutionSystem = require('../evolutions');
const Types = require('../Types');
const config = require('../../config');
const { clamp, calculateGemsXP } = require('../../helpers');
const { skins } = require('../../cosmetics.json');

const { prof } = require('../../prof');


class Player extends Entity {
  constructor(game, name) {
    super(game, Types.Entity.Player);
    this.name = name;
    this.isGlobal = true;
    this.client = null;
    this.movedDistance = new SAT.Vector(0, 0);
    this.movementDirection = 0;
    this.angle = 0;
    this.inputs = new Inputs();
    this.mouse = null;
    this.targets.push(Types.Entity.Player);
    this.skin = skins.player.id;

    const { speed, radius, maxHealth, regeneration, viewport } = config.player;
    this.shape = Circle.create(0, 0, radius);
    if (this.name === 'Update Testing Account') {
      this.speed = new Property(1000);
    } else {
      this.speed = new Property(speed);
    }
    this.health = new Health(maxHealth, regeneration);
    this.friction = new Property(1);
    this.regeneration = new Property(regeneration);
    this.knockbackResistance = new Property(1);

    this.startTimestamp = Date.now();
    this.kills = 0;
    this.biome = 0;
    this.inSafezone = true;

    this.viewport = new Viewport(
      this,
      viewport.width,
      viewport.height,
      viewport.zoom,
    );
    this.viewportEntityIds = [];
    this.effects = new Map();
    this.flags = new Map();
    this.sword = new Sword(this);
    this.game.addEntity(this.sword);
    this.levels = new LevelSystem(this);
    this.evolutions = new EvolutionSystem(this);
    this.tamedEntities = new Set();

    this.modifiers = {};

    this.chatMessage = '';
    this.chatMessageTimer = new Timer(0, 3);
  }

  get playtime() {
    return Math.round((Date.now() - this.startTimestamp) / 1000);
  }

  createState() {
    const state = super.createState();
    state.name = this.name;
    state.account = this.client && this.client.account;
    state.angle = this.angle;
    state.kills = this.kills;
    state.flags = {};
    for (const flag of Object.values(Types.Flags)) {
      state.flags[flag] = this.flags.has(flag) ? this.flags.get(flag) : false;
    }

    state.biome = this.biome;
    state.level = this.levels.level;
    state.coins = this.levels.coins;
    state.nextLevelCoins = this.levels.nextLevelCoins;
    state.previousLevelCoins = this.levels.previousLevelCoins;
    state.upgradePoints = this.levels.upgradePoints;
    state.skin = this.skin;

    state.buffs = structuredClone(this.levels.buffs);
    state.evolution = this.evolutions.evolution;
    state.possibleEvolutions = {};
    this.evolutions.possibleEvols.forEach(
      (evol) => (state.possibleEvolutions[evol] = true),
    );

    state.isAbilityAvailable =
      this.evolutions.evolutionEffect.isAbilityAvailable;
    state.abilityActive = this.evolutions.evolutionEffect.isAbilityActive;
    state.abilityDuration = this.evolutions.evolutionEffect.durationTime;
    state.abilityCooldown = this.evolutions.evolutionEffect.cooldownTime;

    state.viewportZoom = this.viewport.zoom.value;
    state.chatMessage = this.chatMessage;

    state.swordSwingAngle = this.sword.swingAngle;
    state.swordSwingProgress = this.sword.swingProgress;
    state.swordSwingDuration = this.sword.swingDuration.value;
    state.swordFlying = this.sword.isFlying;
    state.swordFlyingCooldown = this.sword.flyCooldownTime;
    if (this.removed && this.client) {
      state.disconnectReasonMessage = this.client.disconnectReason.message;
      state.disconnectReasonType = this.client.disconnectReason.type;
    }
    return state;
  }

  update(dt) {
    prof('player-biome', () => this.applyBiomeEffects());
    this.levels.applyBuffs();
    this.effects.forEach((effect) => effect.update(dt));
    this.health.update(dt);
    this.applyInputs(dt);
    this.sword.flySpeed.value = clamp(this.speed.value / 10, 100, 200);
    this.sword.update(dt);

    if (
      this.inputs.isInputDown(Types.Input.Ability) &&
      this.evolutions.evolutionEffect.canActivateAbility
    ) {
      this.evolutions.evolutionEffect.activateAbility();
    }

    this.viewport.zoom.multiplier /= this.shape.scaleRadius.multiplier;

    if (this.chatMessage) {
      this.chatMessageTimer.update(dt);
      if (this.chatMessageTimer.finished) {
        this.chatMessage = '';
      }
    }
  }

  tameWolf(wolf) {
    this.tamedEntities.add(wolf.id);
  }

  applyBiomeEffects() {
    let topBiome = null;
    let topResponse = null;
    let topZ = -Infinity;
    let safezoneInside = false;
    const sharedResp = new SAT.Response();

    for (const biome of this.game.map.biomes) {
      sharedResp.clear();
      if (!biome.shape.collides(this.shape, sharedResp)) continue;

      if (biome.type === Types.Biome.Safezone) safezoneInside = true;

      biome.collides(this, sharedResp);

      const allowed =
        biome.type !== Types.Biome.Safezone || this.inSafezone;
      if (allowed && biome.zIndex > topZ) {
        topBiome = biome;
        topZ = biome.zIndex;
        topResponse = new SAT.Response();
        Object.assign(topResponse, sharedResp);
        topResponse.overlapN = sharedResp.overlapN.clone();
        topResponse.overlapV = sharedResp.overlapV.clone();
      }
    }

    if (topBiome) {
      this.biome = topBiome.type;
      topBiome.applyEffects(this, topResponse);
    }

    if (!safezoneInside) this.inSafezone = false;
  }

  processTargetsCollision(entity, response) {
    const selfWeight = this.weight;
    const targetWeight = entity.weight;
    const totalWeight = selfWeight + targetWeight;

    const mtv = this.shape.getCollisionOverlap(response);
    const selfMtv = mtv.clone().scale(targetWeight / totalWeight);
    const targetMtv = mtv.clone().scale((selfWeight / totalWeight) * -1);

    this.shape.applyCollision(selfMtv);
    entity.shape.applyCollision(targetMtv);
  }

  applyInputs(dt) {
    const mouse = this.mouse;
    const modNoDiag = this.modifiers.disableDiagonalMovement;
    let speed = this.speed.value;
    let dx = 0, dy = 0;

    if (mouse) {
      const FORCE_MAX = 150;
      const ratio = Math.min(mouse.force, FORCE_MAX) / FORCE_MAX;
      speed *= ratio;

      const ang = mouse.angle;
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      dx = speed * cos;
      dy = speed * sin;

      if (modNoDiag && dx && dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
          dx = dx > 0 ? speed : -speed; dy = 0;
        } else {
          dy = dy > 0 ? speed : -speed; dx = 0;
        }
      }
      this.movementDirection = ang;
    } else {
      const dirX = (this.inputs.isInputDown(Types.Input.Right) ? 1 : 0) -
        (this.inputs.isInputDown(Types.Input.Left) ? 1 : 0);
      const dirY = (this.inputs.isInputDown(Types.Input.Down) ? 1 : 0) -
        (this.inputs.isInputDown(Types.Input.Up) ? 1 : 0);

      if (dirX || dirY) {
        const len = Math.hypot(dirX, dirY);
        const nx = dirX / len;
        const ny = dirY / len;
        dx = speed * nx;
        dy = speed * ny;

        if (modNoDiag && dirX && dirY) {
          dx = dirX ? 0 : dx;
          dy = dirY ? speed * Math.sign(dirY) : 0;
        }
        this.movementDirection = Math.atan2(dirY, dirX);
      } else {
        this.movementDirection = 0;
      }
    }

    this.shape.x += this.velocity.x;
    this.shape.y += this.velocity.y;
    this.velocity.scale(0.6);

    const frictionMul = 1 - this.friction.value;
    dx += (this.movedDistance.x *= frictionMul);
    dy += (this.movedDistance.y *= frictionMul);

    const maxLen = speed;
    const len2 = dx * dx + dy * dy;
    if (len2 > maxLen * maxLen) {
      const scale = maxLen / Math.sqrt(len2);
      dx *= scale;
      dy *= scale;
    }

    this.shape.x += dx * dt;
    this.shape.y += dy * dt;
    this.movedDistance.x = dx;
    this.movedDistance.y = dy;

    const halfW = this.game.map.width * 0.5;
    const halfH = this.game.map.height * 0.5;
    this.shape.x = clamp(this.shape.x, -halfW, halfW);
    this.shape.y = clamp(this.shape.y, -halfH, halfH);
  }

  damaged(damage, entity = null) {
    if (this.name !== 'Update Testing Account') {
      this.health.damaged(damage);
    }

    if (!this.health.isDead) return;

    const DAMAGE_REASON = {
      [Types.Entity.Player]: (e) => e.name,
      [Types.Entity.LavaPool]: 'Lava',
      [Types.Entity.Wolf]: 'A Wolf',
      [Types.Entity.Cat]: 'A Cat',
      [Types.Entity.Moose]: 'A Moose',
      [Types.Entity.AngryFish]: 'A Fish',
      [Types.Entity.Yeti]: 'A Yeti',
      [Types.Entity.Chimera]: 'A Chimera',
      [Types.Entity.Roku]: 'Roku',
      [Types.Entity.Snowball]: 'Big Yeti',
      [Types.Entity.Fireball]: 'Roku',
      [Types.Entity.SwordProj]: 'An Ancient Statue',
      [Types.Entity.Ancient]: 'An Ancient Statue',
      [Types.Entity.Boulder]: 'An Ancient Statue',
    };

    let reason = 'Unknown Entity';
    if (entity && DAMAGE_REASON[entity.type]) {
      const r = DAMAGE_REASON[entity.type];
      reason = typeof r === 'function' ? r(entity) : r;
    }

    this.remove(
      reason,
      entity && entity.type === Types.Entity.Player
        ? Types.DisconnectReason.Player
        : Types.DisconnectReason.Mob,
    );
  }

  addEffect(type, id, config) {
    let EffectClass = Effect;
    switch (type) {
      case Types.Effect.Speed:
        EffectClass = SpeedEffect;
        break;
      case Types.Effect.Slipping:
        EffectClass = SlippingEffect;
        break;
      case Types.Effect.Burning:
        EffectClass = BurningEffect;
        break;
    }

    if (!id) id = Math.random();
    if (this.effects.has(id)) {
      this.effects.get(id).continue(config);
    } else {
      const effect = new EffectClass(this, id, config);
      this.effects.set(id, effect);
    }
  }

  addChatMessage(message) {
    if (message.length === '') return;

    message = message.slice(0, 35);
    message = filter.clean(message);
    this.chatMessage = message;
    this.chatMessageTimer.renew();
  }

  getEntitiesInViewport() {
    this.viewportEntityIds = this.game.entitiesQuadtree
      .get(this.viewport.boundary)
      .map((result) => result.entity.id);
    return this.viewportEntityIds;
  }

  remove(message = 'Server', type = Types.DisconnectReason.Server) {
    if (this.removed) return;

    const c = this.client;
    if (c) {
      c.disconnectReason = { message, type };
      c.saveGame({
        coins: this.levels.coins,
        kills: this.kills,
        playtime: this.playtime
      });
    }

    this.evolutions?.reset?.();
    this.effects.clear();
    this.tamedEntities.clear();

    super.remove();

    if (this.evolutions) {
      this.evolutions.possibleEvols.clear();
      this.evolutions.skippedEvols.clear();
    }

    if (this.name !== 'Update Testing Account') {
      const drop = this.calculateDropAmount();
      if (drop > 0) {
        this.game.map.spawnCoinsInShape(
          this.shape, drop, c?.account?.id,
        );
      }
    }
  }

  calculateDropAmount() {
    const coins = this.levels.coins;
    return coins < 13
      ? 10
      : Math.round(
        coins < 25000
          ? coins * 0.8
          : Math.log10(coins) * 30000 - 111938.2002602,
      );
  }

  cleanup() {
    super.cleanup();
    this.sword.cleanup();
    this.flags.clear();
    this.modifiers = {};

    [
      this.speed,
      this.regeneration,
      this.friction,
      this.viewport.zoom,
      this.knockbackResistance,
      this.health.regenWait,
    ].forEach((property) => property.reset());
  }
}


// Check if any duplicate ids in cosmetics.json
(function verifyCosmeticIds() {
  const seen = new Map();
  const duplicates = [];

  for (const skin of Object.values(skins)) {
    if (seen.has(skin.id)) {
      duplicates.push({ id: skin.id, name: skin.name, first: seen.get(skin.id) });
    } else {
      seen.set(skin.id, skin.name);
    }
  }

  if (duplicates.length) {
    console.error('Duplicate skin ids found in cosmetics.json:');
    duplicates.forEach(({ id, name, first }) =>
      console.error(`  id=${id}  first="${first}"  duplicate="${name}"`),
    );
    process.exit(1);
  }
})();

module.exports = Player;
