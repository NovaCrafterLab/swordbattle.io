#!/usr/bin/env node

/**
 * Find the game ID for a specific vault address
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

// Target vault address from error logs
const TARGET_VAULT = '72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA';

// Simple BN implementation for gameId conversion
function gameIdToBuffer(gameId) {
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32LE(gameId, 0);
  buffer.writeUInt32LE(0, 4);
  return buffer;
}

async function findGameId() {
  console.log('🔍 Finding game ID for vault address...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Wallet loaded: ${walletKeypair.publicKey.toString()}`);

  const tokenMint = new PublicKey(SBTT_MINT);
  const programId = new PublicKey(PROGRAM_ID);
  const targetVault = new PublicKey(TARGET_VAULT);

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎯 Target vault: ${targetVault.toString()}\n`);

  // Test a wider range of game IDs
  for (let gameId = 1; gameId <= 10000; gameId++) {
    // Calculate vault PDA
    const gameIdBuffer = gameIdToBuffer(gameId);
    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), gameIdBuffer],
      programId,
    );

    if (vault.equals(targetVault)) {
      console.log(
        `🎉 FOUND! Game ID ${gameId} corresponds to vault ${vault.toString()}`,
      );

      // Get associated token address for this vault
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

      return;
    }

    // Progress indicator
    if (gameId % 1000 === 0) {
      console.log(`🔍 Checked up to game ID ${gameId}...`);
    }
  }

  console.log('❌ Game ID not found in range 1-10000');
}

// Run the search
findGameId().catch(console.error);
