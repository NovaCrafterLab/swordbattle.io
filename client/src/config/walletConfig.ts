// Solana钱包相关配置
// 适配 Solana Devnet 与 Mainnet，预留程序ID与配置

import { config } from '../config';

// 环境变量检查
const ENV = process.env.REACT_APP_BUILD_ENV ?? 'development';
export const isDev = config.isDev;
export const isRelease = ENV === 'release';
console.log('Environment:', ENV);

// 有效的Solana地址作为占位符（base58编码）
const PLACEHOLDER_ADDRESSES = {
  // 使用系统程序ID作为安全的占位符地址
  GAME_PROGRAM_DEVNET: '11111111111111111111111111111112', // System Program
  REWARD_TOKEN_MINT_DEVNET: 'So11111111111111111111111111111111111111112', // SOL mint
  GAME_PROGRAM_MAINNET: '11111111111111111111111111111112', // System Program
  REWARD_TOKEN_MINT_MAINNET: 'So11111111111111111111111111111111111111112', // SOL mint
} as const;

// Solana程序ID配置 - 根据环境选择
export const SOLANA_PROGRAMS = isDev
  ? {
    // Devnet程序地址 - TODO: 替换为实际部署的程序ID
    GAME_PROGRAM: process.env.REACT_APP_GAME_PROGRAM_ID_DEVNET || PLACEHOLDER_ADDRESSES.GAME_PROGRAM_DEVNET,
    REWARD_TOKEN_MINT: process.env.REACT_APP_REWARD_TOKEN_MINT_DEVNET || PLACEHOLDER_ADDRESSES.REWARD_TOKEN_MINT_DEVNET,
  }
  : {
    // Mainnet-beta程序地址 - TODO: 替换为实际部署的程序ID
    GAME_PROGRAM: process.env.REACT_APP_GAME_PROGRAM_ID_MAINNET || PLACEHOLDER_ADDRESSES.GAME_PROGRAM_MAINNET,
    REWARD_TOKEN_MINT: process.env.REACT_APP_REWARD_TOKEN_MINT_MAINNET || PLACEHOLDER_ADDRESSES.REWARD_TOKEN_MINT_MAINNET,
  } as const;

// 程序配置类型
export type ProgramConfig = {
  programId: string;
  cluster: string;
};

// 导出程序配置 
export const getGameProgramConfig = (): ProgramConfig => ({
  programId: SOLANA_PROGRAMS.GAME_PROGRAM,
  cluster: isDev ? 'devnet' : 'mainnet-beta',
});

// SPL Token配置
export const getRewardTokenConfig = (): ProgramConfig => ({
  programId: SOLANA_PROGRAMS.REWARD_TOKEN_MINT,
  cluster: isDev ? 'devnet' : 'mainnet-beta',
});

// Helius RPC API Keys Pool (49个密钥用于负载均衡)
const RPC_API_KEYS_RAW = process.env.REACT_APP_RPC_API_KEYS_POOL || '';
const RPC_API_KEYS = RPC_API_KEYS_RAW.split(',').filter(key => key.trim().length > 0);

// Solana Devnet RPC池配置 (使用Helius API密钥)
export const SOLANA_DEVNET_RPC_POOL = RPC_API_KEYS.length > 0 
  ? RPC_API_KEYS.map(key => `https://devnet.helius-rpc.com/?api-key=${key}`)
  : [
    'https://api.devnet.solana.com',
    'https://devnet.helius-rpc.com/?api-key=demo',
    'https://rpc.ankr.com/solana_devnet',
    'https://solana-devnet.g.alchemy.com/v2/demo',
  ] as const;

// Solana Mainnet RPC池配置 (使用Helius API密钥)
export const SOLANA_MAINNET_RPC_POOL = RPC_API_KEYS.length > 0
  ? RPC_API_KEYS.map(key => `https://mainnet.helius-rpc.com/?api-key=${key}`)
  : [
    'https://api.mainnet-beta.solana.com',
    'https://mainnet.helius-rpc.com/?api-key=demo',
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.alchemy.com/v2/demo',
  ] as const;

// RPC池配置
export const SOLANA_RPC_POOLS = {
  devnet: SOLANA_DEVNET_RPC_POOL,
  mainnet: SOLANA_MAINNET_RPC_POOL,
} as const;

// 根据环境选择RPC池
export const CURRENT_RPC_POOL = isDev ? SOLANA_DEVNET_RPC_POOL : SOLANA_MAINNET_RPC_POOL;

