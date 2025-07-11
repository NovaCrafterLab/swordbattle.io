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
const { CYCLE_DATA } = require('../utils/cycleRestart');
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

    this.logicalTime = 0;

    this.entitiesQuadtree = null;
    this.tps = 0;

    this._qtTick = 0;

    // Solana vault game related properties
    this.solanaGameId = null;
    this.gamePhase = 'initializing';
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.registeredPlayers = new Set();
    this.finalKillRewards = new Map();
    this.finalScores = new Map(); // Keep for compatibility
    this.isGameCreationInProgress = false;
    this.gameTimeout = null;

    // 游戏最大持续时间 (30分钟)
    this.maxGameDuration = CYCLE_DATA.PERIOD_MS;
    this.pendingMassKill = false;

    // Game tier properties
    this.gameTier = 'low';

    // 服务器引用，用于访问客户端连接
    this.server = null;

    // Solana vault service for blockchain operations
    this.solanaVaultService = null;
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
          player.remove(
            'Game Ended - Server Restarting',
            Types.DisconnectReason.Server,
          );
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

      if (
        target.depthZone &&
        target.depthZone.isPointInside(entityCenter.x, entityCenter.y)
      ) {
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
    const needFullRebuild = stable < 0 || stable * stable < this.entities.size;

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

    // Solana player verification (only in race server mode)
    if (
      config.isRaceServer &&
      config.solana.enabled &&
      this.solanaVaultService
    ) {
      // Check if wallet address is provided
      if (!data.walletAddress) {
        console.log(
          `❌ Player ${name} rejected: No wallet address provided for race server`,
        );
        client.socket.close();
        return;
      }

      // Async verification of player ticket
      this.verifyAndAddSolanaPlayer(client, data, name);
      return; // Async processing, don't return player directly
    }

    // 正常模式直接添加玩家
    return this.createAndAddPlayer(client, data, name);
  }

  /**
   * Async verification and addition of Solana players
   */
  async verifyAndAddSolanaPlayer(client, data, name) {
    try {
      const walletAddress = data.walletAddress;

      // In RACE mode, use wallet address prefix as player name
      const racePlayerName = walletAddress.slice(0, 11); // 0x + first 9 chars = 11 total
      console.log(
        `🔍 Verifying Solana player ${racePlayerName} with wallet ${walletAddress}...`,
      );

      // Verify player has bought a ticket for this game
      const hasTicket = await this.verifySolanaPlayerTicket(walletAddress);

      if (!hasTicket) {
        console.log(
          `❌ Player ${racePlayerName} rejected: No ticket found for current game`,
        );
        // Send error message to client
        client.socket.send(
          JSON.stringify({
            type: 'error',
            message:
              'You must buy a ticket for this game first. Please purchase an entry ticket to participate.',
          }),
        );
        client.socket.close();
        return;
      }

      // Check if player is already in game
      for (const player of this.players) {
        if (
          player.client?.walletAddress?.toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          console.log(
            `❌ Player ${racePlayerName} rejected: Already in game with this wallet`,
          );
          client.socket.close();
          return;
        }
      }

      // Verification passed, create player
      console.log(
        `✅ Solana player ${racePlayerName} verified and joining game`,
      );
      const player = this.createAndAddPlayer(client, data, racePlayerName);

      // Save wallet address to client
      client.walletAddress = walletAddress;

      return player;
    } catch (error) {
      const walletAddress = data.walletAddress;
      const racePlayerName = walletAddress
        ? walletAddress.slice(0, 11)
        : 'Unknown';
      console.error(
        `❌ Error verifying Solana player ${racePlayerName}:`,
        error,
      );
      client.socket.send(
        JSON.stringify({
          type: 'error',
          message: 'Failed to verify ticket. Please try again.',
        }),
      );
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

    // In race mode, check if game can start
    if (
      config.isRaceServer &&
      config.solana.enabled &&
      this.gamePhase === 'waiting'
    ) {
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
      gameId: this.solanaGameId,
    });

    // 可以添加更多开始游戏的条件，比如最小玩家数、时间限制等
    if (activeCount >= Math.min(2, registeredCount)) {
      // 至少2个玩家或所有注册玩家都加入
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
        gameId: this.solanaGameId,
        duration: this.maxGameDuration,
      });
      this.endSolanaGame('timeout');
    }, this.maxGameDuration);

    Logger.game.info('Game timeout set', {
      gameId: this.solanaGameId,
      timeoutMinutes: this.maxGameDuration / 1000 / 60,
    });
  }

  /**
   * 清除游戏超时定时器
   */
  clearGameTimeout() {
    if (this.gameTimeoutTimer) {
      clearTimeout(this.gameTimeoutTimer);
      this.gameTimeoutTimer = null;
      Logger.game.info('Game timeout cleared', { gameId: this.solanaGameId });
    }
  }

  /**
   * 广播游戏开始消息
   */
  broadcastGameStart() {
    const message = {
      type: 'gameStart',
      gameId: this.solanaGameId ? Number(this.solanaGameId) : null,
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
            error: error.message,
          });
          errorCount++;
        }
      }
    }

    Logger.game.info('Game start message broadcasted', {
      gameId: this.solanaGameId,
      successCount,
      errorCount,
      totalPlayers: this.players.size,
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

  // ============ Solana Vault Methods ============

  /**
   * Initialize Solana game vault
   * Called on server startup to create on-chain game
   */
  /**
   * Initialize Solana game with tier support
   */
  async initializeSolanaGame(retryCount = 0, tier = 'low') {
    if (
      !config.isRaceServer ||
      !config.solana.enabled ||
      !this.solanaVaultService
    ) {
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

      // Create game vault atomically to prevent race conditions between multiple servers
      Logger.server.info(
        `🎮 Creating Solana game vault atomically with tier (attempt ${currentAttempt}/${maxRetries})`,
        {
          tier,
          message: 'Using atomic creation to prevent server conflicts',
        },
      );

      // Validate tier configuration
      const tierConfig = this.solanaVaultService.getTierConfig(tier);
      Logger.server.info(`🏆 Game tier configuration`, {
        tier,
        entranceFee: tierConfig.entranceFee,
        killReward: tierConfig.killReward,
        levelRange: `${tierConfig.minLevel}-${tierConfig.maxLevel}`,
      });

      // Atomically create the next available game ID and initialize vault
      const createResult =
        await this.solanaVaultService.createGameAtomically(tier);

      if (createResult.success) {
        this.solanaGameId = createResult.gameId; // Use the actual game ID returned
        this.gameTier = tier; // Store tier for later use
        this.gamePhase = 'waiting';
        this.gameStartTime = Date.now();

        Logger.server.info(
          `✅ Solana game vault created successfully with tier!`,
          {
            gameId: this.solanaGameId,
            tier: tier,
            tierConfig: createResult.tierConfig,
            txHash: createResult.txHash,
            tokenMint: createResult.tokenMint,
          },
        );
        this.isGameCreationInProgress = false;
      } else {
        throw new Error('Failed to create game vault');
      }
    } catch (error) {
      Logger.server.error(
        `❌ Solana game creation failed (${currentAttempt}/${maxRetries}):`,
        {
          error: error.message,
          stack: error.stack,
          solanaService: !!this.solanaVaultService,
          isInitialized: this.solanaVaultService?.isInitialized,
          walletAddress: this.solanaVaultService?.wallet?.publicKey?.toString(),
        },
      );

      this.gamePhase = 'error';
      this.isGameCreationInProgress = false;

      // Retry if attempts remaining
      if (retryCount < maxRetries - 1) {
        Logger.server.info(
          `🔄 Retrying in 5s... (${maxRetries - currentAttempt} attempts left)`,
        );
        setTimeout(() => {
          this.initializeSolanaGame(retryCount + 1);
        }, 5000);
      } else {
        Logger.server.error(
          '🚫 All retries exhausted - Solana features disabled',
        );
      }
    }
  }

  /**
   * Get comprehensive token information for the current Solana game
   */
  async getCurrentGameTokenInfo() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      Logger.server.warn(
        'Cannot get token info - Solana service or gameId missing',
        {
          hasService: !!this.solanaVaultService,
          gameId: this.solanaGameId,
        },
      );
      return null;
    }

    try {
      Logger.server.debug('🔍 Getting current game token info', {
        gameId: this.solanaGameId,
      });

      const tokenInfo = await this.solanaVaultService.getGameTokenInfo(
        this.solanaGameId,
      );

      Logger.server.info('✅ Retrieved current game token info', {
        gameId: this.solanaGameId,
        tokenMint: tokenInfo.tokenMint,
        isActive: tokenInfo.isActive,
        canBuyTickets: tokenInfo.canBuyTickets,
      });

      return tokenInfo;
    } catch (error) {
      Logger.server.error('Failed to get current game token info', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Get only the token mint address for the current Solana game
   */
  async getCurrentGameTokenMint() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      Logger.server.warn(
        'Cannot get token mint - Solana service or gameId missing',
        {
          hasService: !!this.solanaVaultService,
          gameId: this.solanaGameId,
        },
      );
      return null;
    }

    try {
      Logger.server.debug('🪙 Getting current game token mint', {
        gameId: this.solanaGameId,
      });

      const tokenMint = await this.solanaVaultService.getGameTokenMint(
        this.solanaGameId,
      );

      Logger.server.info('✅ Retrieved current game token mint', {
        gameId: this.solanaGameId,
        tokenMint,
      });

      return tokenMint;
    } catch (error) {
      Logger.server.error('Failed to get current game token mint', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Get detailed vault account information for the current Solana game
   */
  async getCurrentVaultAccount() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      Logger.server.warn(
        'Cannot get vault account - Solana service or gameId missing',
        {
          hasService: !!this.solanaVaultService,
          gameId: this.solanaGameId,
        },
      );
      return null;
    }

    try {
      Logger.server.debug('🏛️ Getting current game vault account', {
        gameId: this.solanaGameId,
      });

      const vaultAccount = await this.solanaVaultService.getVaultAccount(
        this.solanaGameId,
      );

      Logger.server.info('✅ Retrieved current game vault account', {
        gameId: this.solanaGameId,
        tokenMint: vaultAccount.tokenMint,
        totalDeposit: vaultAccount.totalDeposit,
        finalized: vaultAccount.finalized,
        withdrawEnabled: vaultAccount.withdrawEnabled,
      });

      return vaultAccount;
    } catch (error) {
      Logger.server.error('Failed to get current game vault account', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Verify player has bought a ticket for this Solana game
   * Replaces complex BSC registration verification
   */
  async verifySolanaPlayerTicket(playerAddress) {
    if (!this.solanaVaultService || !this.solanaGameId) {
      console.log(
        `❌ Verification failed - solanaService: ${!!this.solanaVaultService}, gameId: ${this.solanaGameId}`,
      );
      return false;
    }

    try {
      // Check if player has bought a ticket for this game
      const hasTicket = await this.solanaVaultService.verifyPlayerTicket(
        this.solanaGameId,
        playerAddress,
      );

      if (hasTicket) {
        this.registeredPlayers.add(playerAddress.toLowerCase());
        console.log(`✅ Player ${playerAddress} has valid ticket`);
        return true;
      } else {
        console.log(
          `❌ Player ${playerAddress} has no ticket for game ${this.solanaGameId}`,
        );
        return false;
      }
    } catch (error) {
      console.error('Error verifying player ticket:', error);
      return false;
    }
  }

  /**
   * Old BSC method - no longer used
   */
  async waitForGameCreated(initialCounter) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(
            '⏱️  Game creation timeout (60s) - transaction may still be pending',
          ),
        );
      }, 60000); // 60秒超时

      const checkGameCreated = async () => {
        try {
          const currentCounter = await this.blockchainService.getGameCounter();
          Logger.server.debug('Checking game counter', {
            currentCounter,
            initialCounter,
          });

          // 检查计数器是否增加了（表示新游戏创建成功）
          if (currentCounter > initialCounter) {
            this.blockchainGameId = currentCounter;
            this.gamePhase = 'waiting';
            this.gameStartTime = Date.now();

            Logger.server.info(
              `🎯 Game created successfully! ID: ${this.blockchainGameId}`,
            );

            clearTimeout(timeout);
            this.isGameCreationInProgress = false;
            resolve();
          } else {
            // 安静等待，不记录日志避免刷屏
            setTimeout(checkGameCreated, 2000);
          }
        } catch (error) {
          Logger.server.error('Error checking game creation', {
            error: error.message,
          });
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
      console.log(
        `❌ Verification failed - blockchainService: ${!!this.blockchainService}, gameId: ${this.blockchainGameId}`,
      );
      return false;
    }

    try {
      // 验证玩家注册状态

      // 检查玩家是否在链上游戏中
      const players = await this.blockchainService.getGamePlayers(
        this.blockchainGameId,
      );

      // 确保players是数组
      const playerList = Array.isArray(players) ? players : [];
      // 检查游戏玩家列表

      const isRegistered = playerList
        .map((p) => p.toLowerCase())
        .includes(playerAddress.toLowerCase());

      if (isRegistered) {
        this.registeredPlayers.add(playerAddress.toLowerCase());
        console.log(`✅ Player ${playerAddress} joined game`);
        return true;
      } else {
        console.log(
          `❌ Player ${playerAddress} not registered for game ${this.blockchainGameId}`,
        );
        console.log(`   Searched for: ${playerAddress.toLowerCase()}`);
        return false;
      }
    } catch (error) {
      console.error('Error verifying player registration:', error);
      return false;
    }
  }

  /**
   * Collect player kill-based rewards for Solana
   * Simplified from complex BSC score collection
   */
  collectPlayerKillRewards() {
    this.finalKillRewards.clear();

    for (const player of this.players) {
      if (player.removed) continue;

      const killReward = this.calculatePlayerKillRewards(player);

      // Only include players with kills and wallet addresses
      if (killReward.kills > 0 && player.client?.walletAddress) {
        const rewardData = {
          playerId: player.id,
          playerName: player.name,
          walletAddress: player.client.walletAddress,
          kills: killReward.kills,
          rewardSOL: killReward.rewardSOL,
          rewardLamports: killReward.rewardLamports,
        };

        this.finalKillRewards.set(player.id, rewardData);
      }
    }

    Logger.game.info('Collected player kill rewards', {
      gameId: this.solanaGameId,
      rewardCount: this.finalKillRewards.size,
      totalRewardSOL: Array.from(this.finalKillRewards.values())
        .reduce((sum, r) => sum + r.rewardSOL, 0)
        .toFixed(6),
    });

    return this.finalKillRewards;
  }

  /**
   * Legacy BSC score collection - no longer used
   */
  collectPlayerScores() {
    // Keep for compatibility but not used in Solana mode
    this.finalScores.clear();

    for (const player of this.players) {
      if (player.removed) continue;

      const score = {
        playerId: player.id,
        playerName: player.name,
        kills: player.kills || 0,
        coins: player.levels?.coins || 0,
        playtime: player.playtime || 0,
        finalScore: this.calculatePlayerScore(player),
        walletAddress: player.client?.walletAddress || null,
      };

      this.finalScores.set(player.id, score);
    }

    Logger.game.info('Collected player scores', {
      gameId: this.solanaGameId,
      scoreCount: this.finalScores.size,
    });
    return this.finalScores;
  }

  /**
   * Calculate kill-based rewards for Solana
   * Simplified from complex BSC scoring system
   */
  calculatePlayerKillRewards(player) {
    // Only kills matter for Solana rewards
    const kills = player.kills || 0;
    const killReward = config.solana.killReward || 0.001; // SOL per kill

    return {
      kills,
      rewardSOL: kills * killReward,
      rewardLamports: Math.floor(kills * killReward * 1e9), // Convert to lamports
    };
  }

  /**
   * Legacy BSC score calculation - no longer used
   */
  calculatePlayerScore(player) {
    // Keep for compatibility but not used in Solana mode
    const kills = player.kills || 0;
    const coins = player.levels?.coins || 0;
    const playtime = player.playtime || 0;

    return kills * 100 + coins * 10 + Math.floor(playtime / 1000);
  }

  /**
   * End Solana game - simplified version using kill-based rewards
   */
  async endSolanaGame(reason = 'normal') {
    if (
      !config.isRaceServer ||
      !config.solana.enabled ||
      !this.solanaVaultService
    ) {
      return;
    }

    if (this.gamePhase === 'ending' || this.gamePhase === 'ended') {
      Logger.game.warn('Game already ending or ended', {
        gameId: this.solanaGameId,
        currentPhase: this.gamePhase,
      });
      return;
    }

    try {
      // Clear game timeout timer
      this.clearGameTimeout();

      this.gamePhase = 'ending';
      this.gameEndTime = Date.now();

      Logger.status('Ending Solana game', 'game');
      Logger.game.info('Solana game end initiated', {
        gameId: this.solanaGameId,
        reason,
        playerCount: this.players.size,
        duration: this.gameEndTime - this.gameStartTime,
      });

      console.log(
        `📢 Solana Game ${this.solanaGameId} ending (${reason}) - calculating kill-based rewards...`,
      );

      // Collect kill-based rewards (much simpler than BSC)
      const killRewards = this.collectPlayerKillRewards();

      // Broadcast game end to all clients
      this.broadcastSolanaGameEnd(reason, killRewards);

      // Finalize game with tier-based VaultSDK (single operation vs complex BSC flow)
      await this.finalizeSolanaGameWithRewards(
        killRewards,
        this.gameTier || 'low',
      );

      // Set game as ended
      this.gamePhase = 'ended';

      // Clean up current game state
      this.cleanupCurrentGame();

      console.log(
        `✅ Solana Game ${this.solanaGameId} finalized. Server will restart for new game.`,
      );

      // Trigger server restart
      this.triggerServerRestart();
    } catch (error) {
      Logger.game.error('Failed to end Solana game', {
        gameId: this.solanaGameId,
        error: error.message,
        stack: error.stack,
      });

      this.gamePhase = 'error';

      // Restart server even if error occurred
      setTimeout(() => {
        this.triggerServerRestart();
      }, 5000);
    }
  }

  /**
   * Legacy BSC method - no longer used
   */
  async endBlockchainGame(reason = 'normal') {
    // Redirect to Solana method
    return this.endSolanaGame(reason);
  }

  /**
   * Finalize Solana game with tier-based kill rewards
   * Replaces complex BSC score submission with single VaultSDK call
   */
  async finalizeSolanaGameWithRewards(killRewards, tier = 'low') {
    console.log(
      `🔄 Finalizing Solana game ${this.solanaGameId} with ${killRewards.size} reward entries`,
    );

    try {
      if (killRewards.size === 0) {
        console.log('⚠️ No kill rewards to distribute');
        return { success: true, rewardsDistributed: 0 };
      }

      // Convert rewards Map to array format for SolanaVaultService
      const rewardArray = Array.from(killRewards.values());

      console.log(`💰 Distributing pre-calculated rewards:`, {
        playerCount: rewardArray.length,
        totalSOL: rewardArray
          .reduce((sum, r) => sum + r.rewardSOL, 0)
          .toFixed(6),
        rewards: rewardArray.map(
          (r) => `${r.playerName}: ${r.kills} kills = ${r.rewardSOL} SOL`,
        ),
      });

      // Pass pre-calculated rewards to SolanaVaultService (no re-calculation)
      const result = await this.solanaVaultService.finalizeGame(
        this.solanaGameId,
        rewardArray, // Pre-calculated reward data
        tier,
      );

      if (result.success) {
        console.log(
          `✅ Solana game finalized successfully with tier ${tier} - ${result.rewardsDistributed} rewards set`,
        );

        // 🎯 新增：保存游戏结果到数据库
        if (config.apiEndpoint) {
          try {
            await this.saveGameResultsToDatabase(
              killRewards,
              this.solanaGameId,
            );
            console.log(`💾 Game results saved to database successfully`);
          } catch (dbError) {
            console.error(
              `⚠️ Database save failed but blockchain operations completed:`,
              dbError.message,
            );
            Logger.game.error(
              'Database save failed after successful blockchain finalization',
              {
                gameId: this.solanaGameId,
                error: dbError.message,
              },
            );
            // 不抛出错误，让区块链操作成功完成
          }
        } else {
          console.log(`⚠️ Database save skipped - API endpoint not configured`);
        }

        return result;
      } else {
        throw new Error('VaultSDK finalizeGame failed');
      }
    } catch (error) {
      console.error(`❌ Failed to finalize Solana game:`, error.message);
      Logger.game.error('Solana game finalization failed', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Broadcast Solana game end to all clients
   * Simplified version of BSC broadcast
   */
  broadcastSolanaGameEnd(reason, killRewards) {
    console.log(
      `📢 Solana Game ${this.solanaGameId} ending (${reason}) - notifying players`,
    );

    // Use existing pendingMassKill mechanism to kick players cleanly
    this.pendingMassKill = true;

    const playerCount = this.players.size;
    const rewardCount = killRewards.size;
    const totalSOL = Array.from(killRewards.values()).reduce(
      (sum, r) => sum + r.rewardSOL,
      0,
    );

    console.log(
      `🔄 Scheduled ${playerCount} players to be kicked, ${rewardCount} rewards distributed (${totalSOL.toFixed(6)} SOL total)`,
    );
  }

  /**
   * Legacy BSC method - complex implementation no longer used
   */
  async processCompleteBlockchainGameEnd(gameId, scores, reason) {
    console.log(
      `🔄 Starting complete blockchain processing for game ${gameId}`,
    );

    let scoreSubmissionSuccess = false;
    let gameEndSuccess = false;
    let rewardDistributionSuccess = false;

    try {
      // 1. 提交分数到区块链
      console.log(`📊 Step 1/3: Submitting player scores to blockchain...`);
      try {
        await this.submitPlayerScores(scores);
        scoreSubmissionSuccess = true;
        console.log(`✅ Score submission completed successfully`);

        // 等待分数提交交易确认
        console.log(`⏳ Waiting 30s for score confirmations...`);
        await new Promise((resolve) => setTimeout(resolve, 30000));
        console.log(`✅ Score confirmation wait completed`);
      } catch (scoreError) {
        console.error(`❌ Failed to submit player scores:`, scoreError.message);
        Logger.game.error('Failed to submit player scores', {
          gameId,
          error: scoreError.message,
        });
        // 继续处理，但记录失败状态
      }

      // 2. 调用合约结束游戏
      console.log(`🔚 Step 2/3: Ending game ${gameId} on blockchain...`);
      try {
        const endTxHash = await this.blockchainService.endGame(gameId);
        gameEndSuccess = true;
        console.log(`✅ Game ${gameId} ended successfully - TX: ${endTxHash}`);

        Logger.server.info('Game end transaction sent', {
          gameId,
          txHash: endTxHash,
        });

        // 等待游戏结束交易确认
        console.log(`⏳ Waiting 10s for game end confirmation...`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } catch (endGameError) {
        console.error(
          `❌ Failed to end game on blockchain:`,
          endGameError.message,
        );
        Logger.game.error('Failed to end game on blockchain', {
          gameId,
          error: endGameError.message,
        });
        throw endGameError; // 游戏结束失败是严重错误
      }

      // 3. 检查和分发奖励
      console.log(`🎁 Step 3/3: Processing rewards for game ${gameId}...`);
      try {
        const rewardResult =
          await this.blockchainService.distributeGameRewards(gameId);
        rewardDistributionSuccess = true;
        console.log(`✅ Rewards processed successfully`);

        // 获取游戏最终状态
        const finalGameInfo =
          await this.blockchainService.getGameFullInfo(gameId);
        console.log(
          `🏁 Final game state: Pool ${finalGameInfo.totalPool.toString()}, Duration ${finalGameInfo.gameDuration}s`,
        );

        // 查询所有玩家的奖励分发情况
        const activePlayers =
          await this.blockchainService.getGamePlayers(gameId);
        console.log(
          `🔍 Checking rewards for ${activePlayers.length} players...`,
        );

        for (const playerAddress of activePlayers) {
          try {
            await this.blockchainService.checkPlayerRewards(
              gameId,
              playerAddress,
            );
          } catch (playerRewardError) {
            console.warn(
              `⚠️ Failed to check rewards for player ${playerAddress}:`,
              playerRewardError.message,
            );
          }
        }

        Logger.game.info('Game rewards distributed', {
          gameId,
          result: rewardResult,
        });
      } catch (rewardError) {
        console.error(
          `❌ Failed to distribute game rewards:`,
          rewardError.message,
        );
        Logger.game.error('Failed to distribute game rewards', {
          gameId,
          error: rewardError.message,
        });
        // 奖励分发失败不阻止游戏结束，但记录状态
      }

      // 最终状态汇总
      console.log(`📋 Blockchain processing summary for game ${gameId}:`);
      console.log(
        `   Score Submission: ${scoreSubmissionSuccess ? '✅ Success' : '❌ Failed'}`,
      );
      console.log(
        `   Game End: ${gameEndSuccess ? '✅ Success' : '❌ Failed'}`,
      );
      console.log(
        `   Reward Distribution: ${rewardDistributionSuccess ? '✅ Success' : '❌ Failed'}`,
      );

      if (gameEndSuccess) {
        console.log(
          `✅ Complete blockchain processing finished for game ${gameId}`,
        );
      } else {
        console.error(
          `❌ Critical blockchain operations failed for game ${gameId}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ Complete blockchain processing failed for game ${gameId}:`,
        error.message,
      );
      Logger.game.error('Complete blockchain processing failed', {
        gameId,
        error: error.message,
        stack: error.stack,
        scoreSubmissionSuccess,
        gameEndSuccess,
        rewardDistributionSuccess,
      });
      throw error;
    }
  }

  /**
   * 向所有客户端广播游戏结束消息并踢出玩家
   */
  broadcastGameEnd(reason, scores) {
    console.log(
      `📢 Game ${this.blockchainGameId} ending (${reason}) - kicking all players to main menu`,
    );

    // 使用pendingMassKill机制，在下一次tick时踢出所有玩家
    // 这与周期重启使用相同的机制，确保玩家被正确踢出并回到主界面
    this.pendingMassKill = true;

    const playerCount = this.players.size;
    console.log(
      `🔄 Scheduled ${playerCount} players to be kicked in next game tick`,
    );
  }

  /**
   * 触发服务器重启以开始新游戏
   */
  triggerServerRestart() {
    console.log(`🔄 Triggering server restart to begin new game...`);

    // 设置标志，准备重启
    this.pendingMassKill = true;

    // 给客户端一些时间处理游戏结束状态
    setTimeout(() => {
      console.log(`🔄 Executing server restart...`);

      // Clean up game state for Solana
      this.clearGameTimeout();
      Object.assign(this, {
        gamePhase: 'initializing',
        solanaGameId: null,
        gameStartTime: null,
        gameEndTime: null,
      });
      this.registeredPlayers.clear();
      this.finalKillRewards.clear();
      this.finalScores.clear(); // Keep for compatibility

      // 重置所有客户端状态
      if (this.server?.clients) {
        for (const client of this.server.clients.values()) {
          client.player = null;
          client.spectator.isSpectating = true;
          client.fullSync = true;
        }
      }

      // Start new Solana game
      console.log(`🎮 Server restarted, initializing new Solana game...`);
      this.initializeSolanaGame().catch((error) => {
        console.error(
          `❌ Failed to initialize new Solana game after restart:`,
          error.message,
        );
        // If new game creation fails, try restart again
        setTimeout(() => {
          this.triggerServerRestart();
        }, 10000);
      });
    }, 3000); // 3秒延迟，给客户端足够时间
  }

  /**
   * 提交玩家分数到合约（并发执行）
   */
  async submitPlayerScores(scores) {
    if (!scores || scores.size === 0) {
      console.log('⚠️ No scores to submit');
      return;
    }

    const startTime = Date.now();
    console.log(
      `📤 Starting concurrent score submission for game ${this.blockchainGameId} - ${scores.size} players total`,
    );

    // 首先显示所有玩家的分数概览
    console.log('📊 Player scores overview:');
    for (const [playerId, scoreData] of scores) {
      console.log(
        `   ${scoreData.playerName} (${scoreData.walletAddress || 'NO_WALLET'}): ${scoreData.finalScore} pts, ${scoreData.kills} kills`,
      );
    }

    // 过滤出有钱包地址的玩家
    const playersWithWallet = Array.from(scores.entries()).filter(
      ([playerId, scoreData]) => {
        if (!scoreData.walletAddress) {
          console.log(
            `⚠️ Skipping player ${scoreData.playerName} - no wallet address`,
          );
          return false;
        }
        return true;
      },
    );

    if (playersWithWallet.length === 0) {
      console.log('⚠️ No players with wallet addresses to submit scores');
      return;
    }

    console.log(
      `🚀 Starting concurrent submission for ${playersWithWallet.length} players with wallets...`,
    );

    // 创建并发提交Promise数组
    const submissionPromises = playersWithWallet.map(([playerId, scoreData]) =>
      this.submitSinglePlayerScore(playerId, scoreData),
    );

    // 使用Promise.allSettled等待所有提交完成
    const results = await Promise.allSettled(submissionPromises);

    // 分析结果
    const successful = [];
    const failed = [];
    const gameDataForDatabase = [];

    results.forEach((result, index) => {
      const [playerId, scoreData] = playersWithWallet[index];

      if (result.status === 'fulfilled') {
        successful.push({ playerId, scoreData, result: result.value });
        this.playerScoreSubmitted.add(playerId);

        // 准备数据库保存数据
        gameDataForDatabase.push({
          gameId: Number(this.blockchainGameId),
          playerAddress: scoreData.walletAddress,
          score: scoreData.finalScore,
          kills: scoreData.kills,
          rewardAmount: '0', // 临时值，后续可以从区块链查询实际奖励
          usdRewardAmount: '0',
          nclabRewardAmount: '0',
          hasClaimed: false,
          usdClaimed: false,
          nclabClaimed: false,
          usdClaimable: false,
          nclabClaimable: false,
          nclabClaimableTime: 0,
          rank: 0,
          isWinner: false,
          gameEnded: true,
          gameEndedAt: new Date(),
        });
      } else {
        failed.push({
          playerId,
          scoreData,
          error: result.reason,
        });
      }
    });

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    // 显示并发执行结果
    console.log(
      `📊 Concurrent score submission completed in ${totalTime.toFixed(2)}s:`,
    );
    console.log(`   Total players: ${scores.size}`);
    console.log(`   Players with wallet: ${playersWithWallet.length}`);
    console.log(`   Successful submissions: ${successful.length}`);
    console.log(`   Failed submissions: ${failed.length}`);

    if (successful.length > 0) {
      console.log(`✅ Successfully submitted scores:`);
      successful.forEach((success, index) => {
        console.log(
          `   ${index + 1}. ${success.scoreData.playerName}: ${success.scoreData.finalScore} pts, ${success.scoreData.kills} kills`,
        );
      });
    }

    if (failed.length > 0) {
      console.log(`❌ Failed submissions:`);
      failed.forEach((failure, index) => {
        console.log(
          `   ${index + 1}. ${failure.scoreData.playerName} (${failure.scoreData.walletAddress})`,
        );
        console.log(
          `      Score: ${failure.scoreData.finalScore}, Kills: ${failure.scoreData.kills}`,
        );
        console.log(`      Error: ${failure.error.message}`);

        // 检查特定错误类型
        if (failure.error.message.includes('403')) {
          console.log(`      💡 Likely API authentication issue`);
        } else if (failure.error.message.includes('nonce')) {
          console.log(`      💡 Likely blockchain nonce issue`);
        } else if (failure.error.message.includes('gas')) {
          console.log(`      💡 Likely gas estimation issue`);
        } else if (failure.error.message.includes('timeout')) {
          console.log(
            `      💡 Request timeout - try increasing timeout limit`,
          );
        }
      });
    }

    // 异步查询成功提交玩家的奖励信息
    if (successful.length > 0) {
      console.log(
        `🎁 Scheduling reward queries for ${successful.length} successful submissions...`,
      );
      setTimeout(() => {
        this.queryPlayerRewardsAsync(successful);
      }, 5000);
    }

    // 🎯 注意：数据库保存现在通过Solana游戏结束流程处理
    // 不再在BSC score submission中处理数据库保存
    console.log(
      `⚠️ BSC database save removed - data will be saved through Solana finalize flow`,
    );
  }

  /**
   * 提交单个玩家分数（带超时控制）
   */
  async submitSinglePlayerScore(playerId, scoreData) {
    const timeout = 60000; // 60秒超时

    return Promise.race([
      this.performSingleScoreSubmission(playerId, scoreData),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(new Error(`Submission timeout after ${timeout / 1000}s`)),
          timeout,
        ),
      ),
    ]);
  }

  /**
   * 执行单个玩家的分数提交
   */
  async performSingleScoreSubmission(playerId, scoreData) {
    try {
      console.log(`🔄 [${scoreData.playerName}] Starting score submission...`);

      // 获取玩家nonce
      console.log(`📋 [${scoreData.playerName}] Getting player nonce...`);
      const nonce = await this.blockchainService.getPlayerNonce(
        scoreData.walletAddress,
      );
      console.log(`📋 [${scoreData.playerName}] Nonce: ${nonce}`);

      // 通过API服务器获取签名
      console.log(`✍️ [${scoreData.playerName}] Getting signature...`);
      const signature = await this.getScoreSignature(
        this.blockchainGameId,
        scoreData.walletAddress,
        scoreData.kills,
        scoreData.finalScore,
        nonce,
      );
      console.log(`✍️ [${scoreData.playerName}] Signature obtained`);

      // 提交分数到区块链
      console.log(`📤 [${scoreData.playerName}] Submitting to blockchain...`);
      const txHash = await this.blockchainService.submitScore(
        this.blockchainGameId,
        scoreData.walletAddress,
        scoreData.kills,
        scoreData.finalScore,
        nonce,
        signature,
      );

      console.log(
        `✅ [${scoreData.playerName}] Score submitted successfully - TX: ${txHash}`,
      );
      return { success: true, txHash, playerName: scoreData.playerName };
    } catch (error) {
      console.error(
        `❌ [${scoreData.playerName}] Submission failed: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * 异步查询玩家奖励信息
   */
  async queryPlayerRewardsAsync(successfulSubmissions) {
    console.log(
      `🎁 Starting async reward queries for ${successfulSubmissions.length} players...`,
    );

    const rewardPromises = successfulSubmissions.map(async (submission) => {
      try {
        await this.blockchainService.checkPlayerRewards(
          this.blockchainGameId,
          submission.scoreData.walletAddress,
        );
        console.log(
          `🎁 [${submission.scoreData.playerName}] Reward query completed`,
        );
      } catch (error) {
        console.warn(
          `⚠️ [${submission.scoreData.playerName}] Reward query failed: ${error.message}`,
        );
      }
    });

    try {
      await Promise.allSettled(rewardPromises);
      console.log(`🎁 Async reward queries completed for all players`);
    } catch (error) {
      console.error(`❌ Error during async reward queries: ${error.message}`);
    }
  }

  /**
   * 安排区块链奖励数据的异步更新任务
   * 游戏结束60秒后查询区块链真实奖励并更新数据库
   */
  scheduleBlockchainRewardUpdate(gameDataArray, gameId) {
    // 安排奖励更新任务

    // 60秒后执行异步更新，使用保存的gameId而不是当前的this.blockchainGameId
    // 增加延迟时间给奖励分发交易更多确认时间
    setTimeout(async () => {
      try {
        await this.updateBlockchainRewards(gameDataArray, gameId);
        console.log(`✅ Rewards updated for game ${gameId}`);
      } catch (error) {
        console.error(
          `❌ Reward update failed for game ${gameId}:`,
          error.message,
        );
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

    // 查询区块链奖励数据

    const updatedGameData = [];

    for (const gameData of gameDataArray) {
      try {
        // 查询玩家奖励

        // 从区块链查询真实奖励数据（使用GameAggregator合约）
        const playerRewardStatus =
          await this.blockchainService.getPlayerCompleteRewards(
            gameId,
            gameData.playerAddress,
          );

        // getPlayerCompleteRewards返回: PlayerCompleteRewards结构体
        // { usdAmount, nclabAmount, fragmentBonus, ...其他字段 }
        const usdRewards = playerRewardStatus.usdAmount || BigInt(0); // USD1奖励总额
        const nclabRewards = playerRewardStatus.nclabAmount || BigInt(0); // NCLab奖励总额
        const fragmentBonus = playerRewardStatus.fragmentBonus || 0; // 额外碎片数

        // 注意：getPlayerCompleteRewards可能不包含可领取状态信息
        // 这些信息可能需要从其他接口获取，暂时设为默认值
        const usdClaimable = true; // 默认可领取
        const nclabClaimable = true; // 默认可领取
        const nclabClaimableTime = 0; // 默认立即可领取
        const usdClaimed = false; // 默认未领取
        const nclabClaimed = false; // 默认未领取

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

        // 只在有奖励时记录关键信息
        if (isWinner) {
          console.log(
            `💰 Player ${gameData.playerAddress}: ${usdRewardEth.toFixed(4)} USD1 + ${nclabRewardEth.toFixed(4)} NCLab`,
          );
        }

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
        console.error(
          `❌ 查询玩家 ${gameData.playerAddress} 奖励失败:`,
          error.message,
        );
        console.log(
          `⚠️ 可能原因: 游戏 ${gameId} 的奖励尚未分发到RewardManager合约，或合约地址配置错误`,
        );
        // 如果查询失败，保留原始数据（奖励为0，表示尚未分发）
        updatedGameData.push(gameData);
      }
    }

    // 批量更新数据库中的奖励信息
    if (updatedGameData.length > 0) {
      try {
        await this.updateRewardsInDatabase(updatedGameData);
        console.log(
          `✅ Database updated with rewards for ${updatedGameData.length} players`,
        );
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
      const response = await fetch(
        `${config.apiEndpoint}/race-games/update-rewards`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.serverSecret}`,
          },
          body: JSON.stringify({
            games: gameDataArray,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update reward data');
      }

      // 数据库更新成功
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
      console.log(
        `   playerAddress: ${playerAddress} (type: ${typeof playerAddress})`,
      );
      console.log(`   kills: ${kills} (type: ${typeof kills})`);
      console.log(`   score: ${score} (type: ${typeof score})`);
      console.log(`   nonce: ${nonce} (type: ${typeof nonce})`);

      if (gameId === undefined || gameId === null) {
        throw new Error('gameId is undefined or null');
      }
      if (
        playerAddress === undefined ||
        playerAddress === null ||
        playerAddress === ''
      ) {
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

      console.log(
        `📤 Sending request to ${config.apiEndpoint}/blockchain/sign-score`,
      );
      console.log(`📤 Request body: ${JSON.stringify(requestBody)}`);

      const response = await fetch(
        `${config.apiEndpoint}/blockchain/sign-score`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

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
   * Get Solana game status
   */
  getSolanaGameStatus() {
    if (!config.isRaceServer || !config.solana.enabled) {
      return null;
    }

    return {
      gameId: this.solanaGameId ? Number(this.solanaGameId) : null,
      phase: this.gamePhase,
      registeredPlayersCount: this.registeredPlayers.size,
      activePlayersCount: this.players.size,
      gameStartTime: this.gameStartTime,
      gameEndTime: this.gameEndTime,
      killRewardsCount: this.finalKillRewards.size,
      totalRewardSOL: Array.from(this.finalKillRewards.values()).reduce(
        (sum, r) => sum + r.rewardSOL,
        0,
      ),
    };
  }

  /**
   * Legacy BSC status method - redirects to Solana
   */
  getBlockchainGameStatus() {
    return this.getSolanaGameStatus();
  }

  /**
   * Clean up current Solana game state
   */
  cleanupCurrentGame() {
    Logger.game.info('Cleaning up current Solana game', {
      gameId: this.solanaGameId,
    });

    // Clear Solana-related state
    this.solanaGameId = null;
    this.registeredPlayers.clear();
    this.finalKillRewards.clear();
    this.finalScores.clear(); // Keep for compatibility

    // Reset game time
    this.gameStartTime = null;
    this.gameEndTime = null;

    // Remove all players (let them reconnect to new game)
    const playersToRemove = [...this.players];
    for (const player of playersToRemove) {
      if (player.client) {
        player.client.disconnectReason = {
          message: 'Game ended',
          type: 'GameEnd',
        };
      }
      this.removeEntity(player);
    }

    Logger.game.info('Solana game cleanup completed', {
      removedPlayers: playersToRemove.length,
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
      nclabClaimed,
    } = rewardStatus;

    const strategy = {
      shouldClaimUSD: usdClaimable && !usdClaimed && usdRewards > BigInt(0),
      shouldClaimNCLab:
        nclabClaimable && !nclabClaimed && nclabRewards > BigInt(0),
      canClaimAll: false,
      recommendedMethod: 'none',
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

  /**
   * Get comprehensive game token information
   */
  async getCurrentGameTokenInfo() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      return null;
    }

    try {
      const gameInfo = await this.solanaVaultService.vaultSDK.getGameInfo(
        parseInt(this.solanaGameId),
      );

      return {
        tokenMint: gameInfo.tokenMint.toString(),
        isActive: gameInfo.isActive,
        canBuyTickets: gameInfo.canBuyTickets,
        vault: gameInfo.vault,
        retrievedAt: Date.now(),
        gameId: this.solanaGameId,
        tier: this.gameTier || 'low',
      };
    } catch (error) {
      Logger.server.warn('Failed to get current game token info', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null; // 修复：确保在错误时返回null
    }
  }

  /**
   * Get current game token mint address
   */
  async getCurrentGameTokenMint() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      return null;
    }

    try {
      const tokenMint = await this.solanaVaultService.vaultSDK.getGameTokenMint(
        parseInt(this.solanaGameId),
      );
      return tokenMint.toString();
    } catch (error) {
      Logger.server.warn('Failed to get current game token mint', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Get current vault account information
   */
  async getCurrentVaultAccount() {
    if (!this.solanaVaultService || !this.solanaGameId) {
      return null;
    }

    try {
      const vaultAccount =
        await this.solanaVaultService.vaultSDK.getVaultAccount(
          parseInt(this.solanaGameId),
        );
      return vaultAccount;
    } catch (error) {
      Logger.server.warn('Failed to get current vault account', {
        gameId: this.solanaGameId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Get Solana game status for /serverinfo endpoint
   * Provides current game state information to clients
   */
  getSolanaGameStatus() {
    if (!config.isRaceServer || !config.solana.enabled) {
      return null;
    }

    // 获取 token mint 信息 - 优先使用配置中的 token mint
    let tokenMint = null;
    let tokenInfo = null;

    try {
      // 直接使用配置中的 token mint，这是最可靠的方式
      tokenMint = config.solana.tokenMint;

      if (tokenMint) {
        tokenInfo = {
          address: tokenMint,
          isSOL: tokenMint === 'So11111111111111111111111111111111111111112',
          isUSDC: tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
          isWSol: tokenMint === 'So11111111111111111111111111111111111111112',
        };
      }
    } catch (error) {
      Logger.server.warn('Failed to get token info for serverinfo', {
        error: error.message,
      });
    }

    return {
      gameId: this.solanaGameId ? Number(this.solanaGameId) : null,
      phase: this.gamePhase,
      registeredPlayersCount: this.registeredPlayers.size,
      activePlayersCount: this.players.size,
      gameStartTime: this.gameStartTime,
      gameEndTime: this.gameEndTime,
      killRewardsCount: this.finalKillRewards.size,
      totalRewardSOL: Array.from(this.finalKillRewards.values()).reduce(
        (sum, r) => sum + r.rewardSOL,
        0,
      ),
      gameCreationInProgress: this.isGameCreationInProgress,
      // 添加 token 信息到 gameStatus 中
      tokenMint: tokenMint,
      tokenInfo: tokenInfo,
    };
  }

  /**
   * 保存Solana游戏结果到数据库
   * @param {Map} killRewards - 玩家击杀奖励Map
   * @param {number} gameId - 游戏ID
   */
  async saveGameResultsToDatabase(killRewards, gameId) {
    const config = require('../config');

    console.log(
      `💾 Saving ${killRewards.size} game records to database for game ${gameId}`,
    );

    // 转换killRewards Map为API期望的格式
    const gameRecords = Array.from(killRewards.values()).map((reward) => ({
      gameId: parseInt(gameId),
      playerAddress: reward.walletAddress,
      score: reward.kills * 100, // 简单的分数计算
      rewardAmount: reward.rewardSOL.toString(),
      hasClaimed: false,
      rank: 1, // TODO: 实现真实排名逻辑
      isWinner: reward.kills > 0,
      gameEnded: true,
      gameEndedAt: new Date().toISOString(),
    }));

    // 动态导入fetch (Node.js 18+兼容性)
    let fetch;
    try {
      fetch = (await import('node-fetch')).default;
    } catch (error) {
      // Node.js 18+ 内置fetch
      fetch = globalThis.fetch;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    try {
      const response = await fetch(
        `${config.apiEndpoint}/race-games/save-batch`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.serverSecret}`,
          },
          body: JSON.stringify({ games: gameRecords }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ Database save response:`, result);

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

module.exports = Game;
