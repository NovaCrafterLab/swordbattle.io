// Verification script for Game 479 reward distribution
const SolanaVaultService = require('./SolanaVaultService');
const { Connection, PublicKey } = require('@solana/web3.js');

async function verifyGame479() {
  console.log('🔍 Verifying Game 479 reward distribution on Solana...');

  try {
    // Initialize Solana vault service
    const config = {
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

    const vaultService = new SolanaVaultService(config);
    await vaultService.initialize();
    console.log('✅ Solana vault service initialized');

    const gameId = 479;
    const playerAddress = '72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA';
    const playerPubkey = new PublicKey(playerAddress);

    console.log('\n🎯 Verification targets:');
    console.log('  Game ID:', gameId);
    console.log('  Player:', playerAddress);

    // 1. Check vault account
    console.log('\n🏛️ Checking vault account...');
    try {
      const vaultAccount = await vaultService.vaultSDK.getVaultAccount(gameId);
      console.log('✅ Vault account found:', {
        gameId: vaultAccount.gameId,
        authority: vaultAccount.authority.toString(),
        totalDeposit: vaultAccount.totalDeposit,
        finalized: vaultAccount.finalized,
        withdrawEnabled: vaultAccount.withdrawEnabled,
        tokenMint: vaultAccount.tokenMint.toString(),
      });

      if (!vaultAccount.finalized) {
        console.log('❌ Game is not finalized yet!');
        return;
      }

      if (!vaultAccount.withdrawEnabled) {
        console.log('❌ Withdrawals are not enabled!');
        return;
      }
    } catch (error) {
      console.log('❌ Vault account not found:', error.message);
      return;
    }

    // 2. Check reward map
    console.log('\n🗺️ Checking reward map...');
    try {
      const rewardMapAccount =
        await vaultService.vaultSDK.getRewardMapAccount(gameId);

      if (!rewardMapAccount) {
        console.log('❌ Reward map not found');
        return;
      }

      console.log('✅ Reward map found:', {
        gameId: rewardMapAccount.gameId,
        rewardCount: rewardMapAccount.rewards.length,
        rewards: rewardMapAccount.rewards.map((reward) => ({
          user: reward.user.toString(),
          amount: reward.amount,
          amountSOL: (parseInt(reward.amount) / 1e9).toFixed(6),
        })),
      });

      // Check if our player has a reward
      const playerReward = rewardMapAccount.rewards.find(
        (reward) => reward.user.toString() === playerAddress,
      );

      if (playerReward) {
        console.log('🎉 Player reward found:', {
          user: playerReward.user.toString(),
          amount: playerReward.amount,
          amountSOL: (parseInt(playerReward.amount) / 1e9).toFixed(6),
        });
      } else {
        console.log('❌ No reward found for player:', playerAddress);
        return;
      }
    } catch (error) {
      console.log('❌ Reward map error:', error.message);
      return;
    }

    // 3. Check user ticket
    console.log('\n🎫 Checking user ticket...');
    try {
      const userTicketAccount =
        await vaultService.vaultSDK.getUserTicketAccount(gameId, playerPubkey);

      if (!userTicketAccount) {
        console.log('❌ User ticket not found');
        return;
      }

      console.log('✅ User ticket found:', {
        gameId: userTicketAccount.gameId,
        user: userTicketAccount.user.toString(),
        amount: userTicketAccount.amount,
        hasWithdrawn: userTicketAccount.hasWithdrawn,
      });

      if (userTicketAccount.hasWithdrawn) {
        console.log('✅ Player has already claimed their reward');
      } else {
        console.log('💰 Player can claim their reward');
      }
    } catch (error) {
      console.log('❌ User ticket error:', error.message);
    }

    console.log('\n🎯 Verification Summary:');
    console.log('  Game 479 status: Checking complete');
    console.log('  Player address:', playerAddress);
    console.log('  Expected reward: 0.001 SOL (1,000,000 lamports)');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.error(error.stack);
  }
}

// Run verification
if (require.main === module) {
  verifyGame479();
}

module.exports = { verifyGame479 };
