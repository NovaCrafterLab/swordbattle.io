// Solana blockchain interaction hook
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Type definitions for backward compatibility
export interface GameFullInfo {
  gameId: string;           // 游戏ID
  level: number;            // 游戏等级 (0=EASY, 1=MEDIUM, 2=HARD)
  status: number;           // 游戏状态 (0=WAITING, 1=ACTIVE, 2=ENDED)
  totalPool: string;        // 奖池总额 (lamports)
  createdAt: string;        // 创建时间戳
  endedAt: string;          // 结束时间戳
  gameDuration: number;     // 游戏持续时间 (秒)
  playerCount: string;      // 玩家数量
  maxPlayers: string;       // 最大玩家数
  activePlayers: string[];  // 活跃玩家地址列表
  canJoin: boolean;         // 是否可加入
  entryFee: string;         // 入场费 (lamports)
}

export interface PlayerCompleteRewards {
  solRewards: string;        // 🟡 SOL 奖励数量 (lamports)
  splRewards: string;        // 🔵 SPL Token 奖励数量
  fragmentBalance: string;   // 🟠 碎片余额
  solClaimable: boolean;     // SOL 是否可领取
  splClaimable: boolean;     // SPL Token 是否可领取
  splClaimableTime: string;  // SPL Token 可领取时间戳
  solClaimed: boolean;       // SOL 是否已领取
  splClaimed: boolean;       // SPL Token 是否已领取
}

export interface PlayerDashboard {
  // 游戏统计
  totalGamesPlayed: string;    // 总游戏局数
  totalKills: string;          // 总击杀数
  totalScore: string;          // 总分数
  winRate: string;             // 胜率 (百分比 * 100)
  
  // 奖励统计
  totalSolEarned: string;      // 🟡 总 SOL 收益 (lamports)
  totalSplEarned: string;      // 🔵 总 SPL Token 收益
  totalFragmentsEarned: string; // 🟠 总碎片收益
  
  // 待领取奖励
  pendingSolRewards: string;   // 🟡 待领取 SOL (lamports)
  pendingSplRewards: string;   // 🔵 待领取 SPL Token
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
  rewardAmounts: string[];     // 每个游戏的奖励总额 (lamports)
  claimableTypes: number[];    // 奖励类型位掩码 (1=SOL, 2=SPL, 3=Both)
}

// 领取类型枚举
export enum ClaimType {
  ALL = 0,        // 领取所有类型 (SOL + SPL Token)
  SOL_ONLY = 1,   // 仅领取 SOL
  SPL_ONLY = 2    // 仅领取 SPL Token
}

/**
 * Solana blockchain interaction hook
 * Provides all blockchain functionality through Solana
 */
