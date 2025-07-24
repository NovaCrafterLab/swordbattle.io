// Solana区块链配置
// 统一的Solana网络配置，与client/server保持一致

export interface SolanaBlockchainConfig {
  enabled: boolean;
  environment: {
    isDev: boolean;
    isRelease: boolean;
    cluster: 'mainnet-beta' | 'devnet' | 'testnet';
    networkName: string;
  };
  rpc: {
    primaryRpcUrl: string;
    rpcPool: string[];
    commitment: 'processed' | 'confirmed' | 'finalized';
  };
  programs: {
    vaultProgramId: string;
    tokenMint: string;
  };
  healthCheck: {
    enabled: boolean;
    interval: number; // 毫秒
    timeout: number; // 毫秒
  };
}

// 环境判断逻辑
const ENV = process.env.BUILD_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

// Helius RPC API Keys Pool (与client保持一致)
const RPC_API_KEYS_RAW =
  process.env.RPC_API_KEYS_POOL ||
  process.env.REACT_APP_RPC_API_KEYS_POOL ||
  '';
const RPC_API_KEYS = RPC_API_KEYS_RAW.split(',').filter(
  (key) => key.trim().length > 0,
);

// Solana Devnet RPC池配置 (与client/server保持一致)
export const SOLANA_DEVNET_RPC_POOL =
  RPC_API_KEYS.length > 0
    ? RPC_API_KEYS.map((key) => `https://devnet.helius-rpc.com/?api-key=${key}`)
    : ([
        'https://api.devnet.solana.com',
        'https://rpc.ankr.com/solana_devnet',
      ] as const);

// Solana Mainnet RPC池配置 (与client/server保持一致)
export const SOLANA_MAINNET_RPC_POOL =
  RPC_API_KEYS.length > 0
    ? RPC_API_KEYS.map(
        (key) => `https://mainnet.helius-rpc.com/?api-key=${key}`,
      )
    : ([
        'https://api.mainnet-beta.solana.com',
        'https://rpc.ankr.com/solana',
      ] as const);

// RPC池配置
export const SOLANA_RPC_POOLS = {
  devnet: SOLANA_DEVNET_RPC_POOL,
  mainnet: SOLANA_MAINNET_RPC_POOL,
} as const;

// 根据环境选择RPC池
export const CURRENT_RPC_POOL = isDev
  ? SOLANA_DEVNET_RPC_POOL
  : SOLANA_MAINNET_RPC_POOL;

// 有效的Solana地址作为占位符（base58编码）
const PLACEHOLDER_ADDRESSES = {
  // 使用系统程序ID作为安全的占位符地址
  VAULT_PROGRAM_DEVNET: '11111111111111111111111111111112', // System Program
  TOKEN_MINT_DEVNET: 'So11111111111111111111111111111111111111112', // SOL mint
  VAULT_PROGRAM_MAINNET: '11111111111111111111111111111112', // System Program
  TOKEN_MINT_MAINNET: 'So11111111111111111111111111111111111111112', // SOL mint
} as const;

// 默认Solana区块链配置
export const defaultSolanaBlockchainConfig: SolanaBlockchainConfig = {
  enabled: process.env.SOLANA_BLOCKCHAIN_ENABLED !== 'false', // Default: true (enabled)
  environment: {
    isDev,
    isRelease,
    cluster: isDev ? 'devnet' : 'mainnet-beta',
    networkName: isDev ? 'Solana Devnet' : 'Solana Mainnet',
  },
  rpc: {
    primaryRpcUrl: CURRENT_RPC_POOL[0],
    rpcPool: [...CURRENT_RPC_POOL],
    commitment: 'confirmed',
  },
  programs: {
    // Vault程序地址 - 根据环境选择
    vaultProgramId: isDev
      ? process.env.VAULT_PROGRAM_ID_DEVNET ||
        process.env.VAULT_PROGRAM_ID ||
        PLACEHOLDER_ADDRESSES.VAULT_PROGRAM_DEVNET
      : process.env.VAULT_PROGRAM_ID_MAINNET ||
        process.env.VAULT_PROGRAM_ID ||
        PLACEHOLDER_ADDRESSES.VAULT_PROGRAM_MAINNET,
    // Token Mint地址 - 根据环境选择
    tokenMint: isDev
      ? process.env.TOKEN_MINT_DEVNET ||
        process.env.TOKEN_MINT ||
        'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq' // Default to SBTT test token
      : process.env.TOKEN_MINT_MAINNET ||
        process.env.TOKEN_MINT ||
        PLACEHOLDER_ADDRESSES.TOKEN_MINT_MAINNET,
  },
  healthCheck: {
    enabled: true,
    interval: 5 * 60 * 1000, // 5分钟
    timeout: 5000, // 5秒
  },
};

// 验证Solana配置
export function validateSolanaBlockchainConfig(
  config: SolanaBlockchainConfig,
): boolean {
  if (!config.enabled) {
    console.log('ℹ️ Solana blockchain service is disabled');
    return true; // 如果未启用，配置有效
  }

  console.log('✅ Solana blockchain service is enabled');

  const missingFields: string[] = [];

  // 检查RPC配置
  if (!config.rpc.rpcPool || config.rpc.rpcPool.length === 0) {
    missingFields.push('RPC_API_KEYS_POOL (for Helius endpoints)');
  }

  // 检查程序配置
  if (
    !config.programs.vaultProgramId ||
    config.programs.vaultProgramId ===
      PLACEHOLDER_ADDRESSES.VAULT_PROGRAM_DEVNET
  ) {
    const expectedVar = isDev
      ? 'VAULT_PROGRAM_ID_DEVNET'
      : 'VAULT_PROGRAM_ID_MAINNET';
    missingFields.push(expectedVar);
  }

  if (
    !config.programs.tokenMint ||
    config.programs.tokenMint === PLACEHOLDER_ADDRESSES.TOKEN_MINT_MAINNET
  ) {
    const expectedVar = isDev ? 'TOKEN_MINT_DEVNET' : 'TOKEN_MINT_MAINNET';
    missingFields.push(expectedVar);
  }

  if (missingFields.length > 0) {
    console.warn(
      '⚠️ Some Solana configuration fields are using placeholders:',
      missingFields,
    );
    console.warn(
      `当前环境: ${isDev ? '开发环境 (Devnet)' : '生产环境 (Mainnet)'}`,
    );
    console.warn('💡 Consider setting proper values for production use');
  }

  // 输出当前使用的配置
  console.log('✅ Solana blockchain configuration loaded:');
  console.log(`   环境: ${config.environment.networkName}`);
  console.log(`   RPC池大小: ${config.rpc.rpcPool.length} endpoints`);
  console.log(`   Helius密钥数量: ${RPC_API_KEYS.length}`);
  console.log(`   Vault程序ID: ${config.programs.vaultProgramId}`);
  console.log(`   Token Mint: ${config.programs.tokenMint}`);
  console.log(`   承诺级别: ${config.rpc.commitment}`);

  return true;
}

// 导出Solana环境信息
export const SOLANA_ENVIRONMENT = {
  ENV,
  isDev,
  isRelease,
  cluster: defaultSolanaBlockchainConfig.environment.cluster,
  networkName: defaultSolanaBlockchainConfig.environment.networkName,
  commitment: defaultSolanaBlockchainConfig.rpc.commitment,
  primaryRpcUrl: defaultSolanaBlockchainConfig.rpc.primaryRpcUrl,
  rpcPoolSize: CURRENT_RPC_POOL.length,
  heliusKeys: RPC_API_KEYS.length,
} as const;
