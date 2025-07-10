#!/usr/bin/env node

/**
 * Create ATA for the correct vault PDA that VaultSDK uses
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
const CORRECT_VAULT = 'CSWER3vPpzUHznsST2fBoHNFub36N55kQZHQYuSXKfvR'; // From PDA test

async function createCorrectVaultATA() {
  console.log('🔍 Creating ATA for correct vault PDA...\n');

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
  const vault = new PublicKey(CORRECT_VAULT);

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`🏛️ Vault PDA: ${vault.toString()}\n`);

  // Get associated token address for vault
  const vaultTokenAddress = await getAssociatedTokenAddress(
    tokenMint,
    vault,
    true, // allowOwnerOffCurve
  );

  console.log(
    `🔗 Expected vault token address: ${vaultTokenAddress.toString()}`,
  );

  // Check if it already exists
  try {
    const accountInfo = await getAccount(connection, vaultTokenAddress);
    console.log(`✅ Vault token account already exists!`);
    console.log(`   Owner: ${accountInfo.owner.toString()}`);
    console.log(`   Mint: ${accountInfo.mint.toString()}`);
    console.log(`   Amount: ${accountInfo.amount.toString()}`);
    return;
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
      console.log(`❌ Vault token account not found, creating...`);
    } else {
      console.log(`❌ Error checking account:`, error.message);
      return;
    }
  }

  // Create the ATA
  console.log(`🔨 Creating vault token account...`);
  try {
    const result = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      tokenMint,
      vault,
      true, // allowOwnerOffCurve
    );

    console.log(`✅ SUCCESS! Vault token account created:`);
    console.log(`   Address: ${result.address.toString()}`);
    console.log(`   Owner: ${result.owner.toString()}`);
    console.log(`   Mint: ${result.mint.toString()}`);
    console.log(`   Amount: ${result.amount.toString()}`);
  } catch (error) {
    console.log(`❌ FAILED to create vault token account:`);
    console.log(`   Error type: ${error.constructor.name}`);
    console.log(`   Error message: ${error.message}`);

    if (error.stack) {
      console.log(`   Stack trace:`);
      console.log(error.stack);
    }
  }

  console.log('\n✅ Creation completed!');
}

// Run the creation
createCorrectVaultATA().catch(console.error);