export const useBlockchain = () => {
  // Solana hooks 
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Return Solana wallet state
  const isConnected = connected;
  const address = publicKey?.toString();

  console.log(`🔗 useBlockchain: Solana - Connected: ${isConnected}, Address: ${address?.slice(0, 10)}...`);

  // Placeholder implementations for backward compatibility
  const useGameFullInfo = (gameId: number) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useGameCounter = () => ({
    data: 0,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useActiveGames = (level: number = 0, limit: number = 10) => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerCurrentGames = (playerAddress: string) => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useGameStats = (startTime: number, endTime: number) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerStats = (playerAddress: string) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerCompleteRewards = (gameId: number, playerAddress: string) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerAllRewards = (playerAddress: string) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerDashboard = (playerAddress: string) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerClaimableGames = (playerAddress: string, maxGames: number = 25) => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  // Game operations - placeholder implementations
  const joinGame = (gameId: number) => {
    console.log(`🎮 Joining Solana game ${gameId} - TODO: implement`);
  };

  const smartJoinGame = (level: number = 0, maxWaitTime: number = 300) => {
    console.log(`🎮 Smart joining Solana game level ${level} - TODO: implement`);
  };

  const joinMultipleGames = (gameIds: number[]) => {
    console.log(`🎮 Joining multiple Solana games ${gameIds} - TODO: implement`);
  };

  // Reward claiming - placeholder implementations
  const claimGameReward = (gameId: number, claimType: ClaimType = ClaimType.ALL) => {
    console.log(`💰 Claiming Solana rewards for game ${gameId}, type ${claimType} - TODO: implement`);
  };

  const claimAllPlayerRewards = (claimType: ClaimType = ClaimType.ALL, maxGames: number = 25) => {
    console.log(`💰 Claiming all Solana rewards, type ${claimType}, max ${maxGames} games - TODO: implement`);
  };

  const claimSolRewards = (gameId: number) => {
    claimGameReward(gameId, ClaimType.SOL_ONLY);
  };

  const claimSplRewards = (gameId: number) => {
    claimGameReward(gameId, ClaimType.SPL_ONLY);
  };

  const claimAllSolRewards = (maxGames: number = 25) => {
    claimAllPlayerRewards(ClaimType.SOL_ONLY, maxGames);
  };

  const claimAllSplRewards = (maxGames: number = 25) => {
    claimAllPlayerRewards(ClaimType.SPL_ONLY, maxGames);
  };

  // Compatibility methods (keeping backward compatibility)
  const useEntryFee = (level: number = 0) => ({
    data: BigInt(1000000), // 0.001 SOL in lamports 
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useLevelConfig = (level: number) => ({
    data: {
      entryFee: BigInt(1000000), // 0.001 SOL in lamports
      killReward: BigInt(100000), // 0.0001 SOL in lamports
      active: true
    },
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useGamePlayers = (gameId: number) => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerNonce = (playerAddress: string) => ({
    data: BigInt(0),
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const usePlayerScore = (gameId: number, playerAddress: string) => ({
    data: BigInt(0),
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  const useCanClaimReward = (gameId: number, playerAddress: string) => ({
    data: false,
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  // SPL Token balance (placeholder)
  const useSPLBalance = (address: string) => ({
    data: BigInt(0),
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  // SPL Token allowance (placeholder)
  const useSPLAllowance = (owner: string, spender: string) => ({
    data: BigInt(0),
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  // Game program address
  const useGameProgramAddress = () => ({
    data: '11111111111111111111111111111112', // System Program as placeholder
    isLoading: false,
    error: null,
    refetch: () => {}
  });

  // SPL Token operations (placeholder)
  const approveSPL = (spenderOrAmount: string | bigint, amount?: bigint) => {
    console.log(`🪙 Approving SPL tokens - TODO: implement`);
  };

  const approveSPLToGameProgram = (amount: bigint) => {
    console.log(`🪙 Approving SPL to game program - TODO: implement`);
  };

  // Deprecated compatibility methods
  const useGameInfo = useGameFullInfo;
  const usePlayerRewards = usePlayerCompleteRewards;
  const claimReward = (gameId: number) => claimGameReward(gameId, ClaimType.ALL);
  const claimAllRewards = () => claimAllPlayerRewards(ClaimType.ALL, 25);
  
  // Legacy BSC method names mapped to SPL equivalents
  const useUSD1Balance = useSPLBalance;
  const useUSD1Allowance = useSPLAllowance;
  const approveUSD1 = approveSPL;
  const approveUSD1ToSwordBattle = approveSPLToGameProgram;
  const approveUSD1ToGameAggregator = approveSPLToGameProgram; // @deprecated
  const useSwordBattleAddress = useGameProgramAddress;
  const claimUSDRewards = claimSolRewards; // Map USD to SOL
  const claimNclabRewards = claimSplRewards; // Map NCLab to SPL
  const claimAllUSDRewards = claimAllSolRewards;
  const claimAllNclabRewards = claimAllSplRewards;

  return {
    // Solana wallet state
    isConnected,
    address,
    publicKey,
    connected,

    // New Solana read methods
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

    // Game operations
    joinGame,
    smartJoinGame,
    joinMultipleGames,

    // Reward claiming
    claimGameReward,
    claimAllPlayerRewards,
    claimSolRewards,
    claimSplRewards,
    claimAllSolRewards,
    claimAllSplRewards,

    // SPL Token operations
    useGameProgramAddress,
    approveSPL,
    approveSPLToGameProgram,
    
    // Compatibility methods (keeping backward compatibility)
    useEntryFee,
    useLevelConfig,
    useGamePlayers,
    usePlayerNonce,
    usePlayerScore,
    useCanClaimReward,
    useSPLBalance,
    useSPLAllowance,
    useGameInfo,
    usePlayerRewards,
    claimReward,
    claimAllRewards,

    // Legacy BSC method names (mapped to Solana equivalents)
    useUSD1Balance,
    useUSD1Allowance,
    approveUSD1,
    approveUSD1ToSwordBattle,
    approveUSD1ToGameAggregator, // @deprecated
    useSwordBattleAddress,
    claimUSDRewards,
    claimNclabRewards,
    claimAllUSDRewards,
    claimAllNclabRewards,

    // Transaction state (placeholders)
    isWritePending: false,
    isConfirming: false,
    isConfirmed: false,
    writeError: null,
    writeData: null,
  };
};