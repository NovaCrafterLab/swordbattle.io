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

## Game Discovery

The SDK provides comprehensive game discovery capabilities to find and analyze all games on the blockchain.

### Get All Game IDs

```typescript
// Get all game IDs
const allGameIds = await vaultSDK.getAllGameIds();
console.log('All game IDs:', allGameIds); // ['1', '2', '3', ...]
```

### Get All Games with Details

```typescript
// Get all games with detailed information
const allGames = await vaultSDK.getAllGames();
console.log('Total games:', allGames.length);

allGames.forEach(game => {
  console.log(`Game ${game.gameId}:`, {
    vault: game.vault.toString(),
    authority: game.authority.toString(),
    totalDeposit: game.totalDeposit,
    finalized: game.finalized,
    withdrawEnabled: game.withdrawEnabled,
    tokenMint: game.tokenMint.toString()
  });
});
```

### Filter Games

```typescript
// Get games with custom filters
const filteredGames = await vaultSDK.getAllGames({
  limit: 10, // Limit to 10 games
  finalized: false, // Only active games
  authority: adminPublicKey, // Only games by specific authority
  tokenMint: tokenMintPublicKey // Only games with specific token
});
```

### Get Games by Category

```typescript
// Get active (non-finalized) games
const activeGames = await vaultSDK.getActiveGames();

// Get finalized games
const finalizedGames = await vaultSDK.getFinalizedGames();

// Get games with withdraw enabled
const withdrawEnabledGames = await vaultSDK.getGamesWithWithdrawEnabled();

// Get games by specific authority
const authorityGames = await vaultSDK.getGamesByAuthority(authorityPublicKey);

// Get games by specific token mint
const tokenGames = await vaultSDK.getGamesByTokenMint(tokenMintPublicKey);
```

### Game Statistics

```typescript
// Get game statistics
const stats = await vaultSDK.getGameStats();
console.log('Game Statistics:', {
  total: stats.total,
  active: stats.active,
  finalized: stats.finalized,
  withWithdrawEnabled: stats.withWithdrawEnabled
});
```

### Game ID Management

```typescript
// Get the latest game ID
const latestGameId = await vaultSDK.getLatestGameId();
console.log('Latest game ID:', latestGameId);

// Get the next available game ID
const nextGameId = await vaultSDK.getNextGameId();
console.log('Next available game ID:', nextGameId);

// Check if a game exists
const exists = await vaultSDK.gameExists(12345);
console.log('Game 12345 exists:', exists);
```

### Game Discovery Example

```typescript
async function analyzeGames() {
  console.log('🎮 Analyzing all games...');

  // Get all games
  const allGames = await vaultSDK.getAllGames();
  
  // Group by status
  const activeGames = allGames.filter(g => !g.finalized);
  const finalizedGames = allGames.filter(g => g.finalized);
  
  // Group by authority
  const authorityMap = new Map();
  allGames.forEach(game => {
    const authority = game.authority.toString();
    if (!authorityMap.has(authority)) {
      authorityMap.set(authority, []);
    }
    authorityMap.get(authority).push(game);
  });

  console.log(`📊 Analysis Results:`);
  console.log(`  Total games: ${allGames.length}`);
  console.log(`  Active games: ${activeGames.length}`);
  console.log(`  Finalized games: ${finalizedGames.length}`);
  console.log(`  Unique authorities: ${authorityMap.size}`);

  // Show top authorities
  const topAuthorities = Array.from(authorityMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  console.log(`👑 Top authorities:`);
  topAuthorities.forEach(([authority, games], index) => {
    console.log(`  ${index + 1}. ${authority}: ${games.length} games`);
  });
}
```

## Event Listening and Querying

The SDK provides comprehensive event listening and querying capabilities for real-time updates and historical data analysis.

### Real-time Event Listening