// Solana网络配置 - 根据环境选择
export const SOLANA_NETWORK_CONFIG = isDev
  ? {
    cluster: 'devnet',
    name: 'Solana Devnet', 
    rpcUrls: SOLANA_DEVNET_RPC_POOL,
    primaryRpcUrl: SOLANA_DEVNET_RPC_POOL[0],
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    commitment: 'confirmed' as const,
    wsUrl: 'wss://api.devnet.solana.com',
  }
  : {
    cluster: 'mainnet-beta',
    name: 'Solana Mainnet',
    rpcUrls: SOLANA_MAINNET_RPC_POOL,
    primaryRpcUrl: SOLANA_MAINNET_RPC_POOL[0],
    explorerUrl: 'https://explorer.solana.com',
    commitment: 'confirmed' as const,
    wsUrl: 'wss://api.mainnet-beta.solana.com',
  } as const;

// 导出Solana环境信息
export const SOLANA_ENVIRONMENT = {
  ENV,
  isDev,
  isRelease,
  cluster: SOLANA_NETWORK_CONFIG.cluster,
  networkName: SOLANA_NETWORK_CONFIG.name,
  explorerUrl: SOLANA_NETWORK_CONFIG.explorerUrl,
  commitment: SOLANA_NETWORK_CONFIG.commitment,
  wsUrl: SOLANA_NETWORK_CONFIG.wsUrl,
  primaryRpcUrl: SOLANA_NETWORK_CONFIG.primaryRpcUrl,
  rpcPoolSize: CURRENT_RPC_POOL.length,
} as const;

// Solana RPC健康检查和故障转移工具
export class SolanaRPCManager {
  private static instance: SolanaRPCManager;
  private currentRpcIndex = 0;
  private failedRpcs = new Set<number>();
  private lastHealthCheck = 0;
  private readonly healthCheckInterval = 5 * 60 * 1000; // 5分钟

  static getInstance(): SolanaRPCManager {
    if (!SolanaRPCManager.instance) {
      SolanaRPCManager.instance = new SolanaRPCManager();
    }
    return SolanaRPCManager.instance;
  }

  getCurrentRPC(): string {
    return CURRENT_RPC_POOL[this.currentRpcIndex];
  }

  getAvailableRPCs(): string[] {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed(): string {
    console.warn(`Solana RPC ${this.getCurrentRPC()} 标记为失败，切换到下一个节点`);
    this.failedRpcs.add(this.currentRpcIndex);
    this.switchToNextRPC();
    return this.getCurrentRPC();
  }

  private switchToNextRPC(): void {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index)
    );
    if (availableIndices.length === 0) {
      console.warn('所有Solana RPC节点都失败，重置失败列表');
      this.failedRpcs.clear();
      this.currentRpcIndex = 0;
      return;
    }
    const currentAvailableIndex = availableIndices.indexOf(this.currentRpcIndex);
    const nextIndex = (currentAvailableIndex + 1) % availableIndices.length;
    this.currentRpcIndex = availableIndices[nextIndex];
  }

  async healthCheck(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    this.lastHealthCheck = now;
    
    const healthPromises = CURRENT_RPC_POOL.map(async (rpc, index) => {
      try {
        const response = await fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'getHealth',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.result === 'ok') {
            if (this.failedRpcs.has(index)) {
              console.log(`Solana RPC ${rpc} 已恢复健康`);
              this.failedRpcs.delete(index);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        console.warn(`Solana RPC ${rpc} 健康检查失败:`, error);
        this.failedRpcs.add(index);
        return { index, status: 'failed', rpc };
      }
    });

    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'healthy'
    ).length;
    
    console.log(`Solana RPC健康检查完成: ${healthyCount}/${CURRENT_RPC_POOL.length} 节点正常`);
    console.log(`Helius API密钥数量: ${RPC_API_KEYS.length}`);
  }

  getStats() {
    return {
      total: CURRENT_RPC_POOL.length,
      available: CURRENT_RPC_POOL.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      current: this.getCurrentRPC(),
      failedRpcs: Array.from(this.failedRpcs).map((i) => CURRENT_RPC_POOL[i]),
      environment: SOLANA_ENVIRONMENT.networkName,
      heliusKeys: RPC_API_KEYS.length,
      cluster: SOLANA_ENVIRONMENT.cluster,
    };
  }
}

// 导出向后兼容的环境信息（对接原有代码）
export const ENVIRONMENT = {
  ENV,
  isDev,
  isRelease,
  chainId: isDev ? 101 : 101, // Solana 主网和测试网都使用 cluster 而非 chainId
  networkName: SOLANA_ENVIRONMENT.networkName,
  explorerUrl: SOLANA_ENVIRONMENT.explorerUrl,
} as const;