// RainbowKit/Wagmi/Viem 钱包相关配置
// 适配 BSC 主网与测试网，预留 ABI 路径与类型声明

// ABI导入
import DeploySwordABI from './DeploySword.json';
import ERC20ABI from './ERC20.json';

// 环境变量检查
const ENV = process.env.REACT_APP_NODE_ENV || 'development'; // 默认为开发环境
export const isDev = ENV === 'development';
export const isRelease = ENV === 'release';
console.log('Environment:', ENV);

// 合约地址配置 - 根据环境选择
export const CONTRACTS = isDev
  ? {
      // BSC测试网合约地址
      SWORD_BATTLE: process.env.REACT_APP_SWORD_BATTLE_CONTRACT_TESTNET || '0x8306be4db9071eaeeaa772fe52b5338990f90ec9',
      USD1_TOKEN: process.env.REACT_APP_USD1_TOKEN_CONTRACT_TESTNET || '0x73b8C8c5c81F257832e86A7329123035477C12fA',
    }
  : {
      // BSC主网合约地址
      SWORD_BATTLE: process.env.REACT_APP_SWORD_BATTLE_CONTRACT_MAINNET || '0x0000000000000000000000000000000000000000',
      USD1_TOKEN: process.env.REACT_APP_USD1_TOKEN_CONTRACT_MAINNET || '0x0000000000000000000000000000000000000000',
    } as const;

// ABI导入
export const ABIS = {
  SWORD_BATTLE: DeploySwordABI as readonly any[],
  USD1_TOKEN: ERC20ABI.abi as readonly any[],
} as const;

// 合约配置类型
export type ContractConfig = {
  address: `0x${string}`;
  abi: readonly any[];
};

// 导出合约配置
export const getSwordBattleContract = (): ContractConfig => ({
  address: CONTRACTS.SWORD_BATTLE as `0x${string}`,
  abi: ABIS.SWORD_BATTLE,
});

export const getUSD1TokenContract = (): ContractConfig => ({
  address: CONTRACTS.USD1_TOKEN as `0x${string}`,
  abi: ABIS.USD1_TOKEN,
});

// BSC主网RPC池配置
export const BSC_MAINNET_RPC_POOL = [
  'https://rpc.ankr.com/bsc/861a4f3afee73437812056e2efd748f76db6220c614f0e34a9c7b2f66c9e97d5',
  'https://rpc.ankr.com/bsc/45608a7cdae0c7873dcbd9196953b7015f8d7127736df17480472224b128e67e',
  'https://rpc.ankr.com/bsc/6912fa941610bbd399c033a47c0103ac0611db7e30b95c19b8087d5363670537',
  'https://rpc.ankr.com/bsc/c5c5e3d8c1b1b285ba4778fb16c35fc211b3eb691cf9bd2a9b9a155eca0f4bc2',
] as const;

// BSC测试网RPC池配置
export const BSC_TESTNET_RPC_POOL = [
  'https://bsc-testnet-dataseed.bnbchain.org',
  'https://bsc-testnet.bnbchain.org',
  'https://bsc-testnet-rpc.publicnode.com',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-1-s2.bnbchain.org:8545',
  'https://data-seed-prebsc-2-s2.bnbchain.org:8545',
  'https://data-seed-prebsc-1-s3.bnbchain.org:8545',
  'https://data-seed-prebsc-2-s3.bnbchain.org:8545',
] as const;

// 根据环境选择RPC池
export const CURRENT_RPC_POOL = isDev ? BSC_TESTNET_RPC_POOL : BSC_MAINNET_RPC_POOL;

// 网络配置 - 根据环境选择
export const NETWORK_CONFIG = isDev
  ? {
      chainId: 97,
      name: 'BSC Testnet',
      rpcUrls: BSC_TESTNET_RPC_POOL,
      primaryRpcUrl: BSC_TESTNET_RPC_POOL[0],
      explorerUrl: 'https://testnet.bscscan.com/',
      nativeCurrency: {
        name: 'tBNB',
        symbol: 'tBNB',
        decimals: 18,
      },
    }
  : {
      chainId: 56,
      name: 'BSC Mainnet',
      rpcUrls: BSC_MAINNET_RPC_POOL,
      primaryRpcUrl: BSC_MAINNET_RPC_POOL[0],
      explorerUrl: 'https://bscscan.com/',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
    } as const;

// 导出环境信息
export const ENVIRONMENT = {
  ENV,
  isDev,
  isRelease,
  chainId: NETWORK_CONFIG.chainId,
  networkName: NETWORK_CONFIG.name,
  explorerUrl: NETWORK_CONFIG.explorerUrl,
} as const;

// RPC健康检查和故障转移工具
export class RPCManager {
  private static instance: RPCManager;
  private currentRpcIndex = 0;
  private failedRpcs = new Set<number>();
  private lastHealthCheck = 0;
  private readonly healthCheckInterval = 5 * 60 * 1000;

  static getInstance(): RPCManager {
    if (!RPCManager.instance) {
      RPCManager.instance = new RPCManager();
    }
    return RPCManager.instance;
  }

  getCurrentRPC(): string {
    return CURRENT_RPC_POOL[this.currentRpcIndex];
  }

  getAvailableRPCs(): string[] {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed(): string {
    console.warn(`RPC ${this.getCurrentRPC()} 标记为失败，切换到下一个节点`);
    this.failedRpcs.add(this.currentRpcIndex);
    this.switchToNextRPC();
    return this.getCurrentRPC();
  }

  private switchToNextRPC(): void {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index)
    );
    if (availableIndices.length === 0) {
      console.warn('所有RPC节点都失败，重置失败列表');
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
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            if (this.failedRpcs.has(index)) {
              this.failedRpcs.delete(index);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        console.warn(`RPC ${rpc} 健康检查失败:`, error);
        this.failedRpcs.add(index);
        return { index, status: 'failed', rpc };
      }
    });
    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'healthy'
    ).length;
    console.log(`RPC健康检查完成: ${healthyCount}/${CURRENT_RPC_POOL.length} 节点正常`);
  }

  getStats() {
    return {
      total: CURRENT_RPC_POOL.length,
      available: CURRENT_RPC_POOL.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      current: this.getCurrentRPC(),
      failedRpcs: Array.from(this.failedRpcs).map((i) => CURRENT_RPC_POOL[i]),
      environment: ENVIRONMENT.networkName,
    };
  }
} 