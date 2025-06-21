// 区块链配置
// API服务器的区块链相关配置

export interface BlockchainConfig {
  enabled: boolean;
  rpcUrl?: string;
  contracts: {
    swordBattle: string;
    usd1Token: string;
  };
  trustedSigner?: string;
  environment: {
    isDev: boolean;
    isRelease: boolean;
    chainId: number;
    networkName: string;
  };
}

// 环境判断逻辑
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

// 默认区块链配置
export const defaultBlockchainConfig: BlockchainConfig = {
  enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
  contracts: {
    swordBattle: process.env.SWORD_BATTLE_CONTRACT || '',
    usd1Token: process.env.USD1_TOKEN_CONTRACT || '',
  },
  trustedSigner: process.env.TRUSTED_SIGNER_PRIVATE_KEY,
  environment: {
    isDev,
    isRelease,
    chainId: isDev ? 97 : 56, // BSC测试网:97, BSC主网:56
    networkName: isDev ? 'BSC Testnet' : 'BSC Mainnet',
  },
};

// 验证配置
export function validateBlockchainConfig(config: BlockchainConfig): boolean {
  if (!config.enabled) {
    return true; // 如果未启用，配置有效
  }

  const missingFields: string[] = [];
  
  if (!config.contracts.swordBattle) {
    missingFields.push('SWORD_BATTLE_CONTRACT');
  }
  
  if (!config.contracts.usd1Token) {
    missingFields.push('USD1_TOKEN_CONTRACT');
  }
  
  if (!config.trustedSigner) {
    missingFields.push('TRUSTED_SIGNER_PRIVATE_KEY');
  }

  if (missingFields.length > 0) {
    console.error('Missing required blockchain configuration:', missingFields);
    return false;
  }

  return true;
} 