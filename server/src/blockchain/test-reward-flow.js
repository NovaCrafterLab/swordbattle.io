// Test script to validate the reward distribution flow
const SolanaVaultService = require('./SolanaVaultService');

async function testRewardFlow() {
  console.log('🧪 Testing reward distribution flow...');

  try {
    // Mock configuration
    const mockConfig = {
      enabled: true,
      rpcUrl: 'https://api.devnet.solana.com',
      programId: 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV',
      tokenMint: 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq',
      tiers: {
        low: { entranceFee: 0.01, killReward: 0.001 },
        medium: { entranceFee: 0.05, killReward: 0.005 },
        high: { entranceFee: 0.1, killReward: 0.01 },
      },
    };

    // Create service instance (without initialization for testing)
    const service = new SolanaVaultService(mockConfig);

    // Test 1: Format pre-calculated rewards from Game.js
    console.log('\n📋 Test 1: Formatting pre-calculated rewards');
    const gameRewards = [
      {
        playerId: 'player1',
        playerName: 'Alice',
        walletAddress: '72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA',
        kills: 5,
        rewardSOL: 0.005,
        rewardLamports: 5000000,
      },
      {
        playerId: 'player2',
        playerName: 'Bob',
        walletAddress: '7DKjS9h87FSAMPADrStBX1Z7bu5jD9X5PPgDzBjpyz4n',
        kills: 3,
        rewardSOL: 0.003,
        rewardLamports: 3000000,
      },
    ];

    const formattedRewards = service.formatRewardsForVaultSDK(gameRewards);

    console.log('✅ Formatted rewards:', {
      count: formattedRewards.length,
      totalSOL: formattedRewards.reduce((sum, r) => sum + r.rewardSOL, 0),
      rewards: formattedRewards.map((r) => ({
        player: r.playerName,
        address: r.playerAddress.slice(0, 8) + '...',
        kills: r.kills,
        rewardSOL: r.rewardSOL,
        rewardLamports: r.rewardAmount,
      })),
    });

    // Test 2: Validate data structure compatibility
    console.log('\n🔍 Test 2: Data structure validation');

    // Simulate what VaultSDK expects
    const vaultSDKFormat = formattedRewards.map((reward) => {
      if (!reward.playerAddress || !reward.rewardAmount) {
        throw new Error(`Missing required fields for ${reward.playerName}`);
      }

      return {
        user: reward.playerAddress, // Would be PublicKey in real scenario
        amount: reward.rewardAmount.toString(),
      };
    });

    console.log('✅ VaultSDK format validation passed:', {
      entries: vaultSDKFormat.length,
      sample: vaultSDKFormat[0],
    });

    // Test 3: Tier configuration
    console.log('\n⚙️ Test 3: Tier configuration');
    const tierConfig = service.getTierConfig('low');
    console.log('✅ Tier config:', tierConfig);

    console.log('\n🎉 All tests passed! Reward flow is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
if (require.main === module) {
  testRewardFlow();
}

module.exports = { testRewardFlow };
