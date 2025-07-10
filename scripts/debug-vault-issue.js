#!/usr/bin/env node

/**
 * Debug vault token account issue for actual game
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

// Simple BN implementation for gameId conversion
function gameIdToBuffer(gameId) {
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32LE(gameId, 0);
  buffer.writeUInt32LE(0, 4);
  return buffer;
}

async function debugVaultIssue() {
  console.log('🔍 Debugging vault token account issue...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Wallet loaded: ${walletKeypair.publicKey.toString()}`);

  // Test different game IDs that might be in use
  const testGameIds = [1, 2, 3, 4, 5, 10, 100, 1000, 12345];

  const tokenMint = new PublicKey(SBTT_MINT);
  const programId = new PublicKey(PROGRAM_ID);

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`📋 Program ID: ${programId.toString()}\n`);

  for (const gameId of testGameIds) {
    console.log(`\n🎮 Testing Game ID: ${gameId}`);

    // Calculate vault PDA
    const gameIdBuffer = gameIdToBuffer(gameId);
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

    console.log(`🔗 Vault token address: ${vaultTokenAddress.toString()}`);

    // Check if vault token account exists
    try {
      await getAccount(connection, vaultTokenAddress);
      console.log(`✅ Vault token account exists`);
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        console.log(`❌ Vault token account NOT found`);

        // Try to create it
        console.log(`🔨 Attempting to create vault token account...`);
        try {
          const createdAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            walletKeypair,
            tokenMint,
            vault,
            true, // allowOwnerOffCurve
          );
          console.log(
            `✅ Successfully created vault token account: ${createdAccount.address.toString()}`,
          );
        } catch (createError) {
          console.log(
            `❌ Failed to create vault token account:`,
            createError.message,
          );
        }
      } else {
        console.log(
          `❌ Unexpected error checking vault token account:`,
          error.message,
        );
      }
    }
  }

  console.log('\n✅ Debug completed!');
}

// Run the debug
debugVaultIssue().catch(console.error);
