import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getGameAggregatorContract, getUSD1TokenContract } from '../config/walletConfig';

// GameAggregator数据类型定义
export interface GameFullInfo {
  gameId: string;           // 游戏ID
  level: number;            // 游戏等级 (0=EASY, 1=MEDIUM, 2=HARD)
  status: number;           // 游戏状态 (0=WAITING, 1=ACTIVE, 2=ENDED)
  totalPool: string;        // 奖池总额 (wei)
  createdAt: string;        // 创建时间戳
  endedAt: string;          // 结束时间戳
  gameDuration: number;     // 游戏持续时间 (秒)
  playerCount: string;      // 玩家数量
  maxPlayers: string;       // 最大玩家数
  activePlayers: string[];  // 活跃玩家地址列表
  canJoin: boolean;         // 是否可加入
  entryFee: string;         // 入场费 (wei)
}

export interface PlayerCompleteRewards {
  usdRewards: string;        // 🟡 USD1 奖励数量 (wei)
  nclabRewards: string;      // 🔵 NCLab 奖励数量 (wei)
  fragmentBalance: string;   // 🟠 碎片余额
  usdClaimable: boolean;     // USD1 是否可领取
  nclabClaimable: boolean;   // NCLab 是否可领取
  nclabClaimableTime: string; // NCLab 可领取时间戳
  usdClaimed: boolean;       // USD1 是否已领取
  nclabClaimed: boolean;     // NCLab 是否已领取
}

export interface PlayerDashboard {
  // 游戏统计
  totalGamesPlayed: string;    // 总游戏局数
  totalKills: string;          // 总击杀数
  totalScore: string;          // 总分数
  winRate: string;             // 胜率 (百分比 * 100)
  
  // 奖励统计
  totalUsdEarned: string;      // 🟡 总 USD1 收益 (wei)
  totalNclabEarned: string;    // 🔵 总 NCLab 收益 (wei)
  totalFragmentsEarned: string; // 🟠 总碎片收益
  
  // 待领取奖励
  pendingUsdRewards: string;   // 🟡 待领取 USD1 (wei)
  pendingNclabRewards: string; // 🔵 待领取 NCLab (wei)
  fragmentBalance: string;     // 🟠 当前碎片余额
  
  // 当前状态
  currentGameCount: string;    // 当前参与游戏数量
  hasClaimableRewards: boolean; // 是否有可领取奖励
}

export interface PlayerStats {
  totalGamesPlayed: string;    // 总游戏数
  totalKills: string;          // 总击杀数
  totalScore: string;          // 总分数
  avgScorePerGame: string;     // 平均每局分数
  winRate: string;             // 胜率
}

export interface GameStats {
  totalGames: string;          // 总游戏数
  totalPlayers: string;        // 总玩家数
  totalPool: string;           // 总奖池
  avgPlayersPerGame: string;   // 平均每局玩家数
}

export interface ClaimableGames {
  gameIds: string[];           // 可领取奖励的游戏ID列表
  rewardAmounts: string[];     // 每个游戏的奖励总额 (wei)
  claimableTypes: number[];    // 奖励类型位掩码 (1=USD, 2=NCLab, 3=Both)
}

// 领取类型枚举
export enum ClaimType {
  ALL = 0,        // 领取所有类型 (USD1 + NCLab)
  USD_ONLY = 1,   // 仅领取 USD1
  NCLAB_ONLY = 2  // 仅领取 NCLab
}

/**
 * GameAggregator区块链交互主hook
 */
