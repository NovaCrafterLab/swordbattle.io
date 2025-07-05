const { createPublicClient, createWalletClient, http } = require('viem');
const { bsc, bscTestnet } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const Logger = require('../utils/Logger');

// 导入模块化配置
const { CURRENT_RPC_POOL, NETWORK_CONFIG, ENVIRONMENT, isDev } = require('./networkConfig');
const { GAME_AGGREGATOR_ABI } = require('./abis');
const RPCManager = require('./RPCManager');

class BlockchainService {
  constructor(config) {
    this.config = config;
    this.publicClient = null;
    this.walletClient = null;
    this.account = null;
    this.isInitialized = false;
    
    // 使用模块化的环境配置
    this.environment = ENVIRONMENT;
    this.networkConfig = NETWORK_CONFIG;
    
    // 初始化RPC管理器
    this.rpcManager = new RPCManager(CURRENT_RPC_POOL);
    
    Logger.server.info('Blockchain environment initialized', {
      environment: ENVIRONMENT.ENV,
      networkName: ENVIRONMENT.networkName,
      chainId: ENVIRONMENT.chainId
    });
  }

  async initialize() {
    try {
      Logger.server.info('🔗 Initializing blockchain service', {
        network: this.networkConfig.name
      });

      // 确定使用的链
      const chain = isDev ? bscTestnet : bsc;

      // 获取当前RPC URL
      let rpcUrl = this.config.rpcUrl || this.rpcManager.getCurrentRPC();
      Logger.server.info('📡 Using RPC:', rpcUrl.split('/').pop());

      // 创建公共客户端用于读取
      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
      });

      // 如果有私钥，创建钱包客户端用于签名和发送交易
      if (this.config.trustedSigner) {
        this.account = privateKeyToAccount(this.config.trustedSigner);
        this.walletClient = createWalletClient({
          account: this.account,
          chain,
          transport: http(rpcUrl),
        });
        Logger.server.info('🔑 Wallet initialized:', this.account.address);
      } else {
        Logger.server.error('❌ No trusted signer private key provided!');
      }

      // 测试连接
      const blockNumber = await this.publicClient.getBlockNumber();
      Logger.server.info('✅ Blockchain connected, block:', Number(blockNumber));

      // 使用GameAggregator ABI
      this.gameAggregatorAbi = GAME_AGGREGATOR_ABI;
      Logger.server.debug('GameAggregator ABI loaded:', {
        abiLength: this.gameAggregatorAbi.length,
        hasGetCurrentGameId: this.gameAggregatorAbi.some(f => f.name === 'getCurrentGameId'),
        hasGetPlayerNonce: this.gameAggregatorAbi.some(f => f.name === 'getPlayerNonce'),
        functionNames: this.gameAggregatorAbi.filter(f => f.type === 'function').map(f => f.name).slice(0, 10)
      });

      // 启动RPC健康检查
      await this.rpcManager.healthCheck();
      
      this.isInitialized = true;
      Logger.status('🚀 Blockchain service ready');
      
