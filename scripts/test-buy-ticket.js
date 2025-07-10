#!/usr/bin/env node

/**
 * Test buyTicket directly with VaultSDK
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');
const { VaultSDK } = require('../solana/vault-sdk/dist/index.js');
const path = require('path');

// Configuration
const CLUSTER = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const SBTT_MINT = 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq';
const PROGRAM_ID = 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV';
const GAME_ID = 424; // From server info
const USER_WALLET = '72U6xaEnna2iF2RcZHBKBhsB6VC76deyhib8KV2zUqMA'; // User wallet

async function testBuyTicket() {
  console.log('🔍 Testing buyTicket with VaultSDK...\n');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Load server wallet from project abis directory
  const walletPath = path.join(__dirname, '../abis/id.json');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(require(walletPath)),
  );
  console.log(`🔑 Server wallet loaded: ${walletKeypair.publicKey.toString()}`);

  const tokenMint = new PublicKey(SBTT_MINT);
  const programId = new PublicKey(PROGRAM_ID);
  const userWallet = new PublicKey(USER_WALLET);

  console.log(`🪙 Token mint: ${tokenMint.toString()}`);
  console.log(`📋 Program ID: ${programId.toString()}`);
  console.log(`🎮 Game ID: ${GAME_ID}`);
  console.log(`👤 User wallet: ${userWallet.toString()}\n`);

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

  // Get user token account
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    userWallet,
  );

  console.log(`🔗 User token account: ${userTokenAccount.toString()}`);

  // Test buyTicket
  try {
    console.log('\n🎫 Attempting to buy ticket...');

    const txHash = await vaultSDK.buyTicket({
      gameId: GAME_ID,
      amount: 10000000, // 0.01 SBTT (assuming 9 decimals)
      userTokenAccount: userTokenAccount,
      tier: 'low',
      expectedAmount: '10000000',
    });

    console.log(`✅ Ticket purchased successfully!`);
    console.log(`   Transaction: ${txHash}`);
    console.log(
      `   Explorer: https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
    );
  } catch (error) {
    console.log(`❌ Failed to buy ticket:`, error.message);
    console.log(`   Error type: ${error.constructor.name}`);
    console.log(`   Full error:`, error);
  }

  console.log('\n✅ Test completed!');
}

// Run the test
testBuyTicket().catch(console.error);
