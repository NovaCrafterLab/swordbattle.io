// server/src/game/GameMap.js

const SAT = require('sat');
const Polygon = require('./shapes/Polygon');
const Biome = require('./biomes/Biome');
const EarthBiome = require('./biomes/EarthBiome');
const FireBiome = require('./biomes/FireBiome');
const IceBiome = require('./biomes/IceBiome');
const River = require('./biomes/River');
const Safezone = require('./biomes/Safezone');
const House1 = require('./entities/mapObjects/House1');
const MossyRock = require('./entities/mapObjects/MossyRock');
const Pond = require('./entities/mapObjects/Pond');
const Bush = require('./entities/mapObjects/Bush');
const IceMound = require('./entities/mapObjects/IceMound');
const IcePond = require('./entities/mapObjects/IcePond');
const IceSpike = require('./entities/mapObjects/IceSpike');
const Rock = require('./entities/mapObjects/Rock');
const LavaRock = require('./entities/mapObjects/LavaRock');
const LavaPool = require('./entities/mapObjects/LavaPool');
const Chest = require('./entities/Chest');
const Coin = require('./entities/Coin');
const PlayerAI = require('./entities/PlayerBot');
const WolfMob = require('./entities/mobs/Wolf');
const CatMob = require('./entities/mobs/Cat');
const BunnyMob = require('./entities/mobs/Bunny');
const MooseMob = require('./entities/mobs/Moose');
const FishMob = require('./entities/mobs/Fish');
const AngryFishMob = require('./entities/mobs/AngryFish');
const ChimeraMob = require('./entities/mobs/Chimera');
const YetiMob = require('./entities/mobs/Yeti');
const SantaMob = require('./entities/mobs/Santa');
const RokuMob = require('./entities/mobs/Roku');
const AncientMob = require('./entities/mobs/Ancient');
const Fireball = require('./entities/Fireball');
const Boulder = require('./entities/Boulder');
const SwordProj = require('./entities/SwordProj');
const Snowball = require('./entities/Snowball');
const Timer = require('./components/Timer');
const Types = require('./Types');
const map = require('./maps/main');
const helpers = require('../helpers');
const config = require('../config');

const ENTITY_CLASS_MAP = {
  [Types.Entity.MossyRock]: MossyRock,
  [Types.Entity.Pond]: Pond,
  [Types.Entity.Bush]: Bush,
  [Types.Entity.House1]: House1,
  [Types.Entity.IceMound]: IceMound,
  [Types.Entity.IcePond]: IcePond,
  [Types.Entity.IceSpike]: IceSpike,
  [Types.Entity.Rock]: Rock,
  [Types.Entity.LavaRock]: LavaRock,
  [Types.Entity.LavaPool]: LavaPool,
  [Types.Entity.Chest]: Chest,
  [Types.Entity.Coin]: Coin,
  [Types.Entity.Wolf]: WolfMob,
  [Types.Entity.Cat]: CatMob,
  [Types.Entity.Bunny]: BunnyMob,
  [Types.Entity.Moose]: MooseMob,
  [Types.Entity.Fish]: FishMob,
  [Types.Entity.AngryFish]: AngryFishMob,
  [Types.Entity.Chimera]: ChimeraMob,
  [Types.Entity.Yeti]: YetiMob,
  [Types.Entity.Santa]: SantaMob,
  [Types.Entity.Roku]: RokuMob,
  [Types.Entity.Ancient]: AncientMob,
  [Types.Entity.Fireball]: Fireball,
  [Types.Entity.Boulder]: Boulder,
  [Types.Entity.SwordProj]: SwordProj,
  [Types.Entity.Snowball]: Snowball,
};

class GameMap {
  constructor(game) {
    this.game = game;
    this.biomes = [];
    this.staticObjects = [];
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.safezone = null;
    this.shape = null;
    this.entityTimers = new Set();
    this.coinsCount = map.coinsCount !== undefined ? map.coinsCount : 100;
    this.chestsCount = map.chestCount !== undefined ? map.chestsCount : 50;
    this.aiPlayersCount =
      map.aiPlayersCount !== undefined ? map.aiPlayersCount : 10; // contrary to the name, we want to make sure theres no more than this many AI players, goal is to maintain the game at this many players when low traffic
  }

  initialize() {
    for (const biomeData of map.biomes) {
      this.addBiome(biomeData);
    }
    this.biomes.forEach((biome) => biome.initialize()); // Initialize biomes after they're added to map.biomes
    this.calculateMapBounds();

    for (let i = 0; i < this.chestsCount; i++) {
      this.addEntity({
        type: Types.Entity.Chest,
        respawnable: true,
        spawnZone: this.shape,
      });
    }
    for (let i = 0; i < this.coinsCount; i++) {
      this.addEntity({
        type: Types.Entity.Coin,
        respawnable: true,
        spawnZone: this.shape,
      });
    }
    console.log('spawning', this.aiPlayersCount, 'AI bots');
    for (let i = 0; i < this.aiPlayersCount; i++) {
      this.spawnPlayerBot();
    }
  }

