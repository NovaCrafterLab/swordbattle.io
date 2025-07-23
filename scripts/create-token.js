#!/usr/bin/env node

const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
} = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

async function createToken() {
  try {
    console.log('🚀 Starting token creation process...');

    // Connect to Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    console.log('✅ Connected to Solana devnet');

    // Load the payer keypair from id.json
    const keyPath = path.join(__dirname, '../abis/id.json');
    let fileContent = fs.readFileSync(keyPath, 'utf8');

    // Clean the file content - remove extra lines and whitespace
    fileContent = fileContent.trim();
    const lines = fileContent.split('\n');

    // Find the JSON array part
    let jsonContent = '';
    let inArray = false;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('[')) {
        inArray = true;
        jsonContent += line;
      } else if (inArray && line.endsWith(']')) {
        jsonContent += line;
        break;
      } else if (inArray) {
        jsonContent += line;
      }
    }

    console.log('🔍 Parsing key data...');
    const secretKey = JSON.parse(jsonContent);
    const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

    console.log(`💳 Payer address: ${payer.publicKey.toString()}`);

    // Check payer balance
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`💰 Payer balance: ${balance / 1e9} SOL`);

    if (balance < 0.1 * 1e9) {
      console.log('⚠️ Low balance detected. You may need to request airdrop.');
      console.log('💧 Requesting airdrop...');
      const airdropTx = await connection.requestAirdrop(
        payer.publicKey,
        2 * 1e9, // 2 SOL
      );
      await connection.confirmTransaction(airdropTx);
      console.log('✅ Airdrop completed');
    }

    // Create the token mint
    console.log('🪙 Creating token mint...');
    const tokenMint = await createMint(
      connection,
      payer, // Payer of the transaction fees
      payer.publicKey, // Account that will control the minting
      payer.publicKey, // Account that will control the freezing of the token
      9, // Decimals (9 is standard for most tokens)
    );

    console.log(`✅ Token mint created: ${tokenMint.toString()}`);

    // Define the recipient address
    const recipientAddress = new PublicKey(
      '7z6qWXerduGXwMUi3w1gDZ1vHTyRoFAyiFh9WEd8RF3Z',
    );
    console.log(`🎯 Recipient address: ${recipientAddress.toString()}`);

    // Create associated token account for the payer (mint authority)
    console.log('🔧 Creating associated token account for mint authority...');
    const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      tokenMint,
      payer.publicKey,
    );
    console.log(
      `✅ Mint authority token account: ${payerTokenAccount.address.toString()}`,
    );

    // Create associated token account for the recipient
    console.log('🔧 Creating associated token account for recipient...');
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer, // Payer for the transaction
      tokenMint,
      recipientAddress,
    );
    console.log(
      `✅ Recipient token account: ${recipientTokenAccount.address.toString()}`,
    );

    // Define total supply (1 billion tokens with 9 decimals)
    const totalSupply = 1_000_000_000 * Math.pow(10, 9);
    const halfSupply = totalSupply / 2;

    console.log(`📊 Total supply: ${totalSupply / Math.pow(10, 9)} tokens`);
    console.log(
      `📊 Half supply to recipient: ${halfSupply / Math.pow(10, 9)} tokens`,
    );

    // Mint total supply to the mint authority first
    console.log('⚡ Minting total supply to mint authority...');
    await mintTo(
      connection,
      payer, // Payer of the transaction fees
      tokenMint, // Token mint
      payerTokenAccount.address, // Destination token account
      payer, // Authority (mint authority)
      totalSupply, // Amount to mint
    );
    console.log('✅ Total supply minted to mint authority');

    // Transfer half of the supply to the recipient
    console.log('💸 Transferring half supply to recipient...');
    await mintTo(
      connection,
      payer, // Payer of the transaction fees
      tokenMint, // Token mint
      recipientTokenAccount.address, // Destination token account
      payer, // Authority (mint authority)
      halfSupply, // Amount to mint
    );
    console.log('✅ Half supply transferred to recipient');

    // Verify balances
    console.log('🔍 Verifying token balances...');

    const payerBalance = await getAccount(
      connection,
      payerTokenAccount.address,
    );
    const recipientBalance = await getAccount(
      connection,
      recipientTokenAccount.address,
    );

    console.log(
      `💰 Mint authority balance: ${Number(payerBalance.amount) / Math.pow(10, 9)} tokens`,
    );
    console.log(
      `💰 Recipient balance: ${Number(recipientBalance.amount) / Math.pow(10, 9)} tokens`,
    );

    // Summary
    console.log('\n🎉 Token creation completed successfully!');
    console.log('📋 Summary:');
    console.log(`   Token Name: letsbonkgame test`);
    console.log(`   Token Mint: ${tokenMint.toString()}`);
    console.log(`   Total Supply: ${totalSupply / Math.pow(10, 9)} tokens`);
    console.log(`   Mint Authority: ${payer.publicKey.toString()}`);
    console.log(`   Recipient: ${recipientAddress.toString()}`);
    console.log(
      `   Recipient Balance: ${Number(recipientBalance.amount) / Math.pow(10, 9)} tokens`,
    );
    console.log(`   Network: Solana Devnet`);

    // Return the token mint address for use in configuration
    return {
      tokenMint: tokenMint.toString(),
      mintAuthority: payer.publicKey.toString(),
      recipient: recipientAddress.toString(),
      totalSupply: totalSupply / Math.pow(10, 9),
      recipientBalance: Number(recipientBalance.amount) / Math.pow(10, 9),
    };
  } catch (error) {
    console.error('❌ Error creating token:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  createToken()
    .then((result) => {
      console.log('\n🎯 Use this token mint address in your configuration:');
      console.log(result.tokenMint);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createToken };