export const useBlockchain = () => {
  const gameAggregatorContract = getGameAggregatorContract();

  // 写入合约hook
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // ============ 读取方法 ============

  /**
   * 获取当前游戏ID (使用 GameAggregator 的 getCurrentGameId)
   */
  const useGameCounter = () => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getCurrentGameId',
      query: {
        enabled: true,
        refetchInterval: 3000, // 每3秒自动刷新
      },
    });
  };

  /**
   * 获取游戏完整信息 (使用 GameAggregator)
   */
  const useGameFullInfo = (gameId: number) => {
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
   * 获取活跃游戏列表 (使用 GameAggregator)
   */
  const useActiveGames = (level: number = 0, limit: number = 10) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getActiveGames',
      args: [level, BigInt(limit)],
      query: {
        enabled: true,
      },
    });
  };

  /**
   * 获取玩家当前游戏 (使用 GameAggregator)
   */
  const usePlayerCurrentGames = (playerAddress: string) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerCurrentGames',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取游戏统计信息 (使用 GameAggregator)
   */
  const useGameStats = (startTime: number, endTime: number) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getGameStats',
      args: [BigInt(startTime), BigInt(endTime)],
      query: {
        enabled: startTime > 0 && endTime > startTime,
      },
    });
  };

  /**
   * 获取玩家统计信息 (使用 GameAggregator)
   */
  const usePlayerStats = (playerAddress: string) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerStats',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取玩家完整奖励信息 (使用 GameAggregator)
   */
  const usePlayerCompleteRewards = (gameId: number, playerAddress: string) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerCompleteRewards',
      args: [BigInt(gameId), playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress && gameId >= 0,
      },
    });
  };

  /**
   * 获取玩家所有奖励 (使用 GameAggregator)
   */
  const usePlayerAllRewards = (playerAddress: string) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerAllRewards',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取玩家仪表板 (使用 GameAggregator)
   */
  const usePlayerDashboard = (playerAddress: string) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerDashboard',
      args: [playerAddress as `0x${string}`],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  /**
   * 获取可领取奖励的游戏 (使用 GameAggregator)
   */
  const usePlayerClaimableGames = (playerAddress: string, maxGames: number = 25) => {
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getPlayerClaimableGames',
      args: [playerAddress as `0x${string}`, BigInt(maxGames)],
      query: {
        enabled: !!playerAddress,
      },
    });
  };

  // ============ 游戏操作方法 ============

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
   * 智能加入游戏 (使用 GameAggregator)
   */
  const smartJoinGame = (level: number = 0, maxWaitTime: number = 300) => {
    writeContract({
      ...gameAggregatorContract,
      functionName: 'smartJoinGame',
      args: [level, BigInt(maxWaitTime)],
    });
  };

  /**
   * 批量加入多个游戏 (使用 GameAggregator)
   */
  const joinMultipleGames = (gameIds: number[]) => {
    writeContract({
      ...gameAggregatorContract,
      functionName: 'joinMultipleGames',
      args: [gameIds.map(id => BigInt(id))],
    });
  };

  // ============ 奖励领取方法 ============

  /**
   * 领取指定游戏奖励 (使用 GameAggregator)
   */
  const claimGameReward = (gameId: number, claimType: ClaimType = ClaimType.ALL) => {
    writeContract({
      ...gameAggregatorContract,
      functionName: 'claimGameReward',
      args: [BigInt(gameId), claimType],
    });
  };

  /**
   * 批量领取所有奖励 (使用 GameAggregator)
   */
  const claimAllPlayerRewards = (claimType: ClaimType = ClaimType.ALL, maxGames: number = 25) => {
    writeContract({
      ...gameAggregatorContract,
      functionName: 'claimAllPlayerRewards',
      args: [claimType, BigInt(maxGames)],
    });
  };

  /**
   * 领取指定游戏的USD奖励
   */
  const claimUSDRewards = (gameId: number) => {
    claimGameReward(gameId, ClaimType.USD_ONLY);
  };

  /**
   * 领取指定游戏的NCLab奖励
   */
  const claimNclabRewards = (gameId: number) => {
    claimGameReward(gameId, ClaimType.NCLAB_ONLY);
  };

  /**
   * 一键领取所有USD奖励
   */
  const claimAllUSDRewards = (maxGames: number = 25) => {
    claimAllPlayerRewards(ClaimType.USD_ONLY, maxGames);
  };

  /**
   * 一键领取所有NCLab奖励
   */
  const claimAllNclabRewards = (maxGames: number = 25) => {
    claimAllPlayerRewards(ClaimType.NCLAB_ONLY, maxGames);
  };

  // ============ 兼容性方法 (保持向后兼容) ============

  /**
   * 获取入场费 - 从活跃游戏中获取
   */
  const useEntryFee = (level: number = 0) => {
    const { data: activeGames, isLoading, error } = useActiveGames(level, 1);
    const gameInfoArray = activeGames as GameFullInfo[] | undefined;
    
    // entryFee从合约返回的已经是wei格式，无需parseEther
    let entryFeeValue: bigint;
    if (gameInfoArray && gameInfoArray.length > 0) {
      const entryFee = gameInfoArray[0].entryFee;
      // 处理不同的数据类型
      if (typeof entryFee === 'string') {
        entryFeeValue = BigInt(entryFee);
      } else if (typeof entryFee === 'bigint') {
        entryFeeValue = entryFee;
      } else {
        entryFeeValue = parseEther('10'); // 默认值
      }
    } else {
      entryFeeValue = parseEther('10'); // 默认值
    }
    
    return {
      data: entryFeeValue,
      isLoading,
      error,
      refetch: () => {}
    };
  };

  /**
   * 获取级别配置 - 模拟旧的配置结构
   */
  const useLevelConfig = (level: number) => {
    const { data: activeGames, isLoading, error } = useActiveGames(level, 1);
    const gameInfoArray = activeGames as GameFullInfo[] | undefined;
    
    // 处理entryFee数据类型
    let entryFeeValue: bigint;
    if (gameInfoArray && gameInfoArray.length > 0) {
      const entryFee = gameInfoArray[0].entryFee;
      if (typeof entryFee === 'string') {
        entryFeeValue = BigInt(entryFee);
      } else if (typeof entryFee === 'bigint') {
        entryFeeValue = entryFee;
      } else {
        entryFeeValue = parseEther('10');
      }
    } else {
      entryFeeValue = parseEther('10');
    }
    
    return {
      data: gameInfoArray && gameInfoArray.length > 0 ? {
        entryFee: entryFeeValue,
        killReward: parseEther('1'), // 默认值
        active: true
      } : null,
      isLoading,
      error,
      refetch: () => {}
    };
  };

  /**
   * 获取游戏玩家列表 - 从游戏完整信息获取
   */
  const useGamePlayers = (gameId: number) => {
    const { data: gameInfo, ...rest } = useGameFullInfo(gameId);
    const gameData = gameInfo as GameFullInfo | undefined;
    return {
      ...rest,
      data: gameData?.activePlayers || []
    };
  };

  /**
   * 获取玩家nonce - 模拟返回0，因为GameAggregator不需要nonce
   */
  const usePlayerNonce = (playerAddress: string) => {
    return {
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {}
    };
  };

  /**
   * 获取玩家分数 - 从奖励信息推断
   */
  const usePlayerScore = (gameId: number, playerAddress: string) => {
    const { data: rewards, ...rest } = usePlayerCompleteRewards(gameId, playerAddress);
    return {
      ...rest,
      data: BigInt(0) // 简化返回，实际分数需要从其他地方获取
    };
  };

  /**
   * 检查是否可以领取奖励
   */
  const useCanClaimReward = (gameId: number, playerAddress: string) => {
    const { data: rewards, ...rest } = usePlayerCompleteRewards(gameId, playerAddress);
    const rewardsData = rewards as PlayerCompleteRewards | undefined;
    return {
      ...rest,
      data: rewardsData ? (rewardsData.usdClaimable || rewardsData.nclabClaimable) : false
    };
  };

  /**
   * 获取USD1余额 - 真实ERC20查询
   */
  const useUSD1Balance = (address: string) => {
    const usd1TokenContract = getUSD1TokenContract();
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      query: {
        enabled: !!address,
        refetchInterval: 10000, // 每10秒刷新一次
      },
    });
  };

  /**
   * 获取USD1授权额度 - 真实ERC20查询
   */
  const useUSD1Allowance = (owner: string, spender: string) => {
    const usd1TokenContract = getUSD1TokenContract();
    return useReadContract({
      ...usd1TokenContract,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: {
        enabled: !!owner && !!spender,
        refetchInterval: 10000, // 每10秒刷新一次
      },
    });
  };

  /**
   * 获取SwordBattle合约地址 - 从GameAggregator获取
   */
  const useSwordBattleAddress = () => {
    const gameAggregatorContract = getGameAggregatorContract();
    return useReadContract({
      ...gameAggregatorContract,
      functionName: 'getSwordBattleAddress',
      args: [],
      query: {
        enabled: true,
      },
    });
  };

  // 获取SwordBattle地址（在hook顶层调用）
  const { data: swordBattleAddress } = useSwordBattleAddress();

  /**
   * 授权USD1给SwordBattle合约 - 智能授权
   */
  const approveUSD1ToSwordBattle = (amount: bigint) => {
    if (swordBattleAddress) {
      const usd1TokenContract = getUSD1TokenContract();
      writeContract({
        ...usd1TokenContract,
        functionName: 'approve',
        args: [swordBattleAddress as `0x${string}`, amount],
      });
    } else {
      console.error('SwordBattle address not available yet, please wait for it to load');
    }
  };

  /**
   * 授权USD1 - 真实ERC20授权（兼容版本）
   */
  const approveUSD1 = (spenderOrAmount: string | bigint, amount?: bigint) => {
    const usd1TokenContract = getUSD1TokenContract();
    
    // 兼容旧的调用方式：approveUSD1(amount) - 授权给SwordBattle
    if (typeof spenderOrAmount === 'bigint' && !amount) {
      approveUSD1ToSwordBattle(spenderOrAmount);
    } 
    // 新的调用方式：approveUSD1(spender, amount)
    else if (typeof spenderOrAmount === 'string' && amount) {
      writeContract({
        ...usd1TokenContract,
        functionName: 'approve',
        args: [spenderOrAmount as `0x${string}`, amount],
      });
    } else {
      console.error('Invalid approveUSD1 parameters');
    }
  };

  /**
   * 授权USD1给GameAggregator合约 - 便捷方法（已废弃，现在使用SwordBattle）
   * @deprecated 使用 approveUSD1ToSwordBattle 替代
   */
  const approveUSD1ToGameAggregator = (amount: bigint) => {
    console.warn('approveUSD1ToGameAggregator is deprecated, use approveUSD1ToSwordBattle instead');
    approveUSD1ToSwordBattle(amount);
  };

  /**
   * @deprecated 使用 useGameFullInfo 替代
   */
  const useGameInfo = useGameFullInfo;

  /**
   * @deprecated 使用 usePlayerCompleteRewards 替代
   */
  const usePlayerRewards = usePlayerCompleteRewards;

  /**
   * @deprecated 使用 claimGameReward 替代
   */
  const claimReward = (gameId: number) => {
    claimGameReward(gameId, ClaimType.ALL);
  };

  /**
   * @deprecated 使用 claimAllPlayerRewards 替代
   */
  const claimAllRewards = () => {
    claimAllPlayerRewards(ClaimType.ALL, 25);
  };

  return {
    // 新的GameAggregator读取方法
    useGameCounter,
    useGameFullInfo,
    useActiveGames,
    usePlayerCurrentGames,
    useGameStats,
    usePlayerStats,
    usePlayerCompleteRewards,
    usePlayerAllRewards,
    usePlayerDashboard,
    usePlayerClaimableGames,

    // 游戏操作方法
    joinGame,
    smartJoinGame,
    joinMultipleGames,

    // 奖励领取方法
    claimGameReward,
    claimAllPlayerRewards,
    claimUSDRewards,
    claimNclabRewards,
    claimAllUSDRewards,
    claimAllNclabRewards,

    // USD1 授权方法
    useSwordBattleAddress,
    swordBattleAddress, // SwordBattle合约地址数据
    approveUSD1,
    approveUSD1ToSwordBattle,
    approveUSD1ToGameAggregator, // @deprecated
    
    // 兼容性方法 (保持向后兼容)
    useEntryFee,
    useLevelConfig,
    useGamePlayers,
    usePlayerNonce,
    usePlayerScore,
    useCanClaimReward,
    useUSD1Balance,
    useUSD1Allowance,
    useGameInfo,
    usePlayerRewards,
    claimReward,
    claimAllRewards,

    // 交易状态
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    writeData,
  };
};