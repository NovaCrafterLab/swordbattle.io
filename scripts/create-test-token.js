#!/usr/bin/env node

/**
 * Create Test SPL Token for Swordbattle Development
 *
 * This script creates a simple SPL token that we can mint for testing purposes.
 * This is much easier than using USDC which requires real assets.
 */

const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  getMint,
  getAccount,
} = require('@solana/spl-token');

const fs = require('fs');
const path = require('path');

// Configuration
const CLUSTER = 'devnet'; // Use devnet for testing
const TOKEN_NAME = 'SwordBattle Test Token';
const TOKEN_SYMBOL = 'SBTT';
const TOKEN_DECIMALS = 9; // Same as SOL
const INITIAL_MINT_AMOUNT = 1000000; // 1M tokens

async function main() {
  console.log('🪙 Creating SwordBattle Test Token (SBTT)...\n');

  // Connect to Solana devnet
  const connection = new Connection(clusterApiUrl(CLUSTER), 'confirmed');
  console.log(`📡 Connected to Solana ${CLUSTER}`);

  // Create or load mint authority keypair
  let mintAuthority;
  const mintAuthorityPath = path.join(__dirname, 'test-token-authority.json');

  if (fs.existsSync(mintAuthorityPath)) {
    console.log('🔑 Loading existing mint authority...');
    const keypairData = JSON.parse(fs.readFileSync(mintAuthorityPath, 'utf8'));
    mintAuthority = Keypair.fromSecretKey(new Uint8Array(keypairData));
  } else {
    console.log('🔑 Creating new mint authority...');
    mintAuthority = Keypair.generate();

    // Save the keypair for future use
    fs.writeFileSync(
      mintAuthorityPath,
      JSON.stringify(Array.from(mintAuthority.secretKey)),
    );
    console.log(`💾 Mint authority saved to ${mintAuthorityPath}`);
  }

  console.log(`🔑 Mint Authority: ${mintAuthority.publicKey.toString()}`);

  // Request airdrop for mint authority if needed
  const balance = await connection.getBalance(mintAuthority.publicKey);
  if (balance < 1000000000) {
    // Less than 1 SOL
    console.log('💧 Requesting SOL airdrop for mint authority...');
    try {
      const signature = await connection.requestAirdrop(
        mintAuthority.publicKey,
        2000000000, // 2 SOL
      );
      await connection.confirmTransaction(signature);
      console.log('✅ Airdrop completed');
    } catch (error) {
      console.log(
        '⚠️ Airdrop failed (might have reached limit):',
        error.message,
      );
    }
  }

  // Create token mint
  console.log('\n🏭 Creating token mint...');
  let tokenMint;

  try {
    tokenMint = await createMint(
      connection,
      mintAuthority,
      mintAuthority.publicKey, // mint authority
      mintAuthority.publicKey, // freeze authority (optional)
      TOKEN_DECIMALS,
    );

    console.log(`✅ Token mint created: ${tokenMint.toString()}`);

    // Save token mint address
    const tokenConfigPath = path.join(__dirname, 'test-token-config.json');
    const tokenConfig = {
      mintAddress: tokenMint.toString(),
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      decimals: TOKEN_DECIMALS,
      authority: mintAuthority.publicKey.toString(),
      cluster: CLUSTER,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(tokenConfigPath, JSON.stringify(tokenConfig, null, 2));
    console.log(`💾 Token config saved to ${tokenConfigPath}`);
  } catch (error) {
    console.error('❌ Failed to create token mint:', error);
    process.exit(1);
  }

  // Create associated token account for mint authority
  console.log('\n🏦 Creating token account for mint authority...');
  try {
    const mintAuthorityTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      tokenMint,
      mintAuthority.publicKey,
    );

    console.log(
      `✅ Token account created: ${mintAuthorityTokenAccount.address.toString()}`,
    );

    // Mint initial supply
    console.log(
      `\n🪙 Minting ${INITIAL_MINT_AMOUNT.toLocaleString()} ${TOKEN_SYMBOL} tokens...`,
    );
    const mintAmount = INITIAL_MINT_AMOUNT * Math.pow(10, TOKEN_DECIMALS);

    await mintTo(
      connection,
      mintAuthority,
      tokenMint,
      mintAuthorityTokenAccount.address,
      mintAuthority,
      mintAmount,
    );

    console.log(
      `✅ Minted ${INITIAL_MINT_AMOUNT.toLocaleString()} ${TOKEN_SYMBOL} tokens`,
    );
  } catch (error) {
    console.error('❌ Failed to create token account or mint tokens:', error);
    process.exit(1);
  }

  // Display summary
  console.log('\n📋 Token Creation Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🪙 Token Name: ${TOKEN_NAME}`);
  console.log(`🏷️  Token Symbol: ${TOKEN_SYMBOL}`);
  console.log(`📍 Token Mint: ${tokenMint.toString()}`);
  console.log(`🔑 Mint Authority: ${mintAuthority.publicKey.toString()}`);
  console.log(`🌐 Cluster: ${CLUSTER}`);
  console.log(
    `💰 Initial Supply: ${INITIAL_MINT_AMOUNT.toLocaleString()} ${TOKEN_SYMBOL}`,
  );
  console.log(`🔢 Decimals: ${TOKEN_DECIMALS}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n🔧 Next Steps:');
  console.log('1. Update your environment variables:');
  console.log(`   REACT_APP_TOKEN_MINT=${tokenMint.toString()}`);
  console.log(`   REACT_APP_SOLANA_CLUSTER=${CLUSTER}`);
  console.log('\n2. Run the minting script to get test tokens in your wallet');
  console.log('3. Test the race modal with the new token');

  console.log('\n✅ Test token creation completed successfully!');
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

module.exports = { main };
