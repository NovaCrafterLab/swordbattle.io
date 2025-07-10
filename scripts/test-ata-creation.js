#!/usr/bin/env node

/**
 * Test ATA creation with exact same parameters as VaultSDK
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
const PROGRAM_ID = 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV';
const GAME_ID = 424; // From server info

// Simple BN implementation for gameId conversion
function gameIdToBuffer(gameId) {
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32LE(gameId, 0);
  buffer.writeUInt32LE(0, 4);
  return buffer;
}

async function testATACreation() {
  console.log('🔍 Testing ATA creation with exact VaultSDK parameters...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load server wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Server wallet: ${walletKeypair.publicKey.toString()}`);

  const tokenMint = new PublicKey(SBTT_MINT);
  const programId = new PublicKey(PROGRAM_ID);

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎮 Game ID: ${GAME_ID}\n`);

  // Calculate vault PDA for game 424 (exactly like VaultSDK)
  const gameIdBuffer = gameIdToBuffer(GAME_ID);
  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), gameIdBuffer],
    programId,
  );

  console.log(`🏛️ Vault PDA: ${vault.toString()}`);

  // Get associated token address for vault
  const vaultTokenAddress = await getAssociatedTokenAddress(
    tokenMint,
    vault,
    true, // allowOwnerOffCurve
  );

  console.log(
    `🔗 Expected vault token address: ${vaultTokenAddress.toString()}`,
  );

  // Check @solana/spl-token version
  const splTokenPackage = require('../solana/vault-sdk/node_modules/@solana/spl-token/package.json');
  console.log(`📦 @solana/spl-token version: ${splTokenPackage.version}\n`);

  // Test getOrCreateAssociatedTokenAccount with exact same parameters
  console.log('🔨 Testing getOrCreateAssociatedTokenAccount...');
  console.log('Parameters:');
  console.log(`  connection: ${connection.rpcEndpoint}`);
  console.log(`  payer: ${walletKeypair.publicKey.toString()}`);
  console.log(`  mint: ${tokenMint.toString()}`);
  console.log(`  owner: ${vault.toString()}`);
  console.log(`  allowOwnerOffCurve: true\n`);

  try {
    const result = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      tokenMint,
      vault,
      true, // allowOwnerOffCurve
    );

    console.log(`✅ SUCCESS! ATA created/retrieved:`);
    console.log(`   Address: ${result.address.toString()}`);
    console.log(`   Owner: ${result.owner.toString()}`);
    console.log(`   Mint: ${result.mint.toString()}`);
    console.log(`   Amount: ${result.amount.toString()}`);
  } catch (error) {
    console.log(`❌ FAILED! Error details:`);
    console.log(`   Error type: ${error.constructor.name}`);
    console.log(`   Error message: ${error.message}`);

    if (error.stack) {
      console.log(`   Stack trace:`);
      console.log(error.stack);
    }

    if (error.logs) {
      console.log(`   Transaction logs:`);
      error.logs.forEach((log, i) => {
        console.log(`     ${i}: ${log}`);
      });
    }

    // Try to get more details about the error
    if (error.code) {
      console.log(`   Error code: ${error.code}`);
    }

    if (error.programErrorStack) {
      console.log(`   Program error stack:`);
      console.log(error.programErrorStack);
    }
  }

  console.log('\n✅ Test completed!');
}

// Run the test
testATACreation().catch(console.error);
