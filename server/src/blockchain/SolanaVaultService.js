const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const Logger = require('../utils/Logger');
const { getInstance: getRPCManager } = require('../utils/SolanaRPCManager');

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
    this.rpcManager = null;

    // Service initializing - details logged on completion
  }

  async initialize() {
    try {
      // Initializing Solana vault service

      // Initialize RPC manager for load balancing
      this.rpcManager = getRPCManager();

      // Create connection using RPC manager
      this.connection = this.rpcManager.getCurrentConnection('confirmed');

      // Initialize wallet from private key
      if (this.config.privateKey) {
        const privateKeyBytes = Uint8Array.from(
          Buffer.from(this.config.privateKey, 'hex'),
        );
        this.wallet = Keypair.fromSecretKey(privateKeyBytes);
        // Wallet initialized from config
      } else {
        // Fallback to id.json file in abis directory
        try {
          const idPath = path.resolve(__dirname, '../../abis/id.json');
          const privateKeyArray = require(idPath);
          this.wallet = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
          // Wallet loaded from id.json
        } catch (error) {
          throw new Error(
            'No Solana private key provided and id.json not found',
          );
        }
      }

      // Test connection with retry logic for RPC failures
      let connectionTested = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!connectionTested && retryCount < maxRetries) {
        try {
          const latestBlockhash = await this.connection.getLatestBlockhash();
          // Solana connection verified
          connectionTested = true;
        } catch (error) {
          retryCount++;
          Logger.server.warn(
            `RPC connection test failed (attempt ${retryCount}/${maxRetries}):`,
            {
              error: error.message,
              currentRpc: this.rpcManager.getCurrentRPC(),
            },
          );

          if (retryCount < maxRetries) {
            // Mark current RPC as failed and switch to next one
            this.rpcManager.markCurrentRPCFailed();
            this.connection = this.rpcManager.getCurrentConnection('confirmed');
            // Switched to backup RPC
          } else {
            throw new Error(
              `All RPC endpoints failed after ${maxRetries} attempts: ${error.message}`,
            );
          }
        }
      }

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

      // VaultSDK initialized

      this.isInitialized = true;
      Logger.status('✅ Solana服务正常启动');
    } catch (error) {
      Logger.server.error('Failed to initialize Solana vault service', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Create a random RPC connection for load balancing
   */
  createRandomConnection(commitment = 'confirmed') {
    if (!this.rpcManager) {
      // Fallback to current connection if RPC manager not available
      return this.connection;
    }
    return this.rpcManager.createRandomConnection(commitment);
  }

  /**
   * Get RPC manager statistics
   */
  getRPCStats() {
    return this.rpcManager ? this.rpcManager.getStats() : null;
  }

  /**
   * Perform RPC health check
   */
  async performRPCHealthCheck() {
    if (this.rpcManager) {
      await this.rpcManager.healthCheck();
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
      Logger.server.info('🎮 创建新游戏', {
        tier,
      });

      // Validate tier configuration
      const tierConfig = this.getTierConfig(tier);

      // Use configured token mint
      const tokenMintAddress = this.config.tokenMint;

      let tokenMint;
      try {
        tokenMint = new PublicKey(tokenMintAddress);
      } catch (error) {
        Logger.server.error(`❌ 无效的token mint: ${error.message}`);
        throw error;
      }

      // Call VaultSDK to atomically create the next game
      const result = await this.vaultSDK.createNextGameAtomically({
        tokenMint: tokenMint,
        tier,
        maxRetries: 5,
      });

      Logger.server.info(
        `✅ 游戏创建成功 - ID: ${result.gameId}, Tier: ${tier}`,
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
   * Enhanced with proper error handling and dynamic decimals support
   * Replaces BSC player registration verification
   */
  async verifyPlayerTicket(gameId, playerAddress, expectedTier = null) {
    // Early validation - service initialization
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    // Input validation
    if (!gameId || gameId === null || gameId === undefined) {
      throw new Error('Invalid gameId: gameId is required');
    }

    if (
      !playerAddress ||
      typeof playerAddress !== 'string' ||
      playerAddress.trim().length === 0
    ) {
      throw new Error('Invalid playerAddress: must be a non-empty string');
    }

    const trimmedAddress = playerAddress.trim();

    // Basic Base58 format validation for Solana addresses
    if (trimmedAddress.length < 32 || trimmedAddress.length > 44) {
      throw new Error(
        `Invalid playerAddress format: address length ${trimmedAddress.length} is outside valid range (32-44 characters)`,
      );
    }

    // Validate Base58 characters (basic check)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    if (!base58Regex.test(trimmedAddress)) {
      throw new Error(
        'Invalid playerAddress format: contains invalid Base58 characters',
      );
    }

    const maxRetries = 3;
    const retryDelays = [0, 1000, 2000]; // 0ms, 1s, 2s
    let lastError = null;

    Logger.server.debug('🎫 Checking player ticket with enhanced validation', {
      gameId,
      playerAddress: trimmedAddress,
      expectedTier,
      retriesEnabled: true,
    });

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          Logger.server.debug(
            `🔄 Retry attempt ${attempt + 1}/${maxRetries} for ticket verification`,
            {
              gameId,
              playerAddress: trimmedAddress,
              previousError: lastError?.message,
            },
          );

          // Wait before retry
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelays[attempt]),
          );
        }

        // Convert string address to PublicKey with proper error handling
        let playerPubkey;
        try {
          playerPubkey = new PublicKey(trimmedAddress);
        } catch (publicKeyError) {
          // This is an input validation error, don't retry
          throw new Error(
            `Invalid playerAddress format: ${publicKeyError.message}`,
          );
        }

        // Checking player ticket

        const ticketAccount = await this.vaultSDK.getUserTicketAccount(
          gameId,
          playerPubkey,
        );

        // Business logic: no ticket or withdrawn ticket
        if (!ticketAccount || ticketAccount.hasWithdrawn) {
          // Player has no valid ticket
          return false; // This is expected behavior, not an error
        }

        // Tier-based price validation if expectedTier is provided
        if (expectedTier && this.config.security?.enableStrictPriceValidation) {
          const tierConfig = this.getTierConfig(expectedTier);

          // 🔧 Fix: Use dynamic token decimals instead of hardcoded 1e9
          const tokenDecimals = await this.getTokenDecimals();
          const multiplier = Math.pow(10, tokenDecimals);
          const expectedAmountLamports = Math.floor(
            tierConfig.entranceFee * multiplier,
          );
          const actualAmountLamports = parseInt(ticketAccount.amount);

          Logger.server.debug('🔍 Performing tier-based price validation', {
            gameId,
            playerAddress: trimmedAddress,
            expectedTier,
            tierConfig: {
              entranceFee: tierConfig.entranceFee,
              name: tierConfig.name,
            },
            tokenDecimals,
            expectedAmountLamports,
            actualAmountLamports,
          });

          if (actualAmountLamports !== expectedAmountLamports) {
            Logger.server.warn('❌ Ticket price validation failed', {
              gameId,
              playerAddress: trimmedAddress,
              expectedTier,
              tierConfig: tierConfig.name,
              tokenDecimals,
              expectedAmount: expectedAmountLamports,
              actualAmount: actualAmountLamports,
              difference: actualAmountLamports - expectedAmountLamports,
            });
            return false; // This is expected behavior for wrong-tier tickets
          }

          // Player has valid tier ticket
        } else {
          // Player has valid ticket
        }

        // Success case
        Logger.server.info('✅ Player ticket verification successful', {
          gameId,
          playerAddress: trimmedAddress,
          tier: expectedTier,
          attempts: attempt + 1,
        });

        return true;
      } catch (error) {
        lastError = error;

        // Categorize errors for appropriate handling
        const errorMessage = error.message || String(error);
        const isInputValidationError =
          errorMessage.includes('Invalid playerAddress') ||
          errorMessage.includes('Invalid gameId') ||
          errorMessage.includes('Base58');
        const isNetworkError =
          errorMessage.includes('network') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('ENOTFOUND') ||
          errorMessage.includes('fetch');
        const isRPCError =
          errorMessage.includes('RPC') ||
          errorMessage.includes('429') ||
          errorMessage.includes('rate limit');

        Logger.server.warn(
          `❌ Ticket verification attempt ${attempt + 1} failed`,
          {
            gameId,
            playerAddress: trimmedAddress,
            expectedTier,
            attempt: attempt + 1,
            maxRetries,
            error: errorMessage,
            errorType: isInputValidationError
              ? 'INPUT_VALIDATION'
              : isNetworkError
                ? 'NETWORK'
                : isRPCError
                  ? 'RPC'
                  : 'UNKNOWN',
            willRetry: attempt < maxRetries - 1 && !isInputValidationError,
          },
        );

        // Don't retry input validation errors
        if (isInputValidationError) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === maxRetries - 1) {
          break;
        }
      }
    }

    // All retries exhausted
    const finalError = new Error(
      `Failed to verify player ticket after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`,
    );
    finalError.originalError = lastError;
    finalError.gameId = gameId;
    finalError.playerAddress = trimmedAddress;
    finalError.attempts = maxRetries;

    Logger.server.error('❌ All ticket verification attempts failed', {
      gameId,
      playerAddress: trimmedAddress,
      expectedTier,
      totalAttempts: maxRetries,
      finalError: lastError?.message,
      errorStack: lastError?.stack,
    });

    throw finalError;
  }

  /**
   * Extensible reward calculation system
   * Currently implements kill-based rewards but designed for future expansion
   */
  async calculateGameRewards(players, tier = 'low', gameId = null) {
    const rewards = [];

    Logger.server.info('💰 Calculating game rewards with extensible system', {
      playerCount: players.length,
      tier,
      gameId,
    });

    // Current implementation: Kill-based rewards (now async)
    const killRewards = await this.calculateKillBasedRewards(players, tier);
    rewards.push(...killRewards);

    // Future expansion points:
    // const survivalRewards = await this.calculateSurvivalRewards(players, tier, gameId);
    // const performanceRewards = await this.calculatePerformanceRewards(players, tier, gameId);
    // const bonusRewards = await this.calculateBonusRewards(players, tier, gameId);
    // rewards.push(...survivalRewards, ...performanceRewards, ...bonusRewards);

    Logger.server.info('💰 Final reward calculation completed', {
      totalPlayers: players.length,
      rewardedPlayers: rewards.length,
      tier,
      totalRewardSOL: rewards
        .reduce((sum, r) => sum + r.rewardSOL, 0)
        .toFixed(6),
    });

    return rewards;
  }

  /**
   * Calculate tier-based kill rewards with dynamic token decimals
   * Core reward calculation method
   */
  async calculateKillBasedRewards(players, tier = 'low') {
    const rewards = [];
    const tierConfig = this.getTierConfig(tier);
    const killReward = tierConfig.killReward;

    // Get dynamic token decimals instead of hardcoding 1e9
    const tokenDecimals = await this.getTokenDecimals();
    const multiplier = Math.pow(10, tokenDecimals);

    Logger.server.debug(
      '💰 Calculating kill-based rewards with dynamic decimals',
      {
        playerCount: players.length,
        tier,
        killReward,
        tokenDecimals,
        tokenMint: this.config.tokenMint,
      },
    );

    for (const player of players) {
      const kills = player.kills || 0;
      const rewardAmount = kills * killReward;

      if (kills > 0 && player.walletAddress) {
        rewards.push({
          playerAddress: player.walletAddress,
          playerName: player.name,
          kills,
          tier,
          rewardAmount: Math.floor(rewardAmount * multiplier), // Convert using dynamic decimals
          rewardSOL: rewardAmount, // Keep original amount for display
          rewardType: 'kill-based',
          tokenDecimals, // Include decimals info for debugging
        });
      }
    }

    Logger.server.debug(
      '💰 Kill-based rewards calculated with dynamic decimals',
      {
        rewardedPlayers: rewards.length,
        tier,
        killReward,
        tokenDecimals,
        totalRewards: rewards
          .reduce((sum, r) => sum + r.rewardSOL, 0)
          .toFixed(6),
      },
    );

    return rewards;
  }

  /**
   * Format pre-calculated rewards from Game.js for VaultSDK
   * @param {Array} rewardData - Array of reward objects from Game.js
   * @returns {Array} Formatted rewards for VaultSDK
   */
  formatRewardsForVaultSDK(rewardData) {
    Logger.server.debug('💰 Formatting pre-calculated rewards for VaultSDK', {
      rewardCount: rewardData.length,
    });

    const formattedRewards = rewardData.map((reward) => ({
      playerAddress: reward.walletAddress, // Game.js uses 'walletAddress'
      playerName: reward.playerName,
      kills: reward.kills,
      tier: 'kill-based', // Mark as pre-calculated
      rewardAmount: reward.rewardLamports, // Already in lamports
      rewardSOL: reward.rewardSOL,
      rewardType: 'pre-calculated',
    }));

    Logger.server.debug('💰 Rewards formatted for VaultSDK', {
      formattedCount: formattedRewards.length,
      totalRewardSOL: formattedRewards
        .reduce((sum, r) => sum + r.rewardSOL, 0)
        .toFixed(6),
    });

    return formattedRewards;
  }

  // Reserved interfaces for future reward types:

  /**
   * Calculate survival-based rewards (future implementation)
   * @param {Array} players - Array of player objects
   * @param {string} tier - Game tier
   * @param {string} gameId - Game ID for context
   * @returns {Promise<Array>} Array of survival reward objects
   */
  async calculateSurvivalRewards(players, tier, gameId) {
    // Future implementation: reward based on survival time
    return [];
  }

  /**
   * Calculate performance-based rewards (future implementation)
   * @param {Array} players - Array of player objects
   * @param {string} tier - Game tier
   * @param {string} gameId - Game ID for context
   * @returns {Promise<Array>} Array of performance reward objects
   */
  async calculatePerformanceRewards(players, tier, gameId) {
    // Future implementation: reward based on overall performance metrics
    return [];
  }

  /**
   * Calculate bonus rewards (future implementation)
   * @param {Array} players - Array of player objects
   * @param {string} tier - Game tier
   * @param {string} gameId - Game ID for context
   * @returns {Promise<Array>} Array of bonus reward objects
   */
  async calculateBonusRewards(players, tier, gameId) {
    // Future implementation: special event bonuses, achievements, etc.
    return [];
  }

  /**
   * Finalize game with pre-calculated rewards using VaultSDK
   * Enhanced with retry mechanism and proper data handling
   */
  async finalizeGame(gameId, rewardData, tier = 'low') {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.server.info(
          `🏁 Finalizing Solana game (attempt ${attempt}/${maxRetries})`,
          {
            gameId,
            rewardCount: rewardData.length,
            tier,
          },
        );

        // Use pre-calculated rewards from Game.js
        const rewards = this.formatRewardsForVaultSDK(rewardData);

        if (rewards.length === 0) {
          Logger.server.warn('No rewards to distribute', { gameId });
          return { success: true, rewardsDistributed: 0 };
        }

        // Validate and convert rewards to format expected by VaultSDK
        const rewardEntries = rewards.map((reward) => {
          // Validate required fields
          if (!reward.playerAddress || !reward.rewardAmount) {
            throw new Error(
              `Invalid reward data: missing playerAddress or rewardAmount for ${reward.playerName}`,
            );
          }

          try {
            return {
              user: new PublicKey(reward.playerAddress),
              amount: reward.rewardAmount.toString(),
            };
          } catch (error) {
            throw new Error(
              `Invalid player address: ${reward.playerAddress} for ${reward.playerName}`,
            );
          }
        });

        Logger.server.info('📝 Reward entries prepared', {
          gameId,
          entries: rewardEntries.length,
          totalRewardSOL: rewards
            .reduce((sum, r) => sum + r.rewardSOL, 0)
            .toFixed(6),
        });

        // 🔗 Log RPC Pool usage before VaultSDK operation
        Logger.server.info(
          '🔗 About to call VaultSDK.finalizeGame via RPC Pool',
          {
            gameId,
            rewardCount: rewardEntries.length,
            currentRPC: this.rpcManager?.getCurrentRPC(),
            rpcStats: this.rpcManager?.getStats(),
            operation: 'VaultSDK.finalizeGame',
          },
        );

        // Call VaultSDK to finalize the game with rewards
        const txHash = await this.vaultSDK.finalizeGame({
          gameId: parseInt(gameId),
          rewards: rewardEntries,
        });

        // 🔗 Log successful VaultSDK operation via RPC Pool
        Logger.server.info(
          '✅ VaultSDK.finalizeGame completed successfully via RPC Pool',
          {
            gameId,
            txHash: txHash.slice(0, 8) + '...',
            rpcEndpoint: this.rpcManager?.getCurrentRPC(),
            rewardsFinalized: rewardEntries.length,
          },
        );

        // Wait for transaction confirmation
        await this.waitForTransactionConfirmation(txHash);

        Logger.server.info('✅ Game finalized on Solana', {
          gameId,
          txHash,
          rewardsDistributed: rewards.length,
          attempt,
        });

        return {
          success: true,
          gameId,
          tier,
          txHash,
          rewardsDistributed: rewards.length,
          totalRewardSOL: rewards.reduce((sum, r) => sum + r.rewardSOL, 0),
          rewards,
          attempt,
        };
      } catch (error) {
        lastError = error;
        Logger.server.warn(`❌ Game finalization attempt ${attempt} failed`, {
          gameId,
          error: error.message,
          attemptsLeft: maxRetries - attempt,
        });

        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          Logger.server.error('Non-retryable error encountered', {
            gameId,
            error: error.message,
          });
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          Logger.server.info(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    Logger.server.error('All finalization attempts failed', {
      gameId,
      maxRetries,
      finalError: lastError.message,
    });
    throw lastError;
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
    if (!this.isInitialized || !this.rpcManager) return false;

    try {
      // Use RPC Pool for connection testing
      const rpcConnection = this.rpcManager.getCurrentConnection('confirmed');

      await rpcConnection.getLatestBlockhash();

      return true;
    } catch (error) {
      Logger.server.error('Solana connection check failed via RPC Pool', {
        error: error.message,
        rpcEndpoint: this.rpcManager?.getCurrentRPC(),
      });
      return false;
    }
  }

  /**
   * Get token decimals for the configured token mint
   * @returns {Promise<number>} Number of decimals for the token
   */
  async getTokenDecimals() {
    if (!this.isInitialized || !this.rpcManager) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      // Use RPC Pool for better load balancing and failover
      const rpcConnection = this.rpcManager.getCurrentConnection('confirmed');
      Logger.server.debug('🔗 Using RPC Pool connection for getTokenDecimals', {
        currentRPC: this.rpcManager.getCurrentRPC(),
        stats: this.rpcManager.getStats(),
      });

      const { getMint } = require('@solana/spl-token');
      const tokenMint = new PublicKey(this.config.tokenMint);
      const mintInfo = await getMint(rpcConnection, tokenMint);

      Logger.server.debug('🔍 Retrieved token decimals via RPC Pool', {
        tokenMint: tokenMint.toString(),
        decimals: mintInfo.decimals,
        rpcEndpoint: this.rpcManager.getCurrentRPC(),
      });

      return mintInfo.decimals;
    } catch (error) {
      Logger.server.warn(
        'Failed to get token decimals via RPC Pool, using default 9',
        {
          tokenMint: this.config.tokenMint,
          error: error.message,
          rpcEndpoint: this.rpcManager?.getCurrentRPC(),
        },
      );
      // Fallback to 9 decimals (SOL standard) if unable to fetch
      return 9;
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

    const tierConfig = this.config.tiers[tier];

    // Show tier configuration information
    Logger.server.info('🎯 Tier配置', {
      tier,
      门票: tierConfig.entranceFee,
      奖励: tierConfig.killReward,
    });

    return tierConfig;
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
   * Wait for transaction confirmation with timeout
   * @param {string} txHash - Transaction hash to wait for
   * @param {number} timeout - Timeout in milliseconds (default: 60s)
   * @returns {Promise<boolean>} True if confirmed, throws on timeout
   */
  async waitForTransactionConfirmation(txHash, timeout = 60000) {
    const startTime = Date.now();
    const checkInterval = 2000; // Check every 2 seconds

    if (!this.rpcManager) {
      throw new Error('RPC Manager not initialized');
    }

    Logger.server.debug(
      '⏳ Waiting for transaction confirmation via RPC Pool',
      {
        txHash: txHash.slice(0, 8) + '...',
        timeout: timeout / 1000 + 's',
        initialRPC: this.rpcManager.getCurrentRPC(),
      },
    );

    while (Date.now() - startTime < timeout) {
      try {
        // Use RPC Pool for better reliability during confirmation
        const rpcConnection = this.rpcManager.getCurrentConnection('confirmed');
        Logger.server.debug('🔗 Checking transaction status via RPC Pool', {
          txHash: txHash.slice(0, 8) + '...',
          rpcEndpoint: this.rpcManager.getCurrentRPC(),
        });

        const status = await rpcConnection.getSignatureStatus(txHash);

        if (
          status?.value?.confirmationStatus === 'confirmed' ||
          status?.value?.confirmationStatus === 'finalized'
        ) {
          Logger.server.debug('✅ Transaction confirmed via RPC Pool', {
            txHash: txHash.slice(0, 8) + '...',
            confirmationStatus: status.value.confirmationStatus,
            rpcEndpoint: this.rpcManager.getCurrentRPC(),
          });
          return true;
        }

        if (status?.value?.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(status.value.err)}`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, checkInterval));
      } catch (error) {
        Logger.server.warn('Error checking transaction status via RPC Pool', {
          txHash: txHash.slice(0, 8) + '...',
          error: error.message,
          rpcEndpoint: this.rpcManager?.getCurrentRPC(),
        });
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
      }
    }

    throw new Error(
      `Transaction confirmation timeout after ${timeout / 1000}s`,
    );
  }

  /**
   * Check if an error is non-retryable
   * @param {Error} error - The error to check
   * @returns {boolean} True if error should not be retried
   */
  isNonRetryableError(error) {
    const message = error.message.toLowerCase();

    // Non-retryable error patterns
    const nonRetryablePatterns = [
      'invalid account data',
      'account not found',
      'insufficient funds',
      'invalid instruction',
      'program error',
      'unauthorized',
    ];

    return nonRetryablePatterns.some((pattern) => message.includes(pattern));
  }

  /**
   * Get comprehensive service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      walletAddress: this.wallet?.publicKey?.toString() || null,
      rpcUrl: this.config.rpcUrl,
      programId: this.config.programId,
      tokenMint: this.config.tokenMint,
      availableTiers: Object.keys(this.config.tiers || {}),
      timestamp: Date.now(),
    };
  }

  /**
   * Test connection and vault SDK functionality
   * @returns {Promise<Object>} Test results
   */
  async testConnection() {
    const results = {
      connection: false,
      wallet: false,
      vaultSDK: false,
      errors: [],
    };

    try {
      // Test connection using RPC Pool
      if (!this.rpcManager) {
        throw new Error('RPC Manager not initialized');
      }

      const rpcConnection = this.rpcManager.getCurrentConnection('confirmed');
      Logger.server.debug('🔗 Testing connection via RPC Pool', {
        rpcEndpoint: this.rpcManager.getCurrentRPC(),
      });

      const latestBlockhash = await rpcConnection.getLatestBlockhash();
      results.connection = true;
      Logger.server.debug('✅ Connection test passed via RPC Pool', {
        blockhash: latestBlockhash.blockhash.slice(0, 8) + '...',
        rpcEndpoint: this.rpcManager.getCurrentRPC(),
      });
    } catch (error) {
      results.errors.push(`Connection failed via RPC Pool: ${error.message}`);
    }

    try {
      // Test wallet
      if (this.wallet?.publicKey) {
        results.wallet = true;
        Logger.server.debug('✅ Wallet test passed', {
          address: this.wallet.publicKey.toString(),
        });
      } else {
        results.errors.push('Wallet not initialized');
      }
    } catch (error) {
      results.errors.push(`Wallet test failed: ${error.message}`);
    }

    try {
      // Test VaultSDK (try to get all game IDs)
      if (this.vaultSDK) {
        await this.vaultSDK.getAllGameIds();
        results.vaultSDK = true;
        Logger.server.debug('✅ VaultSDK test passed');
      } else {
        results.errors.push('VaultSDK not initialized');
      }
    } catch (error) {
      results.errors.push(`VaultSDK test failed: ${error.message}`);
    }

    const allPassed = results.connection && results.wallet && results.vaultSDK;
    Logger.server.info('🧪 Connection test completed', {
      allPassed,
      results,
    });

    return { ...results, allPassed };
  }
}

module.exports = SolanaVaultService;
