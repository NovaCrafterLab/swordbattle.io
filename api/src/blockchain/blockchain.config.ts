export interface BlockchainConfig {
  enabled: boolean;
  rpcUrl?: string;
  contracts: {
    gameAggregator: string;
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
const ENV = process.env.BUILD_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

// 默认区块链配置
export const defaultBlockchainConfig: BlockchainConfig = {
  enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
  contracts: {
    gameAggregator: isDev 
      ? (process.env.GAME_AGGREGATOR_CONTRACT_TESTNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x6810494B605ac1A6259788Db999202f5578dA4E1')
      : (process.env.GAME_AGGREGATOR_CONTRACT_MAINNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x0E1124B236e454EA325c33aBBb561D38b255Da6c'),
    usd1Token: isDev 
      ? '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16'
      : '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16',
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
  
  if (!config.contracts.gameAggregator) {
    const expectedVar = isDev 
      ? 'GAME_AGGREGATOR_CONTRACT_TESTNET' 
      : 'GAME_AGGREGATOR_CONTRACT_MAINNET';
    missingFields.push(expectedVar);
  }
  
  if (!config.contracts.usd1Token) {
    const expectedVar = isDev 
      ? 'USD1_TOKEN_CONTRACT_TESTNET (或 USD1_TOKEN_CONTRACT)' 
      : 'USD1_TOKEN_CONTRACT_MAINNET (或 USD1_TOKEN_CONTRACT)';
    missingFields.push(expectedVar);
  }
  
  if (!config.trustedSigner) {
    missingFields.push('TRUSTED_SIGNER_PRIVATE_KEY');
  }

  if (missingFields.length > 0) {
    console.error('Missing required blockchain configuration:', missingFields);
    console.error(`当前环境: ${isDev ? '开发环境 (测试网)' : '生产环境 (主网)'}`);
    return false;
  }

  // 输出当前使用的合约地址配置
  console.log('✅ Blockchain configuration validated');
  console.log(`   环境: ${config.environment.networkName}`);
  console.log(`   GAME_AGGREGATOR合约: ${config.contracts.gameAggregator}`);
  console.log(`   USD1_TOKEN合约: ${config.contracts.usd1Token}`);

  return true;
} 