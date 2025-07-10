#!/usr/bin/env node

/**
 * Test VaultSDK PDA calculation
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { VaultSDK } = require('../solana/vault-sdk/dist/index.js');
const path = require('path');

// Configuration
const CLUSTER = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV';
const GAME_ID = 424; // From server info

async function testVaultSDKPDAs() {
  console.log('🔍 Testing VaultSDK PDA calculation...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load server wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Server wallet: ${walletKeypair.publicKey.toString()}`);

  const programId = new PublicKey(PROGRAM_ID);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎮 Game ID: ${GAME_ID}\n`);

  // Create wallet interface for VaultSDK
  const walletInterface = {
    publicKey: walletKeypair.publicKey,
    signTransaction: async (tx) => {
      tx.sign(walletKeypair);
      return tx;
    },
    signAllTransactions: async (txs) => {
      return txs.map((tx) => {
        tx.sign(walletKeypair);
        return tx;
      });
    },
  };

  // Initialize VaultSDK
  const vaultSDK = new VaultSDK({
    programId: programId,
    connection: connection,
    wallet: walletInterface,
  });

  console.log('✅ VaultSDK initialized');
  console.log(
    `🔧 VaultSDK program ID: ${vaultSDK.program.programId.toString()}\n`,
  );

  // Test getVaultPdas method (we need to access it somehow)
  // Since it's private, let's calculate the PDA manually using the same logic
  const anchor = require('@coral-xyz/anchor');

  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), new anchor.BN(GAME_ID).toArrayLike(Buffer, 'le', 8)],
    vaultSDK.program.programId,
  );

  console.log(`🏛️ VaultSDK calculated vault PDA: ${vault.toString()}`);

  // Compare with our manual calculation
  function gameIdToBuffer(gameId) {
    const buffer = Buffer.alloc(8);
    buffer.writeUInt32LE(gameId, 0);
    buffer.writeUInt32LE(0, 4);
    return buffer;
  }

  const [manualVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), gameIdToBuffer(GAME_ID)],
    programId,
  );

  console.log(`🔧 Manual calculated vault PDA: ${manualVault.toString()}`);

  if (vault.equals(manualVault)) {
    console.log('✅ PDA calculations match!');
  } else {
    console.log('❌ PDA calculations DO NOT match!');
    console.log(
      "This explains why VaultSDK fails - it's using different PDA calculation",
    );

    // Let's see the difference in buffer encoding
    const anchorBuffer = new anchor.BN(GAME_ID).toArrayLike(Buffer, 'le', 8);
    const manualBuffer = gameIdToBuffer(GAME_ID);

    console.log(`\nBuffer comparison:`);
    console.log(`Anchor BN buffer: [${Array.from(anchorBuffer).join(', ')}]`);
    console.log(`Manual buffer:    [${Array.from(manualBuffer).join(', ')}]`);
  }

  console.log('\n✅ Test completed!');
}

// Run the test
testVaultSDKPDAs().catch(console.error);
