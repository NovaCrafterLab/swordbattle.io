// server/src/game/Game.js
const SAT = require('sat');
const IdPool = require('./components/IdPool');
const SpatialHash = require('./components/SpatialHash');
const GameMap = require('./GameMap');
const GlobalEntities = require('./GlobalEntities');
const Player = require('./entities/Player');
const helpers = require('../helpers');
const config = require('../config');
const filter = require('leo-profanity');
const Types = require('./Types');
const { getBannedIps } = require('../moderation');
const { rectangleRectangle } = require('./collisions');
const Logger = require('../utils/Logger');


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

    this.logicalTime = 0

    this.entitiesQuadtree = null;
    this.tps = 0;

    this._qtTick = 0;

    // 区块链游戏相关属性初始化
    this.blockchainGameId = null;
    this.gamePhase = 'initializing';
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.registeredPlayers = new Set();
    this.finalScores = new Map();
    this.playerScoreSubmitted = new Set();
    this.isGameCreationInProgress = false;
    this.gameTimeout = null;

    // 游戏最大持续时间 (30分钟)
    this.maxGameDuration = 30 * 60 * 1000;
    this.pendingMassKill = false;
  }

  initialize() {
    this.map.initialize();

    const mapBoundary = this.map;
    this.entitiesQuadtree = new SpatialHash(mapBoundary);
  }

  tick(dt) {
    if (this.pendingMassKill) {
      for (const player of this.players) {
        if (!player.removed && !player.isBot) {
          player.remove('Race Finished', Types.DisconnectReason.Server);
        }
      }
      this.pendingMassKill = false;
    }

    for (const entity of this.entities.values()) {
      if (entity.type === Types.Entity.Sword) continue;
      entity.update(dt);
    }

    // const needRebuild = ++this._qtTick === 4 || this.newEntities.size > 0;
    // if (needRebuild) {
    //   this._qtTick = 0;

    // }

    this._qtTick += 1;
    this.updateQuadtree();
    this.newEntities.clear();

    for (const entity of this.entities.values()) {
      if (entity.removed) continue;
      if (entity.isGlobal) this.globalEntities.entities.set(entity.id, entity);
      this.processCollisions(entity, dt);
    }

    this.map.update(dt);
  }

  processCollisions(entity, dt) {
    const candidates = this.entitiesQuadtree.get(entity.shape.boundary);

    const targetsSet = entity._targetsSet;

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

  // Player-count-based movement threshold
  get movementTolerance() {
    if (this.players.size > 700) return 32;
    if (this.players.size > 400) return 64;
    return 128;
  }

  // Player-count-based quadtree rebuild interval (ticks)
  get quadtreeTickInterval() {
    if (this.players.size > 1200) return 30;
    if (this.players.size > 800) return 60;
    if (this.players.size > 600) return 90;
    return 120;
  }

  changeRatio() {
    let moved = 0;

    // Early return when entity count is small
    if (this.entities.size < 2000)
      return this.newEntities.size + this.removedEntities.size;

    // Check each dynamic entity for large movement
    const tolerance = this.movementTolerance;
    for (const entity of this.entities.values()) {
      if (entity.isStatic || !entity.shape?.boundary) continue;

      const rect = entity.shape.boundary;
      const prev = entity.prevRect;
      if (!prev) continue;

      const dx = Math.abs(prev.x - rect.x);
      const dy = Math.abs(prev.y - rect.y);
      if (dx > tolerance || dy > tolerance) moved++;
    }

    return moved + this.newEntities.size + this.removedEntities.size;
  }

  updateQuadtree() {
    const stable = this.entities.size - this.changeRatio();
    const needFullRebuild =
      stable < 0 || stable * stable < this.entities.size;

    const interval = this.quadtreeTickInterval;

    if (needFullRebuild || this._qtTick < 60 || this._qtTick % interval === 0) {
      this.entitiesQuadtree.clear();
      for (const entity of this.entities.values()) {
        const rect = entity.shape.boundary;
        rect.entity = entity;
        this.entitiesQuadtree.insert(rect);
      }
      return;
    }

    // Incremental updates
    for (const entity of this.removedEntities) {
      const rect = entity.shape.boundary;
      rect.entity = entity;
      this.entitiesQuadtree.remove(rect);
    }

    for (const entity of this.entities.values()) {
      const rect = entity.shape.boundary;
      rect.entity = entity;
      if (entity.removed || this.removedEntities.has(entity)) {
        this.entitiesQuadtree.remove(rect);
        continue;
      }
      this.entitiesQuadtree.update(rect);
    }
  }

  getAllEntities(player) {
    const entities = {};
    for (const entityId of player.getEntitiesInViewport()) {
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

    // 区块链玩家验证（仅在比赛服务器模式下）
    if (config.isRaceServer && config.blockchain.enabled && this.blockchainService) {
      // 检查是否提供了钱包地址
      if (!data.walletAddress) {
        console.log(`❌ Player ${name} rejected: No wallet address provided for race server`);
        client.socket.close();
        return;
      }

      // 异步验证玩家注册状态
      this.verifyAndAddPlayer(client, data, name);
      return; // 异步处理，不直接返回player
    }

    // 正常模式直接添加玩家
    return this.createAndAddPlayer(client, data, name);
  }

  /**
   * 异步验证并添加玩家（区块链模式）
   */
  async verifyAndAddPlayer(client, data, name) {
    try {
      const walletAddress = data.walletAddress;
      console.log(`🔍 Verifying player ${name} with wallet ${walletAddress}...`);

      // 验证玩家是否已在链上注册
      const isRegistered = await this.verifyPlayerRegistration(walletAddress);

      if (!isRegistered) {
        console.log(`❌ Player ${name} rejected: Not registered for current game`);
        // 发送错误消息给客户端
        client.socket.send(JSON.stringify({
          type: 'error',
          message: 'You must join the game on-chain first. Please pay the entry fee to participate.',
        }));
        client.socket.close();
        return;
      }

      // 检查玩家是否已经在游戏中
      for (const player of this.players) {
        if (player.client?.walletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
          console.log(`❌ Player ${name} rejected: Already in game with this wallet`);
          client.socket.close();
          return;
        }
      }

      // 验证通过，创建玩家
      console.log(`✅ Player ${name} verified and joining game`);
      const player = this.createAndAddPlayer(client, data, name);

      // 保存钱包地址到客户端
      client.walletAddress = walletAddress;

      return player;
    } catch (error) {
      console.error(`❌ Error verifying player ${name}:`, error);
      client.socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to verify blockchain registration. Please try again.',
      }));
      client.socket.close();
    }
  }

  /**
   * 创建并添加玩家到游戏
   */
  createAndAddPlayer(client, data, name) {
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
      }
    }

    this.players.add(player);
    this.map.spawnPlayer(player);
    this.addEntity(player);

    // 在比赛模式下，检查是否可以开始游戏
    if (config.isRaceServer && config.blockchain.enabled && this.gamePhase === 'waiting') {
      this.checkGameStart();
    }

    return player;
  }

  /**
   * 检查是否可以开始游戏
   */
  checkGameStart() {
    const registeredCount = this.registeredPlayers.size;
    const activeCount = this.players.size;

    Logger.game.info('Checking game start conditions', {
      activeCount,
      registeredCount,
      gamePhase: this.gamePhase,
      gameId: this.blockchainGameId
    });

    // 可以添加更多开始游戏的条件，比如最小玩家数、时间限制等
    if (activeCount >= Math.min(2, registeredCount)) { // 至少2个玩家或所有注册玩家都加入
      if (this.gamePhase === 'waiting') {
        this.gamePhase = 'active';
        Logger.status('Game started! All players are ready', 'game');

        // 设置游戏超时定时器
        this.startGameTimeout();

        // 可以在这里添加游戏开始的特殊逻辑
        this.broadcastGameStart();
      }
    }
  }

  /**
   * 开始游戏超时计时
   */
  startGameTimeout() {
    if (this.gameTimeoutTimer) {
      clearTimeout(this.gameTimeoutTimer);
    }

    this.gameTimeoutTimer = setTimeout(() => {
      Logger.game.warn('Game timeout reached, ending game automatically', {
        gameId: this.blockchainGameId,
        duration: this.maxGameDuration
      });
      this.endBlockchainGame('timeout');
    }, this.maxGameDuration);

    Logger.game.info('Game timeout set', {
      gameId: this.blockchainGameId,
      timeoutMinutes: this.maxGameDuration / 1000 / 60
    });
  }

  /**
   * 清除游戏超时定时器
   */
  clearGameTimeout() {
    if (this.gameTimeoutTimer) {
      clearTimeout(this.gameTimeoutTimer);
      this.gameTimeoutTimer = null;
      Logger.game.info('Game timeout cleared', { gameId: this.blockchainGameId });
    }
  }

  /**
   * 广播游戏开始消息
   */
  broadcastGameStart() {
    const message = {
      type: 'gameStart',
      gameId: this.blockchainGameId ? Number(this.blockchainGameId) : null,
      phase: this.gamePhase,
      playerCount: this.players.size,
    };

    let successCount = 0;
    let errorCount = 0;

    for (const player of this.players) {
      if (player.client && player.client.socket) {
        try {
          player.client.socket.send(JSON.stringify(message));
          successCount++;
        } catch (error) {
          Logger.game.error('Error sending game start message to player', {
            playerId: player.id,
            error: error.message
          });
          errorCount++;
        }
      }
    }

    Logger.game.info('Game start message broadcasted', {
      gameId: this.blockchainGameId,
      successCount,
      errorCount,
      totalPlayers: this.players.size
    });
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

  // ============ 区块链相关方法 ============

  /**
   * 初始化区块链游戏
   * 在服务器启动时调用，创建链上游戏
   */
  async initializeBlockchainGame(retryCount = 0) {
    if (!config.isRaceServer || !config.blockchain.enabled || !this.blockchainService) {
      return;
    }

    if (this.isGameCreationInProgress) {
      Logger.server.warn('Game creation already in progress');
      return;
    }

    const maxRetries = 3;
    const currentAttempt = retryCount + 1;

    try {
      this.isGameCreationInProgress = true;
      this.gamePhase = 'initializing';

      // 从配置中获取游戏级别
      const gameLevel = config.blockchain.gameLevel || 0;
      Logger.server.info(`🎮 Creating blockchain game (attempt ${currentAttempt}/${maxRetries})`);

      // 在创建游戏前记录初始计数器
      const initialCounter = await this.blockchainService.getGameCounter();

      // 调用合约创建游戏，传入级别参数
      const createResult = await this.blockchainService.createGame(gameLevel);
      Logger.server.info('🚀 Game creation TX sent:', createResult.txHash);

      // 监听GameCreated事件获取gameId，传递初始计数器
      await this.waitForGameCreated(initialCounter);

    } catch (error) {
      Logger.server.error(`❌ Game creation failed (${currentAttempt}/${maxRetries}):`, error.message);
      this.gamePhase = 'error';
      this.isGameCreationInProgress = false;

      // 如果还有重试次数，等待5秒后重试
      if (retryCount < maxRetries - 1) {
        Logger.server.info(`🔄 Retrying in 5s... (${maxRetries - currentAttempt} attempts left)`);
        setTimeout(() => {
          this.initializeBlockchainGame(retryCount + 1);
        }, 5000);
      } else {
        Logger.server.error('🚫 All retries exhausted - blockchain features disabled');
      }
    }
  }

  /**
   * 等待GameCreated事件
   */
  async waitForGameCreated(initialCounter) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('⏱️  Game creation timeout (60s) - transaction may still be pending'));
      }, 60000); // 60秒超时

      const checkGameCreated = async () => {
        try {
          const currentCounter = await this.blockchainService.getGameCounter();
          Logger.server.debug('Checking game counter', { currentCounter, initialCounter });

          // 检查计数器是否增加了（表示新游戏创建成功）
          if (currentCounter > initialCounter) {
            this.blockchainGameId = currentCounter;
            this.gamePhase = 'waiting';
            this.gameStartTime = Date.now();

            Logger.server.info(`🎯 Game created successfully! ID: ${this.blockchainGameId}`);

            clearTimeout(timeout);
            this.isGameCreationInProgress = false;
            resolve();
          } else {
            // 安静等待，不记录日志避免刷屏
            setTimeout(checkGameCreated, 2000);
          }
        } catch (error) {
          Logger.server.error('Error checking game creation', { error: error.message });
          clearTimeout(timeout);
          this.isGameCreationInProgress = false;
          reject(error);
        }
      };

      // 开始检查前稍等一下，让createGame交易有时间处理
      setTimeout(checkGameCreated, 3000);
    });
  }

  /**
   * 验证玩家是否已加入链上游戏
   */
  async verifyPlayerRegistration(playerAddress) {
    if (!this.blockchainService || !this.blockchainGameId) {
      console.log(`❌ Verification failed - blockchainService: ${!!this.blockchainService}, gameId: ${this.blockchainGameId}`);
      return false;
    }

    try {
      console.log(`🔍 Verifying player ${playerAddress} for game ${this.blockchainGameId}:`);

      // 检查玩家是否在链上游戏中
      const players = await this.blockchainService.getGamePlayers(this.blockchainGameId);

      // 确保players是数组
      const playerList = Array.isArray(players) ? players : [];
      console.log(`📋 Found ${playerList.length} players in game ${this.blockchainGameId}:`);
      console.log(`   Players: ${playerList.map(p => p.toLowerCase()).join(', ')}`);
      console.log(`   Looking for: ${playerAddress.toLowerCase()}`);

      const isRegistered = playerList.map(p => p.toLowerCase()).includes(playerAddress.toLowerCase());

      if (isRegistered) {
        this.registeredPlayers.add(playerAddress.toLowerCase());
        console.log(`✅ Player ${playerAddress} verified as registered`);
        return true;
      } else {
        console.log(`❌ Player ${playerAddress} not registered for game ${this.blockchainGameId}`);
        console.log(`   Available players: [${playerList.map(p => p.toLowerCase()).join(', ')}]`);
        console.log(`   Searched for: ${playerAddress.toLowerCase()}`);
        return false;
      }
    } catch (error) {
      console.error('Error verifying player registration:', error);
      return false;
    }
  }

  /**
   * 收集玩家最终分数
   */
  collectPlayerScores() {
    this.finalScores.clear();

    for (const player of this.players) {
      if (player.removed) continue;

      // 收集玩家分数数据
      const score = {
        playerId: player.id,
        playerName: player.name,
        kills: player.kills || 0,
        coins: player.levels?.coins || 0,
        playtime: player.playtime || 0,
        // 可以根据需要添加更多分数计算逻辑
        finalScore: this.calculatePlayerScore(player),
        walletAddress: player.client?.walletAddress || null
      };

      this.finalScores.set(player.id, score);
    }

    Logger.game.info('Collected player scores', {
      gameId: this.blockchainGameId,
      scoreCount: this.finalScores.size
    });
    return this.finalScores;
  }

  /**
   * 计算玩家最终分数
   */
  calculatePlayerScore(player) {
    // 简单的分数计算逻辑，可以根据需要调整
    const kills = player.kills || 0;
    const coins = player.levels?.coins || 0;
    const playtime = player.playtime || 0;

    // 分数 = 击杀数 * 100 + 金币数 * 10 + 游戏时间（秒）
    return kills * 100 + coins * 10 + Math.floor(playtime / 1000);
  }

  /**
   * 结束区块链游戏
   */
  async endBlockchainGame(reason = 'normal') {
    if (!config.isRaceServer || !config.blockchain.enabled || !this.blockchainService) {
      return;
    }

    if (this.gamePhase === 'ending' || this.gamePhase === 'ended') {
      Logger.game.warn('Game already ending or ended', {
        gameId: this.blockchainGameId,
        currentPhase: this.gamePhase
      });
      return;
    }

    try {
      // 清除游戏超时定时器
      this.clearGameTimeout();

      this.gamePhase = 'ending';
      this.gameEndTime = Date.now();

      Logger.status('Ending blockchain game', 'game');
      Logger.game.info('Game end initiated', {
        gameId: this.blockchainGameId,
        reason,
        playerCount: this.players.size,
        duration: this.gameEndTime - this.gameStartTime
      });

      // 收集所有玩家分数
      const scores = this.collectPlayerScores();

      // 尝试为每个玩家的分数进行签名（通过API服务器）
      // 但不要让分数提交失败阻止游戏结束
      try {
        await this.submitPlayerScores(scores);
      } catch (scoreError) {
        Logger.game.error('Failed to submit player scores, but continuing with game end', {
          error: scoreError.message
        });
        // 继续执行游戏结束流程，不让分数提交失败阻止游戏结束
      }

      // 调用合约结束游戏
      const endTxHash = await this.blockchainService.endGame(this.blockchainGameId);
      Logger.server.info('Game end transaction sent', {
        gameId: this.blockchainGameId,
        txHash: endTxHash
      });

      // 等待游戏结束交易确认后，分发奖励到RewardManager
      try {
        console.log(`🎁 开始分发游戏 ${this.blockchainGameId} 的奖励...`);
        const rewardTxHash = await this.blockchainService.distributeGameRewards(this.blockchainGameId);
        console.log(`✅ 奖励分发交易已发送: ${rewardTxHash}`);
      } catch (rewardError) {
        console.error(`❌ 奖励分发失败:`, rewardError.message);
        // 不让奖励分发失败阻止游戏结束流程
      }

      this.gamePhase = 'ended';

      // 清理当前游戏状态
      this.cleanupCurrentGame();

      // 可选：重新开始新游戏
      setTimeout(() => {
        this.initializeBlockchainGame();
      }, 10000); // 10秒后创建新游戏

    } catch (error) {
      Logger.game.error('Failed to end blockchain game', {
        gameId: this.blockchainGameId,
        error: error.message,
        stack: error.stack
      });
      // 即使出错也要尝试设置状态，避免游戏卡在ending状态
      this.gamePhase = 'error';
    }
  }

  /**
   * 提交玩家分数到合约
   */
  async submitPlayerScores(scores) {
    if (!scores || scores.size === 0) {
      console.log('⚠️ No scores to submit');
      return;
    }

    console.log('📤 Submitting player scores to contract...');

    let totalPlayers = 0;
    let playersWithWallet = 0;
    let successfulSubmissions = 0;
    let failedSubmissions = 0;

    // 收集成功的分数数据用于批量保存到数据库
    const gameDataForDatabase = [];

    for (const [playerId, scoreData] of scores) {
      totalPlayers++;

      if (!scoreData.walletAddress) {
        console.log(`⚠️ Skipping player ${scoreData.playerName} - no wallet address`);
        continue;
      }

      playersWithWallet++;
      console.log(`🔄 Processing score for ${scoreData.playerName} (${scoreData.walletAddress}): ${scoreData.finalScore}`);

      try {
        // 获取玩家nonce
        console.log(`📋 Getting nonce for player ${scoreData.walletAddress}...`);
        const nonce = await this.blockchainService.getPlayerNonce(scoreData.walletAddress);
        console.log(`📋 Player nonce: ${nonce}`);

        // 通过API服务器获取签名
        console.log(`✍️ Getting signature from API server...`);
        const signature = await this.getScoreSignature(
          this.blockchainGameId,
          scoreData.walletAddress,
          scoreData.kills,
          scoreData.finalScore,
          nonce
        );
        console.log(`✍️ Signature obtained: ${signature.substring(0, 20)}...`);

        // 调用合约提交分数
        console.log(`📊 Submitting score to blockchain...`);
        const txHash = await this.blockchainService.submitScore(
          this.blockchainGameId,
          scoreData.walletAddress,
          scoreData.kills,
          scoreData.finalScore,
          nonce,
          signature
        );

        console.log(`✅ Score submitted for ${scoreData.playerName}: ${scoreData.finalScore} kills: ${scoreData.kills} (tx: ${txHash})`);
        this.playerScoreSubmitted.add(playerId);
        successfulSubmissions++;

        // 准备数据库保存数据（暂时假设奖励为0，排名为0，后续可以改进）
        gameDataForDatabase.push({
          gameId: Number(this.blockchainGameId),
          playerAddress: scoreData.walletAddress,
          score: scoreData.finalScore,
          kills: scoreData.kills, // 添加击杀数据
          rewardAmount: '0', // 临时值，后续可以从区块链查询实际奖励
          usdRewardAmount: '0', // USD奖励金额
          nclabRewardAmount: '0', // NCLab奖励金额
          hasClaimed: false,
          usdClaimed: false, // USD奖励是否已领取
          nclabClaimed: false, // NCLab奖励是否已领取
          usdClaimable: false, // USD奖励是否可领取
          nclabClaimable: false, // NCLab奖励是否可领取
          nclabClaimableTime: 0, // NCLab奖励可领取时间
          rank: 0, // 临时值，后续可以计算实际排名
          isWinner: false, // 临时值，后续可以根据排名确定
          gameEnded: true,
          gameEndedAt: new Date(),
        });

      } catch (error) {
        console.error(`❌ Failed to submit score for ${scoreData.playerName}:`, error);
        console.error(`❌ Error details: ${error.message}`);
        failedSubmissions++;
      }
    }

    console.log(`📊 Score submission summary:`);
    console.log(`   Total players: ${totalPlayers}`);
    console.log(`   Players with wallet: ${playersWithWallet}`);
    console.log(`   Successful submissions: ${successfulSubmissions}`);
    console.log(`   Failed submissions: ${failedSubmissions}`);

    // 保存成功的游戏数据到数据库
    if (gameDataForDatabase.length > 0) {
      try {
        console.log(`💾 Saving ${gameDataForDatabase.length} game records to database...`);
        await this.saveGameDataToDatabase(gameDataForDatabase);
        console.log(`✅ Game data saved to database successfully`);

        // 🎯 新增：启动异步延迟更新任务，传递当前游戏ID
        this.scheduleBlockchainRewardUpdate(gameDataForDatabase, this.blockchainGameId);

      } catch (dbError) {
        console.error(`❌ Failed to save game data to database:`, dbError);
        // 不抛出错误，让游戏继续结束
      }
    }
  }

  /**
   * 保存游戏数据到数据库
   */
  async saveGameDataToDatabase(gameDataArray) {
    try {
      const response = await fetch(`${config.apiEndpoint}/race-games/save-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.serverSecret}`, // 服务器认证
        },
        body: JSON.stringify({
          games: gameDataArray
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save game data');
      }

      console.log(`💾 Database save response:`, result);
      return result.data;
    } catch (error) {
      console.error('❌ Error saving game data to database:', error);
      throw error;
    }
  }

  /**
   * 安排区块链奖励数据的异步更新任务
   * 游戏结束60秒后查询区块链真实奖励并更新数据库
   */
  scheduleBlockchainRewardUpdate(gameDataArray, gameId) {
    console.log(`⏰ 安排60秒后的区块链奖励更新任务 (游戏ID: ${gameId})...`);

    // 60秒后执行异步更新，使用保存的gameId而不是当前的this.blockchainGameId
    // 增加延迟时间给奖励分发交易更多确认时间
    setTimeout(async () => {
      try {
        console.log(`🔄 开始执行区块链奖励更新任务 (游戏ID: ${gameId})`);
        await this.updateBlockchainRewards(gameDataArray, gameId);
        console.log(`✅ 区块链奖励更新任务完成`);
      } catch (error) {
        console.error(`❌ 区块链奖励更新任务失败:`, error);
        // 可以考虑重试机制或者记录到错误日志中
      }
    }, 60000); // 60秒延迟
  }

  /**
   * 从区块链查询真实奖励数据并更新数据库
   */
  async updateBlockchainRewards(gameDataArray, gameId) {
    if (!gameDataArray || gameDataArray.length === 0) {
      console.log('⚠️ 没有游戏数据需要更新奖励');
      return;
    }

    console.log(`🔗 开始查询游戏 ${gameId} 的区块链奖励数据...`);

    const updatedGameData = [];

    for (const gameData of gameDataArray) {
      try {
        console.log(`🔍 查询玩家 ${gameData.playerAddress} 的奖励...`);

        // 从区块链查询真实奖励数据（使用RewardManager合约）
        const playerRewardStatus = await this.blockchainService.readContract(
          this.blockchainService.getRewardManagerContract(),
          'getPlayerRewardStatus',
          [BigInt(gameId), gameData.playerAddress]
        );

        // getPlayerRewardStatus返回: [usdRewards, nclabRewards, usdClaimable, nclabClaimable, nclabClaimableTime, usdClaimed, nclabClaimed]
        const usdRewards = playerRewardStatus[0];        // USD1奖励总额
        const nclabRewards = playerRewardStatus[1];      // NCLab奖励总额
        const usdClaimable = playerRewardStatus[2];      // USD奖励是否可领取
        const nclabClaimable = playerRewardStatus[3];    // NCLab奖励是否可领取
        const nclabClaimableTime = playerRewardStatus[4]; // NCLab奖励可领取时间
        const usdClaimed = playerRewardStatus[5];        // USD奖励是否已领取
        const nclabClaimed = playerRewardStatus[6];      // NCLab奖励是否已领取

        // 计算总USD奖励金额（以ETH为单位）
        const usdRewardEth = Number(usdRewards) / 1e18;
        const nclabRewardEth = Number(nclabRewards) / 1e18;
        const totalRewardEth = usdRewardEth + nclabRewardEth;

        // 判断是否为获胜者（有任何奖励）
        const isWinner = usdRewards > BigInt(0) || nclabRewards > BigInt(0);

        // 判断是否已全部领取完毕
        const hasClaimedAll = usdClaimed && nclabClaimed;

        // 判断是否有可领取的奖励
        const hasClaimableRewards = usdClaimable || nclabClaimable;

        console.log(`💰 玩家 ${gameData.playerAddress} 区块链奖励:`);
        console.log(`   USD奖励: ${usdRewardEth} USD1 (可领取: ${usdClaimable}, 已领取: ${usdClaimed})`);
        console.log(`   NCLab奖励: ${nclabRewardEth} NCLab (可领取: ${nclabClaimable}, 已领取: ${nclabClaimed})`);
        console.log(`   总奖励: ${totalRewardEth}, 全部已领取: ${hasClaimedAll}`);

        // 更新奖励数据
        const updatedData = {
          ...gameData,
          rewardAmount: totalRewardEth.toString(),
          usdRewardAmount: usdRewardEth.toString(),
          nclabRewardAmount: nclabRewardEth.toString(),
          hasClaimed: hasClaimedAll,
          usdClaimed: Boolean(usdClaimed),
          nclabClaimed: Boolean(nclabClaimed),
          usdClaimable: Boolean(usdClaimable),
          nclabClaimable: Boolean(nclabClaimable),
          nclabClaimableTime: Number(nclabClaimableTime),
          isWinner: isWinner,
        };

        updatedGameData.push(updatedData);

      } catch (error) {
        console.error(`❌ 查询玩家 ${gameData.playerAddress} 奖励失败:`, error.message);
        console.log(`⚠️ 可能原因: 游戏 ${gameId} 的奖励尚未分发到RewardManager合约，或合约地址配置错误`);
        // 如果查询失败，保留原始数据（奖励为0，表示尚未分发）
        updatedGameData.push(gameData);
      }
    }

    // 批量更新数据库中的奖励信息
    if (updatedGameData.length > 0) {
      try {
        console.log(`💾 更新数据库中的奖励信息...`);
        await this.updateRewardsInDatabase(updatedGameData);
        console.log(`✅ 数据库奖励信息更新完成`);
      } catch (dbError) {
        console.error(`❌ 更新数据库奖励信息失败:`, dbError);
      }
    }
  }

  /**
   * 更新数据库中的奖励信息
   */
  async updateRewardsInDatabase(gameDataArray) {
    try {
      const response = await fetch(`${config.apiEndpoint}/race-games/update-rewards`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.serverSecret}`,
        },
        body: JSON.stringify({
          games: gameDataArray
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update reward data');
      }

      console.log(`💾 数据库奖励更新响应:`, result);
      return result.data;
    } catch (error) {
      console.error('❌ 更新数据库奖励信息时出错:', error);
      throw error;
    }
  }

  /**
   * 通过API服务器获取分数签名
   */
  async getScoreSignature(gameId, playerAddress, kills, score, nonce) {
    try {
      // 验证参数
      console.log(`🔍 Signature request parameters:`);
      console.log(`   gameId: ${gameId} (type: ${typeof gameId})`);
      console.log(`   playerAddress: ${playerAddress} (type: ${typeof playerAddress})`);
      console.log(`   kills: ${kills} (type: ${typeof kills})`);
      console.log(`   score: ${score} (type: ${typeof score})`);
      console.log(`   nonce: ${nonce} (type: ${typeof nonce})`);

      if (gameId === undefined || gameId === null) {
        throw new Error('gameId is undefined or null');
      }
      if (playerAddress === undefined || playerAddress === null || playerAddress === '') {
        throw new Error('playerAddress is undefined, null or empty');
      }
      if (kills === undefined || kills === null) {
        throw new Error('kills is undefined or null');
      }
      if (score === undefined || score === null) {
        throw new Error('score is undefined or null');
      }
      if (nonce === undefined || nonce === null) {
        throw new Error('nonce is undefined or null');
      }

      // 将BigInt转换为字符串以避免JSON序列化问题
      const requestBody = {
        gameId: typeof gameId === 'bigint' ? gameId.toString() : String(gameId),
        playerAddress: String(playerAddress),
        kills: typeof kills === 'bigint' ? kills.toString() : String(kills),
        score: typeof score === 'bigint' ? score.toString() : String(score),
        nonce: typeof nonce === 'bigint' ? nonce.toString() : String(nonce),
      };

      console.log(`📤 Sending request to ${config.apiEndpoint}/blockchain/sign-score`);
      console.log(`📤 Request body: ${JSON.stringify(requestBody)}`);

      const response = await fetch(`${config.apiEndpoint}/blockchain/sign-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📨 Response status: ${response.status}`);

      const data = await response.json();
      console.log(`📨 Response data: ${JSON.stringify(data)}`);

      if (data.success) {
        return data.data.signature;
      } else {
        throw new Error(data.error || 'Failed to get signature');
      }
    } catch (error) {
      console.error('Error getting score signature:', error);
      throw error;
    }
  }

  /**
   * 获取区块链游戏状态
   */
  getBlockchainGameStatus() {
    if (!config.isRaceServer || !config.blockchain.enabled) {
      return null;
    }

    return {
      gameId: this.blockchainGameId ? Number(this.blockchainGameId) : null,
      phase: this.gamePhase,
      registeredPlayersCount: this.registeredPlayers.size,
      activePlayersCount: this.players.size,
      gameStartTime: this.gameStartTime,
      gameEndTime: this.gameEndTime,
      finalScoresCount: this.finalScores.size,
      scoresSubmittedCount: this.playerScoreSubmitted.size,
    };
  }

  /**
   * 清理当前游戏状态
   */
  cleanupCurrentGame() {
    Logger.game.info('Cleaning up current game', { gameId: this.blockchainGameId });

    // 清理区块链相关状态
    this.blockchainGameId = null;
    this.registeredPlayers.clear();
    this.finalScores.clear();
    this.playerScoreSubmitted.clear();

    // 重置游戏时间
    this.gameStartTime = null;
    this.gameEndTime = null;

    // 移除所有玩家（让他们重新连接到新游戏）
    const playersToRemove = [...this.players];
    for (const player of playersToRemove) {
      if (player.client) {
        player.client.disconnectReason = {
          message: 'Game ended',
          type: 'GameEnd'
        };
      }
      this.removeEntity(player);
    }

    Logger.game.info('Game cleanup completed', {
      removedPlayers: playersToRemove.length
    });
  }

  /**
   * 分析奖励领取策略
   * 根据奖励状态返回最优的领取策略
   */
  analyzeRewardClaimStrategy(rewardStatus) {
    const {
      usdRewards,
      nclabRewards,
      usdClaimable,
      nclabClaimable,
      usdClaimed,
      nclabClaimed
    } = rewardStatus;

    const strategy = {
      shouldClaimUSD: usdClaimable && !usdClaimed && usdRewards > BigInt(0),
      shouldClaimNCLab: nclabClaimable && !nclabClaimed && nclabRewards > BigInt(0),
      canClaimAll: false,
      recommendedMethod: 'none'
    };

    // 如果两种奖励都可以领取，推荐一键领取
    if (strategy.shouldClaimUSD && strategy.shouldClaimNCLab) {
      strategy.canClaimAll = true;
      strategy.recommendedMethod = 'claimReward'; // 一键领取所有
    }
    // 如果只有USD奖励可领取
    else if (strategy.shouldClaimUSD && !strategy.shouldClaimNCLab) {
      strategy.recommendedMethod = 'claimAllUSDRewards'; // 只领取USD
    }
    // 如果只有NCLab奖励可领取
    else if (!strategy.shouldClaimUSD && strategy.shouldClaimNCLab) {
      strategy.recommendedMethod = 'claimAllNclabRewards'; // 只领取NCLab
    }

    return strategy;
  }
}

module.exports = Game;
