import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VaultSDK } from './vault-sdk';
import { getAssociatedTokenAddress, createMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token';

// Example usage of VaultSDK
async function example() {
  // Setup connection and wallet
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const wallet = Keypair.generate(); // In real app, this would be user's wallet
  
  // Program ID from your deployed contract
  const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');
  
  // Initialize SDK
  const vaultSDK = new VaultSDK({
    programId,
    connection,
    wallet
  });

  // Example: Initialize a game vault
  const gameId = 12345;
  const tokenMint = new PublicKey('11111111111111111111111111111111'); // Replace with actual mint
  
  try {
    const tx = await vaultSDK.initializeGameVault({
      gameId,
      tokenMint
    });
    console.log('Game vault initialized:', tx);
  } catch (error) {
    console.error('Failed to initialize game vault:', error);
  }

  // Example: Buy a ticket
  const userTokenAccount = new PublicKey('11111111111111111111111111111111'); // Replace with actual token account
  
  try {
    const tx = await vaultSDK.buyTicket({
      gameId,
      amount: 100000000, // 100 tokens (assuming 9 decimals)
      userTokenAccount
    });
    console.log('Ticket purchased:', tx);
  } catch (error) {
    console.error('Failed to buy ticket:', error);
  }

  // Example: Get vault account info
  try {
    const vaultAccount = await vaultSDK.getVaultAccount(gameId);
    console.log('Vault account:', vaultAccount);
  } catch (error) {
    console.error('Failed to get vault account:', error);
  }

  // Example: Get user ticket info
  try {
    const userTicket = await vaultSDK.getUserTicketAccount(gameId, wallet.publicKey);
    console.log('User ticket:', userTicket);
  } catch (error) {
    console.error('Failed to get user ticket:', error);
  }
}

// Example: Complete game flow
async function completeGameFlow() {
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const admin = Keypair.generate();
  const user = Keypair.generate();
  const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');
  
  // Create token mint
  const tokenMint = await createMint(
    connection,
    admin,
    admin.publicKey,
    null,
    9
  );

  // Create token accounts
  const adminTokenAccount = await getAssociatedTokenAddress(tokenMint, admin.publicKey);
  const userTokenAccount = await getAssociatedTokenAddress(tokenMint, user.publicKey);
  
  await createAssociatedTokenAccount(connection, admin, tokenMint, admin.publicKey);
  await createAssociatedTokenAccount(connection, admin, tokenMint, user.publicKey);
  
  // Mint tokens to user
  await mintTo(connection, admin, tokenMint, userTokenAccount, admin, 1000000000);

  // Initialize SDK for admin
  const adminSDK = new VaultSDK({
    programId,
    connection,
    wallet: admin
  });

  // Initialize SDK for user
  const userSDK = new VaultSDK({
    programId,
    connection,
    wallet: user
  });

  const gameId = 12345;

  // 1. Admin initializes vault
  await adminSDK.initializeGameVault({
    gameId,
    tokenMint
  });

  // 2. User buys ticket
  await userSDK.buyTicket({
    gameId,
    amount: 100000000,
    userTokenAccount
  });

  // 3. Admin finalizes game with rewards
  await adminSDK.finalizeGame({
    gameId,
    rewards: [{
      user: user.publicKey,
      amount: '50000000' // 50 tokens reward
    }]
  });

  // 4. User claims reward
  await userSDK.claimReward({
    gameId,
    userTokenAccount
  });

  // 5. Admin withdraws remaining funds
  await adminSDK.adminWithdraw({
    gameId,
    amount: 50000000, // 50 tokens
    adminTokenAccount
  });
}

export { example, completeGameFlow }; 