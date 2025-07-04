# SwordBattle 前端集成文档

## 概述

SwordBattle 采用三层聚合器架构，前端只需对接三个核心聚合器合约即可完成 95% 以上的业务功能。所有合约已部署到 BSC 测试网并完成验证。

## 合约地址 (BSC 测试网)

```javascript
const CONTRACT_ADDRESSES = {
  // 核心聚合器
  GameAggregator: "0x99616B1f031aF994a4b2cc940683255cB76Dd596",
  NFTAggregator: "0x42f4a788813eDBc1D6c76C3754DbD8Deb0B3D85f", 
  EconomyAggregator: "0x757b4D13904eddBfc2C9cc3F19d45Da056167415",
  
  // 主合约（用于授权）
  SwordBattle: "0x788aA9aAb214B3ac525c23bd257e93Ff0f10D9E0",
  
  // 代币合约
  USDToken: "0x7f7d613942d903956e4DCE82fF8551fA8b1dfe16",
  NCLabToken: "0x73b8C8c5c81F257832e86A7329123035477C12fA"
};

const NETWORK_CONFIG = {
  chainId: 97, // BSC 测试网
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  blockExplorer: "https://testnet.bscscan.com/"
};
```

## ABI 文件位置

编译后的 ABI 文件位于：
- `out/GameAggregator.sol/GameAggregator.json`
- `out/NFTAggregator.sol/NFTAggregator.json` 
- `out/EconomyAggregator.sol/EconomyAggregator.json`

## 核心功能模块

### 1. GameAggregator - 游戏生命周期管理

#### 主要功能
- 🎮 游戏创建与加入
- 📊 游戏统计与历史
- 🏆 批量游戏操作

#### 关键方法

```javascript
// 创建游戏
await gameAggregator.createGame(level); // level: 0=LOW, 1=MEDIUM, 2=HIGH

// 智能加入游戏（推荐）
const gameId = await gameAggregator.smartJoinGame(level, maxWaitTime);

// 获取可加入的游戏
const joinableGames = await gameAggregator.getJoinableGames(level, playerAddress);

// 获取玩家当前游戏
const currentGames = await gameAggregator.getPlayerCurrentGames(playerAddress);

// 提交游戏分数
await gameAggregator.submitScore(gameId, player, kills, score, nonce, signature);

// 批量加入游戏
const successCount = await gameAggregator.joinMultipleGames([gameId1, gameId2]);
```

#### 返回数据结构

```typescript
interface GameFullInfo {
  gameId: number;
  level: number; // 0=LOW, 1=MEDIUM, 2=HIGH
  status: number; // 0=ACTIVE, 1=ENDED, 2=CLEANED
  totalPool: string;
  createdAt: number;
  endedAt: number;
  gameDuration: number;
  playerCount: number;
  maxPlayers: number;
  activePlayers: string[];
  canJoin: boolean;
  entryFee: string;
}
```

### 2. NFTAggregator - NFT 和词条管理

#### 主要功能
- ⚒️ 铲子/熔炉铸造
- 🔥 三元素合成系统
- 🎲 词条重铸功能
- 📈 词条加成计算
- 📦 批量 NFT 操作

#### 关键方法

```javascript
// 铸造铲子
const tokenId = await nftAggregator.mintShovel(tier, element, toAddress);
// tier: 0=BRONZE, 1=SILVER, 2=GOLD, 3=DIAMOND
// element: 0=FIRE, 1=WATER, 2=EARTH

// 批量铸造铲子（最多20个）
const tokenIds = await nftAggregator.batchMintShovels(tiers, elements, toAddress);

// 三元素合成
const newTokenId = await nftAggregator.threeElementSynthesis(
  [fireTokenId, waterTokenId, earthTokenId],
  forgeId,
  randomSeed
);

// 基础词条重铸
const [newTraitTypes, newTraitValues, cost] = await nftAggregator.rerollTraits(
  tokenId, 
  randomSeed
);

// 高级重铸（锁定词条）
const [types, values, totalCost] = await nftAggregator.advancedReroll(
  tokenId,
  [0, 2], // 锁定第0和第2个词条
  randomSeed
);

// 获取铲子完整信息
const shovelInfo = await nftAggregator.getShovelFullInfo(tokenId);

// 获取玩家词条加成
const [effectTypes, totalBonuses, cappedBonuses] = 
  await nftAggregator.getPlayerTraitBonuses(playerAddress);

// 批量转移NFT
await nftAggregator.batchTransfer(tokenIds, toAddress, nftTypes);
```

