// Load environment variables from a .env file
require('dotenv').config();

/*
 * 环境变量配置说明：
 * 
 * 基础服务器配置：
 * - SERVER_PORT: 服务器端口，默认 8000
 * - USE_SSL: 是否启用SSL，设置为 'TRUE' 启用
 * - SSL_KEY: SSL私钥文件路径
 * - SSL_CERT: SSL证书文件路径
 * - DEBUG: 调试模式，设置为 'TRUE' 启用
 * - SERVER_SECRET: 服务器密钥，默认 'server-secret'
 * - MODERATION_SECRET: 审核密钥，默认 'moderation-secret'
 * - API_ENDPOINT: API服务器地址，默认 'http://localhost:8080'
 * - RECAPTCHA_SECRET_KEY: ReCAPTCHA密钥
 * 
 * 比赛服务器配置：
 * - NODE_ENV: 环境类型，'development' 或 'production'
 * - SERVER_TYPE: 服务器类型，'NORMAL' 或 'RACE'
 * - BLOCKCHAIN_ENABLED: 是否启用区块链功能，设置为 'true' 启用
 * - BLOCKCHAIN_RPC_URL: 区块链RPC地址（可选，会使用内置RPC池）
 * - SWORD_BATTLE_CONTRACT: SwordBattle合约地址
 * - USD1_TOKEN_CONTRACT: USD1代币合约地址
 * - TRUSTED_SIGNER_PRIVATE_KEY: 可信签名者私钥（用于EIP-712签名）
 */

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
