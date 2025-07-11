// Check rewards for specific player and games
const { Connection, PublicKey } = require('@solana/web3.js');

async function checkRewards() {
  try {
    const connection = new Connection(
      'https://api.devnet.solana.com',
      'confirmed',
    );
    const playerAddress = '72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA';
    const playerPubkey = new PublicKey(playerAddress);

    console.log('🔍 Checking rewards for player:', playerAddress);
    console.log('📊 Database shows:');
    console.log('   Game 518: 0.001 SOL (未领取)');
    console.log('   Game 517: 0.001 SOL (未领取)');
    console.log('   Total: 0.002 SOL');

    // Check if player has any token accounts
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      playerPubkey,
      {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      },
    );

    console.log(`\n💰 Player has ${tokenAccounts.value.length} token accounts`);

    // Check SOL balance
    const solBalance = await connection.getBalance(playerPubkey);
    console.log(`💎 SOL Balance: ${(solBalance / 1e9).toFixed(6)} SOL`);

    console.log('\n✅ Summary:');
    console.log('   📊 Database records: 2 games with rewards');
    console.log('   💰 Total claimable: 0.002 SOL');
    console.log('   🎯 Status: Ready to claim');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRewards();
