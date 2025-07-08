const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const Logger = require('../utils/Logger');

// Import simplified VaultSDK to bypass IDL compatibility issues
const path = require('path');
const { SimpleVaultSDK } = require(path.resolve(__dirname, '../../../simple-vault-sdk.js'));

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
      programId: config.programId
    });
  }

  async initialize() {
    try {
      Logger.server.info('🔗 Initializing Solana vault service');

      // Create connection to Solana cluster
      this.connection = new Connection(
        this.config.rpcUrl || 'https://api.devnet.solana.com',
        'confirmed'
      );

      // Initialize wallet from private key
      if (this.config.privateKey) {
        const privateKeyBytes = Uint8Array.from(Buffer.from(this.config.privateKey, 'hex'));
        this.wallet = Keypair.fromSecretKey(privateKeyBytes);
        Logger.server.info('🔑 Wallet initialized:', this.wallet.publicKey.toString());
      } else {
        // Fallback to id.json file in abis directory
        try {
          const idPath = path.resolve(__dirname, '../../../abis/id.json');
          const privateKeyArray = require(idPath);
          this.wallet = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
          Logger.server.info('🔑 Wallet loaded from id.json:', this.wallet.publicKey.toString());
        } catch (error) {
          throw new Error('No Solana private key provided and id.json not found');
        }
      }

      // Test connection
      const latestBlockhash = await this.connection.getLatestBlockhash();
      Logger.server.info('✅ Solana connected, blockhash:', latestBlockhash.blockhash.slice(0, 8) + '...');

      // Initialize VaultSDK
      if (!this.config.programId || this.config.programId === '11111111111111111111111111111111') {
        throw new Error('Valid Vault program ID is required');
      }

      this.vaultSDK = new SimpleVaultSDK({
        programId: new PublicKey(this.config.programId),
        connection: this.connection,
        wallet: {
          publicKey: this.wallet.publicKey,
          signTransaction: (tx) => Promise.resolve(tx),
          signAllTransactions: (txs) => Promise.resolve(txs)
        }
      });

      Logger.server.info('🔧 SimpleVaultSDK initialized with program:', this.config.programId);
      
      this.isInitialized = true;
      Logger.status('🚀 Solana vault service ready');

    } catch (error) {
      Logger.server.error('Failed to initialize Solana vault service', { 
        error: error.message, 
        stack: error.stack 
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
      Logger.server.debug('📋 Found game IDs:', gameIds);
      return gameIds;
    } catch (error) {
      Logger.server.error('Failed to get all game IDs', { error: error.message });
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
      const latestGameId = await this.vaultSDK.getLatestGameId();
      Logger.server.debug('🎯 Latest game ID:', latestGameId);
      return latestGameId;
    } catch (error) {
      Logger.server.error('Failed to get latest game ID', { error: error.message });
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
      const nextGameId = await this.vaultSDK.getNextGameId();
      Logger.server.debug('🎯 Next game ID:', nextGameId);
      return nextGameId;
    } catch (error) {
      Logger.server.error('Failed to get next game ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Create a new game vault on Solana using the next available game ID
   * Replaces the complex BSC game creation
   */
  async createGame(gameId = null) {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      // If no gameId provided, get the next available one
      const finalGameId = gameId || await this.getNextGameId();
      
      Logger.server.info('🎮 Creating Solana game vault', { gameId: finalGameId });

      // Use default token mint for now (could be configurable)
      const tokenMint = new PublicKey(this.config.tokenMint || '11111111111111111111111111111111');

      // Call VaultSDK to actually create the game vault
      const txHash = await this.vaultSDK.initializeGameVault({
        gameId: finalGameId,
        tokenMint: tokenMint
      });

      Logger.server.info('✅ Game vault created on Solana', { 
        gameId: finalGameId, 
        txHash,
        tokenMint: tokenMint.toString()
      });

      return {
        success: true,
        gameId: finalGameId,
        txHash,
        tokenMint: tokenMint.toString(),
        timestamp: Date.now()
      };

    } catch (error) {
      Logger.server.error('Failed to create game vault', { 
        gameId, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Check if a player has bought a ticket for the game
   * Replaces BSC player registration verification
   */
  async verifyPlayerTicket(gameId, playerAddress) {
    if (!this.isInitialized || !this.vaultSDK) {
      return false;
    }

    try {
      Logger.server.debug('🎫 Checking player ticket', { gameId, playerAddress });
      
      // Convert string address to PublicKey
      const playerPubkey = new PublicKey(playerAddress);
      
      // Use VaultSDK to check if player has a ticket for this game
      const ticketAccount = await this.vaultSDK.getUserTicketAccount(gameId, playerPubkey);
      
      if (ticketAccount && !ticketAccount.hasWithdrawn) {
        Logger.server.debug('✅ Player has valid ticket', { 
          gameId, 
          playerAddress, 
          ticketAmount: ticketAccount.amount 
        });
        return true;
      } else {
        Logger.server.debug('❌ Player has no valid ticket', { gameId, playerAddress });
        return false;
      }

    } catch (error) {
      Logger.server.warn('Failed to verify player ticket', { 
        gameId, 
        playerAddress, 
        error: error.message 
      });
      return false;
    }
  }

  /**
   * Calculate kill-based rewards
   * Replaces complex BSC scoring system
   */
  calculateKillBasedRewards(players) {
    const rewards = [];
    const killReward = 0.001; // 0.001 SOL per kill (configurable)
    
    Logger.server.info('💰 Calculating kill-based rewards', { 
      playerCount: players.length,
      killReward 
    });

    for (const player of players) {
      const kills = player.kills || 0;
      const rewardAmount = kills * killReward;
      
      if (kills > 0 && player.walletAddress) {
        rewards.push({
          playerAddress: player.walletAddress,
          playerName: player.name,
          kills,
          rewardAmount: Math.floor(rewardAmount * 1e9), // Convert to lamports
          rewardSOL: rewardAmount
        });
      }
    }

    Logger.server.info('💰 Kill-based rewards calculated', { 
      totalPlayers: players.length,
      rewardedPlayers: rewards.length,
      totalRewards: rewards.reduce((sum, r) => sum + r.rewardSOL, 0).toFixed(6)
    });

    return rewards;
  }

  /**
   * Finalize game with rewards using VaultSDK
   * Replaces complex BSC score submission and reward distribution
   */
  async finalizeGame(gameId, players) {
    if (!this.isInitialized || !this.vaultSDK) {
      throw new Error('Solana vault service not initialized');
    }

    try {
      Logger.server.info('🏁 Finalizing Solana game', { gameId, playerCount: players.length });

      // Calculate simple kill-based rewards
      const rewards = this.calculateKillBasedRewards(players);

      if (rewards.length === 0) {
        Logger.server.warn('No rewards to distribute', { gameId });
        return { success: true, rewardsDistributed: 0 };
      }

      // Convert rewards to format expected by VaultSDK
      const rewardEntries = rewards.map(reward => ({
        user: new PublicKey(reward.playerAddress),
        amount: reward.rewardAmount.toString()
      }));

      Logger.server.info('📝 Reward entries prepared', { 
        gameId, 
        entries: rewardEntries.length,
        totalRewardSOL: rewards.reduce((sum, r) => sum + r.rewardSOL, 0).toFixed(6)
      });

      // Call VaultSDK to actually finalize the game with rewards
      const txHash = await this.vaultSDK.finalizeGame({
        gameId: gameId,
        rewards: rewardEntries
      });

      Logger.server.info('✅ Game finalized on Solana', { 
        gameId, 
        txHash,
        rewardsDistributed: rewards.length 
      });

      return {
        success: true,
        gameId,
        txHash,
        rewardsDistributed: rewards.length,
        totalRewardSOL: rewards.reduce((sum, r) => sum + r.rewardSOL, 0),
        rewards
      };

    } catch (error) {
      Logger.server.error('Failed to finalize game', { 
        gameId, 
        error: error.message 
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
        error: error.message 
      });
      return false;
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
      programId: this.config.programId
    };
  }
}

module.exports = SolanaVaultService;