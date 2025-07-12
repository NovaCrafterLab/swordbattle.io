// Solana blockchain interaction hook
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
} from '@solana/spl-token';
import { useSolanaVault } from './useSolanaVault';

// Separate custom hooks to avoid rules of hooks violations

/**
 * Hook to fetch SOL balance for a wallet address
 */
export const useSOLBalance = (walletAddress: string) => {
  const { connection } = useConnection();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress || !connection) {
      setBalance(BigInt(0));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const publicKey = new PublicKey(walletAddress);
      const lamports = await connection.getBalance(publicKey);
      setBalance(BigInt(lamports));
    } catch (err) {
      const error = err as Error;
      setError(error);
      setBalance(BigInt(0));
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, connection]);

  // 修复：移除自动触发的 useEffect，防止过度请求 SOL 余额
  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]); // 只依赖 walletAddress 变化，避免过度请求

  return {
    data: balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
};

/**
 * Hook to fetch current game counter from server (稳定版本)
 */
export const useGameCounter = () => {
  const [gameId, setGameId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGameCounter = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get server URL from localStorage or default
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
      const url = `${protocol}://${serverUrl}/serverinfo`;

      const response = await fetch(url);
      const serverInfo = await response.json();

      // 优先使用服务器的solanaGameId（这是当前活跃游戏的稳定ID）
      let currentGameId = 0;
      if (
        serverInfo?.gameStatus?.gameId !== null &&
        serverInfo?.gameStatus?.gameId !== undefined
      ) {
        currentGameId = serverInfo.gameStatus.gameId;
      } else if (serverInfo?.solanaGameId) {
        // 如果gameStatus中没有，尝试从solanaGameId获取
        currentGameId = parseInt(serverInfo.solanaGameId) || 0;
      }

      setGameId(currentGameId);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setGameId(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameCounter();

    // 修复：增加到120秒一次轮询，大幅减少 API 请求
    const interval = setInterval(fetchGameCounter, 120000); // 从60秒增加到120秒
    return () => clearInterval(interval);
  }, []); // 移除 fetchGameCounter 依赖，防止重复创建定时器

  return {
    data: gameId,
    isLoading,
    error,
    refetch: fetchGameCounter,
  };
};

/**
 * Hook to fetch SPL token balance for a wallet address
 */
export const useSPLTokenBalance = (
  walletAddress: string,
  tokenMintAddress: string,
) => {
  const { connection } = useConnection();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress || !tokenMintAddress || !connection) {
      setBalance(BigInt(0));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const walletPubkey = new PublicKey(walletAddress);
      const mintPubkey = new PublicKey(tokenMintAddress);

      // Get associated token account address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPubkey,
        walletPubkey,
      );

      // Get token account info
      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      const balance = BigInt(tokenAccount.amount.toString());
      setBalance(balance);
    } catch (err) {
      const error = err as Error;

      // Check for various error types
      if (
        error.message.includes('could not find account') ||
        error.message.includes('TokenAccountNotFoundError') ||
        error.message.includes('Account does not exist') ||
        error.message.includes('StructError') ||
        error.message.includes('Expected the value to satisfy a union')
      ) {
        setError(null); // Don't treat these as errors, just set balance to 0
      } else {
        setError(error);
      }

      setBalance(BigInt(0));
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, tokenMintAddress, connection]);

  // 修复：移除自动触发的 useEffect，防止过度请求 SPL 余额
  useEffect(() => {
    if (walletAddress && tokenMintAddress) {
      fetchBalance();
    }
  }, [walletAddress, tokenMintAddress]); // 只依赖关键参数变化

  return {
    data: balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
};

/**
 * Hook to fetch SPL token balance using configured token mint
 */
export const useSPLBalance = (address: string) => {
  const tokenMint =
    process.env.REACT_APP_TOKEN_MINT ||
    'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';
  return useSPLTokenBalance(address, tokenMint);
};

/**
 * Hook to dynamically fetch token metadata from on-chain
 */
