const Player = require('./Player');
const Timer = require('../components/Timer');
const Types = require('../Types');
const helpers = require('../../helpers');

function squaredDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

const BehaviourStages = {
  Idle: 0,
  RandomMovement: 1,
  TargetPlayer: 2,
  TargetCoins: 4,
  TargetChests: 5,
  RunAway: 6,
};

const BehaviourConfig = {
  [BehaviourStages.Idle]: {
    duration: [3, 5],
    actions: [],
    targets: [],
  },
  [BehaviourStages.RandomMovement]: {
    duration: [1, 3],
    actions: ['randomMovement'],
    targets: [],
  },
  [BehaviourStages.TargetPlayer]: {
    duration: [3, 8],
    actions: ['target', 'attack'],
    targets: [Types.Entity.Player],
  },
  [BehaviourStages.TargetCoins]: {
    duration: [20, 25],
    actions: ['target'],
    targets: [Types.Entity.Coin],
  },
  [BehaviourStages.TargetChests]: {
    duration: [20, 25],
    actions: ['target', 'attack'],
    targets: [Types.Entity.Chest],
    force: [50, 90],
  },
  [BehaviourStages.RunAway]: {
    duration: [1, 5],
    actions: ['runAway'],
    targets: [],
  },
};

class PlayerAI extends Player {
  constructor(game, objectData) {
    super(game, objectData.name);

    this.isBot = true;
    this.target = null;
    this.attackCooldown = 0;
    this.smartness = Math.random();

    this.stageTimer = new Timer(0, 0, 0);
    this.changeDirectionTimer = new Timer(0, 3, 5);
    this.targetTimer = new Timer(0, 5, 7);
    this.entityScanTimer = new Timer(0, 0.2, 0.4);

    this.cachedTargets = [];
    this.lavaPositions = [];

    this.game.map.shape.randomSpawnInside(this.shape);
    this.changeStage();
  }

  resetTargetTimer() {
    this.targetTimer.renew();
    this.targetTimer.active = false;
  }

  changeStage(stage) {
    stage ??= helpers.randomChoice(
      Object.values(BehaviourStages).filter(type => type !== BehaviourStages.RunAway)
    );
    this.stage = stage;
    this.stageConfig = BehaviourConfig[this.stage];

    this.stageTimer.minTime = this.stageConfig.duration[0];
    this.stageTimer.maxTime = this.stageConfig.duration[1];
    this.stageTimer.renew();

    this.resetTargetTimer();
    this.target = null;
  }

  applyInputs(dt) {
    this.stageTimer.update(dt);
    if (this.stageTimer.finished) this.changeStage();

    this.attackCooldown = Math.max(0, this.attackCooldown - dt);

    if (this.target?.removed) this.target = null;

    // Entity scan
    this.entityScanTimer.update(dt);
    if (this.entityScanTimer.finished) {
      this.entityScanTimer.renew();
      this.cachedTargets = this.getEntitiesInViewport()
        .map(id => this.game.entities.get(id))
        .filter(e => e && e !== this && !e.removed);
    }

    // Target timeout
    if (this.target) {
      if (!this.targetTimer.active) {
        this.targetTimer.active = true;
        this.targetTimer.renew();
      }
      this.targetTimer.update(dt);
      if (this.targetTimer.finished) {
        this.target = null;
        this.changeStage(BehaviourStages.RandomMovement);
        this.changeDirectionTimer.finished = true;
        this.resetTargetTimer();
      }
    }

    // Acquire new target if none
    if (!this.target && this.stageConfig.targets.length > 0) {
      let minDistSq = Infinity;
      for (const e of this.cachedTargets) {
        if (!this.stageConfig.targets.includes(e.type)) continue;
        const distSq = squaredDistance(this.shape.x, this.shape.y, e.shape.x, e.shape.y);
        if (distSq < minDistSq) {
          this.target = e;
          minDistSq = distSq;
        }
      }
    }

    // Execute stage actions
    for (const action of this.stageConfig.actions) {
      switch (action) {
        case 'randomMovement':
          this.randomMovement(dt);
          break;
        case 'target':
          this.targetEntity(dt, this.stageConfig.actions.includes('attack'), this.stageConfig.force);
          break;
        case 'runAway':
          this.runAway(dt);
          break;
      }
    }

    this.checkUpgrades();
    super.applyInputs(dt);
  }

  randomMovement(dt) {
    this.changeDirectionTimer.update(dt);
    if (this.changeDirectionTimer.finished) {
      this.changeDirectionTimer.renew();
      this.movementDirection += helpers.random(-Math.PI, Math.PI) / 2;
    }
    this.mouse = {
      angle: this.movementDirection,
      force: helpers.random(100, 150),
    };
  }

  targetEntity(dt, attack = false, force = [100, 150]) {
    if (!this.target) return this.randomMovement(dt);

    const { x, y } = this.target.shape.center;
    const angle = helpers.angle(this.shape.x, this.shape.y, x, y);
    const dist = helpers.distance(this.shape.x, this.shape.y, x, y);

    if (attack) this.attack(dist);

    this.angle = helpers.angleLerp(this.angle, angle, dt / 0.2);
    this.movementDirection = helpers.angleLerp(this.movementDirection, angle, dt / 0.2);
    this.mouse = {
      angle: this.movementDirection,
      force: helpers.random(force[0], force[1]),
    };
  }

  runAway(dt) {
    const now = Date.now();
    this.lavaPositions = this.lavaPositions.filter(p => now - p.time < 10000);
    const avoid = this.lavaPositions[0] ?? this.target?.shape;

    if (!avoid || this.health.percent > 0.5) {
      return this.changeStage();
    }

    const angleAway = helpers.angle(avoid.x, avoid.y, this.shape.x, this.shape.y);

    this.angle = this.movementDirection = helpers.angleLerp(this.movementDirection, angleAway, dt / 0.2);
    this.mouse = {
      angle: this.movementDirection,
      force: helpers.random(130, 150),
    };
  }

  attack(distance) {
    if (!this.sword.isAnimationFinished || this.sword.isFlying || this.attackCooldown > 0) {
      this.inputs.clear();
      return;
    }
    if (distance < 300) {
      this.inputs.inputDown(Types.Input.SwordSwing);
    } else if (distance < 1300) {
      this.inputs.inputDown(Types.Input.SwordThrow);
    }
    this.attackCooldown = helpers.random(0.5, 1.3);
  }

  checkUpgrades() {
    if (this.levels.upgradePoints > 0) {
      this.levels.addBuff(helpers.randomChoice(Object.values(Types.Buff)));
    }
    if (this.smartness > 0.6 && this.evolutions.possibleEvols.size > 0) {
      const evo = helpers.randomChoice(Array.from(this.evolutions.possibleEvols));
      this.evolutions.upgrade(evo);
    }
  }

  damaged(damage, entity) {
    if (entity?.type === Types.Entity.LavaPool || this.effects.has(Types.Effect.Burning)) {
      this.lavaPositions.push({ x: this.shape.x, y: this.shape.y, time: Date.now() });
      this.changeStage(BehaviourStages.RunAway);
      this.target = null;
    } else if (entity && Math.random() > 0.8) {
      this.changeStage(BehaviourStages.TargetPlayer);
      this.target = entity;
    }

    super.damaged(damage, entity);
  }

  remove(reason) {
    super.remove(reason);
    // 自动重生可选逻辑
  }
}

module.exports = PlayerAI;
