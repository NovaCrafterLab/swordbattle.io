// Solana区块链服务 - 替代BSC服务
// 提供Solana区块链相关的业务逻辑

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  SolanaBlockchainConfig,
  defaultSolanaBlockchainConfig,
  validateSolanaBlockchainConfig,
} from './solana-blockchain.config';
import { SolanaRPCManager } from './solana-rpc-manager.service';

@Injectable()
export class SolanaBlockchainService implements OnModuleInit {
  private readonly logger = new Logger(SolanaBlockchainService.name);
  private config: SolanaBlockchainConfig;
  private rpcManager: SolanaRPCManager;
  private connection: Connection | null = null;
  private isInitialized = false;

  constructor() {
    this.config = defaultSolanaBlockchainConfig;
    this.rpcManager = SolanaRPCManager.getInstance();
  }

  async onModuleInit() {
    this.logger.log('🚀 Initializing Solana Blockchain Service...');

    if (this.config.enabled) {
      await this.initialize();
    } else {
      this.logger.log('ℹ️ Solana blockchain service is disabled');
    }
  }

  private async initialize() {
    try {
      this.logger.log('📡 Connecting to Solana network...');

      // 验证配置
      if (!validateSolanaBlockchainConfig(this.config)) {
        throw new Error('Invalid Solana blockchain configuration');
      }

      // 创建连接
      await this.createConnection();

      // 测试连接
      await this.testConnection();

      // 启动健康检查
      if (this.config.healthCheck.enabled) {
        this.startHealthCheck();
      }

      this.isInitialized = true;
      this.logger.log('✅ Solana blockchain service initialized successfully');
    } catch (error) {
      this.logger.error(
        '❌ Failed to initialize Solana blockchain service:',
        error,
      );
      throw error;
    }
  }

  private async createConnection(): Promise<void> {
    // 使用时间窗口轮换策略的当前RPC节点
    const selectedRpc = this.rpcManager.getCurrentRPC();

    try {
      // 创建带有超时保护的连接
      this.connection = new Connection(selectedRpc, {
        commitment: this.config.rpc.commitment,
        httpHeaders: {
          'Content-Type': 'application/json',
        },
        fetch: this.rpcManager.createTimeoutFetch(15000),
      });

      this.logger.log(
        `🔗 Connected to random RPC: ${selectedRpc.split('/').pop()}`,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to create connection: ${error}`);
      // 标记当前RPC失败并切换到新的健康RPC
      const fallbackRpc = this.rpcManager.markCurrentRPCFailed();

      // 尝试创建备用连接
      this.connection = new Connection(fallbackRpc, {
        commitment: this.config.rpc.commitment,
        fetch: this.rpcManager.createTimeoutFetch(15000),
      });
      this.logger.log(`🔄 Fallback to: ${fallbackRpc.split('/').pop()}`);
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.connection) {
      throw new Error('No connection available');
    }

    try {
      const version = await this.connection.getVersion();
      const slot = await this.connection.getSlot();

      this.logger.log(`📊 Solana version: ${version['solana-core']}`);
      this.logger.log(`📊 Current slot: ${slot}`);
    } catch (error) {
      this.logger.error('❌ Connection test failed:', error);
      throw error;
    }
  }

  private startHealthCheck(): void {
    setInterval(async () => {
      try {
        await this.rpcManager.healthCheck();
      } catch (error) {
        this.logger.error('❌ Health check failed:', error);
      }
    }, this.config.healthCheck.interval);

    this.logger.log(
      `💓 Health check started (interval: ${this.config.healthCheck.interval / 1000}s)`,
    );
  }

  // 检查服务是否可用
  isAvailable(): boolean {
    return (
      this.config.enabled && this.isInitialized && this.connection !== null
    );
  }

  // 获取连接实例（使用时间窗口轮换策略）
  async getConnection(): Promise<Connection> {
    if (!this.isAvailable()) {
      throw new Error('Solana blockchain service not available');
    }

    // 使用时间窗口轮换策略的当前RPC
    const currentRpc = this.rpcManager.getCurrentRPC();
    const newConnection = new Connection(currentRpc, {
      commitment: this.config.rpc.commitment,
      fetch: this.rpcManager.createTimeoutFetch(15000),
    });

    this.logger.debug(
      `🎯 Created new time-window connection: ${currentRpc.split('/').pop()}`,
    );
    return newConnection;
  }

  // 执行具有重试机制的操作 - 使用时间窗口轮换策略
  async executeWithRetry<T>(
    operation: () => Promise<T>, // 修改为无参数，内部使用getConnection
    maxRetries: number = 3,
  ): Promise<T> {
    return this.rpcManager.executeWithRetry(async (rpcUrl) => {
      // 使用时间窗口策略的当前RPC创建连接
      const connection = new Connection(rpcUrl, {
        commitment: this.config.rpc.commitment,
        fetch: this.rpcManager.createTimeoutFetch(15000),
      });
      // 执行操作时传入连接
      return operation();
    }, maxRetries);
  }

  // ==================== Vault相关方法 ====================

  /**
   * 获取游戏Vault信息
   */
  async getGameVaultInfo(gameId: number): Promise<{
    vault: string;
    tokenMint: string;
    totalDeposit: string;
    isActive: boolean;
    exists: boolean;
  }> {
    if (!this.isAvailable()) {
      throw new Error('Solana blockchain service not available');
    }

    try {
      // 这里需要根据实际的Vault程序实现
      // 暂时返回模拟数据，等待实际程序部署
      return {
        vault: `vault_${gameId}`,
        tokenMint: this.config.programs.tokenMint,
        totalDeposit: '0',
        isActive: true,
        exists: true,
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to get vault info for game ${gameId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 检查用户是否拥有某个游戏的票据
   */
  async hasUserTicket(
    gameId: number,
    userAddress: string,
  ): Promise<{
    hasTicket: boolean;
    ticketAmount?: string;
  }> {
    if (!this.isAvailable()) {
      throw new Error('Solana blockchain service not available');
    }

    try {
      // 这里需要根据实际的Vault程序实现
      // 暂时返回模拟数据
      return {
        hasTicket: false,
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to check ticket for game ${gameId}, user ${userAddress}:`,
        error,
      );
      return {
        hasTicket: false,
      };
    }
  }

