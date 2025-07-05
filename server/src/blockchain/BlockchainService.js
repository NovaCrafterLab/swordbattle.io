const { createPublicClient, createWalletClient, http } = require('viem');
const { bsc, bscTestnet } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const Logger = require('../utils/Logger');

// 导入模块化配置
const { CURRENT_RPC_POOL, NETWORK_CONFIG, ENVIRONMENT, isDev } = require('./networkConfig');
const { SWORD_BATTLE_ABI, GAME_AGGREGATOR_ABI, ERC20_ABI, REWARD_MANAGER_ABI } = require('./abis');
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

      // 使用从文件加载的ABI
      this.swordBattleAbi = SWORD_BATTLE_ABI;
      this.gameAggregatorAbi = GAME_AGGREGATOR_ABI;
      this.usd1TokenAbi = ERC20_ABI;
      this.rewardManagerAbi = REWARD_MANAGER_ABI;

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

  // 获取合约实例
  getSwordBattleContract() {
    return {
      address: this.config.contracts.swordBattle,
      abi: this.swordBattleAbi,
    };
  }

  getGameAggregatorContract() {
    return {
      address: this.config.contracts.gameAggregator,
      abi: this.gameAggregatorAbi,
    };
  }

  getUsd1TokenContract() {
    return {
      address: this.config.contracts.usd1Token,
      abi: this.usd1TokenAbi,
    };
  }

  getRewardManagerContract() {
    return {
      address: this.config.contracts.rewardManager,
      abi: this.rewardManagerAbi,
    };
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
        error: error.message 
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

    // EIP-712域定义
    const domain = {
      name: 'SwordBattle',
      version: '1',
      chainId: await this.publicClient.getChainId(),
      verifyingContract: this.config.contracts.gameAggregator,
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
   * 获取游戏计数器 (使用 SwordBattle 合约)
   */
  async getGameCounter() {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'gameCounter', []);
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
    // 从SwordBattle合约获取玩家注册记录，因为实际的玩家数据在那里
    const contract = this.getSwordBattleContract();
    try {
      const players = await this.readContract(contract, 'getGamePlayers', [BigInt(gameId)]);
      return players || [];
    } catch (error) {
      Logger.server.warn(`Failed to get players from SwordBattle for game ${gameId}, trying GameAggregator fallback`, { error: error.message });
      
      // 降级到GameAggregator（可能不包含最新的注册信息）
      const aggregatorContract = this.getGameAggregatorContract();
      const gameInfo = await this.readContract(aggregatorContract, 'getGameFullInfo', [BigInt(gameId)]);
      return gameInfo[9] || []; // activePlayers是第10个字段 (索引9)
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
   * 获取玩家nonce (使用 SwordBattle 合约)
   */
  async getPlayerNonce(playerAddress) {
    const contract = this.getSwordBattleContract();
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
      Logger.server.info('Creating new game on blockchain', { level });
      
      const contract = this.getGameAggregatorContract();
      
      // GameAggregator的createGame会直接返回gameId
      Logger.server.debug('Calling createGame on GameAggregator', { level });
      const { request } = await this.publicClient.simulateContract({
        account: this.account,
        address: contract.address,
        abi: contract.abi,
        functionName: 'createGame',
        args: [level],
      });

      const txHash = await this.walletClient.writeContract(request);
      
      Logger.server.info('Game creation transaction sent', { txHash });
      Logger.server.debug('Transaction submitted to blockchain, waiting for confirmation');
      
      return {
        txHash,
        timestamp: Date.now(),
        level
      };
    } catch (error) {
      Logger.server.error('Failed to create game', { error: error.message });
      
      // 提供更详细的错误信息
      if (error.message.includes('insufficient funds')) {
        Logger.server.error('Insufficient funds in wallet for transaction');
      } else if (error.message.includes('nonce')) {
        Logger.server.error('Nonce issue - possible concurrent transactions');
      } else if (error.message.includes('gas')) {
        Logger.server.error('Gas estimation failed or insufficient gas');
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
   * 分发游戏奖励到RewardManager合约
   */
  async distributeGameRewards(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Distributing game rewards', { gameId });
      
      const contract = this.getRewardManagerContract();
      const txHash = await this.writeContract(contract, 'calculateAndDistributeRewards', [BigInt(gameId)]);
      
      Logger.server.info('Reward distribution transaction sent', { gameId, txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to distribute rewards', { gameId, error: error.message });
      throw error;
    }
  }

  /**
   * 领取USD奖励 (使用 RewardManager 合约)
   */
  async claimUSDRewards(gameIds) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming USD rewards', { gameIds });
      
      const contract = this.getRewardManagerContract();
      const txHash = await this.writeContract(contract, 'claimAllUSDRewards', [gameIds.map(id => BigInt(id))]);
      
      Logger.server.info('USD rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim USD rewards', { gameIds, error: error.message });
      throw error;
    }
  }

  /**
   * 领取NCLab奖励 (使用 RewardManager 合约)
   */
  async claimNclabRewards(gameIds) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming NCLab rewards', { gameIds });
      
      const contract = this.getRewardManagerContract();
      const txHash = await this.writeContract(contract, 'claimAllNclabRewards', [gameIds.map(id => BigInt(id))]);
      
      Logger.server.info('NCLab rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim NCLab rewards', { gameIds, error: error.message });
      throw error;
    }
  }

  /**
   * 一键领取所有奖励 (使用 RewardManager 合约)
   */
  async claimAllRewards(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      Logger.server.info('Claiming all rewards', { gameId });
      
      const contract = this.getRewardManagerContract();
      const txHash = await this.writeContract(contract, 'claimReward', [BigInt(gameId)]);
      
      Logger.server.info('All rewards claim transaction sent', { txHash });
      return txHash;
    } catch (error) {
      Logger.server.error('Failed to claim all rewards', { gameId, error: error.message });
      throw error;
    }
  }

  /**
   * 获取玩家奖励状态 (使用 RewardManager 合约)
   */
  async getPlayerRewardStatus(gameId, playerAddress) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const contract = this.getRewardManagerContract();
      return await this.readContract(contract, 'getPlayerRewardStatus', [BigInt(gameId), playerAddress]);
    } catch (error) {
      Logger.server.error('Failed to get player reward status', { gameId, playerAddress, error: error.message });
      throw error;
    }
  }
}

module.exports = BlockchainService; 