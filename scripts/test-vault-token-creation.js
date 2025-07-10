#!/usr/bin/env node

/**
 * Test vault token account creation
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  TokenAccountNotFoundError,
} = require('@solana/spl-token');
const path = require('path');

// Configuration
const CLUSTER = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const SBTT_MINT = 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq';

async function testVaultTokenCreation() {
  console.log('🧪 Testing vault token account creation...\n');

  try {
    // Connect to Solana
    const connection = new Connection(RPC_URL, 'confirmed');
    console.log(`📡 Connected to Solana ${CLUSTER}`);

    // Load wallet from id.json
    const idPath = path.resolve(__dirname, '../abis/id.json');
    const privateKeyArray = require(idPath);
    const wallet = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
    console.log(`🔑 Wallet loaded: ${wallet.publicKey.toString()}`);

    // Test vault PDA (simulating game ID 999)
    const gameId = 999;
    const programId = new PublicKey(
      'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV',
    );

    // Create game ID buffer in little-endian format (8 bytes)
    const gameIdBuffer = Buffer.alloc(8);
    gameIdBuffer.writeUInt32LE(gameId, 0);

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), gameIdBuffer],
      programId,
    );

    console.log(`🏛️ Test vault PDA: ${vault.toString()}`);

    const tokenMint = new PublicKey(SBTT_MINT);
    console.log(`🪙 Token mint: ${tokenMint.toString()}`);

    // Get associated token address for vault
    const vaultTokenAddress = await getAssociatedTokenAddress(
      tokenMint,
      vault,
      true, // allowOwnerOffCurve
    );

    console.log(`🔗 Vault token address: ${vaultTokenAddress.toString()}`);

    // Check if account exists
    console.log('\n🔍 Checking if vault token account exists...');
    let accountExists = false;
    try {
      await getAccount(connection, vaultTokenAddress);
      accountExists = true;
      console.log('✅ Account already exists');
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        console.log('📝 Account does not exist, will create');
        accountExists = false;
      } else {
        throw error;
      }
    }

    // Create account if it doesn't exist
    if (!accountExists) {
      console.log('\n🔨 Creating vault token account...');
      try {
        const createdAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          wallet,
          tokenMint,
          vault,
          true, // allowOwnerOffCurve
        );

        console.log(`✅ Account created: ${createdAccount.address.toString()}`);
        console.log(`📊 Account info:`, {
          mint: createdAccount.mint.toString(),
          owner: createdAccount.owner.toString(),
          amount: createdAccount.amount.toString(),
        });

        // Verify account exists
        console.log('\n🔍 Verifying account creation...');
        const verifyAccount = await getAccount(connection, vaultTokenAddress);
        console.log('✅ Account verification successful');
        console.log(`📊 Verified account:`, {
          mint: verifyAccount.mint.toString(),
          owner: verifyAccount.owner.toString(),
          amount: verifyAccount.amount.toString(),
        });
      } catch (error) {
        console.error('❌ Failed to create account:', error);
        throw error;
      }
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  testVaultTokenCreation().catch(console.error);
}

module.exports = { testVaultTokenCreation };