  /**
   * 获取用户Token余额 - 使用随机负载均衡
   */
  async getUserTokenBalance(userAddress: string): Promise<{
    balance: string;
    decimals: number;
  }> {
    return this.executeWithRetry(async () => {
      // 每次调用都使用新的随机连接
      const connection = await this.getConnection();

      try {
        const userPubkey = new PublicKey(userAddress);
        const tokenMintPubkey = new PublicKey(this.config.programs.tokenMint);

        // 如果是SOL，直接获取SOL余额
        if (
          this.config.programs.tokenMint ===
          'So11111111111111111111111111111111111111112'
        ) {
          const balance = await connection.getBalance(userPubkey);
          return {
            balance: (balance / LAMPORTS_PER_SOL).toString(),
            decimals: 9,
          };
        }

        // 获取SPL Token余额
        const tokenAccountAddress = await getAssociatedTokenAddress(
          tokenMintPubkey,
          userPubkey,
        );

        const tokenAccount = await getAccount(connection, tokenAccountAddress);

        return {
          balance: tokenAccount.amount.toString(),
          decimals: 9, // 大多数Token使用9位小数
        };
      } catch (error) {
        this.logger.warn(
          `⚠️ Failed to get token balance for ${userAddress}:`,
          error,
        );
        return {
          balance: '0',
          decimals: 9,
        };
      }
    });
  }

  /**
   * 获取Token信息
   */
  async getTokenInfo(): Promise<{
    mint: string;
    name: string;
    symbol: string;
    decimals: number;
  }> {
    // 这里可以从链上获取Token元数据，或者使用配置
    return {
      mint: this.config.programs.tokenMint,
      name: 'LETSBONKGAME Token',
      symbol: 'LBG',
      decimals: 9,
    };
  }

  /**
   * 获取游戏统计信息（兼容BSC接口）
   */
  async getGameInfo(gameId: number) {
    const vaultInfo = await this.getGameVaultInfo(gameId);

    return {
      gameId: gameId,
      level: 1, // 简化的level信息
      status: vaultInfo.isActive ? 1 : 2, // 1=ACTIVE, 2=ENDED
      totalPool: vaultInfo.totalDeposit,
      createdAt: Math.floor(Date.now() / 1000),
      endedAt: 0,
      gameDuration: 0,
      playerCount: 0,
      maxPlayers: 30,
      activePlayers: [],
      canJoin: vaultInfo.isActive,
      entryFee: '1', // 默认入场费
    };
  }

  /**
   * 获取玩家游戏信息（兼容BSC接口）
   */
  async getPlayerInfo(gameId: number, playerAddress: string) {
    const ticketInfo = await this.hasUserTicket(gameId, playerAddress);

    return {
      playerAddr: playerAddress,
      kills: 0,
      score: 0,
      submitted: ticketInfo.hasTicket,
      fragmentReward: '0',
      reward: '0',
      claimed: false,
      // Solana特有字段
      hasTicket: ticketInfo.hasTicket,
      ticketAmount: ticketInfo.ticketAmount || '0',
    };
  }

  /**
   * 获取玩家奖励信息（兼容BSC接口）
   */
  async getPlayerRewards(gameId: number, playerAddress: string) {
    // 这里需要根据实际的奖励系统实现
    return {
      killReward: '0',
      lotteryReward: '0',
      guaranteedReward: '0',
      fragmentReward: '0',
      totalReward: '0',
      claimableTime: 0,
      canClaim: false,
      claimed: false,
      // Solana特有字段
      solReward: '0',
      tokenReward: '0',
    };
  }

  /**
   * 获取游戏玩家列表
   */
  async getGamePlayers(gameId: number): Promise<string[]> {
    // 这里需要根据实际的Vault程序实现
    // 暂时返回空数组
    return [];
  }

  // ==================== 健康检查和统计 ====================

  /**
   * 获取RPC统计信息
   */
  getRPCStats() {
    return this.rpcManager.getStats();
  }

  /**
   * 获取服务配置信息
   */
  getConfig() {
    return {
      enabled: this.config.enabled,
      cluster: this.config.environment.cluster,
      networkName: this.config.environment.networkName,
      commitment: this.config.rpc.commitment,
      rpcCount: this.config.rpc.rpcPool.length,
      vaultProgramId: this.config.programs.vaultProgramId,
      tokenMint: this.config.programs.tokenMint,
      isInitialized: this.isInitialized,
      rpcStats: this.getRPCStats(),
    };
  }

  /**
   * 测试连接功能
   */
  async testService(): Promise<{
    success: boolean;
    details: any;
  }> {
    try {
      if (!this.isAvailable()) {
        return {
          success: false,
          details: { error: 'Service not available' },
        };
      }

      const connection = await this.getConnection();
      const slot = await connection.getSlot();
      const version = await connection.getVersion();

      return {
        success: true,
        details: {
          slot,
          version: version['solana-core'],
          rpcStats: this.getRPCStats(),
          config: {
            cluster: this.config.environment.cluster,
            commitment: this.config.rpc.commitment,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
