// 区块链配置
// API服务器的区块链相关配置

export interface BlockchainConfig {
  enabled: boolean;
  rpcUrl?: string;
  contracts: {
    gameAggregator: string;
    swordBattle: string;
    usd1Token: string;
    rewardManager: string;
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
    // API 现在使用新的 GameAggregator 合约进行所有查询
    gameAggregator: isDev 
      ? (process.env.GAME_AGGREGATOR_CONTRACT_TESTNET || process.env.GAME_AGGREGATOR_CONTRACT || '0xd442E28E906aF252D6ecf6207bD8AE9CC4337bce')
      : (process.env.GAME_AGGREGATOR_CONTRACT_MAINNET || process.env.GAME_AGGREGATOR_CONTRACT || '0xd442E28E906aF252D6ecf6207bD8AE9CC4337bce'),
    // 保留 SwordBattle 合约地址用于某些旧功能
    swordBattle: isDev 
      ? (process.env.SWORD_BATTLE_CONTRACT_TESTNET || process.env.SWORD_BATTLE_CONTRACT || '0x2201a02600d55758F14bbC100c35580785BAD622')
      : (process.env.SWORD_BATTLE_CONTRACT_MAINNET || process.env.SWORD_BATTLE_CONTRACT || '0x2201a02600d55758F14bbC100c35580785BAD622'),
    usd1Token: isDev 
      ? (process.env.USD1_TOKEN_CONTRACT_TESTNET || process.env.USD1_TOKEN_CONTRACT || '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16')
      : (process.env.USD1_TOKEN_CONTRACT_MAINNET || process.env.USD1_TOKEN_CONTRACT || ''),
    rewardManager: isDev 
      ? (process.env.REWARD_MANAGER_CONTRACT_TESTNET || process.env.REWARD_MANAGER_CONTRACT || '0x8732A5ceE8372DFa95Db266086A7FF297245b05c')
      : (process.env.REWARD_MANAGER_CONTRACT_MAINNET || process.env.REWARD_MANAGER_CONTRACT || '0x8732A5ceE8372DFa95Db266086A7FF297245b05c'),
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
  
  if (!config.contracts.rewardManager) {
    const expectedVar = isDev 
      ? 'REWARD_MANAGER_CONTRACT_TESTNET (或 REWARD_MANAGER_CONTRACT)' 
      : 'REWARD_MANAGER_CONTRACT_MAINNET (或 REWARD_MANAGER_CONTRACT)';
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
  console.log(`   SWORD_BATTLE合约: ${config.contracts.swordBattle}`);
  console.log(`   USD1_TOKEN合约: ${config.contracts.usd1Token}`);
  console.log(`   REWARD_MANAGER合约: ${config.contracts.rewardManager}`);

  return true;
} 