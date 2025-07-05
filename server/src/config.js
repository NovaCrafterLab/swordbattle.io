// Load environment variables from unified env files
const path = require('path');
const fs = require('fs');

// 环境判断逻辑与前端保持一致
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

// 环境文件加载优先级（从高到低）
const envFiles = [
  // 项目根目录的统一环境配置文件（优先）
  path.resolve(__dirname, '..', '..', 'env', `server.env.${ENV}`),
  path.resolve(__dirname, '..', '..', 'env', 'server.env'),
  // 服务器目录下的传统.env文件（备用）
  path.resolve(__dirname, '..', '.env'),
].filter(Boolean);

console.log('🔍 Loading server environment configuration...');
envFiles.forEach((envFile, index) => {
  if (fs.existsSync(envFile)) {
    console.log(`   ${index + 1}. Loading: ${envFile} ✅`);
    require('dotenv-expand')(
      require('dotenv').config({
        path: envFile,
      }),
    );
  } else {
    console.log(`   ${index + 1}. Skipping: ${envFile} ❌`);
  }
});

console.log('✅ Environment configuration loaded\n');

// Export configuration object for the application
module.exports = {
  // Define the port to be used, default to 8000 if not specified in the environment
  port: process.env.SERVER_PORT || process.env.PORT || 8000,

  // Determine if SSL should be used based on the environment variable USE_SSL being set to 'TRUE'
  useSSL: process.env.USE_SSL === 'TRUE',

  // SSL certificate data, using empty strings as defaults if not provided in the environment
  sslData: {
    key: process.env.SSL_KEY || '',
    cert: process.env.SSL_CERT || '',
  },

  // Enable debugging
  debug: process.env.DEBUG === 'TRUE',

  // Secret key for the server, defaulting to 'server-secret' if not specified in the environment
  serverSecret: process.env.SERVER_SECRET || 'server-secret',

  // Moderation secret
  moderationSecret: process.env.MODERATION_SECRET || 'moderation-secret',

  // API endpoint for the server to communicate with the API service
  apiEndpoint: process.env.API_ENDPOINT || 'http://localhost:8080',

  // ReCAPTCHA secret key for verifying ReCAPTCHA responses
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,

  // Environment information
  environment: {
    ENV,
    isDev,
    isRelease,
    nodeEnv: ENV,
  },

  // Server type configuration
  serverType: process.env.SERVER_TYPE || 'NORMAL',
  isRaceServer: process.env.SERVER_TYPE === 'RACE',
  enableCycleRestart:process.env.ENABLE_CYCLE_RESTART === 'true' || process.env.SERVER_TYPE === 'RACE',

  // Blockchain configuration
  blockchain: {
    enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL, // 可选，会使用内置RPC池
    contracts: {
      // GameAggregator 合约用于游戏操作 - 更新为最新地址
      gameAggregator: isDev
        ? (process.env.GAME_AGGREGATOR_CONTRACT_TESTNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x30C5fDb3FBdd3247ebEBD82EFFd235c221285dBE')
        : (process.env.GAME_AGGREGATOR_CONTRACT_MAINNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x30C5fDb3FBdd3247ebEBD82EFFd235c221285dBE'),
      // SwordBattle 原合约用于基础数据查询 - 更新为最新地址
      swordBattle: isDev
        ? (process.env.SWORD_BATTLE_CONTRACT_TESTNET || process.env.SWORD_BATTLE_CONTRACT || '0xCd2846d73b4bA42c8b000bcBE52Df28c1B1722eD')
        : (process.env.SWORD_BATTLE_CONTRACT_MAINNET || process.env.SWORD_BATTLE_CONTRACT || '0xCd2846d73b4bA42c8b000bcBE52Df28c1B1722eD'),
      usd1Token: isDev
        ? (process.env.USD1_TOKEN_CONTRACT_TESTNET || process.env.USD1_TOKEN_CONTRACT || '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16')
        : (process.env.USD1_TOKEN_CONTRACT_MAINNET || process.env.USD1_TOKEN_CONTRACT),
      rewardManager: isDev
        ? (process.env.REWARD_MANAGER_CONTRACT_TESTNET || process.env.REWARD_MANAGER_CONTRACT)
        : (process.env.REWARD_MANAGER_CONTRACT_MAINNET || process.env.REWARD_MANAGER_CONTRACT),
    },
    trustedSigner: process.env.TRUSTED_SIGNER_PRIVATE_KEY,
    gameLevel: parseInt(process.env.GAME_LEVEL || '0'), // 游戏级别：0=LOW, 1=MEDIUM, 2=HIGH
    environment: {
      isDev,
      isRelease,
      chainId: isDev ? 97 : 56, // BSC测试网:97, BSC主网:56
      networkName: isDev ? 'BSC Testnet' : 'BSC Mainnet',
    },
  },

  // Game configuration settings
  tickRate: 20,

  // Player settings
  player: {
    speed: 700,
    radius: 100,
    maxHealth: 80,
    regeneration: 3,

    // Player's viewport configuration
    viewport: {
      width: 1500,
      height: 1500,
      zoom: 0.7,
      spectateZoom: 0.9,
    },
  },

  // Sword settings
  sword: {
    initialSwingDuration: 0.1,
    swingDurationIncrease: 1.15,
    maxSwingDuration: 3,
    damage: 10,
    knockback: 200,
  },

  // Game saving settings
  saveGame: {
    playtime: 30, // in minutes
    coins: 20000,
    kills: 50,
  },

  // World settings
  world: {
    worldHeight: 30000,
    worldWidth: 30000,
  },
};