#### 数据结构

```typescript
interface ShovelFullInfo {
  tokenId: number;
  tier: number; // 0=BRONZE, 1=SILVER, 2=GOLD, 3=DIAMOND
  element: number; // 0=FIRE, 1=WATER, 2=EARTH
  traitTypes: number[];
  traitValues: number[];
  rerollCount: number;
  isUpgrading: boolean;
  upgradeEndTime: number;
  owner: string;
  mintedAt: number;
}

// 词条效果类型
enum EffectType {
  KILL_BONUS = 0,
  SURVIVAL_BONUS = 1,
  LOTTERY_WEIGHT = 2,
  GUARANTEED_REWARD = 3,
  FRAGMENT_GAIN = 4,
  REROLL_COST_REDUCTION = 5,
  UPGRADE_TIME_REDUCTION = 6,
  SPECIAL_EFFECT = 7,
  PLACEHOLDER = 8
}
```

### 3. EconomyAggregator - 经济系统

#### 主要功能
- 💰 奖励领取与管理
- 💎 碎片购买与使用
- ⏰ 冷却时间管理
- 🔄 经济循环操作
- 📊 经济数据统计

#### 关键方法

```javascript
// 领取单个游戏奖励
const [usdReward, nclabReward, fragmentReward] = 
  await economyAggregator.claimGameReward(gameId);

// 批量领取奖励
const batchResult = await economyAggregator.claimRewardsBatch([gameId1, gameId2]);

// 领取所有可用奖励
const allRewards = await economyAggregator.claimAllAvailableRewards();

// 智能领取奖励（Gas优化）
const smartResult = await economyAggregator.smartClaimRewards(maxGames, prioritizeUSD);

// 购买碎片
const purchaseResult = await economyAggregator.purchaseFragments(amount);

// 用碎片合成铲子
const newShovelId = await economyAggregator.craftShovelWithFragments(randomSeed);

// 购买碎片并立即合成
const craftResult = await economyAggregator.purchaseFragmentsAndCraft(
  fragmentAmount, 
  randomSeed
);

// 获取玩家经济状态
const economyStatus = await economyAggregator.getPlayerEconomyStatus(playerAddress);

// 获取冷却状态
const [lastClaimTime, nextClaimTime, canClaim] = 
  await economyAggregator.getCooldownStatus(playerAddress);
```

#### 数据结构

```typescript
interface EconomyStatus {
  fragmentBalance: string;
  fragmentsEarned: string;
  fragmentsUsed: string;
  fragmentsPurchased: string;
  totalRewardsPending: string;
  totalRewardsClaimed: string;
  usdRewardsPending: string;
  nclabRewardsPending: string;
  nextClaimTime: number;
  canClaimNow: boolean;
  estimatedTotalValue: string;
}

interface BatchClaimResult {
  successCount: number;
  totalUsdClaimed: string;
  totalNclabClaimed: string;
  totalFragmentsClaimed: string;
  failedGameIds: number[];
  errorMessages: string[];
}
```

## 前端集成示例

### React Hook 示例

