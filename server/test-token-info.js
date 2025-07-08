#!/usr/bin/env node

/**
 * Test script to verify token information retrieval functionality
 * This demonstrates how to use the new token info methods
 */

const Game = require('./src/game/Game');
const SolanaVaultService = require('./src/blockchain/SolanaVaultService');
const config = require('./src/config');

async function testTokenInfoRetrieval() {
  console.log('🧪 Testing Token Information Retrieval\n');

  try {
    // Create Game instance
    const game = new Game();

    // Initialize Solana service if config is available
    if (config.blockchain?.solana?.enabled) {
      console.log('📋 Solana configuration found, initializing service...');

      const solanaConfig = config.blockchain.solana;
      const solanaVaultService = new SolanaVaultService(solanaConfig);

      // Initialize the service
      await solanaVaultService.initialize();
      game.solanaVaultService = solanaVaultService;

      console.log('✅ SolanaVaultService initialized\n');

      // Test 1: Initialize a Solana game
      console.log('🎮 Test 1: Initializing Solana game...');
      await game.initializeSolanaGame(0, 'low');

      if (game.solanaGameId) {
        console.log(`✅ Game initialized with ID: ${game.solanaGameId}\n`);

        // Test 2: Get comprehensive token info
        console.log('🔍 Test 2: Getting comprehensive token info...');
        const tokenInfo = await game.getCurrentGameTokenInfo();
        if (tokenInfo) {
          console.log('✅ Token info retrieved:', {
            gameId: tokenInfo.gameId,
            tokenMint: tokenInfo.tokenMint,
            isActive: tokenInfo.isActive,
            canBuyTickets: tokenInfo.canBuyTickets,
          });
        } else {
          console.log('❌ Failed to get token info');
        }
        console.log('');

        // Test 3: Get only token mint
        console.log('🪙 Test 3: Getting token mint only...');
        const tokenMint = await game.getCurrentGameTokenMint();
        if (tokenMint) {
          console.log('✅ Token mint retrieved:', tokenMint);
        } else {
          console.log('❌ Failed to get token mint');
        }
        console.log('');

        // Test 4: Get vault account details
        console.log('🏛️ Test 4: Getting vault account details...');
        const vaultAccount = await game.getCurrentVaultAccount();
        if (vaultAccount) {
          console.log('✅ Vault account retrieved:', {
            gameId: vaultAccount.gameId,
            tokenMint: vaultAccount.tokenMint,
            totalDeposit: vaultAccount.totalDeposit,
            finalized: vaultAccount.finalized,
            withdrawEnabled: vaultAccount.withdrawEnabled,
          });
        } else {
          console.log('❌ Failed to get vault account');
        }
        console.log('');

        // Test 5: Test direct service methods
        console.log(
          '🔧 Test 5: Testing SolanaVaultService methods directly...',
        );

        console.log('  - Testing getGameTokenInfo...');
        try {
          const directTokenInfo = await solanaVaultService.getGameTokenInfo(
            game.solanaGameId,
          );
          console.log('  ✅ Direct token info:', directTokenInfo.tokenMint);
        } catch (error) {
          console.log('  ❌ Direct token info failed:', error.message);
        }

        console.log('  - Testing getGameTokenMint...');
        try {
          const directTokenMint = await solanaVaultService.getGameTokenMint(
            game.solanaGameId,
          );
          console.log('  ✅ Direct token mint:', directTokenMint);
        } catch (error) {
          console.log('  ❌ Direct token mint failed:', error.message);
        }

        console.log('  - Testing getVaultAccount...');
        try {
          const directVaultAccount = await solanaVaultService.getVaultAccount(
            game.solanaGameId,
          );
          console.log('  ✅ Direct vault account:', {
            gameId: directVaultAccount.gameId,
            tokenMint: directVaultAccount.tokenMint,
          });
        } catch (error) {
          console.log('  ❌ Direct vault account failed:', error.message);
        }
      } else {
        console.log('❌ Failed to initialize game with valid ID');
      }
    } else {
      console.log('⚠️ Solana configuration not found or disabled');
      console.log('   Make sure you have proper .env configuration:');
      console.log('   - SOLANA_ENABLED=true');
      console.log('   - SOLANA_RPC_URL=...');
      console.log('   - SOLANA_PROGRAM_ID=...');
      console.log('   - SOLANA_PRIVATE_KEY=...');
      console.log('   - SOLANA_TOKEN_MINT=...\n');

      // Test with no gameId (should handle gracefully)
      console.log(
        '🧪 Testing methods without gameId (should handle gracefully)...',
      );
      const tokenInfo = await game.getCurrentGameTokenInfo();
      const tokenMint = await game.getCurrentGameTokenMint();
      const vaultAccount = await game.getCurrentVaultAccount();

      console.log('Results (should all be null):');
      console.log('  - tokenInfo:', tokenInfo);
      console.log('  - tokenMint:', tokenMint);
      console.log('  - vaultAccount:', vaultAccount);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }

  console.log('\n🎯 Test completed!');
}

// Export for use as module
module.exports = { testTokenInfoRetrieval };

// Run if called directly
if (require.main === module) {
  testTokenInfoRetrieval()
    .then(() => {
      console.log('✅ All tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}