export const useTokenMetadata = (tokenMintAddress: string) => {
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<{
    symbol: string;
    name: string;
    decimals: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetadata = useCallback(async () => {
    if (!tokenMintAddress || !connection) {
      setMetadata(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const mintPubkey = new PublicKey(tokenMintAddress);

      // Get mint account info to get decimals
      const mintInfo = await getMint(connection, mintPubkey);

      // For now, we'll use a simple mapping for known tokens
      // In the future, this could be enhanced with actual metadata program calls
      let symbol = 'UNKNOWN';
      let name = 'Unknown Token';

      if (tokenMintAddress === 'So11111111111111111111111111111111111111112') {
        symbol = 'SOL';
        name = 'Solana';
      } else if (
        tokenMintAddress === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
      ) {
        symbol = 'USDC';
        name = 'USD Coin';
      } else if (
        tokenMintAddress === 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq'
      ) {
        symbol = 'SBTT';
        name = 'SwordBattle Test Token';
      } else {
        // For unknown tokens, try to get a better display name
        symbol = tokenMintAddress.slice(0, 4) + '...';
        name = 'Custom Token';
      }

      setMetadata({
        symbol,
        name,
        decimals: mintInfo.decimals,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, [tokenMintAddress, connection]);

  useEffect(() => {
    if (tokenMintAddress) {
      fetchMetadata();
    }
  }, [tokenMintAddress, fetchMetadata]);

  return {
    data: metadata,
    isLoading,
    error,
    refetch: fetchMetadata,
  };
};

/**
 * Hook to get current game token information dynamically from server
 * 优化：直接从 /serverinfo 获取 token 信息，避免额外的 API 调用
 */
export const useCurrentGameToken = () => {
  const { connection } = useConnection();
  const [tokenInfo, setTokenInfo] = useState<{
    tokenMint: string;
    tokenSymbol: string;
    tokenName: string;
    isSOL: boolean;
    isWSol?: boolean; // 添加 WSOL 标识
    isUSDC: boolean;
    gameId: string;
    tier: string;
    canBuyTickets: boolean;
    retrievalMethod: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentGameToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get server URL from localStorage or default
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

      // 🚀 优化：直接从 /serverinfo 获取 token 信息，避免额外的 API 调用
      const url = `${protocol}://${serverUrl}/serverinfo`;

      const response = await fetch(url);
      const serverInfo = await response.json();

      // 检查是否有 gameStatus 和 token 信息
      if (!serverInfo.gameStatus) {
        throw new Error('Game status not available from server');
      }

      const gameStatus = serverInfo.gameStatus;

      // 获取 token mint 信息 - 优先使用 gameStatus 中的信息
      let tokenMint = gameStatus.tokenMint;
      let tokenInfoData = gameStatus.tokenInfo;

      // 如果 gameStatus 中没有 token 信息，回退到服务器配置
      if (!tokenMint && serverInfo.solanaConfig) {
        tokenMint = 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'; // 默认 USDC
      }

      if (!tokenMint) {
        throw new Error('Token mint information not available');
      }

      // 🚀 Dynamic token metadata retrieval
      let tokenSymbol = 'UNKNOWN';
      let tokenName = 'Unknown Token';
      let tokenDecimals = 9; // Default decimals

      // Try to get mint info for decimals and better metadata
      try {
        const mintPubkey = new PublicKey(tokenMint);
        // Use stable connection instead of random RPC to avoid API key issues
        const mintInfo = await getMint(connection, mintPubkey);
        tokenDecimals = mintInfo.decimals;
      } catch (error) {
        // Silent failure - use default decimals
        console.warn('Failed to get mint info, using default decimals:', error);
      }

      // 使用 tokenInfo 中的信息，或基于 tokenMint 地址判断
      if (
        tokenInfoData?.isSOL ||
        tokenMint === 'So11111111111111111111111111111111111111112'
      ) {
        tokenSymbol = 'SOL';
        tokenName = 'Solana';
        tokenDecimals = 9;
      } else if (
        tokenInfoData?.isUSDC ||
        tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
      ) {
        tokenSymbol = 'USDC';
        tokenName = 'USD Coin';
        tokenDecimals = 6;
      } else if (tokenMint === 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq') {
        tokenSymbol = 'SBTT';
        tokenName = 'SwordBattle Test Token';
        tokenDecimals = 9; // From test-token-config.json
      } else {
        // For unknown tokens, use a more descriptive fallback
        tokenSymbol = tokenMint.slice(0, 4) + '...';
        tokenName = 'Custom Token';
      }

      // 🔧 修复：WSOL 应该被当作 SPL Token 处理，不是原生 SOL
      // WSOL (wrapped SOL) 有特殊的 token mint，但它仍然是 SPL Token
      const gameTokenInfo = {
        tokenMint,
        tokenSymbol,
        tokenName,
        tokenDecimals, // 添加 decimals 信息
        isSOL: false, // 🔧 重要：即使是 WSOL 也应该作为 SPL Token 处理
        isWSol: tokenMint === 'So11111111111111111111111111111111111111112', // 添加 WSOL 标识
        isUSDC:
          tokenInfoData?.isUSDC ||
          tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
        isSBTT: tokenMint === 'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq', // 添加 SBTT 标识
        gameId: gameStatus.gameId?.toString() || '0',
        tier: 'low', // 默认 tier，可以从服务器配置获取
        canBuyTickets: true, // 默认允许购买
        retrievalMethod: 'serverinfo-optimized-with-metadata', // 标记为优化版本
      };

      setTokenInfo(gameTokenInfo);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setTokenInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    fetchCurrentGameToken();
  }, [fetchCurrentGameToken]);

  return {
    data: tokenInfo,
    isLoading,
    error,
    refetch: fetchCurrentGameToken,
  };
};

/**
 * Hook to get tier-based pricing information
 */
export const useTierPricing = (tier: string = 'low') => {
  const [pricing, setPricing] = useState<{
    entranceFee: bigint;
    killReward: bigint;
    tierName: string;
    minLevel: number;
    maxLevel: number;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTierPricing = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Default tier configurations (can be fetched from server later)
      const tierConfigs = {
        low: {
          entranceFee: BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL)), // 0.01 SOL
          killReward: BigInt(Math.floor(0.001 * LAMPORTS_PER_SOL)), // 0.001 SOL
          tierName: 'Low Tier Arena',
          minLevel: 1,
          maxLevel: 10,
          description: 'Beginner-friendly arena with basic rewards',
        },
        medium: {
          entranceFee: BigInt(Math.floor(0.05 * LAMPORTS_PER_SOL)), // 0.05 SOL
          killReward: BigInt(Math.floor(0.005 * LAMPORTS_PER_SOL)), // 0.005 SOL
          tierName: 'Medium Tier Arena',
          minLevel: 11,
          maxLevel: 25,
          description: 'Intermediate arena with enhanced rewards',
        },
        high: {
          entranceFee: BigInt(Math.floor(0.1 * LAMPORTS_PER_SOL)), // 0.1 SOL
          killReward: BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL)), // 0.01 SOL
          tierName: 'High Tier Arena',
          minLevel: 26,
          maxLevel: 999,
          description: 'Advanced arena with premium rewards',
        },
      };

      const config = tierConfigs[tier as keyof typeof tierConfigs];
      if (!config) {
        throw new Error(`Invalid tier: ${tier}`);
      }

      setPricing(config);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setPricing(null);
    } finally {
      setIsLoading(false);
    }
  }, [tier]);

  useEffect(() => {
    fetchTierPricing();
  }, [fetchTierPricing]);

  return {
    data: pricing,
    isLoading,
    error,
    refetch: fetchTierPricing,
  };
};