  update(dt) {
    for (const [id, entity] of this.game.entities) {
      this.processBorderCollision(entity, dt);
    }

    for (const spawner of this.entityTimers) {
      spawner.timer.update(dt);
      if (spawner.timer.finished) {
        this.entityTimers.delete(spawner);
        this.addEntity(spawner.definition);
      }
    }

    if (this.game.players.size < this.aiPlayersCount) {
      for (let i = 0; i < this.aiPlayersCount - this.game.players.size; i++) {
        this.spawnPlayerBot();
      }
    }
  }

  spawnPlayerBot() {
    this.addAI({
      type: Types.Entity.Player,
      name: `${helpers.randomNickname()}`,
      isPlayer: true,
      respawnTime: [10, 30],
    });
  }

  spawnCoinsInShape(shape, totalCoinValue, droppedBy) {
    const maxCoinsCount = 200;
    let remainingCoinValue = totalCoinValue;
    const coins = Math.min(Math.round(totalCoinValue / 5), maxCoinsCount);
    const coinValue = totalCoinValue / coins;

    for (let i = 0; i < coins; i++) {
      // Get a random point within the shape for the coin's position
      const randomPoint = shape.getRandomPoint();
      const coin = this.game.map.addEntity({
        type: Types.Entity.Coin,
        position: [randomPoint.x, randomPoint.y], // Spawn directly at the random point
        value: coinValue,
        droppedBy,
      });
      //Remove the velocity application.
      //coin.velocity.add(new SAT.Vector(
      //  randomPoint.x - center.x,
      //  randomPoint.y - center.y,
      //).scale(0.5));
    }
  }

  addAI(objectData) {
    let ObjectClass;
    switch (objectData.type) {
      case Types.Entity.Player:
        ObjectClass = PlayerAI;
        break;
    }

    if (!ObjectClass) return console.warn('Unknown entity type: ', objectData);

    const entity = new ObjectClass(this.game, objectData);
    if (objectData.isPlayer) {
      this.game.players.add(entity);
    }
    this.game.addEntity(entity);
    return entity;
  }

  addEntity(objectData) {
    const ObjectClass = ENTITY_CLASS_MAP[objectData.type];
    if (!ObjectClass) {
      return console.warn('Unknown entity type:', objectData);
    }

    const entity = new ObjectClass(this.game, objectData);
    if (entity.isStatic) this.staticObjects.push(entity);

    this.game.addEntity(entity);
    return entity;
  }

  addEntityTimer(definition, time) {
    this.entityTimers.add({
      timer: new Timer(0, time[0], time[1]),
      definition,
    });
  }

  addBiome(biomeData) {
    let BiomeClass = Biome;
    switch (biomeData.type) {
      case Types.Biome.Safezone:
        BiomeClass = Safezone;
        break;
      case Types.Biome.River:
        BiomeClass = River;
        break;
      case Types.Biome.Earth:
        BiomeClass = EarthBiome;
        break;
      case Types.Biome.Fire:
        BiomeClass = FireBiome;
        break;
      case Types.Biome.Ice:
        BiomeClass = IceBiome;
        break;
    }

    const biome = new BiomeClass(this.game, biomeData);
    this.biomes.push(biome);
    if (biome.type === Types.Biome.Safezone) {
      this.safezone = biome;
    }
    return biome;
  }

  spawnPlayer(player) {
    this.safezone.shape.randomSpawnInside(player.shape);
  }

  calculateMapBounds() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const biome of this.biomes) {
      const bounds = biome.shape.boundary;
      if (minX > bounds.x) minX = bounds.x;
      if (minY > bounds.y) minY = bounds.y;
      if (maxX < bounds.x + bounds.width) maxX = bounds.x + bounds.width;
      if (maxY < bounds.y + bounds.height) maxY = bounds.y + bounds.height;
    }

    this.x = minX;
    this.y = minY;
    this.width = maxX - minX;
    this.height = maxY - minY;

    if (this.width !== config.world.worldWidth) {
      throw new Error(
        `Map width in config is ${config.world.worldWidth}, which differs from ${this.width} calculated from biome definitions`,
      );
    }
    if (this.height !== config.world.worldHeight) {
      throw new Error(
        `Map height in config is ${config.world.worldHeight}, which differs from ${this.height} calculated from biome definitions`,
      );
    }
    this.shape = Polygon.createFromRectangle(
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  processBorderCollision(entity, dt) {
    if (entity.type === Types.Entity.Coin) return;
    entity.collidesWithForbidden(dt, true);

    const bounds = entity.shape.boundary;
    if (bounds.x < this.x) {
      entity.shape.x =
        this.x + bounds.width * (0.5 - entity.shape.centerOffset.x);
    } else if (bounds.x + bounds.width >= this.x + this.width) {
      entity.shape.x =
        this.x +
        this.width -
        bounds.width * (0.5 + entity.shape.centerOffset.x);
    }
    if (bounds.y < this.y) {
      entity.shape.y =
        this.y + bounds.height * (0.5 - entity.shape.centerOffset.y);
    } else if (bounds.y + bounds.height >= this.y + this.height) {
      entity.shape.y =
        this.y +
        this.height -
        bounds.height * (0.5 + entity.shape.centerOffset.y);
    }
  }

  getData() {
    const biomesData = this.biomes.map((biome) => biome.getData());
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      biomes: biomesData,
      staticObjects: this.staticObjects.map((obj) => obj.createState()),
    };
  }
}

module.exports = GameMap;
