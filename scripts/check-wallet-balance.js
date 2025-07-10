#!/usr/bin/env node

/**
 * Check wallet balance for SBTT tokens
 * Usage: node scripts/check-wallet-balance.js <wallet_address>
 */

const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');

// Configuration
const CLUSTER = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const SBTT_MINT = 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq';

async function checkWalletBalance(walletAddress) {
  console.log('🔍 Checking wallet balance...\n');

  try {
    // Connect to Solana
    const connection = new Connection(RPC_URL, 'confirmed');
    console.log(`📡 Connected to Solana ${CLUSTER}`);

    // Validate wallet address
    let walletPubkey;
    try {
      walletPubkey = new PublicKey(walletAddress);
    } catch (error) {
      throw new Error(`Invalid wallet address: ${walletAddress}`);
    }

    console.log(`👛 Wallet: ${walletAddress}`);
    console.log(`🪙 Token: ${SBTT_MINT} (SBTT)\n`);

    // Check SOL balance
    const solBalance = await connection.getBalance(walletPubkey);
    console.log(`💰 SOL Balance: ${solBalance / 1e9} SOL`);

    // Check SBTT balance
    const mintPubkey = new PublicKey(SBTT_MINT);
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPubkey,
      walletPubkey,
    );

    console.log(
      `🔗 Associated Token Account: ${associatedTokenAddress.toString()}`,
    );

    try {
      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      const balance = Number(tokenAccount.amount) / 1e9; // SBTT has 9 decimals

      console.log(`✅ SBTT Balance: ${balance} SBTT`);
      console.log(`📊 Raw Amount: ${tokenAccount.amount.toString()}`);

      if (balance === 0) {
        console.log('\n⚠️  Zero balance detected!');
        console.log('💡 To get SBTT tokens, run:');
        console.log(
          `   ./scripts/mint-tokens-to-wallet.sh ${walletAddress} 1000`,
        );
      } else {
        console.log('\n✅ Wallet has SBTT tokens!');
      }
    } catch (error) {
      if (
        error.message.includes('could not find account') ||
        error.message.includes('TokenAccountNotFoundError')
      ) {
        console.log('❌ No SBTT token account found');
        console.log('📝 This means the wallet has never received SBTT tokens');
        console.log('\n💡 To create account and mint tokens, run:');
        console.log(
          `   ./scripts/mint-tokens-to-wallet.sh ${walletAddress} 1000`,
        );
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Error checking wallet balance:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const walletAddress = process.argv[2];

  if (!walletAddress) {
    console.log('Usage: node scripts/check-wallet-balance.js <wallet_address>');
    console.log('');
    console.log('Example:');
    console.log(
      '  node scripts/check-wallet-balance.js 6Fe6mnH1ujPgZ9RYLAqsoiVn1V9j8xHEDLwPmyrScfCq',
    );
    process.exit(1);
  }

  await checkWalletBalance(walletAddress);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkWalletBalance };
