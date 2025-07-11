// Load environment variables from a .env file
require('dotenv').config();

// 环境判断逻辑与前端保持一致
const ENV = process.env.BUILD_ENV || 'development';
const isDev = ENV === 'development';
const isRelease = ENV === 'production';

console.log('state:', process.env.BUILD_ENV);
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

  // Enable/disable database save (temporary flag to bypass API issues)
  enableDatabaseSave: process.env.ENABLE_DATABASE_SAVE !== 'false',

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
  isRaceServer: process.env.SERVER_TYPE === 'RACE' || isDev, // Enable race server in dev mode
  enableCycleRestart: process.env.ENABLE_CYCLE_RESTART === 'true',

  // Solana configuration - replaces BSC blockchain
  solana: {
    enabled: true, // Re-enabled after fixing uWebSockets issues
    rpcUrl:
      process.env.SOLANA_RPC_URL ||
      (isDev
        ? 'https://api.devnet.solana.com'
        : 'https://api.mainnet-beta.solana.com'),
    privateKey: process.env.SOLANA_PRIVATE_KEY, // Server wallet private key for vault operations
    programId:
      process.env.VAULT_PROGRAM_ID ||
      'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV', // Vault program ID
    tokenMint:
      process.env.SOLANA_TOKEN_MINT ||
      'So11111111111111111111111111111111111111112', // Token mint for rewards (default: SOL)
    killReward: parseFloat(process.env.KILL_REWARD || '0.001'), // Token reward per kill (deprecated - use tiers)
    environment: {
      isDev,
      isRelease,
      cluster: isDev ? 'devnet' : 'mainnet-beta',
    },
    // Game tier configuration for secure pricing control
    tiers: {
      low: {
        name: 'Low Tier Arena',
        entranceFee: parseFloat(process.env.LOW_TIER_ENTRANCE_FEE || '0.01'), // 0.01 SOL
        killReward: parseFloat(process.env.LOW_TIER_KILL_REWARD || '0.001'), // 0.001 SOL per kill
        minLevel: 1,
        maxLevel: 10,
        description: 'Beginner-friendly arena with basic rewards',
      },
      medium: {
        name: 'Medium Tier Arena',
        entranceFee: parseFloat(process.env.MID_TIER_ENTRANCE_FEE || '0.05'), // 0.05 SOL
        killReward: parseFloat(process.env.MID_TIER_KILL_REWARD || '0.005'), // 0.005 SOL per kill
        minLevel: 11,
        maxLevel: 25,
        description: 'Intermediate arena with enhanced rewards',
      },
      high: {
        name: 'High Tier Arena',
        entranceFee: parseFloat(process.env.HIGH_TIER_ENTRANCE_FEE || '0.1'), // 0.1 SOL
        killReward: parseFloat(process.env.HIGH_TIER_KILL_REWARD || '0.01'), // 0.01 SOL per kill
        minLevel: 26,
        maxLevel: 999,
        description: 'Advanced arena with premium rewards',
      },
    },
    // Security settings for tier validation
    security: {
      enableStrictPriceValidation:
        process.env.ENABLE_STRICT_PRICE_VALIDATION !== 'false', // Default enabled
      allowPriceDeviation: parseFloat(process.env.ALLOW_PRICE_DEVIATION || '0'), // No deviation allowed by default
      requireExactTierMatch: process.env.REQUIRE_EXACT_TIER_MATCH !== 'false', // Default enabled
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
