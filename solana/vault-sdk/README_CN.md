# Vault SDK

游戏金库 Solana 智能合约的 JavaScript SDK。

## 安装

```bash
npm install vault-sdk
```

## 依赖

```json
{
  "@coral-xyz/anchor": "^0.28.0",
  "@solana/web3.js": "^1.87.0",
  "@solana/spl-token": "^0.3.9"
}
```

## 快速开始

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VaultSDK } from 'vault-sdk';

// 设置连接和钱包
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const wallet = Keypair.generate(); // 实际应用中，这应该是用户的钱包

// 部署合约的程序ID
const programId = new PublicKey('AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV');

// 初始化SDK
const vaultSDK = new VaultSDK({
  programId,
  connection,
  wallet,
});
```

## API 参考

### 初始化游戏金库

使用特定的游戏ID和代币铸造地址初始化新的游戏金库。

```typescript
const tx = await vaultSDK.initializeGameVault({
  gameId: 12345,
  tokenMint: new PublicKey('your-token-mint-address'),
});
```

### 购买门票

为游戏购买门票。

```typescript
const tx = await vaultSDK.buyTicket({
  gameId: 12345,
  amount: 100000000, // 100 代币 (假设9位小数)
  userTokenAccount: new PublicKey('user-token-account-address'),
});
```

### 领取奖励

游戏结束后为用户领取奖励。

```typescript
const tx = await vaultSDK.claimReward({
  gameId: 12345,
  userTokenAccount: new PublicKey('user-token-account-address'),
});
```

### 结束游戏

结束游戏并为玩家设置奖励。

```typescript
const tx = await vaultSDK.finalizeGame({
  gameId: 12345,
  rewards: [
    {
      user: new PublicKey('user-public-key'),
      amount: '50000000', // 50 代币
    },
  ],
});
```

### 管理员提款

管理员可以从金库中提取资金。

```typescript
const tx = await vaultSDK.adminWithdraw({
  gameId: 12345,
  amount: 50000000, // 50 代币
  adminTokenAccount: new PublicKey('admin-token-account-address'),
});
```

### 更改代币铸造

更改金库的代币铸造地址（仅管理员）。

```typescript
const tx = await vaultSDK.changeTokenMint({
  gameId: 12345,
  newMint: new PublicKey('new-token-mint-address'),
});
```

### 获取账户数据

```typescript
// 获取金库账户信息
const vaultAccount = await vaultSDK.getVaultAccount(12345);

// 获取用户门票信息
const userTicket = await vaultSDK.getUserTicketAccount(12345, userPublicKey);

// 获取奖励映射信息
const rewardMap = await vaultSDK.getRewardMapAccount(12345);

// 获取所有金库信息，包括PDAs
const vaultInfo = vaultSDK.getVaultInfo(12345);
```

## 游戏发现

SDK提供了全面的游戏发现功能，可以查找和分析区块链上的所有游戏。

### 获取所有游戏ID

```typescript
// 获取所有游戏ID
const allGameIds = await vaultSDK.getAllGameIds();
console.log('所有游戏ID:', allGameIds); // ['1', '2', '3', ...]
```

### 获取所有游戏详细信息

```typescript
// 获取所有游戏的详细信息
const allGames = await vaultSDK.getAllGames();
console.log('总游戏数:', allGames.length);

allGames.forEach((game) => {
  console.log(`游戏 ${game.gameId}:`, {
    vault: game.vault.toString(),
    authority: game.authority.toString(),
    totalDeposit: game.totalDeposit,
    finalized: game.finalized,
    withdrawEnabled: game.withdrawEnabled,
    tokenMint: game.tokenMint.toString(),
  });
});
```

### 筛选游戏

```typescript
// 使用自定义过滤器获取游戏
const filteredGames = await vaultSDK.getAllGames({
  limit: 10, // 限制10个游戏
  finalized: false, // 只要活跃游戏
  authority: adminPublicKey, // 只要特定管理员的游戏
  tokenMint: tokenMintPublicKey, // 只要特定代币的游戏
});
```

### 按类别获取游戏

```typescript
// 获取活跃（未结束）游戏
const activeGames = await vaultSDK.getActiveGames();

// 获取已结束游戏
const finalizedGames = await vaultSDK.getFinalizedGames();

// 获取可提款游戏
const withdrawEnabledGames = await vaultSDK.getGamesWithWithdrawEnabled();