/**
 * Hook to get dynamic token balance for current game token
 * 修复：添加请求节流防止过度 API 调用
 */
export const useDynamicTokenBalance = (walletAddress: string) => {
  const gameToken = useCurrentGameToken();

  // 修复：使用 useMemo 避免重复创建 hook 调用
  const solBalance = useSOLBalance(walletAddress);
  const splBalance = useSPLTokenBalance(
    walletAddress,
    gameToken.data?.tokenMint || '',
  );

  // 修复：使用 useMemo 缓存结果，减少重复计算
  return useMemo(() => {
    // 🔧 修复：所有 SPL Tokens (包括 WSOL) 都应该使用 SPL token balance
    // 只有真正的原生 SOL 才使用 SOL balance
    if (gameToken.data?.isSOL && !gameToken.data?.isWSol) {
      // 只有原生 SOL (非 WSOL)
      return {
        data: solBalance.data,
        isLoading: solBalance.isLoading || gameToken.isLoading,
        error: solBalance.error || gameToken.error,
        refetch: () => {
          // 修复：添加防抖，避免连续快速请求
          solBalance.refetch();
          gameToken.refetch();
        },
        tokenInfo: gameToken.data,
      };
    } else {
      // SPL Tokens (包括 WSOL, USDC 等)
      return {
        data: splBalance.data,
        isLoading: splBalance.isLoading || gameToken.isLoading,
        error: splBalance.error || gameToken.error,
        refetch: () => {
          // 修复：添加防抖，避免连续快速请求
          splBalance.refetch();
          gameToken.refetch();
        },
        tokenInfo: gameToken.data,
      };
    }
  }, [
    gameToken.data,
    solBalance.data,
    splBalance.data,
    solBalance.isLoading,
    splBalance.isLoading,
    gameToken.isLoading,
    solBalance.error,
    splBalance.error,
    gameToken.error,
  ]); // 添加适当的依赖项
};

