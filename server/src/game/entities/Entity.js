const SAT = require('sat');
const State = require('../components/State');
const Health = require('../components/Health');
const Types = require('../Types');
const helpers = require('../../helpers');

class Entity {
  static defaultDefinition = {
    forbiddenBiomes: [],
    forbiddenEntities: [],
  };

  constructor(game, type, definition = {}) {
    this.game = game;
    this.type = type;

    this.id = null;
    this.shape = null;
    this.removed = false;
    this.isStatic = false;
    this.isGlobal = false;
    this.depth = 0;
    this.targets = [];
    this.velocity = new SAT.Vector(0, 0);
    this.state = new State(this.createState.bind(this));

    this.density = 1;
    this.spawnZone = null;
    this.respawnable = false;

    this.originalDefinition = { ...definition }; // used for entity respawn
    this.definition = definition;
    this.processDefinition();
  }

  get weight() {
    return this.shape.area * this.density;
  }

  processDefinition() {
    this.definition = Object.assign(
      {},
      Entity.defaultDefinition,
      this.constructor.defaultDefinition,
      this.definition,
    );

    const { definition } = this;

    if (definition.density !== undefined) {
      this.density = definition.density;
    }
    if (definition.size !== undefined) {
      if (Array.isArray(definition.size)) {
        this.size = helpers.random(definition.size[0], definition.size[1]);
      } else {
        this.size = definition.size;
      }
    }

    if (definition.spawnZone !== undefined) {
      this.spawnZone = definition.spawnZone;
    }
    this.respawnable = definition.respawnable && this.spawnZone;
  }

  spawn() {
    if (this.spawnZone) {
      this.spawnZone.randomSpawnInside(this.shape);

      // Respawn if entity collides with forbidden objects
      let tries = 0;
      while (tries < 10 && this.collidesWithForbidden(1, false)) {
        tries += 1;
        this.spawnZone.randomSpawnInside(this.shape);
      }
    } else if (Array.isArray(this.definition.position)) {
      this.shape.x = this.definition.position[0];
      this.shape.y = this.definition.position[1];
    }
  }

  collidesWithForbidden(dt, collide = false) {
    const response =
      this._collisionResp ?? (this._collisionResp = new SAT.Response());
    response.clear();

    // Set O(1)
    const forbiddenBiomes =
      this._forbiddenBiomesSet ??
      (this._forbiddenBiomesSet = new Set(this.definition.forbiddenBiomes));
    const forbiddenEntities =
      this._forbiddenEntitiesSet ??
      (this._forbiddenEntitiesSet = new Set(this.definition.forbiddenEntities));

    for (const biome of this.game.map.biomes) {
      if (!forbiddenBiomes.has(biome.type)) continue;

      if (biome.shape.collides(this.shape, response)) {
        if (!collide) return true;

        const mtv = this.shape.getCollisionOverlap(response);
        if (Types.Groups.Mobs.includes(this.type)) {
          this.velocity.add(mtv.scale(dt));
          this.target = null; // reached forbidden zone, reset target
          this.angle = Math.atan2(mtv.y, mtv.x);
        } else {
          this.shape.applyCollision(mtv);
        }
        response.clear();
      }
    }

    if (!this.game.entitiesQuadtree) return false;

    const candidates = this.game.entitiesQuadtree
      .get(this.shape.boundary)
      .map((res) => res.entity);

    for (let i = 0; i < candidates.length; i++) {
      const entity = candidates[i];
      if (!forbiddenEntities.has(entity.type)) continue;

      const collisionShape = entity.depthZone ?? entity.shape;
      if (collisionShape.collides(this.shape, response)) {
        if (!collide) return true;

        const mtv = this.shape.getCollisionOverlap(response);
        this.shape.applyCollision(mtv);
        response.clear();
      }
    }

    return false;
  }

  createState() {
    const data = {
      id: this.id,
      type: this.type,
      shapeData: this.shape.getData(),
      depth: this.depth,
    };
    if (this.health instanceof Health) {
      data.healthPercent = this.health.percent;
    }
    return data;
  }

  update() {
    // Use velocity to restrict spawn outside biomes
    this.shape.x += this.velocity.x;
    this.shape.y += this.velocity.y;
    // prevent leaving map
    this.shape.x = helpers.clamp(
      this.shape.x,
      -this.game.map.width / 2,
      this.game.map.width / 2,
    );
    this.shape.y = helpers.clamp(
      this.shape.y,
      -this.game.map.height / 2,
      this.game.map.height / 2,
    );
    this.velocity.scale(0.9);
  }

  processTargetsCollision(targetEntity, dt) { }

  cleanup() {
    this.state.cleanup();
    this.shape.cleanup();
    if (this.health instanceof Health) {
      this.health.cleanup();
    }
  }

  createInstance() {
    if (this.definition.respawnTime) {
      this.game.map.addEntityTimer(
        this.originalDefinition,
        this.definition.respawnTime,
      );
    } else {
      this.game.map.addEntity(this.originalDefinition);
    }
  }

  remove() {
    this.game.removeEntity(this);
  }
}

module.exports = Entity;
