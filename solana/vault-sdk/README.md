# Vault SDK

JavaScript SDK for the Game Vault Solana smart contract.

## Installation

```bash
npm install vault-sdk
```

## Dependencies

```json
{
  "@coral-xyz/anchor": "^0.28.0",
  "@solana/web3.js": "^1.87.0",
  "@solana/spl-token": "^0.3.9"
}
```

## Quick Start

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VaultSDK } from 'vault-sdk';

// Setup connection and wallet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const wallet = Keypair.generate(); // In real app, this would be user's wallet

// Program ID from your deployed contract
const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');

// Initialize SDK
const vaultSDK = new VaultSDK({
  programId,
  connection,
  wallet
});
```

## API Reference

### Initialize Game Vault

Initialize a new game vault with a specific game ID and token mint.

```typescript
const tx = await vaultSDK.initializeGameVault({
  gameId: 12345,
  tokenMint: new PublicKey('your-token-mint-address')
});
```

### Buy Ticket

Purchase a ticket for a game.

```typescript
const tx = await vaultSDK.buyTicket({
  gameId: 12345,
  amount: 100000000, // 100 tokens (assuming 9 decimals)
  userTokenAccount: new PublicKey('user-token-account-address')
});
```

### Claim Reward

Claim rewards for a user after game finalization.

```typescript
const tx = await vaultSDK.claimReward({
  gameId: 12345,
  userTokenAccount: new PublicKey('user-token-account-address')
});
```

### Finalize Game

Finalize a game and set rewards for players.

```typescript
const tx = await vaultSDK.finalizeGame({
  gameId: 12345,
  rewards: [
    {
      user: new PublicKey('user-public-key'),
      amount: '50000000' // 50 tokens
    }
  ]
});
```

### Admin Withdraw

Admin can withdraw funds from the vault.

```typescript
const tx = await vaultSDK.adminWithdraw({
  gameId: 12345,
  amount: 50000000, // 50 tokens
  adminTokenAccount: new PublicKey('admin-token-account-address')
});
```

### Change Token Mint

Change the token mint for a vault (admin only).

```typescript
const tx = await vaultSDK.changeTokenMint({
  gameId: 12345,
  newMint: new PublicKey('new-token-mint-address')
});
```

### Get Account Data

```typescript
// Get vault account info
const vaultAccount = await vaultSDK.getVaultAccount(12345);

// Get user ticket info
const userTicket = await vaultSDK.getUserTicketAccount(12345, userPublicKey);

// Get reward map info
const rewardMap = await vaultSDK.getRewardMapAccount(12345);

// Get all vault info including PDAs
const vaultInfo = vaultSDK.getVaultInfo(12345);
```

## Complete Example

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VaultSDK } from 'vault-sdk';
import { getAssociatedTokenAddress, createMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token';

async function completeGameFlow() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
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
```

## Important Notes

1. **Vault Token Account**: The SDK automatically creates the vault's associated token account (ATA) with `allowOwnerOffCurve: true` after vault initialization, as the vault PDA is off-curve.

2. **PDA Calculation**: All PDAs are calculated consistently with the on-chain program using the same seeds.

3. **Token Amounts**: All token amounts should be provided in the smallest unit (e.g., lamports for SOL, or the smallest unit for your token based on decimals).

4. **Error Handling**: Always wrap SDK calls in try-catch blocks to handle potential errors gracefully.

5. **Network**: Make sure to use the correct network (devnet, testnet, or mainnet) for your deployment.

## Types

The SDK provides TypeScript types for all parameters and return values:

```typescript
interface VaultConfig {
  programId: PublicKey;
  connection: any;
  wallet: any;
}

interface GameVault {
  gameId: string;
  authority: PublicKey;
  totalDeposit: string;
  finalized: boolean;
  withdrawEnabled: boolean;
  tokenMint: PublicKey;
}

interface UserTicket {
  gameId: string;
  user: PublicKey;
  amount: string;
  hasWithdrawn: boolean;
}

interface RewardMap {
  gameId: string;
  rewards: RewardEntry[];
}

interface RewardEntry {
  user: PublicKey;
  amount: string;
}
```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## License

MIT 