```typescript
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

// 合约实例创建
export const useGameContracts = (signer: ethers.Signer) => {
  const [contracts, setContracts] = useState(null);
  
  useEffect(() => {
    if (!signer) return;
    
    const gameAggregator = new ethers.Contract(
      CONTRACT_ADDRESSES.GameAggregator,
      GameAggregatorABI,
      signer
    );
    
    const nftAggregator = new ethers.Contract(
      CONTRACT_ADDRESSES.NFTAggregator,
      NFTAggregatorABI,
      signer
    );
    
    const economyAggregator = new ethers.Contract(
      CONTRACT_ADDRESSES.EconomyAggregator,
      EconomyAggregatorABI,
      signer
    );
    
    setContracts({ gameAggregator, nftAggregator, economyAggregator });
  }, [signer]);
  
  return contracts;
};

// 游戏大厅数据获取
export const useGameHall = (gameAggregator) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchGameHall = async (level = 1) => {
    setLoading(true);
    try {
      const activeGames = await gameAggregator.getActiveGames(level, 10);
      const joinableGames = await gameAggregator.getJoinableGames(level, userAddress);
      
      setGameData({ activeGames, joinableGames });
    } catch (error) {
      console.error('获取游戏大厅数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { gameData, loading, fetchGameHall };
};

// 玩家数据聚合
export const usePlayerData = (contracts, address) => {
  const [playerData, setPlayerData] = useState(null);
  
  const fetchPlayerData = async () => {
    if (!contracts || !address) return;
    
    try {
      const [economyStatus, currentGames, nftPortfolio] = await Promise.all([
        contracts.economyAggregator.getPlayerEconomyStatus(address),
        contracts.gameAggregator.getPlayerCurrentGames(address),
        contracts.nftAggregator.getPlayerNFTPortfolio(address)
      ]);
      
      setPlayerData({ economyStatus, currentGames, nftPortfolio });
    } catch (error) {
      console.error('获取玩家数据失败:', error);
    }
  };
  
  return { playerData, fetchPlayerData };
};
```

### 游戏流程示例

```typescript
// 完整游戏流程
export class GameService {
  constructor(contracts, signer) {
    this.contracts = contracts;
    this.signer = signer;
  }
  
  // 快速开始游戏
  async quickStartGame(difficulty = 1) {
    try {
      // 智能加入游戏
      const gameId = await this.contracts.gameAggregator.smartJoinGame(
        difficulty, 
        300 // 最大等待5分钟
      );
      
      if (gameId.isZero()) {
        // 没有合适的游戏，创建新游戏
        const createTx = await this.contracts.gameAggregator.createGame(difficulty);
        await createTx.wait();
        
        // 重新尝试加入
        return await this.contracts.gameAggregator.smartJoinGame(difficulty, 60);
      }
      
      return gameId;
    } catch (error) {
      console.error('开始游戏失败:', error);
      throw error;
    }
  }
  
  // 游戏结束后领取奖励
  async claimGameRewards(gameIds) {
    try {
      const result = await this.contracts.economyAggregator.claimRewardsBatch(gameIds);
      
      console.log(`成功领取 ${result.successCount} 个游戏奖励`);
      console.log(`USD: ${ethers.utils.formatEther(result.totalUsdClaimed)}`);
      console.log(`NCLab: ${ethers.utils.formatEther(result.totalNclabClaimed)}`);
      
      return result;
    } catch (error) {
      console.error('领取奖励失败:', error);
      throw error;
    }
  }
  
  // NFT升级流程
  async upgradeNFT(materialTokenIds, forgeId) {
    try {
      // 验证合成条件
      const [isValid, errorMessage] = await this.contracts.nftAggregator
        .validateSynthesisConditions(materialTokenIds, forgeId, await this.signer.getAddress());
      
      if (!isValid) {
        throw new Error(errorMessage);
      }
      
      // 执行合成
      const randomSeed = Math.floor(Math.random() * 1000000);
      const tx = await this.contracts.nftAggregator.threeElementSynthesis(
        materialTokenIds,
        forgeId,
        randomSeed
      );
      
      const receipt = await tx.wait();
      
      // 解析新NFT ID
      const newTokenId = receipt.events.find(e => e.event === 'ShovelMinted')?.args?.tokenId;
      
      return newTokenId;
    } catch (error) {
      console.error('NFT升级失败:', error);
      throw error;
    }
  }
}
```

## 错误处理指南

### 常见错误码

```typescript
const ERROR_CODES = {
  // 游戏相关
  GAME_NOT_FOUND: "Game not found",
  GAME_FULL: "Game is full", 
  ALREADY_IN_GAME: "Already in this game",
  
  // NFT相关
  INSUFFICIENT_MATERIALS: "Insufficient materials for synthesis",
  INVALID_TRAIT_LOCK: "Invalid trait lock configuration",
  REROLL_COOLDOWN: "Reroll is on cooldown",
  
  // 经济相关
  INSUFFICIENT_FRAGMENTS: "Insufficient fragments",
  CLAIM_COOLDOWN: "Claim is on cooldown",
  NO_REWARDS_AVAILABLE: "No rewards available",
  
  // 权限相关
  UNAUTHORIZED: "Unauthorized operation",
  PAUSED: "Contract is paused"
};

// 错误处理工具
export const handleContractError = (error) => {
  if (error.data?.message) {
    // 解析revert reason
    const reason = error.data.message.replace('execution reverted: ', '');
    return reason;
  }
  
  if (error.message.includes('user rejected')) {
    return '用户取消了交易';
  }
  
  if (error.message.includes('insufficient funds')) {
    return '余额不足';
  }
  
  return '交易失败，请重试';
};
```