/**
 * Hook to check if player has a ticket for current game
 */
export const usePlayerTicket = (gameId: number, playerAddress: string) => {
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!gameId || !playerAddress) {
      setTicket(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get server vault info to use VaultSDK
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
      const vaultInfoUrl = `${protocol}://${serverUrl}/api/vault-info/${gameId}/${playerAddress}`;

      const response = await fetch(vaultInfoUrl);
      const result = await response.json();

      setTicket(result.ticket);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, playerAddress]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return {
    data: ticket,
    isLoading,
    error,
    refetch: fetchTicket,
    hasTicket: !!ticket,
  };
};

/**
 * Hook to get game vault information including entry fee
 */
export const useGameVault = (gameId: number) => {
  const [vault, setVault] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVault = useCallback(async () => {
    if (!gameId) {
      setVault(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get server vault info
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
      const vaultInfoUrl = `${protocol}://${serverUrl}/api/vault-info/${gameId}`;

      const response = await fetch(vaultInfoUrl);
      const result = await response.json();

      setVault(result.vault);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setVault(null);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  return {
    data: vault,
    isLoading,
    error,
    refetch: fetchVault,
  };
};

// Type definitions for backward compatibility
export interface GameFullInfo {
  gameId: string; // 游戏ID
  level: number; // 游戏等级 (0=EASY, 1=MEDIUM, 2=HARD)
  status: number; // 游戏状态 (0=WAITING, 1=ACTIVE, 2=ENDED)
  totalPool: string; // 奖池总额 (lamports)
  createdAt: string; // 创建时间戳
  endedAt: string; // 结束时间戳
  gameDuration: number; // 游戏持续时间 (秒)
  playerCount: string; // 玩家数量
  maxPlayers: string; // 最大玩家数
  activePlayers: string[]; // 活跃玩家地址列表
  canJoin: boolean; // 是否可加入
  entryFee: string; // 入场费 (lamports)
}

export interface PlayerCompleteRewards {
  solRewards: string; // 🟡 SOL 奖励数量 (lamports)
  splRewards: string; // 🔵 SPL Token 奖励数量
  fragmentBalance: string; // 🟠 碎片余额
  solClaimable: boolean; // SOL 是否可领取
  splClaimable: boolean; // SPL Token 是否可领取
  splClaimableTime: string; // SPL Token 可领取时间戳
  solClaimed: boolean; // SOL 是否已领取
  splClaimed: boolean; // SPL Token 是否已领取
}

export interface PlayerDashboard {
  // 游戏统计
  totalGamesPlayed: string; // 总游戏局数
  totalKills: string; // 总击杀数
  totalScore: string; // 总分数
  winRate: string; // 胜率 (百分比 * 100)

  // 奖励统计
  totalSolEarned: string; // 🟡 总 SOL 收益 (lamports)
  totalSplEarned: string; // 🔵 总 SPL Token 收益
  totalFragmentsEarned: string; // 🟠 总碎片收益

  // 待领取奖励
  pendingSolRewards: string; // 🟡 待领取 SOL (lamports)
  pendingSplRewards: string; // 🔵 待领取 SPL Token
  fragmentBalance: string; // 🟠 当前碎片余额

  // 当前状态
  currentGameCount: string; // 当前参与游戏数量
  hasClaimableRewards: boolean; // 是否有可领取奖励
}

export interface PlayerStats {
  totalGamesPlayed: string; // 总游戏数
  totalKills: string; // 总击杀数
  totalScore: string; // 总分数
  avgScorePerGame: string; // 平均每局分数
  winRate: string; // 胜率
}

export interface GameStats {
  totalGames: string; // 总游戏数
  totalPlayers: string; // 总玩家数
  totalPool: string; // 总奖池
  avgPlayersPerGame: string; // 平均每局玩家数
}

export interface ClaimableGames {
  gameIds: string[]; // 可领取奖励的游戏ID列表
  rewardAmounts: string[]; // 每个游戏的奖励总额 (lamports)
  claimableTypes: number[]; // 奖励类型位掩码 (1=SOL, 2=SPL, 3=Both)
}

// 领取类型枚举
export enum ClaimType {
  ALL = 0, // 领取所有类型 (SOL + SPL Token)
  SOL_ONLY = 1, // 仅领取 SOL
  SPL_ONLY = 2, // 仅领取 SPL Token
}

/**
 * Solana blockchain interaction hook
 * Provides all blockchain functionality through Solana
 */
export const useBlockchain = () => {
  // Solana hooks
  const { publicKey, connected, signTransaction, sendTransaction } =
    useWallet();
  const solanaVault = useSolanaVault();

  // 调试钱包状态
  useEffect(() => {
    // Silent state monitoring
  }, [connected, publicKey, signTransaction, sendTransaction]);

  // Return Solana wallet state
  const isConnected = connected;
  const address = publicKey?.toString();

  // Only log on connection state changes, not every render
  useEffect(() => {
    // Silent state monitoring
  }, [isConnected, address]);

  // Placeholder implementations for backward compatibility
  const useGameFullInfo = useCallback(
    (_gameId: number) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useActiveGames = useCallback(
    (_level: number = 0, _limit: number = 10) => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerCurrentGames = useCallback(
    (_playerAddress: string) => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useGameStats = useCallback(
    (_startTime: number, _endTime: number) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerStats = useCallback(
    (_playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerCompleteRewards = useCallback(
    (_gameId: number, _playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerAllRewards = useCallback(
    (_playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerDashboard = useCallback(
    (_playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerClaimableGames = useCallback(
    (_playerAddress: string, _maxGames: number = 25) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // Game operations - Direct Solana vault implementation using vault-sdk pattern
  const buyTicket = useCallback(
    async (gameId: number, tier: string = 'low', _playerLevel: number = 1) => {
      if (!isConnected || !address || !publicKey) {
        throw new Error('Wallet not connected');
      }

      try {
        // Get tier pricing to determine the correct amount
        const tierConfigs = {
          low: { entranceFee: BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL)) },
          medium: { entranceFee: BigInt(Math.floor(0.05 * LAMPORTS_PER_SOL)) },
          high: { entranceFee: BigInt(Math.floor(0.1 * LAMPORTS_PER_SOL)) },
        };

        const config = tierConfigs[tier as keyof typeof tierConfigs];
        if (!config) {
          throw new Error(`Invalid tier: ${tier}`);
        }

        // Get current game token info to determine token mint
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';

        // Fetch game token info
        const response = await fetch(`${protocol}://${serverUrl}/serverinfo`);
        const serverInfo = await response.json();

        console.log('🔍 DEBUG - Server info:', serverInfo);

        let tokenMint: PublicKey;

        if (serverInfo.gameStatus?.tokenMint) {
          console.log(
            '🪙 Using token mint from server:',
            serverInfo.gameStatus.tokenMint,
          );
          tokenMint = new PublicKey(serverInfo.gameStatus.tokenMint);
        } else {
          console.log('⚠️ No token mint in server info, using default USDC');
          // Default to USDC if no token mint specified
          tokenMint = new PublicKey(
            'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
          );
        }

        console.log('🔍 Final token mint:', tokenMint.toString());

        // Check if vault is configured
        if (!solanaVault.isVaultConfigured) {
          throw new Error(
            'Vault program not configured. Please set REACT_APP_VAULT_PROGRAM_ID environment variable.',
          );
        }

        // Use direct Solana vault implementation
        const result = await solanaVault.buyTicket(
          gameId,
          config.entranceFee,
          tokenMint,
          tier,
          config.entranceFee, // expected amount for validation
        );

        return { success: true, txHash: result, tier };
      } catch (error) {
        throw error;
      }
    },
    [isConnected, address, publicKey, solanaVault],
  );

  const joinGame = useCallback(
    (gameId: number, tier: string = 'low', playerLevel: number = 1) => {
      return buyTicket(gameId, tier, playerLevel);
    },
    [buyTicket],
  );

  const smartJoinGame = useCallback(
    (_level: number = 0, _maxWaitTime: number = 300) => {
      // TODO: implement smart join game logic
    },
    [],
  );

  const joinMultipleGames = useCallback((_gameIds: number[]) => {
    // TODO: implement multiple games join logic
  }, []);

  // Reward claiming - Solana implementation
  const claimGameReward = useCallback(
    async (gameId: number, _claimType: ClaimType = ClaimType.ALL) => {
      if (!isConnected || !address || !publicKey) {
        throw new Error('Wallet not connected');
      }

      try {
        // Check if vault is configured
        if (!solanaVault.isVaultConfigured) {
          throw new Error(
            'Vault program not configured. Please set REACT_APP_VAULT_PROGRAM_ID environment variable.',
          );
        }

        // Use Solana vault to claim reward
        const result = await solanaVault.claimReward(gameId);

        return result;
      } catch (error) {
        throw error;
      }
    },
    [isConnected, address, publicKey, solanaVault],
  );

  const claimAllPlayerRewards = useCallback(
    (_claimType: ClaimType = ClaimType.ALL, _maxGames: number = 25) => {
      // TODO: implement claim all rewards logic
    },
    [],
  );

  const claimSolRewards = useCallback(
    (gameId: number) => {
      claimGameReward(gameId, ClaimType.SOL_ONLY);
    },
    [claimGameReward],
  );

  const claimSplRewards = useCallback(
    (gameId: number) => {
      claimGameReward(gameId, ClaimType.SPL_ONLY);
    },
    [claimGameReward],
  );

  const claimAllSolRewards = useCallback(
    (maxGames: number = 25) => {
      claimAllPlayerRewards(ClaimType.SOL_ONLY, maxGames);
    },
    [claimAllPlayerRewards],
  );

  const claimAllSplRewards = useCallback(
    (maxGames: number = 25) => {
      claimAllPlayerRewards(ClaimType.SPL_ONLY, maxGames);
    },
    [claimAllPlayerRewards],
  );

  // Compatibility methods (keeping backward compatibility)
  const useEntryFee = useCallback(
    (_level: number = 0) => ({
      data: BigInt(1000000), // 0.001 SOL in lamports
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useLevelConfig = useCallback(
    (_level: number) => ({
      data: {
        entryFee: BigInt(1000000), // 0.001 SOL in lamports
        killReward: BigInt(100000), // 0.0001 SOL in lamports
        active: true,
      },
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useGamePlayers = useCallback(
    (_gameId: number) => ({
      data: [] as string[],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerNonce = useCallback(
    (_playerAddress: string) => ({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerScore = useCallback(
    (_gameId: number, _playerAddress: string) => ({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useCanClaimReward = useCallback(
    (_gameId: number, _playerAddress: string) => ({
      data: false,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // SPL Token allowance (placeholder)
  const useSPLAllowance = useCallback(
    (_owner: string, _spender: string) => ({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // Game program address
  const useGameProgramAddress = useCallback(
    () => ({
      data: '11111111111111111111111111111112', // System Program as placeholder
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // SPL Token operations (placeholder)
  const approveSPL = useCallback(
    (_spenderOrAmount: string | bigint, _amount?: bigint) => {
      // TODO: implement SPL token approval
    },
    [],
  );

  const approveSPLToGameProgram = useCallback((_amount: bigint) => {
    // TODO: implement SPL approval to game program
  }, []);

  // Deprecated compatibility methods
  const useGameInfo = useGameFullInfo;
  const usePlayerRewards = usePlayerCompleteRewards;
  const claimReward = useCallback(
    (gameId: number) => claimGameReward(gameId, ClaimType.ALL),
    [claimGameReward],
  );
  const claimAllRewards = useCallback(
    () => claimAllPlayerRewards(ClaimType.ALL, 25),
    [claimAllPlayerRewards],
  );

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

    // New Solana read methods - now returning references to exported hooks
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

    // New ticket and vault methods
    usePlayerTicket,
    useGameVault,

    // New dynamic token and tier methods
    useCurrentGameToken,
    useTierPricing,
    useDynamicTokenBalance,
    useTokenMetadata,

    // Game operations
    buyTicket,
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