// 获取特定管理员的游戏
const authorityGames = await vaultSDK.getGamesByAuthority(authorityPublicKey);

// 获取特定代币的游戏
const tokenGames = await vaultSDK.getGamesByTokenMint(tokenMintPublicKey);
```

### 游戏统计

```typescript
// 获取游戏统计信息
const stats = await vaultSDK.getGameStats();
console.log('游戏统计:', {
  total: stats.total,
  active: stats.active,
  finalized: stats.finalized,
  withWithdrawEnabled: stats.withWithdrawEnabled,
});
```

### 游戏ID管理

```typescript
// 获取最新游戏ID
const latestGameId = await vaultSDK.getLatestGameId();
console.log('最新游戏ID:', latestGameId);

// 获取下一个可用游戏ID
const nextGameId = await vaultSDK.getNextGameId();
console.log('下一个可用游戏ID:', nextGameId);

// 检查游戏是否存在
const exists = await vaultSDK.gameExists(12345);
console.log('游戏12345存在:', exists);
```

### 游戏发现示例

```typescript
async function analyzeGames() {
  console.log('🎮 分析所有游戏...');

  // 获取所有游戏
  const allGames = await vaultSDK.getAllGames();

  // 按状态分组
  const activeGames = allGames.filter((g) => !g.finalized);
  const finalizedGames = allGames.filter((g) => g.finalized);

  // 按管理员分组
  const authorityMap = new Map();
  allGames.forEach((game) => {
    const authority = game.authority.toString();
    if (!authorityMap.has(authority)) {
      authorityMap.set(authority, []);
    }
    authorityMap.get(authority).push(game);
  });

  console.log(`📊 分析结果:`);
  console.log(`  总游戏数: ${allGames.length}`);
  console.log(`  活跃游戏: ${activeGames.length}`);
  console.log(`  已结束游戏: ${finalizedGames.length}`);
  console.log(`  唯一管理员数: ${authorityMap.size}`);

  // 显示顶级管理员
  const topAuthorities = Array.from(authorityMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  console.log(`👑 顶级管理员:`);
  topAuthorities.forEach(([authority, games], index) => {
    console.log(`  ${index + 1}. ${authority}: ${games.length} 个游戏`);
  });
}
```

## 事件监听和查询

SDK提供了全面的实时事件监听和历史数据查询功能。

### 实时事件监听

```typescript
// 监听所有事件
const allEventsSubscription = vaultSDK.onAllEvents((event, slot) => {
  console.log('收到事件:', event, '在槽位:', slot);
});

// 监听特定事件类型
const ticketSubscription = vaultSDK.onTicketPurchased((event, slot) => {
  console.log('门票购买:', {
    gameId: event.gameId,
    user: event.user.toString(),
    amount: event.amount,
    totalDeposit: event.totalDeposit,
  });
});

const rewardSubscription = vaultSDK.onRewardClaimed((event, slot) => {
  console.log('奖励领取:', {
    gameId: event.gameId,
    user: event.user.toString(),
    rewardAmount: event.rewardAmount,
  });
});

const finalizeSubscription = vaultSDK.onGameFinalized((event, slot) => {
  console.log('游戏结束:', {
    gameId: event.gameId,
    totalDeposit: event.totalDeposit,
    rewardCount: event.rewardCount,
  });
});

const adminWithdrawSubscription = vaultSDK.onAdminWithdrawn((event, slot) => {
  console.log('管理员提款:', {
    gameId: event.gameId,
    authority: event.authority.toString(),
    amount: event.amount,
  });
});

const tokenMintSubscription = vaultSDK.onTokenMintChanged((event, slot) => {
  console.log('代币铸造更改:', {
    gameId: event.gameId,
    oldMint: event.oldMint.toString(),
    newMint: event.newMint.toString(),
  });
});

// 完成后记得取消订阅
allEventsSubscription.unsubscribe();
ticketSubscription.unsubscribe();
rewardSubscription.unsubscribe();
finalizeSubscription.unsubscribe();
adminWithdrawSubscription.unsubscribe();
tokenMintSubscription.unsubscribe();
```

### 历史事件查询

```typescript
// 获取所有最近事件（最近1000笔交易）
const recentEvents = await vaultSDK.getRecentEvents();

// 获取特定游戏的事件
const gameEvents = await vaultSDK.getGameEvents(12345);

// 获取特定用户的事件
const userEvents = await vaultSDK.getUserEvents(userPublicKey);

// 获取特定管理员的事件
const authorityEvents = await vaultSDK.getAuthorityEvents(authorityPublicKey);

// 使用自定义过滤器获取事件
const filteredEvents = await vaultSDK.getEvents({
  gameId: 12345,
  user: userPublicKey,
  fromSlot: 1000000,
  toSlot: 2000000,
});
```

### 事件类型

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

### 事件监控示例

```typescript
async function monitorGameEvents(gameId: number) {
  console.log(`🎮 开始监控游戏 ${gameId} 的事件...`);

  // 监听购票事件
  const ticketSubscription = vaultSDK.onTicketPurchased((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(
        `🎫 新购票: 用户 ${event.user.toString()} 购买了 ${event.amount} 代币`,
      );
    }
  });

  // 监听游戏结束事件
  const finalizeSubscription = vaultSDK.onGameFinalized((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(
        `🏁 游戏结束: 总存款 ${event.totalDeposit}, 奖励数量 ${event.rewardCount}`,
      );
    }
  });

  // 监听奖励领取事件
  const rewardSubscription = vaultSDK.onRewardClaimed((event, slot) => {
    if (event.gameId === gameId.toString()) {
      console.log(
        `🏆 奖励领取: 用户 ${event.user.toString()} 领取了 ${event.rewardAmount} 代币`,
      );
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

## 完整示例

```typescript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { VaultSDK } from 'vault-sdk';
import {
  getAssociatedTokenAddress,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';

async function completeGameFlow() {
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed',
  );
  const admin = Keypair.generate();
  const user = Keypair.generate();
  const programId = new PublicKey(
    'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV',
  );

  // 创建代币铸造
  const tokenMint = await createMint(
    connection,
    admin,
    admin.publicKey,
    null,
    9,
  );

  // 创建代币账户
  const adminTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    admin.publicKey,
  );
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    user.publicKey,
  );

  await createAssociatedTokenAccount(
    connection,
    admin,
    tokenMint,
    admin.publicKey,
  );
  await createAssociatedTokenAccount(
    connection,
    admin,
    tokenMint,
    user.publicKey,
  );

  // 向用户铸造代币
  await mintTo(
    connection,
    admin,
    tokenMint,
    userTokenAccount,
    admin,
    1000000000,
  );

  // 为管理员初始化SDK
  const adminSDK = new VaultSDK({
    programId,
    connection,
    wallet: admin,
  });

  // 为用户初始化SDK
  const userSDK = new VaultSDK({
    programId,
    connection,
    wallet: user,
  });

  const gameId = 12345;

  // 1. 管理员初始化金库
  await adminSDK.initializeGameVault({
    gameId,
    tokenMint,
  });

  // 2. 用户购买门票
  await userSDK.buyTicket({
    gameId,
    amount: 100000000,
    userTokenAccount,
  });

  // 3. 管理员结束游戏并设置奖励
  await adminSDK.finalizeGame({
    gameId,
    rewards: [
      {
        user: user.publicKey,
        amount: '50000000', // 50 代币奖励
      },
    ],
  });

  // 4. 用户领取奖励
  await userSDK.claimReward({
    gameId,
    userTokenAccount,
  });

  // 5. 管理员提取剩余资金
  await adminSDK.adminWithdraw({
    gameId,
    amount: 50000000, // 50 代币
    adminTokenAccount,
  });
}
```

## 重要说明

1. **金库代币账户**: SDK在金库初始化后会自动创建金库的关联代币账户(ATA)，并设置`allowOwnerOffCurve: true`，因为金库PDA是离曲线的。

2. **PDA计算**: 所有PDA都使用与链上程序相同的种子进行一致计算。

3. **代币数量**: 所有代币数量都应该以最小单位提供（例如，SOL的lamports，或基于小数位的代币最小单位）。

4. **错误处理**: 始终将SDK调用包装在try-catch块中以优雅地处理潜在错误。

5. **网络**: 确保为您的部署使用正确的网络（devnet、testnet或mainnet）。

## 类型

SDK为所有参数和返回值提供TypeScript类型：

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

// 事件相关类型
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

// 游戏发现类型
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

## 构建

```bash
npm run build
```

## 测试

```bash
npm test
```

## 许可证

MIT
