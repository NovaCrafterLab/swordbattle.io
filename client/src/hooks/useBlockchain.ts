import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getGameAggregatorContract, getSwordBattleContract, getUSD1TokenContract } from '../config/walletConfig';

// 游戏相关数据类型
export interface GameInfo {
  gameId: number;
  isActive: boolean;
  playerCount: number;
  entryFee: bigint;
  totalPrize: bigint;
  endTime: number;
  players: string[];
}

export interface PlayerData {
  address: string;
  score: number;
  hasJoined: boolean;
  hasClaimed: boolean;
  reward: bigint;
  nonce: number;
}

/**
 * 区块链交互主hook
 */
export const useBlockchain = () => {
  const gameAggregatorContract = getGameAggregatorContract();
  const swordBattleContract = getSwordBattleContract();
  const usd1TokenContract = getUSD1TokenContract();

  // 写入合约hook
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // ============ 读取方法 ============

  /**
   * 获取当前游戏计数器
   */
  const useGameCounter = () => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'gameCounter',
      query: {
        enabled: true,
        refetchInterval: 3000, // 每3秒自动刷新
      },
    });
  };

  /**
   * 获取入场费（支持级别参数）- 使用 GameAggregator
   */
  const useEntryFee = (level?: number) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: level !== undefined ? 'levelConfigs' : 'entryFee',
      args: level !== undefined ? [level] : [],
      query: {
        enabled: true,
        select: (data: any) => {
          // 如果是levelConfigs调用，返回entryFee字段
          if (level !== undefined && Array.isArray(data)) {
            return data[0]; // entryFee是第一个字段
          }
          return data;
        },
      },
    });
  };

  /**
   * 获取级别配置 - 使用 GameAggregator
   */
  const useLevelConfig = (level: number) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'levelConfigs',
      args: [level],
      query: {
        enabled: level >= 0 && level <= 2, // 只支持 0=LOW, 1=MEDIUM, 2=HIGH
        select: (data: any) => {
          if (Array.isArray(data)) {
            return {
              entryFee: data[0],
              killReward: data[1], 
              active: data[2],
            };
          }
          return data;
        },
      },
    });
  };

  /**
   * 获取游戏信息 (使用 GameAggregator)
   */
  const useGameInfo = (gameId: number) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getGameFullInfo',
      args: [BigInt(gameId)],
      query: {
        enabled: gameId >= 0,
      },
    });
  };

  /**
   * 获取游戏玩家列表 (使用 GameAggregator)
   */
  const useGamePlayers = (gameId: number) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getGamePlayers',
      args: [BigInt(gameId)],
      query: {
        enabled: gameId >= 0,
      },
    });
  };

  /**
   * 获取玩家nonce
   */
  const usePlayerNonce = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'playerNonces',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取玩家分数
   */
  const usePlayerScore = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPlayerInfo',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
        select: (data: any) => {
          // 新合约getPlayerInfo返回: [playerAddr, kills, score, submitted, fragmentReward]
          // score在索引2位置
          return Array.isArray(data) ? data[2] : 0;
        },
      },
    });
  };

  /**
   * 获取玩家奖励信息（新合约）
   */
  const usePlayerRewards = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPlayerRewards',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
        select: (data: any) => {
          // getPlayerRewards返回: [killReward, lotteryReward, guaranteedReward, fragmentReward, claimableTime, canClaim]
          if (Array.isArray(data)) {
            return {
              killReward: data[0],
              lotteryReward: data[1],
              guaranteedReward: data[2],
              fragmentReward: data[3],
              claimableTime: data[4],
              canClaim: data[5],
            };
          }
          return null;
        },
      },
    });
  };

  /**
   * 获取玩家基本信息（新合约）
   */
  const usePlayerInfo = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPlayerInfo',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
        select: (data: any) => {
          // getPlayerInfo返回: [playerAddr, kills, score, submitted, fragmentReward]
          if (Array.isArray(data)) {
            return {
              playerAddr: data[0],
              kills: data[1],
              score: data[2],
              submitted: data[3],
              fragmentReward: data[4],
            };
          }
          return null;
        },
      },
    });
  };

  /**
   * 检查玩家是否可以领取奖励（使用新的getPlayerRewards函数）
   */
  const useCanClaimReward = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPlayerRewards',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: gameId >= 0 && !!playerAddress,
        select: (data: any) => {
          // getPlayerRewards返回: [killReward, lotteryReward, guaranteedReward, fragmentReward, claimableTime, canClaim]
          // canClaim在索引5位置
          return Array.isArray(data) ? data[5] : false;
        },
      },
    });
  };

  // ============ 碎片系统相关 ============

  /**
   * 获取玩家碎片余额
   */
  const useFragmentBalance = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getFragmentBalance',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取碎片价格
   */
  const useFragmentPrice = () => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getFragmentPrice',
      query: {
        enabled: true,
      },
    });
  };

  /**
   * 计算购买碎片的成本
   */
  const useFragmentCost = (amount: number) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'calculateFragmentCost',
      args: [BigInt(amount)],
      query: {
        enabled: amount > 0,
      },
    });
  };

  /**
   * 获取玩家碎片详细信息
   */
  const usePlayerFragmentInfo = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPlayerFragmentInfo',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
        select: (data: any) => {
          // getPlayerFragmentInfo返回: [balance, totalEarned, totalUsed, totalPurchased]
          if (Array.isArray(data)) {
            return {
              balance: data[0],
              totalEarned: data[1],
              totalUsed: data[2],
              totalPurchased: data[3],
            };
          }
          return null;
        },
      },
    });
  };

  /**
   * 获取玩家奖励冷却状态
   */
  const useCooldownStatus = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getCooldownStatus',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
        select: (data: any) => {
          // getCooldownStatus返回: [lastClaimTime, nextClaimTime, canClaim]
          if (Array.isArray(data)) {
            return {
              lastClaimTime: data[0],
              nextClaimTime: data[1],
              canClaim: data[2],
            };
          }
          return null;
        },
      },
    });
  };

  /**
   * 获取待领取奖励
   */
  const usePendingRewards = (playerAddress: string) => {
    return useReadContract({
      ...swordBattleContract,
      functionName: 'getPendingRewards',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
        select: (data: any) => {
          // getPendingRewards返回: [pendingGames, totalClaimed, nextClaimTime, canClaimNow]
          if (Array.isArray(data)) {
            return {
              pendingGames: data[0],
              totalClaimed: data[1],
              nextClaimTime: data[2],
              canClaimNow: data[3],
            };
          }
          return null;
        },
      },
    });
  };

  // ============ USD1代币相关 ============

  /**
   * 获取USD1代币余额
   */
  const useUSD1Balance = (address: string) => {
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      query: {
        enabled: !!address,
      },
    });
  };

  /**
   * 获取USD1代币授权额度
   */
  const useUSD1Allowance = (owner: string, spender: string) => {
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: {
        enabled: !!owner && !!spender,
      },
    });
  };

  // ============ 写入方法 ============

  /**
   * 授权USD1代币 - 授权给SwordBattle合约，因为实际转账在SwordBattle中执行
   */
  const approveUSD1 = (amount: bigint) => {
    writeContract({
      ...usd1TokenContract,
      functionName: 'approve',
      args: [swordBattleContract.address, amount],
    });
  };

  /**
   * 加入游戏 (使用 GameAggregator)
   */
  const joinGame = (gameId: number) => {
    writeContract({
      ...gameAggregatorContract,
      functionName: 'joinGame',
      args: [BigInt(gameId)],
    });
  };

  /**
   * 领取单个游戏奖励
   */
  const claimReward = (gameId: number) => {
    writeContract({
      ...swordBattleContract,
      functionName: 'claimReward',
      args: [BigInt(gameId)],
    });
  };

  /**
   * 领取所有奖励
   */
  const claimAllRewards = () => {
    writeContract({
      ...swordBattleContract,
      functionName: 'claimAllRewards',
      args: [],
    });
  };

  /**
   * 分页领取奖励
   */
  const claimRewardsPaginated = (startGameId: number, endGameId: number) => {
    writeContract({
      ...swordBattleContract,
      functionName: 'claimRewardsPaginated',
      args: [BigInt(startGameId), BigInt(endGameId)],
    });
  };

  /**
   * 购买碎片
   */
  const purchaseFragments = (amount: number) => {
    writeContract({
      ...swordBattleContract,
      functionName: 'purchaseFragments',
      args: [BigInt(amount)],
    });
  };

  return {
    // 读取hooks
    useGameCounter,
    useEntryFee,
    useLevelConfig,
    useGameInfo,
    useGamePlayers,
    usePlayerNonce,
    usePlayerScore,
    usePlayerInfo,
    usePlayerRewards,
    useCanClaimReward,
    useFragmentBalance,
    useFragmentPrice,
    useFragmentCost,
    usePlayerFragmentInfo,
    useCooldownStatus,
    usePendingRewards,
    useUSD1Balance,
    useUSD1Allowance,

    // 写入方法
    approveUSD1,
    joinGame,
    claimReward,
    claimAllRewards,
    claimRewardsPaginated,
    purchaseFragments,

    // 交易状态
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    writeData,
  };
}; 