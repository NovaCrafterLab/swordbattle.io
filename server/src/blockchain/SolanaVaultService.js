const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const Logger = require('../utils/Logger');

// Import official VaultSDK with Anchor 0.31.1 support
const path = require('path');
const { VaultSDK } = require(
  path.resolve(__dirname, '../../../solana/vault-sdk/dist/index.js'),
);

/**
 * Solana Vault Service - replaces the complex BSC BlockchainService
 * Provides simple kill-based reward system using Solana vault program
 */
class SolanaVaultService {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.wallet = null;
    this.vaultSDK = null;
    this.isInitialized = false;

    Logger.server.info('Solana Vault Service initializing', {
      rpcUrl: config.rpcUrl,
      programId: config.programId,
    });
  }

  async initialize() {
    try {
      Logger.server.info('🔗 Initializing Solana vault service');

      // Create connection to Solana cluster
      this.connection = new Connection(
        this.config.rpcUrl || 'https://api.devnet.solana.com',
        'confirmed',
      );

      // Initialize wallet from private key
      if (this.config.privateKey) {
        const privateKeyBytes = Uint8Array.from(
          Buffer.from(this.config.privateKey, 'hex'),
        );
        this.wallet = Keypair.fromSecretKey(privateKeyBytes);
        Logger.server.info(
          '🔑 Wallet initialized:',
          this.wallet.publicKey.toString(),
        );
      } else {
        // Fallback to id.json file in abis directory
        try {
          const idPath = path.resolve(__dirname, '../../../abis/id.json');
          const privateKeyArray = require(idPath);
          this.wallet = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
          Logger.server.info(
            '🔑 Wallet loaded from id.json:',
            this.wallet.publicKey.toString(),
          );
        } catch (error) {
          throw new Error(
            'No Solana private key provided and id.json not found',
          );
        }
      }

      // Test connection
      const latestBlockhash = await this.connection.getLatestBlockhash();
      Logger.server.info(
        '✅ Solana connected, blockhash:',
        latestBlockhash.blockhash.slice(0, 8) + '...',
      );

      // Initialize VaultSDK
      if (
        !this.config.programId ||
        this.config.programId === '11111111111111111111111111111111'
      ) {
        throw new Error('Valid Vault program ID is required');
      }

      // Create proper wallet interface for VaultSDK
      const walletInterface = {
        publicKey: this.wallet.publicKey,
        signTransaction: async (tx) => {
          tx.sign(this.wallet);
          return tx;
        },
        signAllTransactions: async (txs) => {
          return txs.map((tx) => {
            tx.sign(this.wallet);
            return tx;
          });
        },
      };

      this.vaultSDK = new VaultSDK({
        programId: new PublicKey(this.config.programId),
        connection: this.connection,
        wallet: walletInterface,
      });

      Logger.server.info(
        '🔧 Real VaultSDK initialized with program:',
        this.config.programId,
      );

      this.isInitialized = true;
      Logger.status('🚀 Solana vault service ready');
    } catch (error) {
      Logger.server.error('Failed to initialize Solana vault service', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Get all existing game IDs from Solana
   */
  async getAllGameIds() {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🔍 Fetching all game IDs from Solana');
      const gameIds = await this.vaultSDK.getAllGameIds();
      Logger.server.debug(
        `📋 Found game IDs: [${gameIds.join(', ')}] (${gameIds.length} total)`,
      );
      return gameIds;
    } catch (error) {
      Logger.server.error('Failed to get all game IDs', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get the latest (highest) game ID
   */
  async getLatestGameId() {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🔍 Fetching latest game ID from Solana');
      const gameIds = await this.getAllGameIds();
      const latestGameId =
        gameIds.length > 0 ? gameIds[gameIds.length - 1] : null;
      Logger.server.debug(
        `🎯 Latest game ID: ${latestGameId || 'none (fresh start)'}`,
      );
      return latestGameId;
    } catch (error) {
      Logger.server.error('Failed to get latest game ID', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get the next available game ID (latest + 1)
   */
  async getNextGameId() {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🔍 Getting next available game ID');
      const latestGameId = await this.getLatestGameId();
      const nextGameId = latestGameId
        ? (parseInt(latestGameId) + 1).toString()
        : '1';
      Logger.server.debug(
        `🎯 Next game ID: ${nextGameId} (${latestGameId ? `increment from ${latestGameId}` : 'first game'})`,
      );
      return nextGameId;
    } catch (error) {
      Logger.server.error('Failed to get next game ID', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Atomically create the next available game ID and initialize vault
   * Prevents race conditions when multiple servers start simultaneously
   */
  async createGameAtomically(tier = 'low') {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.info('🎮 Creating Solana game vault atomically with tier', {
        tier,
        message: 'Using atomic creation to prevent server conflicts',
      });

      // Validate tier configuration
      const tierConfig = this.getTierConfig(tier);

      // Use configured token mint from environment variables
      const tokenMintAddress = this.config.tokenMint;
      Logger.server.info(`🔍 Using configured token mint: ${tokenMintAddress}`);

      let tokenMint;
      try {
        tokenMint = new PublicKey(tokenMintAddress);
        Logger.server.info(`✅ Token mint validated: ${tokenMint.toString()}`);
      } catch (error) {
        Logger.server.error(
          `❌ Failed to create PublicKey from token mint: ${tokenMintAddress} - ${error.message}`,
        );
        throw error;
      }

      // Call VaultSDK to atomically create the next game
      const result = await this.vaultSDK.createNextGameAtomically({
        tokenMint: tokenMint,
        tier,
        maxRetries: 5,
      });

      Logger.server.info(
        `✅ Game vault created atomically on Solana - Game ID: ${result.gameId}, TX: ${result.txHash.slice(0, 8)}..., Token: ${tokenMint.toString()}`,
      );

      return {
        success: true,
        gameId: result.gameId.toString(),
        tier,
        tierConfig,
        txHash: result.txHash,
        tokenMint: tokenMint.toString(),
        timestamp: Date.now(),
        creationMethod: 'atomic',
      };
    } catch (error) {
      Logger.server.error('Failed to create game vault atomically', {
        tier,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Create a new game vault on Solana with tier specification
   * Replaces the complex BSC game creation
   * @deprecated Use createGameAtomically() instead for better concurrency safety
   */
  async createGame(gameId = null, tier = 'low') {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      // If no gameId provided, get the next available one
      const finalGameId = gameId || (await this.getNextGameId());

      Logger.server.info('🎮 Creating Solana game vault with tier', {
        gameId: finalGameId,
        tier,
      });

      // Validate tier configuration
      const tierConfig = this.getTierConfig(tier);

      // Use configured token mint from environment variables
      // Default: SOL native mint (So11111111111111111111111111111112)
      // Can be configured to any SPL token via SOLANA_TOKEN_MINT env var
      const tokenMintAddress = this.config.tokenMint;

      Logger.server.info(`🔍 Using configured token mint: ${tokenMintAddress}`);

      let tokenMint;
      let txHash;

      try {
        tokenMint = new PublicKey(tokenMintAddress);
        Logger.server.info(`✅ Token mint validated: ${tokenMint.toString()}`);

        // Call VaultSDK to actually create the game vault
        txHash = await this.vaultSDK.initializeGameVault({
          gameId: parseInt(finalGameId),
          tokenMint: tokenMint,
        });
      } catch (error) {
        Logger.server.error(
          `❌ Failed to create PublicKey from token mint: ${tokenMintAddress} - ${error.message}`,
        );
        throw error;
      }

      Logger.server.info(
        `✅ Game vault created on Solana - Game ID: ${finalGameId}, TX: ${txHash.slice(0, 8)}..., Token: ${tokenMint.toString()}`,
      );

      return {
        success: true,
        gameId: finalGameId,
        tier,
        tierConfig,
        txHash,
        tokenMint: tokenMint.toString(),
        timestamp: Date.now(),
      };
    } catch (error) {
      Logger.server.error('Failed to create game vault', {
        gameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Check if a player has bought a ticket for the game with tier validation
   * Replaces BSC player registration verification
   */
  async verifyPlayerTicket(gameId, playerAddress, expectedTier = null) {
    if (!this.isInitialized || !this.vaultSDK) {
      return false;
    }

    try {
      Logger.server.debug('🎫 Checking player ticket with tier validation', {
        gameId,
        playerAddress,
        expectedTier,
      });

      // Convert string address to PublicKey
      const playerPubkey = new PublicKey(playerAddress);

      // Use VaultSDK to check if player has a ticket for this game
      const ticketAccount = await this.vaultSDK.getUserTicketAccount(
        gameId,
        playerPubkey,
      );

      if (!ticketAccount || ticketAccount.hasWithdrawn) {
        Logger.server.debug('❌ Player has no valid ticket', {
          gameId,
          playerAddress,
        });
        return false;
      }

      // Tier-based price validation if expectedTier is provided
      if (expectedTier && this.config.security?.enableStrictPriceValidation) {
        const tierConfig = this.getTierConfig(expectedTier);
        const expectedAmountLamports = Math.floor(tierConfig.entranceFee * 1e9);
        const actualAmountLamports = parseInt(ticketAccount.amount);

        if (actualAmountLamports !== expectedAmountLamports) {
          Logger.server.warn('❌ Ticket price validation failed', {
            gameId,
            playerAddress,
            expectedTier,
            expectedAmount: expectedAmountLamports,
            actualAmount: actualAmountLamports,
          });
          return false;
        }

        Logger.server.debug('✅ Player has valid tier ticket', {
          gameId,
          playerAddress,
          tier: expectedTier,
          ticketAmount: ticketAccount.amount,
        });
      } else {
        Logger.server.debug('✅ Player has valid ticket (no tier validation)', {
          gameId,
          playerAddress,
          ticketAmount: ticketAccount.amount,
        });
      }

      return true;
    } catch (error) {
      Logger.server.warn('Failed to verify player ticket', {
        gameId,
        playerAddress,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Calculate tier-based kill rewards
   * Replaces complex BSC scoring system
   */
  calculateKillBasedRewards(players, tier = 'low') {
    const rewards = [];
    const tierConfig = this.getTierConfig(tier);
    const killReward = tierConfig.killReward;

    Logger.server.info('💰 Calculating tier-based kill rewards', {
      playerCount: players.length,
      tier,
      killReward,
    });

    for (const player of players) {
      const kills = player.kills || 0;
      const rewardAmount = kills * killReward;

      if (kills > 0 && player.walletAddress) {
        rewards.push({
          playerAddress: player.walletAddress,
          playerName: player.name,
          kills,
          tier,
          rewardAmount: Math.floor(rewardAmount * 1e9), // Convert to lamports
          rewardSOL: rewardAmount,
        });
      }
    }

    Logger.server.info('💰 Tier-based kill rewards calculated', {
      totalPlayers: players.length,
      rewardedPlayers: rewards.length,
      tier,
      killReward,
      totalRewards: rewards.reduce((sum, r) => sum + r.rewardSOL, 0).toFixed(6),
    });

    return rewards;
  }

  /**
   * Finalize game with tier-based rewards using VaultSDK
   * Replaces complex BSC score submission and reward distribution
   */
  async finalizeGame(gameId, players, tier = 'low') {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.info('🏁 Finalizing Solana game with tier', {
        gameId,
        playerCount: players.length,
        tier,
      });

      // Calculate tier-based kill rewards
      const rewards = this.calculateKillBasedRewards(players, tier);

      if (rewards.length === 0) {
        Logger.server.warn('No rewards to distribute', { gameId });
        return { success: true, rewardsDistributed: 0 };
      }

      // Convert rewards to format expected by VaultSDK
      const rewardEntries = rewards.map((reward) => ({
        user: new PublicKey(reward.playerAddress),
        amount: reward.rewardAmount.toString(),
      }));

      Logger.server.info('📝 Reward entries prepared', {
        gameId,
        entries: rewardEntries.length,
        totalRewardSOL: rewards
          .reduce((sum, r) => sum + r.rewardSOL, 0)
          .toFixed(6),
      });

      // Call VaultSDK to actually finalize the game with rewards
      const txHash = await this.vaultSDK.finalizeGame({
        gameId: gameId,
        rewards: rewardEntries,
      });

      Logger.server.info('✅ Game finalized on Solana', {
        gameId,
        txHash,
        rewardsDistributed: rewards.length,
      });

      return {
        success: true,
        gameId,
        tier,
        txHash,
        rewardsDistributed: rewards.length,
        totalRewardSOL: rewards.reduce((sum, r) => sum + r.rewardSOL, 0),
        rewards,
      };
    } catch (error) {
      Logger.server.error('Failed to finalize game', {
        gameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get game vault address for a given game ID
   */
  deriveVaultAddress(gameId) {
    // This would normally derive the PDA address
    // For now, return a placeholder
    return new PublicKey('11111111111111111111111111111111');
  }

  /**
   * Check if service is connected and ready
   */
  async isConnected() {
    if (!this.isInitialized) return false;

    try {
      await this.connection.getLatestBlockhash();
      return true;
    } catch (error) {
      Logger.server.error('Solana connection check failed', {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get tier configuration from server config
   */
  getTierConfig(tier) {
    if (!this.config.tiers || !this.config.tiers[tier]) {
      throw new Error(
        `Invalid tier: ${tier}. Available tiers: ${Object.keys(this.config.tiers || {}).join(', ')}`,
      );
    }
    return this.config.tiers[tier];
  }

  /**
   * Get comprehensive token information for a specific game ID
   */
  async getGameTokenInfo(gameId) {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🔍 Getting token info for game', { gameId });

      // Get comprehensive game information including token details
      const gameInfo = await this.vaultSDK.getGameInfo(parseInt(gameId));

      Logger.server.debug('✅ Retrieved game token info', {
        gameId,
        tokenMint: gameInfo.tokenMint.toString(),
        isActive: gameInfo.isActive,
        canBuyTickets: gameInfo.canBuyTickets,
      });

      return {
        gameId: gameId.toString(),
        tokenMint: gameInfo.tokenMint.toString(),
        isActive: gameInfo.isActive,
        canBuyTickets: gameInfo.canBuyTickets,
        vault: gameInfo.vault,
        retrievedAt: Date.now(),
      };
    } catch (error) {
      Logger.server.error('Failed to get game token info', {
        gameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get only the token mint address for a specific game ID
   */
  async getGameTokenMint(gameId) {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🪙 Getting token mint for game', { gameId });

      const tokenMint = await this.vaultSDK.getGameTokenMint(parseInt(gameId));

      Logger.server.debug('✅ Retrieved token mint', {
        gameId,
        tokenMint: tokenMint.toString(),
      });

      return tokenMint.toString();
    } catch (error) {
      Logger.server.error('Failed to get game token mint', {
        gameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get detailed vault account information for a specific game ID
   */
  async getVaultAccount(gameId) {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.debug('🏛️ Getting vault account for game', { gameId });

      const vaultAccount = await this.vaultSDK.getVaultAccount(
        parseInt(gameId),
      );

      Logger.server.debug('✅ Retrieved vault account', {
        gameId,
        tokenMint: vaultAccount.tokenMint.toString(),
        totalDeposit: vaultAccount.totalDeposit,
        finalized: vaultAccount.finalized,
        withdrawEnabled: vaultAccount.withdrawEnabled,
      });

      return {
        gameId: vaultAccount.gameId,
        authority: vaultAccount.authority.toString(),
        totalDeposit: vaultAccount.totalDeposit,
        finalized: vaultAccount.finalized,
        withdrawEnabled: vaultAccount.withdrawEnabled,
        tokenMint: vaultAccount.tokenMint.toString(),
        retrievedAt: Date.now(),
      };
    } catch (error) {
      Logger.server.error('Failed to get vault account', {
        gameId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      walletAddress: this.wallet?.publicKey?.toString() || null,
      rpcUrl: this.config.rpcUrl,
      programId: this.config.programId,
    };
  }
}

module.exports = SolanaVaultService;
