#!/usr/bin/env node

/**
 * Mint Test Tokens to Your Wallet
 *
 * This script mints test tokens to any Solana wallet address.
 * Use this to get test tokens for development and testing.
 */

const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} = require('@solana/web3.js');

const {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
} = require('@solana/spl-token');

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_MINT_AMOUNT = 1000; // 1000 tokens

async function mintToWallet(walletAddress, amount = DEFAULT_MINT_AMOUNT) {
  console.log(`🪙 Minting ${amount} SBTT to wallet: ${walletAddress}\n`);

  // Load token configuration
  const tokenConfigPath = path.join(__dirname, 'test-token-config.json');
  if (!fs.existsSync(tokenConfigPath)) {
    console.error(
      '❌ Token config not found. Please run create-test-token.js first.',
    );
    process.exit(1);
  }

  const tokenConfig = JSON.parse(fs.readFileSync(tokenConfigPath, 'utf8'));
  console.log(`📋 Token: ${tokenConfig.symbol} (${tokenConfig.name})`);
  console.log(`📍 Mint: ${tokenConfig.mintAddress}`);

  // Load mint authority
  const mintAuthorityPath = path.join(__dirname, 'test-token-authority.json');
  if (!fs.existsSync(mintAuthorityPath)) {
    console.error(
      '❌ Mint authority not found. Please run create-test-token.js first.',
    );
    process.exit(1);
  }

  const keypairData = JSON.parse(fs.readFileSync(mintAuthorityPath, 'utf8'));
  const mintAuthority = Keypair.fromSecretKey(new Uint8Array(keypairData));

  // Connect to Solana
  const connection = new Connection(
    clusterApiUrl(tokenConfig.cluster),
    'confirmed',
  );
  console.log(`📡 Connected to Solana ${tokenConfig.cluster}`);

  // Parse addresses
  const tokenMint = new PublicKey(tokenConfig.mintAddress);
  const recipientWallet = new PublicKey(walletAddress);

  try {
    // Create or get associated token account for recipient
    console.log('🏦 Creating/getting token account for recipient...');
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, // Payer (we pay for account creation)
      tokenMint,
      recipientWallet,
    );

    console.log(
      `✅ Recipient token account: ${recipientTokenAccount.address.toString()}`,
    );

    // Check current balance
    let currentBalance = 0;
    try {
      const accountInfo = await getAccount(
        connection,
        recipientTokenAccount.address,
      );
      currentBalance =
        Number(accountInfo.amount) / Math.pow(10, tokenConfig.decimals);
    } catch (error) {
      // Account might not exist yet, balance is 0
      console.log('ℹ️ New token account, current balance is 0');
    }

    // Mint tokens
    console.log(`\n🪙 Minting ${amount} ${tokenConfig.symbol} tokens...`);
    const mintAmount = amount * Math.pow(10, tokenConfig.decimals);

    const signature = await mintTo(
      connection,
      mintAuthority,
      tokenMint,
      recipientTokenAccount.address,
      mintAuthority,
      mintAmount,
    );

    await connection.confirmTransaction(signature);

    const newBalance = currentBalance + amount;
    console.log(`✅ Minted successfully!`);
    console.log(
      `📈 Balance: ${currentBalance} → ${newBalance} ${tokenConfig.symbol}`,
    );
    console.log(
      `🔗 Transaction: https://explorer.solana.com/tx/${signature}?cluster=${tokenConfig.cluster}`,
    );
  } catch (error) {
    console.error('❌ Failed to mint tokens:', error);
    process.exit(1);
  }

  console.log('\n✅ Token minting completed successfully!');
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🪙 SwordBattle Test Token Minter\n');
    console.log('Usage:');
    console.log('  node mint-test-tokens.js <wallet-address> [amount]');
    console.log('');
    console.log('Examples:');
    console.log(
      '  node mint-test-tokens.js 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM 1000',
    );
    console.log(
      '  node mint-test-tokens.js 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    );
    console.log('');
    process.exit(1);
  }

  const walletAddress = args[0];
  const amount = args[1] ? parseFloat(args[1]) : DEFAULT_MINT_AMOUNT;

  // Validate wallet address
  try {
    new PublicKey(walletAddress);
  } catch (error) {
    console.error('❌ Invalid wallet address:', walletAddress);
    process.exit(1);
  }

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    console.error('❌ Invalid amount:', amount);
    process.exit(1);
  }

  await mintToWallet(walletAddress, amount);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { mintToWallet };
