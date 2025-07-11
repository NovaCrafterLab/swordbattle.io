# Solana Game Vault Contract - JavaScript Integration Guide

This contract is built on the Anchor framework and implements a game vault management system, including ticket purchases, settlements, reward distribution, admin withdrawals, and token switching.

## Core Features

- **initializeGameVault**: Initialize game vault
- **buyTicket**: User ticket purchase (deposit)
- **finalizeGame**: Admin game settlement and reward distribution
- **claimReward**: User reward claiming
- **adminWithdraw**: Admin fund withdrawal
- **changeTokenMint**: Admin token switching (before settlement)

## JavaScript Integration Prerequisites

### 1. Dependencies

- `@coral-xyz/anchor`
- `@solana/web3.js`
- `@solana/spl-token` (>=0.3.10, supports allowOwnerOffCurve)

### 2. Create Vault PDA's ATA (Associated Token Account)

> **Required**: After initializing the vault for the first time, immediately create an ATA for the vault PDA, otherwise subsequent ticket purchases/reward claims will fail.

```js
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');

// vaultPda: PDA address
// tokenMint: SPL Token Mint address
// admin: payer
const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  admin, // payer
  tokenMint, // mint
  vaultPda, // owner (PDA)
  true, // allowOwnerOffCurve
);
```

### 3. PDA Considerations

- The vault's ATA owner must be the PDA, and `allowOwnerOffCurve: true` is required when creating.
- All transfers involving PDA as signer are implemented with `invoke_signed` in the contract.
- When calling from JS, pass the same PDA address as vault_signer.

## JavaScript Integration Examples

### 1. Initialize Game Vault

```js
await program.methods
  .initializeGameVault(new anchor.BN(gameId))
  .accounts({
    vault: vaultPda,
    authority: admin.publicKey,
    tokenMint: tokenMint,
    systemProgram: SystemProgram.programId,
  })
  .signers([admin])
  .rpc();
```

### 2. Create Vault's ATA (One-time setup)

```js
await getOrCreateAssociatedTokenAccount(
  connection,
  admin, // payer
  tokenMint,
  vaultPda,
  true, // allowOwnerOffCurve
);
```

### 3. User Buy Ticket

```js
await program.methods
  .buyTicket(new anchor.BN(amount))
  .accounts({
    vault: vaultPda,
    userTicket: userTicketPda,
    userToken: userTokenAccount,
    vaultToken: vaultTokenAccount.address,
    user: user.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([user])
  .rpc();
```

### 4. Admin Finalize Game

```js
await program.methods
  .finalizeGame(rewards) // rewards: [{user, amount}, ...]
  .accounts({
    vault: vaultPda,
    rewardMap: rewardMapPda,
    authority: admin.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([admin])
  .rpc();
```

### 5. User Claim Reward

```js
await program.methods
  .claimReward()
  .accounts({
    vault: vaultPda,
    userTicket: userTicketPda,
    rewardMap: rewardMapPda,
    vaultToken: vaultTokenAccount.address,
    userToken: userTokenAccount,
    vaultSigner: vaultPda, // vault_signer is the same as vault PDA
    user: user.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([user])
  .rpc();
```

### 6. Admin Withdraw

```js
await program.methods
  .adminWithdraw(new anchor.BN(amount))
  .accounts({
    vault: vaultPda,
    vaultToken: vaultTokenAccount.address,
    adminToken: adminTokenAccount,
    vaultSigner: vaultPda, // vault_signer is the same as vault PDA
    authority: admin.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([admin])
  .rpc();
```

### 7. Change Vault Token (Before Settlement)

```js
await program.methods
  .changeTokenMint(newTokenMint)
  .accounts({
    vault: vaultPda,
    authority: admin.publicKey,
  })
  .signers([admin])
  .rpc();
```

## Common Issues & Solutions

### TokenOwnerOffCurveError

- **Cause**: PDA is not on-curve, but `allowOwnerOffCurve: true` was not used
- **Solution**: Always use `allowOwnerOffCurve: true` when creating ATA for PDA

### AccountNotInitialized Error

- **Cause**: Vault's ATA was not created before using
- **Solution**: Create vault's ATA immediately after vault initialization

### Cross-program Invocation Error

- **Cause**: Incorrect vault_signer or missing PDA seeds
- **Solution**: Ensure vault_signer is the same as vault PDA address

## Important Notes

- Each gameId has its own independent vault PDA and ATA
- Only the authority (admin) can finalize games, withdraw funds, and change tokens
- The vault_signer parameter should be the same as the vault PDA address
- All amounts should be passed as `anchor.BN` instances
- The contract uses `invoke_signed` internally for PDA-based transfers

## Testing

```bash
# Install dependencies
npm install

# Build contract
anchor build

# Run tests
anchor test
```

---

For more questions, please open an issue or contact the developer!
