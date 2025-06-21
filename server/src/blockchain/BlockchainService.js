const { createPublicClient, createWalletClient, http } = require('viem');
const { bsc, bscTestnet } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');

// 导入模块化配置
const { CURRENT_RPC_POOL, NETWORK_CONFIG, ENVIRONMENT, isDev } = require('./networkConfig');
const { SWORD_BATTLE_ABI, ERC20_ABI } = require('./abis');
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
    
    console.log(`Blockchain environment: ${ENVIRONMENT.ENV} (${ENVIRONMENT.networkName})`);
    console.log(`Chain ID: ${ENVIRONMENT.chainId}`);
  }

  async initialize() {
    try {
      console.log('Initializing blockchain service...');
      console.log(`Network: ${this.networkConfig.name}`);

      // 确定使用的链
      const chain = isDev ? bscTestnet : bsc;
      console.log(`Using chain: ${chain.name} (ID: ${chain.id})`);

      // 获取当前RPC URL
      let rpcUrl = this.config.rpcUrl || this.rpcManager.getCurrentRPC();
      console.log(`Primary RPC: ${rpcUrl}`);

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
        console.log(`Wallet account: ${this.account.address}`);
      }

      // 测试连接
      const blockNumber = await this.publicClient.getBlockNumber();
      console.log(`Connected to blockchain, current block: ${blockNumber}`);

      // 使用从文件加载的ABI
      this.swordBattleAbi = SWORD_BATTLE_ABI;
      this.usd1TokenAbi = ERC20_ABI;

      console.log(`Loaded SwordBattle ABI: ${this.swordBattleAbi.length} functions`);
      console.log(`Loaded ERC20 ABI: ${this.usd1TokenAbi.length} functions`);

      // 启动RPC健康检查
      await this.rpcManager.healthCheck();
      
      this.isInitialized = true;
      console.log('Blockchain service initialized successfully');
      console.log(`RPC Manager stats:`, this.rpcManager.getStats());

    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
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
      console.error('Blockchain connection check failed:', error);
      
      // 尝试切换RPC节点
      if (this.rpcManager) {
        const newRpc = this.rpcManager.markCurrentRPCFailed();
        console.log(`Switching to RPC: ${newRpc}`);
        
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
          console.log('Successfully switched to backup RPC');
          return true;
        } catch (switchError) {
          console.error('Failed to switch RPC:', switchError);
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

  getUsd1TokenContract() {
    return {
      address: this.config.contracts.usd1Token,
      abi: this.usd1TokenAbi,
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
      console.error(`Failed to read contract ${functionName}:`, error);
      
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
      const { request } = await this.publicClient.simulateContract({
        account: this.account,
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
      });

      return await this.walletClient.writeContract(request);
    } catch (error) {
      console.error(`Failed to write contract ${functionName}:`, error);
      
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

        return await this.walletClient.writeContract(request);
      }
      
      throw error;
    }
  }

  // EIP-712签名相关方法
  async signScoreSubmission(gameId, playerAddress, score, nonce) {
    if (!this.walletClient || !this.account) {
      throw new Error('No wallet available for signing');
    }

    // EIP-712域定义
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
        { name: 'score', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
      ],
    };

    // 消息数据
    const message = {
      gameId: BigInt(gameId),
      player: playerAddress,
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
        
        console.log(`Switched to fastest RPC: ${result.rpc} (${result.latency}ms)`);
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
   * 获取游戏计数器
   */
  async getGameCounter() {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'gameCounter', []);
  }

  /**
   * 获取游戏信息
   */
  async getGameInfo(gameId) {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'games', [BigInt(gameId)]);
  }

  /**
   * 获取游戏玩家列表
   */
  async getGamePlayers(gameId) {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'getGamePlayers', [BigInt(gameId)]);
  }

  /**
   * 获取入场费
   */
  async getEntryFee() {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'entryFee', []);
  }

  /**
   * 检查玩家是否已加入游戏
   */
  async isPlayerInGame(gameId, playerAddress) {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'isPlayerInGame', [BigInt(gameId), playerAddress]);
  }

  /**
   * 获取玩家nonce
   */
  async getPlayerNonce(playerAddress) {
    const contract = this.getSwordBattleContract();
    return await this.readContract(contract, 'getPlayerNonce', [playerAddress]);
  }

  // ============ 区块链交易方法 ============

  /**
   * 创建新游戏
   */
  async createGame() {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      console.log('📝 Creating new game on blockchain...');
      console.log('🔍 Checking current game counter before creation...');
      
      // 记录创建前的游戏计数器
      const initialCounter = await this.getGameCounter();
      console.log(`📊 Current game counter before creation: ${initialCounter}`);
      
      const contract = this.getSwordBattleContract();
      const txHash = await this.writeContract(contract, 'createGame', []);
      
      console.log(`✅ Game creation transaction sent: ${txHash}`);
      console.log('⏳ Transaction submitted to blockchain, waiting for confirmation...');
      
      return {
        txHash,
        initialCounter,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Failed to create game:', error);
      
      // 提供更详细的错误信息
      if (error.message.includes('insufficient funds')) {
        console.error('💰 Error: Insufficient funds in wallet for transaction');
      } else if (error.message.includes('nonce')) {
        console.error('🔢 Error: Nonce issue - possible concurrent transactions');
      } else if (error.message.includes('gas')) {
        console.error('⛽ Error: Gas estimation failed or insufficient gas');
      }
      
      throw error;
    }
  }

  /**
   * 结束游戏
   */
  async endGame(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      console.log(`🏁 Ending game ${gameId} on blockchain...`);
      
      const contract = this.getSwordBattleContract();
      const txHash = await this.writeContract(contract, 'endGame', [BigInt(gameId)]);
      
      console.log(`✅ Game end transaction sent: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error(`Failed to end game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * 提交分数
   */
  async submitScore(gameId, score, nonce, signature) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      console.log(`📊 Submitting score ${score} for game ${gameId}...`);
      
      const contract = this.getSwordBattleContract();
      const txHash = await this.writeContract(contract, 'submitScore', [
        BigInt(gameId),
        BigInt(score),
        BigInt(nonce),
        signature
      ]);
      
      console.log(`✅ Score submission transaction sent: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error(`Failed to submit score for game ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * 自动结束游戏（如果游戏超时）
   */
  async autoEndGame(gameId) {
    if (!this.isInitialized || !this.walletClient) {
      throw new Error('Blockchain service not initialized or no wallet available');
    }

    try {
      console.log(`⏰ Auto-ending game ${gameId} on blockchain...`);
      
      const contract = this.getSwordBattleContract();
      const txHash = await this.writeContract(contract, 'autoEndGame', [BigInt(gameId)]);
      
      console.log(`✅ Auto-end game transaction sent: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error(`Failed to auto-end game ${gameId}:`, error);
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
        const { address, score, nonce, signature } = playerData;
        const txHash = await this.submitScore(gameId, score, nonce, signature);
        results.push({ address, success: true, txHash });
        
        // 添加延迟避免nonce冲突
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to submit score for ${playerData.address}:`, error);
        results.push({ address: playerData.address, success: false, error: error.message });
      }
    }
    
    return results;
  }
}

module.exports = BlockchainService; 