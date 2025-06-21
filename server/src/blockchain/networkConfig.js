// 网络配置和RPC池管理
// 与前端保持一致的配置

// 环境判断逻辑与前端保持一致
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

// BSC主网RPC池配置
const BSC_MAINNET_RPC_POOL = [
  'https://rpc.ankr.com/bsc/861a4f3afee73437812056e2efd748f76db6220c614f0e34a9c7b2f66c9e97d5',
  'https://rpc.ankr.com/bsc/45608a7cdae0c7873dcbd9196953b7015f8d7127736df17480472224b128e67e',
  'https://rpc.ankr.com/bsc/6912fa941610bbd399c033a47c0103ac0611db7e30b95c19b8087d5363670537',
  'https://rpc.ankr.com/bsc/c5c5e3d8c1b1b285ba4778fb16c35fc211b3eb691cf9bd2a9b9a155eca0f4bc2',
];

// BSC测试网RPC池配置
const BSC_TESTNET_RPC_POOL = [
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
];

// 根据环境选择RPC池
const CURRENT_RPC_POOL = isDev ? BSC_TESTNET_RPC_POOL : BSC_MAINNET_RPC_POOL;

// 网络配置
const NETWORK_CONFIG = isDev
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
    };

// 环境信息
const ENVIRONMENT = {
  ENV,
  isDev,
  isRelease,
  chainId: NETWORK_CONFIG.chainId,
  networkName: NETWORK_CONFIG.name,
  explorerUrl: NETWORK_CONFIG.explorerUrl,
};

module.exports = {
  BSC_MAINNET_RPC_POOL,
  BSC_TESTNET_RPC_POOL,
  CURRENT_RPC_POOL,
  NETWORK_CONFIG,
  ENVIRONMENT,
  isDev,
  isRelease,
  ENV,
}; 