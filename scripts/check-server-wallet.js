#!/usr/bin/env node

/**
 * Check server wallet SOL balance and airdrop if needed
 */

const {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const path = require('path');

// Configuration
const CLUSTER = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';

async function checkServerWallet() {
  console.log('🔍 Checking server wallet SOL balance...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load server wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Server wallet: ${walletKeypair.publicKey.toString()}`);

  // Check SOL balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  const balanceSOL = balance / LAMPORTS_PER_SOL;

  console.log(
    `💰 Current SOL balance: ${balanceSOL} SOL (${balance} lamports)`,
  );

  if (balanceSOL < 0.01) {
    console.log('⚠️  Low SOL balance! Requesting airdrop...');

    try {
      const airdropSignature = await connection.requestAirdrop(
        walletKeypair.publicKey,
        0.1 * LAMPORTS_PER_SOL, // 0.1 SOL
      );

      console.log(`🚁 Airdrop requested: ${airdropSignature}`);

      // Wait for confirmation
      await connection.confirmTransaction(airdropSignature);

      // Check new balance
      const newBalance = await connection.getBalance(walletKeypair.publicKey);
      const newBalanceSOL = newBalance / LAMPORTS_PER_SOL;

      console.log(`✅ Airdrop confirmed! New balance: ${newBalanceSOL} SOL`);
    } catch (error) {
      console.log(`❌ Airdrop failed:`, error.message);
    }
  } else {
    console.log('✅ SOL balance is sufficient');
  }

  console.log('\n✅ Balance check completed!');
}

// Run the check
checkServerWallet().catch(console.error);
