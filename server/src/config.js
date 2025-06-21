// Load environment variables from a .env file
require('dotenv').config();

// 环境判断逻辑与前端保持一致
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

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

  // Blockchain configuration
  blockchain: {
    enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL, // 可选，会使用内置RPC池
    contracts: {
      swordBattle: process.env.SWORD_BATTLE_CONTRACT,
      usd1Token: process.env.USD1_TOKEN_CONTRACT,
    },
    trustedSigner: process.env.TRUSTED_SIGNER_PRIVATE_KEY,
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
