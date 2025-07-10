#!/usr/bin/env node

/**
 * Check vault and token account for game ID 424
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

async function checkGame424() {
  console.log('🔍 Checking Game ID 424 vault and token account...\n');

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

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎮 Game ID: ${GAME_ID}\n`);

  // Calculate vault PDA for game 424
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

  console.log(`🔗 Vault token address: ${vaultTokenAddress.toString()}`);

  // Check if vault token account exists
  try {
    const accountInfo = await getAccount(connection, vaultTokenAddress);
    console.log(`✅ Vault token account exists!`);
    console.log(`   Owner: ${accountInfo.owner.toString()}`);
    console.log(`   Mint: ${accountInfo.mint.toString()}`);
    console.log(`   Amount: ${accountInfo.amount.toString()}`);
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
        console.log(`   Owner: ${createdAccount.owner.toString()}`);
        console.log(`   Mint: ${createdAccount.mint.toString()}`);
        console.log(`   Amount: ${createdAccount.amount.toString()}`);
      } catch (createError) {
        console.log(
          `❌ Failed to create vault token account:`,
          createError.message,
        );
        console.log(`   Error type: ${createError.constructor.name}`);
        console.log(`   Full error:`, createError);
      }
    } else {
      console.log(
        `❌ Unexpected error checking vault token account:`,
        error.message,
      );
    }
  }

  console.log('\n✅ Check completed!');
}

// Run the check
checkGame424().catch(console.error);
