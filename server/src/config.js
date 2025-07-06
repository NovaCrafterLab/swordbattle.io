// Load environment variables from a .env file
require('dotenv').config();

// 环境判断逻辑与前端保持一致
const ENV = process.env.BUILD_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

console.log("state:", process.env.BUILD_ENV);
console.log('workspace:', process.cwd());


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
        ? (process.env.GAME_AGGREGATOR_CONTRACT_TESTNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x6810494B605ac1A6259788Db999202f5578dA4E1')
        : (process.env.GAME_AGGREGATOR_CONTRACT_MAINNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x6810494B605ac1A6259788Db999202f5578dA4E1'),
      // SwordBattle 原合约用于基础数据查询 - 更新为最新地址
      swordBattle: isDev
        ? (process.env.SWORD_BATTLE_CONTRACT_TESTNET || process.env.SWORD_BATTLE_CONTRACT || '0xCd2846d73b4bA42c8b000bcBE52Df28c1B1722eD')
        : (process.env.SWORD_BATTLE_CONTRACT_MAINNET || process.env.SWORD_BATTLE_CONTRACT || '0xCd2846d73b4bA42c8b000bcBE52Df28c1B1722eD'),
      usd1Token: isDev
        ? '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16'
        : '0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16',
      rewardManager: isDev
        ? '0x8732A5ceE8372DFa95Db266086A7FF297245b05c'
        : '0x8732A5ceE8372DFa95Db266086A7FF297245b05c',
    },
    trustedSigner: process.env.TRUSTED_SIGNER_PRIVATE_KEY,
    gameLevel: parseInt(process.env.GAME_LEVEL || '0'), 
    environment: {
      isDev,
      isRelease,
      chainId: isDev ? 97 : 56,
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

  /**************************************
   * Web3
   **************************************/
  // Blockchain configuration
  blockchain: {
    enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL, // 可选，会使用内置RPC池
    contracts: {
      // GameAggregator 合约用于游戏操作
      gameAggregator: isDev
        ? (process.env.GAME_AGGREGATOR_CONTRACT_TESTNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x99616B1f031aF994a4b2cc940683255cB76Dd596')
        : (process.env.GAME_AGGREGATOR_CONTRACT_MAINNET || process.env.GAME_AGGREGATOR_CONTRACT || '0x99616B1f031aF994a4b2cc940683255cB76Dd596'),
      // SwordBattle 原合约用于基础数据查询
      swordBattle: isDev
        ? (process.env.SWORD_BATTLE_CONTRACT_TESTNET || process.env.SWORD_BATTLE_CONTRACT || '0x788aA9aAb214B3ac525c23bd257e93Ff0f10D9E0')
        : (process.env.SWORD_BATTLE_CONTRACT_MAINNET || process.env.SWORD_BATTLE_CONTRACT || '0x788aA9aAb214B3ac525c23bd257e93Ff0f10D9E0'),
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
  enableCycleRestart: process.env.ENABLE_CYCLE_RESTART === 'true' || process.env.SERVER_TYPE === 'RACE',

};
