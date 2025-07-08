/**
 * Simplified VaultSDK for testing - bypasses IDL issues
 * This provides the basic interface needed for the game server
 */
class SimpleVaultSDK {
  constructor(config) {
    this.connection = config.connection;
    this.wallet = config.wallet;
    this.programId = config.programId;
    this.gameIdCounter = 0;
  }

  /**
   * Get all existing game IDs (mock implementation)
   */
  async getAllGameIds() {
    // TODO: Query actual on-chain data
    // For now, return mock data based on counter
    const gameIds = [];
    for (let i = 1; i <= this.gameIdCounter; i++) {
      gameIds.push(i.toString());
    }
    return gameIds;
  }

  /**
   * Get the latest (highest) game ID
   */
  async getLatestGameId() {
    const gameIds = await this.getAllGameIds();
    return gameIds.length > 0 ? gameIds[gameIds.length - 1] : null;
  }

  /**
   * Get the next available game ID (latest + 1)
   */
  async getNextGameId() {
    const latestGameId = await this.getLatestGameId();
    const nextId = latestGameId ? (parseInt(latestGameId) + 1).toString() : '1';
    return nextId;
  }

  /**
   * Initialize a new game vault (mock implementation)
   */
  async initializeGameVault(params) {
    // TODO: Actual Solana transaction
    // For now, increment counter and return mock transaction hash
    this.gameIdCounter = Math.max(this.gameIdCounter, parseInt(params.gameId));
    
    console.log(`🎮 Mock: Initializing game vault ${params.gameId} with token ${params.tokenMint.toString()}`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `mock_tx_${params.gameId}_${Date.now()}`;
  }

  /**
   * Get user ticket account (mock implementation)
   */
  async getUserTicketAccount(gameId, user) {
    // TODO: Query actual on-chain ticket data
    // For testing, always return a valid ticket
    console.log(`🎫 Mock: Checking ticket for game ${gameId}, user ${user.toString().slice(0, 8)}...`);
    
    return {
      amount: 1000000, // 1 SOL in lamports
      hasWithdrawn: false
    };
  }

  /**
   * Finalize game with rewards (mock implementation)
   */
  async finalizeGame(params) {
    // TODO: Actual Solana transaction to distribute rewards
    console.log(`🏁 Mock: Finalizing game ${params.gameId} with ${params.rewards.length} rewards`);
    
    // Log reward details
    params.rewards.forEach((reward, index) => {
      const amountSOL = parseInt(reward.amount) / 1e9;
      console.log(`   ${index + 1}. ${reward.user.toString().slice(0, 8)}...: ${amountSOL} SOL`);
    });
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `mock_finalize_tx_${params.gameId}_${Date.now()}`;
  }

  /**
   * Check if service is ready
   */
  async isReady() {
    try {
      await this.connection.getLatestBlockhash();
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { SimpleVaultSDK };