```typescript
// Listen to all events
const allEventsSubscription = vaultSDK.onAllEvents((event, slot) => {
  console.log('Event received:', event, 'at slot:', slot);
});

// Listen to specific event types
const ticketSubscription = vaultSDK.onTicketPurchased((event, slot) => {
  console.log('Ticket purchased:', {
    gameId: event.gameId,
    user: event.user.toString(),
    amount: event.amount,
    totalDeposit: event.totalDeposit
  });
});

const rewardSubscription = vaultSDK.onRewardClaimed((event, slot) => {
  console.log('Reward claimed:', {
    gameId: event.gameId,
    user: event.user.toString(),
    rewardAmount: event.rewardAmount
  });
});

const finalizeSubscription = vaultSDK.onGameFinalized((event, slot) => {
  console.log('Game finalized:', {
    gameId: event.gameId,
    totalDeposit: event.totalDeposit,
    rewardCount: event.rewardCount
  });
});

const adminWithdrawSubscription = vaultSDK.onAdminWithdrawn((event, slot) => {
  console.log('Admin withdrawn:', {
    gameId: event.gameId,
    authority: event.authority.toString(),
    amount: event.amount
  });
});

const tokenMintSubscription = vaultSDK.onTokenMintChanged((event, slot) => {
  console.log('Token mint changed:', {
    gameId: event.gameId,
    oldMint: event.oldMint.toString(),
    newMint: event.newMint.toString()
  });
});

// Don't forget to unsubscribe when done
allEventsSubscription.unsubscribe();
ticketSubscription.unsubscribe();
rewardSubscription.unsubscribe();
finalizeSubscription.unsubscribe();
adminWithdrawSubscription.unsubscribe();
tokenMintSubscription.unsubscribe();
```

### Historical Event Querying

```typescript
// Get all recent events (last 1000 transactions)
const recentEvents = await vaultSDK.getRecentEvents();

// Get events for a specific game
const gameEvents = await vaultSDK.getGameEvents(12345);

// Get events for a specific user
const userEvents = await vaultSDK.getUserEvents(userPublicKey);

// Get events from a specific authority
const authorityEvents = await vaultSDK.getAuthorityEvents(authorityPublicKey);

// Get events with custom filters
const filteredEvents = await vaultSDK.getEvents({
  gameId: 12345,
  user: userPublicKey,
  fromSlot: 1000000,
  toSlot: 2000000
});
```

### Event Types

```typescript
interface GameVaultInitializedEvent {
  gameId: string;
  authority: PublicKey;
  tokenMint: PublicKey;
  vault: PublicKey;
}

interface TicketPurchasedEvent {
  gameId: string;
  user: PublicKey;
  amount: string;
  totalDeposit: string;
  userTicket: PublicKey;
}

interface RewardClaimedEvent {
  gameId: string;
  user: PublicKey;
  rewardAmount: string;
  userTicket: PublicKey;
}

interface GameFinalizedEvent {
  gameId: string;
  authority: PublicKey;
  totalDeposit: string;
  rewardCount: string;
  rewardMap: PublicKey;
}

interface AdminWithdrawnEvent {
  gameId: string;
  authority: PublicKey;
  amount: string;
  adminToken: PublicKey;
}

interface TokenMintChangedEvent {
  gameId: string;
  authority: PublicKey;
  oldMint: PublicKey;
  newMint: PublicKey;
}
```

### Event Monitoring Example

```typescript
async function monitorGameEvents(gameId: number) {
  console.log(`🎮 开始监控游戏 ${gameId} 的事件...`);

  // 监听购票事件
  const ticketSubscription = vaultSDK.onTicketPurchased((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(`🎫 新购票: 用户 ${event.user.toString()} 购买了 ${event.amount} 代币`);
    }
  });

  // 监听游戏结束事件
  const finalizeSubscription = vaultSDK.onGameFinalized((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(`🏁 游戏结束: 总存款 ${event.totalDeposit}, 奖励数量 ${event.rewardCount}`);
    }
  });

  // 监听奖励领取事件
  const rewardSubscription = vaultSDK.onRewardClaimed((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(`🏆 奖励领取: 用户 ${event.user.toString()} 领取了 ${event.rewardAmount} 代币`);
    }
  });

  // 返回取消订阅函数
  return () => {
    ticketSubscription.unsubscribe();
    finalizeSubscription.unsubscribe();
    rewardSubscription.unsubscribe();
  };
}

// 使用示例
const stopMonitoring = await monitorGameEvents(12345);

// 停止监控
setTimeout(() => {
  stopMonitoring();
  console.log('🛑 停止监控');
}, 60000); // 监控1分钟
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

// Event-related types
interface EventFilter {
  gameId?: number;
  user?: PublicKey;
  authority?: PublicKey;
  fromSlot?: number;
  toSlot?: number;
}

interface EventSubscription {
  unsubscribe: () => void;
}

// Game discovery types
interface GameInfo {
  gameId: string;
  vault: PublicKey;
  authority: PublicKey;
  totalDeposit: string;
  finalized: boolean;
  withdrawEnabled: boolean;
  tokenMint: PublicKey;
  createdAt?: number;
}

interface GameDiscoveryOptions {
  limit?: number;
  authority?: PublicKey;
  finalized?: boolean;
  withdrawEnabled?: boolean;
  tokenMint?: PublicKey;
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