      // 启动时查找最快的RPC节点
      this.findAndSwitchToFastestRPC();

    } catch (error) {
      Logger.server.error('Failed to initialize blockchain service', { 
        error: error.message, 
        stack: error.stack 
      });
      throw error;
    }
  }

  // 查找并切换到最快的RPC节点
  async findAndSwitchToFastestRPC() {
    try {
      const fastest = await this.rpcManager.findFastestRPC();
      
      if (fastest) {
        // 重新创建客户端使用最快的RPC
        const chain = isDev ? bscTestnet : bsc;
        const newRpcUrl = fastest.rpc;
        
        this.publicClient = createPublicClient({
          chain,
          transport: http(newRpcUrl),
        });
        
        if (this.account) {
          this.walletClient = createWalletClient({
            account: this.account,
            chain,
            transport: http(newRpcUrl),
          });
        }
        
        Logger.server.info(`⚡ Switched to fastest RPC (${fastest.latency}ms):`, newRpcUrl.split('/').pop());
      }
    } catch (error) {
      Logger.server.warn('⚠️  Using current RPC node (fastest search failed)');
    }
  }

  // 手动切换RPC节点
  async switchToRPC(index) {
    try {
      const newRpc = this.rpcManager.switchToRPC(index);
      const chain = isDev ? bscTestnet : bsc;
      
      // 重新创建客户端
      this.publicClient = createPublicClient({
        chain,
        transport: http(newRpc),
      });
      
      if (this.account) {
        this.walletClient = createWalletClient({
          account: this.account,
          chain,
          transport: http(newRpc),
        });
      }
      
      // 测试连接
      await this.publicClient.getBlockNumber();
      Logger.server.info('手动切换RPC成功', { newRpc, index });
      return newRpc;
    } catch (error) {
      Logger.server.error('手动切换RPC失败', { error: error.message, index });
      throw error;
    }
  }

  // 检查连接状态
  async isConnected() {
    if (!this.isInitialized) return false;
    
    try {
      await this.publicClient.getBlockNumber();
      return true;
    } catch (error) {
      Logger.server.error('Blockchain connection check failed', { 
        error: error.message 
      });
      
      // 尝试切换RPC节点
      if (this.rpcManager) {
        const newRpc = this.rpcManager.markCurrentRPCFailed();
        Logger.server.info('Switching to backup RPC', { newRpc });
        
        // 重新创建客户端
        try {
          const chain = isDev ? bscTestnet : bsc;
          this.publicClient = createPublicClient({
            chain,
            transport: http(newRpc),
          });
          
          if (this.walletClient && this.account) {
            this.walletClient = createWalletClient({
              account: this.account,
              chain,
              transport: http(newRpc),
            });
          }
          
          await this.publicClient.getBlockNumber();
          Logger.server.info('Successfully switched to backup RPC');
          return true;
        } catch (switchError) {
          Logger.server.error('Failed to switch RPC', { 
            error: switchError.message 
          });
        }
      }
      
      return false;
    }
  }

  // 获取合约实例 - 只使用GameAggregator
  getGameAggregatorContract() {
    const contract = {
      address: this.config.contracts.gameAggregator,
      abi: this.gameAggregatorAbi,
    };
    
    Logger.server.debug('Creating GameAggregator contract instance:', {
      address: contract.address,
      abiExists: !!contract.abi,
      abiLength: contract.abi ? contract.abi.length : 0,
      abiSample: contract.abi ? contract.abi.slice(0, 2) : null
    });
    
    return contract;
  }

  // 读取合约方法的封装
  async readContract(contract, functionName, args = []) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      return await this.publicClient.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
      });
    } catch (error) {
      Logger.server.error('Failed to read contract', { 
        functionName, 
        contractAddress: contract.address,
        args,
        error: error.message,
        errorStack: error.stack,
        errorDetails: error
      });
      
      // 尝试重新连接
      const isConnected = await this.isConnected();
      if (isConnected) {
        // 重试一次
        return await this.publicClient.readContract({
          address: contract.address,
          abi: contract.abi,
          functionName,
          args,
        });
      }
      
      throw error;
    }
  }

  // 写入合约方法的封装
  async writeContract(contract, functionName, args = []) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      // 只记录关键的合约调用
      if (['createGame', 'endGame', 'submitScore'].includes(functionName)) {
        Logger.server.info(`📝 Calling ${functionName}`, {
          contract: contract.address.slice(0, 8) + '...',
          args: args.map(arg => typeof arg === 'bigint' ? Number(arg) : arg)
        });
      }
      
      const { request } = await this.publicClient.simulateContract({
        account: this.account,
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
      });

      // 添加Gas配置以确保BSC测试网交易正确执行
      const gasConfig = {
        ...request,
        gas: BigInt(500000), // 固定Gas限制
        gasPrice: BigInt(20000000000), // 20 Gwei，适合BSC测试网
      };

      const txHash = await this.walletClient.writeContract(gasConfig);
      
      // 只记录关键交易的结果
      if (['createGame', 'endGame', 'submitScore'].includes(functionName)) {
        Logger.server.info(`✅ ${functionName} transaction sent:`, txHash);
      }
      
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to write contract', { 
        functionName, 
        error: error.message 
      });
      
      // 尝试重新连接
      const isConnected = await this.isConnected();
      if (isConnected) {
        // 重试一次
        const { request } = await this.publicClient.simulateContract({
          account: this.account,
          address: contract.address,
          abi: contract.abi,
          functionName,
          args,
        });

        // 重试时也使用Gas配置
        const gasConfig = {
          ...request,
          gas: BigInt(500000),
          gasPrice: BigInt(20000000000),
        };

        return await this.walletClient.writeContract(gasConfig);
      }
      
      throw error;
    }
  }

  // EIP-712签名相关方法
  async signScoreSubmission(gameId, playerAddress, kills, score, nonce) {
    if (!this.walletClient || !this.account) {
      throw new Error('No wallet available for signing');
    }

    // EIP-712域定义 - 使用SwordBattle合约地址进行签名验证
    const domain = {
      name: 'SwordBattle',
      version: '1',
      chainId: await this.publicClient.getChainId(),
      verifyingContract: this.config.contracts.swordBattle,
    };

    // 消息类型定义
    const types = {
      ScoreSubmission: [
        { name: 'gameId', type: 'uint256' },
        { name: 'player', type: 'address' },
        { name: 'kills', type: 'uint256' },
        { name: 'score', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
      ],
    };

    // 消息数据
    const message = {
      gameId: BigInt(gameId),
      player: playerAddress,
      kills: BigInt(kills),
      score: BigInt(score),
      nonce: BigInt(nonce),
    };

    return await this.walletClient.signTypedData({
      account: this.account,
      domain,
      types,
      primaryType: 'ScoreSubmission',
      message,
    });
  }

  // 获取RPC统计信息
  getRPCStats() {
    return this.rpcManager ? this.rpcManager.getStats() : null;
  }

  // 手动触发RPC健康检查
  async performHealthCheck() {
    if (this.rpcManager) {
      await this.rpcManager.healthCheck();
      return this.rpcManager.getStats();
    }
    return null;
  }

  // 获取环境信息
  getEnvironmentInfo() {
    return {
      environment: this.environment,
      networkConfig: this.networkConfig,
      rpcStats: this.getRPCStats(),
    };
  }

  // 高级RPC管理功能
  async switchToFastestRPC() {
    if (this.rpcManager) {
      const result = await this.rpcManager.findFastestRPC();
      if (result) {
        // 重新创建客户端
        const chain = isDev ? bscTestnet : bsc;
        this.publicClient = createPublicClient({
          chain,
          transport: http(result.rpc),
        });
        
        if (this.walletClient && this.account) {
          this.walletClient = createWalletClient({
            account: this.account,
            chain,
            transport: http(result.rpc),
          });
        }
        
        Logger.server.info('Switched to fastest RPC', { 
          rpc: result.rpc, 
          latency: result.latency 
        });
        return result;
      }
    }
    return null;
  }

  resetRPCFailures() {
    if (this.rpcManager) {
      return this.rpcManager.resetFailedRPCs();
    }
    return null;
  }

  // ============ 区块链读取方法 ============

  /**
   * 获取游戏计数器 (使用 GameAggregator 合约)
   */
  async getGameCounter() {
    try {
      Logger.server.debug('Getting game counter from GameAggregator...');
      const contract = this.getGameAggregatorContract();
      Logger.server.debug('GameAggregator contract config:', { address: contract.address, abiLength: contract.abi.length });
      const result = await this.readContract(contract, 'getCurrentGameId', []);
      Logger.server.debug('Game counter result:', result);
      return result;
    } catch (error) {
      Logger.server.error('Failed to get game counter', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  // ========== 新的GameAggregator读取函数 ==========

  /**
   * 获取游戏完整信息 (使用 GameAggregator 合约)
   */
  async getGameFullInfo(gameId) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getGameFullInfo', [BigInt(gameId)]);
  }

  /**
   * 获取玩家完整奖励信息 (使用 GameAggregator 合约)
   */
  async getPlayerCompleteRewards(gameId, playerAddress) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getPlayerCompleteRewards', [BigInt(gameId), playerAddress]);
  }

  /**
   * 获取玩家仪表板 (使用 GameAggregator 合约)
   */
  async getPlayerDashboard(playerAddress) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getPlayerDashboard', [playerAddress]);
  }

  /**
   * 获取玩家所有奖励 (使用 GameAggregator 合约)
   */
  async getPlayerAllRewards(playerAddress) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getPlayerAllRewards', [playerAddress]);
  }

  /**
   * 获取可领取奖励的游戏 (使用 GameAggregator 合约)
   */
  async getPlayerClaimableGames(playerAddress, maxGames = 25) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getPlayerClaimableGames', [playerAddress, BigInt(maxGames)]);
  }

  /**
   * 获取游戏信息 (使用 GameAggregator 合约)
   */
  async getGameInfo(gameId) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getGameFullInfo', [BigInt(gameId)]);
  }

  /**
   * 获取游戏玩家列表 (使用 GameAggregator 合约)
   */
  async getGamePlayers(gameId) {
    // 直接使用GameAggregator获取游戏信息和玩家列表
    const contract = this.getGameAggregatorContract();
    try {
      const gameInfo = await this.readContract(contract, 'getGameFullInfo', [BigInt(gameId)]);
      
      // GameAggregator returns a structured object, not an array
      // Use the activePlayers property directly
      const activePlayers = gameInfo.activePlayers || [];
      
      return activePlayers;
    } catch (error) {
      Logger.server.warn(`Failed to get players from GameAggregator for game ${gameId}`, { error: error.message });
      return [];
    }
  }

  /**
   * 获取入场费 (使用 GameAggregator 合约查询活跃游戏)
   */
  async getEntryFee(level = 0) {
    // GameAggregator 中没有全局的 entryFee 函数
    // 入场费在游戏配置中，可以通过获取活跃游戏来获取
    const contract = this.getGameAggregatorContract();
    try {
      const activeGames = await this.readContract(contract, 'getActiveGames', [level, 1]);
      if (activeGames && activeGames.length > 0) {
        return activeGames[0][11]; // entryFee是GameFullInfo结构的第12个字段
      }
      return BigInt(0); // 默认返回0
    } catch (error) {
      Logger.server.warn('Failed to get entry fee, returning 0', { error: error.message });
      return BigInt(0);
    }
  }

  /**
   * 检查玩家是否已加入游戏
   */
  async isPlayerInGame(gameId, playerAddress) {
    try {
      const players = await this.getGamePlayers(gameId);
      return players.includes(playerAddress.toLowerCase()) || players.includes(playerAddress);
    } catch (error) {
      Logger.server.warn('Failed to check if player is in game, returning false', { gameId, playerAddress, error: error.message });
      return false;
    }
  }

  /**
   * 获取玩家nonce (使用 GameAggregator 合约)
   */
  async getPlayerNonce(playerAddress) {
    const contract = this.getGameAggregatorContract();
    return await this.readContract(contract, 'getPlayerNonce', [playerAddress]);
  }

  // ============ 区块链交易方法 ============

  /**
   * 创建新游戏 (使用 GameAggregator 合约)
   */
  async createGame(level = 0) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('🎮 Creating new game on blockchain', {
        level,
        account: this.account?.address,
        contractAddress: this.config.contracts?.gameAggregator
      });

      const contract = this.getGameAggregatorContract();

      // 检查合约地址是否有效
      if (!contract.address) {
        throw new Error('GameAggregator contract address not configured');
      }

      Logger.server.debug('📋 Contract details', {
        address: contract.address,
        level,
        account: this.account.address
      });

      // 检查账户余额
      try {
        const balance = await this.publicClient.getBalance({
          address: this.account.address,
        });
        Logger.server.debug('💰 Account balance', {
          balance: balance.toString(),
          balanceETH: (Number(balance) / 1e18).toFixed(6)
        });
      } catch (balanceError) {
        Logger.server.warn('⚠️ Could not check account balance', { error: balanceError.message });
      }

      // GameAggregator的createGame会直接返回gameId
      Logger.server.debug('🔍 Simulating createGame transaction', { level });
      const { request } = await this.publicClient.simulateContract({
        account: this.account,
        address: contract.address,
        abi: contract.abi,
        functionName: 'createGame',
        args: [level],
      });

      Logger.server.debug('✅ Transaction simulation successful', {
        gas: request.gas?.toString(),
        gasPrice: request.gasPrice?.toString(),
        value: request.value?.toString()
      });

      const txHash = await this.walletClient.writeContract(request);

      Logger.server.info('🚀 Game creation transaction sent', {
        txHash,
        level,
        account: this.account.address
      });
      Logger.server.debug('⏳ Transaction submitted to blockchain, waiting for confirmation');

      return {
        txHash,
        timestamp: Date.now(),
        level
      };
    } catch (error) {
      Logger.server.error('❌ Failed to create game - detailed error', {
        error: error.message,
        stack: error.stack,
        level,
        account: this.account?.address,
        contractAddress: this.config.contracts?.gameAggregator,
        isInitialized: this.isInitialized,
        hasWalletClient: !!this.walletClient,
        hasPublicClient: !!this.publicClient
      });

      // 提供更详细的错误信息
      if (error.message.includes('insufficient funds')) {
        Logger.server.error('💰 Insufficient funds in wallet for transaction');
      } else if (error.message.includes('nonce')) {
        Logger.server.error('🔢 Nonce issue - possible concurrent transactions');
      } else if (error.message.includes('gas')) {
        Logger.server.error('⛽ Gas estimation failed or insufficient gas');
      } else if (error.message.includes('revert')) {
        Logger.server.error('🔄 Transaction reverted - contract execution failed');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        Logger.server.error('🌐 Network connection issue');
      } else if (error.message.includes('contract')) {
        Logger.server.error('📋 Contract interaction failed');
      }

      throw error;
    }
  }

  /**
   * 结束游戏 (使用 GameAggregator 合约)
   */
  async endGame(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Ending game on blockchain', { gameId });
      
      const contract = this.getGameAggregatorContract();
      const txHash = await this.writeContract(contract, 'endGame', [BigInt(gameId)]);
      
      Logger.server.info('Game end transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to end game', { gameId, error: error.message });
      throw error;
    }
  }

  /**
   * 提交分数 (使用 GameAggregator 合约)
   */
  async submitScore(gameId, playerAddress, kills, score, nonce, signature) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Submitting score', { score, kills, gameId, playerAddress });
      
      const contract = this.getGameAggregatorContract();
      const txHash = await this.writeContract(contract, 'submitScore', [
        BigInt(gameId),
        playerAddress,
        BigInt(kills),
        BigInt(score),
        BigInt(nonce),
        signature
      ]);
      
      Logger.server.info('Score submission transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to submit score', { gameId, playerAddress, error: error.message });
      throw error;
    }
  }

  /**
   * 强制结束游戏（如果游戏超时或需要管理员干预）(使用 GameAggregator 合约)
   */
  async autoEndGame(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Force-ending game on blockchain', { gameId });
      
      const contract = this.getGameAggregatorContract();
      const txHash = await this.writeContract(contract, 'forceEndGame', [BigInt(gameId), "Auto timeout"]);
      
      Logger.server.info('Force-end game transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to force-end game', { gameId, error: error.message });
      throw error;
    }
  }

  /**
   * 批量提交分数（优化版本）
   */
  async batchSubmitScores(gameId, playersData) {
    const results = [];
    
    for (const playerData of playersData) {
      try {
        const { address, kills, score, nonce, signature } = playerData;
        const txHash = await this.submitScore(gameId, address, kills, score, nonce, signature);
        results.push({ address, success: true, txHash });
        
        // 添加延迟避免nonce冲突
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        Logger.server.error('Failed to submit score', { address: playerData.address, error: error.message });
        results.push({ address: playerData.address, success: false, error: error.message });
      }
    }
    
    return results;
  }

  /**
   * 分发游戏奖励 (使用 GameAggregator 合约)
   */
  async distributeGameRewards(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Distributing game rewards', { gameId });
      
      const contract = this.getGameAggregatorContract();
      // GameAggregator的奖励分发逻辑在endGame中已经处理，这里可以是空操作或者调用其他方法
      Logger.server.info('Game rewards already distributed via GameAggregator.endGame', { gameId });
      return 'rewards_distributed_in_endgame';
    } catch (error) {
      Logger.server.error('Failed to distribute rewards', { gameId, error: error.message });
      throw error;
    }
  }

  /**
   * 领取USD奖励 (使用 GameAggregator 合约)
   */
  async claimUSDRewards(gameIds) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming USD rewards', { gameIds });
      
      const contract = this.getGameAggregatorContract();
      // 使用 claimAllPlayerRewards 方法，ClaimType.USD_ONLY = 1
      const txHash = await this.writeContract(contract, 'claimAllPlayerRewards', [1, BigInt(gameIds.length)]);
      
      Logger.server.info('USD rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim USD rewards', { gameIds, error: error.message });
      throw error;
    }
  }

  /**
   * 领取NCLab奖励 (使用 GameAggregator 合约)
   */
  async claimNclabRewards(gameIds) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming NCLab rewards', { gameIds });
      
      const contract = this.getGameAggregatorContract();
      // 使用 claimAllPlayerRewards 方法，ClaimType.NCLAB_ONLY = 2
      const txHash = await this.writeContract(contract, 'claimAllPlayerRewards', [2, BigInt(gameIds.length)]);
      
      Logger.server.info('NCLab rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim NCLab rewards', { gameIds, error: error.message });
      throw error;
    }
  }

  /**
   * 一键领取所有奖励 (使用 GameAggregator 合约)
   */
  async claimAllRewards(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming all rewards', { gameId });
      
      const contract = this.getGameAggregatorContract();
      // 使用 claimGameReward 方法，ClaimType.ALL = 0
      const txHash = await this.writeContract(contract, 'claimGameReward', [BigInt(gameId), 0]);
      
      Logger.server.info('All rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim all rewards', { gameId, error: error.message });
      throw error;
    }
  }

  // ========== 新的GameAggregator奖励领取函数 ==========

  /**
   * 领取指定游戏奖励 (使用 GameAggregator 合约)
   */
  async claimGameReward(gameId, claimType = 0) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming game reward', { gameId, claimType });
      
      const contract = this.getGameAggregatorContract();
      const txHash = await this.writeContract(contract, 'claimGameReward', [BigInt(gameId), claimType]);
      
      Logger.server.info('Game reward claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim game reward', { gameId, claimType, error: error.message });
      throw error;
    }
  }

  /**
   * 批量领取所有奖励 (使用 GameAggregator 合约)
   */
  async claimAllPlayerRewards(claimType = 0, maxGames = 25) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming all player rewards', { claimType, maxGames });
      
      const contract = this.getGameAggregatorContract();
      const txHash = await this.writeContract(contract, 'claimAllPlayerRewards', [claimType, BigInt(maxGames)]);
      
      Logger.server.info('All player rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim all player rewards', { claimType, maxGames, error: error.message });
      throw error;
    }
  }

  /**
   * 获取玩家奖励状态 (使用 GameAggregator 合约)
   */
  async getPlayerRewardStatus(gameId, playerAddress) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const contract = this.getGameAggregatorContract();
      return await this.readContract(contract, 'getPlayerCompleteRewards', [BigInt(gameId), playerAddress]);
    } catch (error) {
      Logger.server.error('Failed to get player reward status', { gameId, playerAddress, error: error.message });
      throw error;
    }
  }

  /**
   * ClaimType 枚举常量
   */
  static get ClaimType() {
    return {
      ALL: 0,        // 领取所有类型 (USD1 + NCLab)
      USD_ONLY: 1,   // 仅领取 USD1
      NCLAB_ONLY: 2  // 仅领取 NCLab
    };
  }
}

module.exports = BlockchainService; 