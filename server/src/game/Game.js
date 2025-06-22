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
    this.maxGameDuration = 30 * 60 * 1000; // 30分钟 = 1800000毫秒
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

    const needRebuild = ++this._qtTick === 4 || this.newEntities.size > 0;
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
    
    console.log(`🎮 Game status: ${activeCount}/${registeredCount} players joined`);
    
    // 可以添加更多开始游戏的条件，比如最小玩家数、时间限制等
    if (activeCount >= Math.min(2, registeredCount)) { // 至少2个玩家或所有注册玩家都加入
      if (this.gamePhase === 'waiting') {
        this.gamePhase = 'active';
        console.log('🚀 Game started! All players are ready.');
        
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
      console.log('⏰ Game timeout reached, ending game automatically');
      this.endBlockchainGame('timeout');
    }, this.maxGameDuration);

    console.log(`⏱️ Game timeout set for ${this.maxGameDuration / 1000 / 60} minutes`);
  }

  /**
   * 清除游戏超时定时器
   */
  clearGameTimeout() {
    if (this.gameTimeoutTimer) {
      clearTimeout(this.gameTimeoutTimer);
      this.gameTimeoutTimer = null;
      console.log('⏱️ Game timeout cleared');
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

    for (const player of this.players) {
      if (player.client && player.client.socket) {
        try {
          player.client.socket.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error sending game start message to player:', error);
        }
      }
    }
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
      console.log('⏳ Game creation already in progress...');
      return;
    }

    const maxRetries = 3;
    const currentAttempt = retryCount + 1;

    try {
      this.isGameCreationInProgress = true;
      this.gamePhase = 'initializing';
      
      console.log(`🚀 Creating blockchain game... (Attempt ${currentAttempt}/${maxRetries})`);
      
      // 在创建游戏前记录初始计数器
      const initialCounter = await this.blockchainService.getGameCounter();
      console.log(`📊 Current game counter before creation: ${initialCounter}`);
      
      // 调用合约创建游戏
      const createResult = await this.blockchainService.createGame();
      console.log(`✅ Game creation transaction sent: ${createResult.txHash}`);
      console.log(`📊 Transaction details: Initial counter = ${createResult.initialCounter}, Timestamp = ${new Date(createResult.timestamp).toISOString()}`);
      
      // 监听GameCreated事件获取gameId，传递初始计数器
      await this.waitForGameCreated(initialCounter);
      
      console.log(`✅ Blockchain game initialization completed successfully on attempt ${currentAttempt}`);
      
    } catch (error) {
      console.error(`❌ Failed to create blockchain game (attempt ${currentAttempt}/${maxRetries}):`, error);
      this.gamePhase = 'error';
      this.isGameCreationInProgress = false;
      
      // 如果还有重试次数，等待5秒后重试
      if (retryCount < maxRetries - 1) {
        console.log(`🔄 Retrying game creation in 5 seconds... (${maxRetries - currentAttempt} attempts remaining)`);
        setTimeout(() => {
          this.initializeBlockchainGame(retryCount + 1);
        }, 5000);
      } else {
        console.error(`💥 Failed to create blockchain game after ${maxRetries} attempts. Server will continue but blockchain features may not work.`);
      }
    }
  }

  /**
   * 等待GameCreated事件
   */
  async waitForGameCreated(initialCounter) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Game creation timeout'));
      }, 60000); // 60秒超时

      const checkGameCreated = async () => {
        try {
          const currentCounter = await this.blockchainService.getGameCounter();
          console.log(`📊 Checking game counter: ${currentCounter} (initial: ${initialCounter})`);
          
          // 检查计数器是否增加了（表示新游戏创建成功）
          if (currentCounter > initialCounter) {
            this.blockchainGameId = currentCounter;
            this.gamePhase = 'waiting';
            this.gameStartTime = Date.now();
            
            console.log(`🎮 NEW blockchain game created with ID: ${this.blockchainGameId} (previous: ${initialCounter})`);
            console.log('⏳ Waiting for players to join...');
            
            clearTimeout(timeout);
            this.isGameCreationInProgress = false;
            resolve();
          } else {
            console.log(`⏳ Waiting for new game creation... counter still: ${currentCounter}`);
            setTimeout(checkGameCreated, 2000);
          }
        } catch (error) {
          console.error('❌ Error checking game creation:', error);
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
      console.log(`📋 Found ${players.length} players in game ${this.blockchainGameId}:`);
      console.log(`   Players: ${players.map(p => p.toLowerCase()).join(', ')}`);
      console.log(`   Looking for: ${playerAddress.toLowerCase()}`);
      
      const isRegistered = players.map(p => p.toLowerCase()).includes(playerAddress.toLowerCase());
      
      if (isRegistered) {
        this.registeredPlayers.add(playerAddress.toLowerCase());
        console.log(`✅ Player ${playerAddress} verified as registered`);
        return true;
      } else {
        console.log(`❌ Player ${playerAddress} not registered for game ${this.blockchainGameId}`);
        console.log(`   Available players: [${players.map(p => p.toLowerCase()).join(', ')}]`);
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
    
    console.log(`📊 Collected scores for ${this.finalScores.size} players`);
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
      console.log('⚠️ Game already ending or ended');
      return;
    }

    try {
      // 清除游戏超时定时器
      this.clearGameTimeout();
      
      this.gamePhase = 'ending';
      this.gameEndTime = Date.now();
      
      console.log(`🏁 Ending blockchain game (reason: ${reason})`);
      
      // 收集所有玩家分数
      const scores = this.collectPlayerScores();
      
      // 尝试为每个玩家的分数进行签名（通过API服务器）
      // 但不要让分数提交失败阻止游戏结束
      try {
        await this.submitPlayerScores(scores);
      } catch (scoreError) {
        console.error('❌ Failed to submit player scores, but continuing with game end:', scoreError);
        // 继续执行游戏结束流程，不让分数提交失败阻止游戏结束
      }
      
      // 调用合约结束游戏
      const txHash = await this.blockchainService.endGame(this.blockchainGameId);
      console.log(`✅ Game end transaction sent: ${txHash}`);
      
      this.gamePhase = 'ended';
      
      // 清理当前游戏状态
      this.cleanupCurrentGame();
      
      // 可选：重新开始新游戏
      setTimeout(() => {
        this.initializeBlockchainGame();
      }, 10000); // 10秒后创建新游戏
      
    } catch (error) {
      console.error('❌ Failed to end blockchain game:', error);
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
          scoreData.finalScore,
          nonce
        );
        console.log(`✍️ Signature obtained: ${signature.substring(0, 20)}...`);

        // 调用合约提交分数
        console.log(`📊 Submitting score to blockchain...`);
        const txHash = await this.blockchainService.submitScore(
          this.blockchainGameId,
          scoreData.finalScore,
          nonce,
          signature
        );

        console.log(`✅ Score submitted for ${scoreData.playerName}: ${scoreData.finalScore} (tx: ${txHash})`);
        this.playerScoreSubmitted.add(playerId);
        successfulSubmissions++;
        
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
  }

  /**
   * 通过API服务器获取分数签名
   */
  async getScoreSignature(gameId, playerAddress, score, nonce) {
    try {
      // 验证参数
      console.log(`🔍 Signature request parameters:`);
      console.log(`   gameId: ${gameId} (type: ${typeof gameId})`);
      console.log(`   playerAddress: ${playerAddress} (type: ${typeof playerAddress})`);
      console.log(`   score: ${score} (type: ${typeof score})`);
      console.log(`   nonce: ${nonce} (type: ${typeof nonce})`);
      
      if (gameId === undefined || gameId === null) {
        throw new Error('gameId is undefined or null');
      }
      if (playerAddress === undefined || playerAddress === null || playerAddress === '') {
        throw new Error('playerAddress is undefined, null or empty');
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
    console.log('🧹 Cleaning up current game...');
    
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
    
    console.log(`🧹 Game cleanup completed. Removed ${playersToRemove.length} players.`);
  }
}

module.exports = Game;