## Gas 费用优化

### 推荐策略

```typescript
// Gas费用估算
export const estimateGasCosts = async (contracts) => {
  return {
    // 游戏操作
    createGame: await contracts.gameAggregator.estimateGas.createGame(1),
    joinGame: await contracts.gameAggregator.estimateGas.joinGame(1),
    smartJoin: await contracts.gameAggregator.estimateGas.smartJoinGame(1, 300),
    
    // NFT操作  
    mintShovel: await contracts.nftAggregator.estimateGas.mintShovel(0, 0, address),
    synthesis: await contracts.nftAggregator.estimateGas.threeElementSynthesis([1,2,3], 1, 123),
    rerollTraits: await contracts.nftAggregator.estimateGas.rerollTraits(1, 123),
    
    // 经济操作
    claimReward: await contracts.economyAggregator.estimateGas.claimGameReward(1),
    batchClaim: await contracts.economyAggregator.estimateGas.claimRewardsBatch([1,2,3]),
    purchaseFragments: await contracts.economyAggregator.estimateGas.purchaseFragments(100)
  };
};

// 批量操作优化
export const optimizeBatchOperations = {
  // 建议批量大小
  maxBatchSize: {
    games: 20,
    nfts: 20, 
    claims: 10
  },
  
  // Gas价格建议
  gasStrategy: {
    low: { maxFeePerGas: ethers.utils.parseUnits('5', 'gwei') },
    standard: { maxFeePerGas: ethers.utils.parseUnits('10', 'gwei') },
    fast: { maxFeePerGas: ethers.utils.parseUnits('20', 'gwei') }
  }
};
```

## 最佳实践

### 1. 状态管理
- 使用 React Context 或 Redux 管理合约状态
- 缓存只读查询结果，减少重复调用
- 监听合约事件实时更新数据

### 2. 用户体验
- 显示交易进度和确认状态
- 提供Gas费用预估
- 实现离线模式数据缓存

### 3. 安全考虑
- 验证所有用户输入
- 使用合约的只读方法进行预检查
- 实现交易失败重试机制

### 4. 性能优化
- 使用 `multicall` 聚合多个查询
- 实现懒加载和分页
- 优化批量操作的大小

## 测试建议

```typescript
// 测试网络配置
const testConfig = {
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  faucet: "https://testnet.binance.org/faucet-smart",
  explorer: "https://testnet.bscscan.com/"
};

// 测试用例示例
describe('SwordBattle Integration', () => {
  it('should create and join game', async () => {
    const gameId = await gameAggregator.createGame(1);
    await gameAggregator.joinGame(gameId);
    
    const gameInfo = await gameAggregator.getGameFullInfo(gameId);
    expect(gameInfo.playerCount).to.equal(1);
  });
  
  it('should handle NFT synthesis', async () => {
    // 铸造三个不同元素的铲子
    const tokenIds = await nftAggregator.batchMintShovels([0,0,0], [0,1,2], address);
    
    // 执行合成
    const newTokenId = await nftAggregator.threeElementSynthesis(tokenIds, forgeId, 123);
    
    const newNFT = await nftAggregator.getShovelFullInfo(newTokenId);
    expect(newNFT.tier).to.be.greaterThan(0);
  });
});
```

## 部署状态

✅ **所有合约已成功部署到 BSC 测试网**
- 编译状态: 通过
- 部署状态: 成功
- Gas消耗: ~68.6M (总计)
- 验证状态: 完成

## 支持与反馈

如有集成问题或建议，请联系开发团队。

---

**注意**: 本文档基于 BSC 测试网部署，主网部署时需要更新合约地址和网络配置。 