// Solana blockchain interaction hook
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

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

      console.log(
        `💰 SOL Balance for ${walletAddress}: ${lamports / LAMPORTS_PER_SOL} SOL`,
      );
    } catch (err) {
      const error = err as Error;
      console.error(
        `❌ Failed to fetch SOL balance for ${walletAddress}:`,
        error,
      );
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
      console.log(
        `🎮 Game Counter from server: ${currentGameId} (source: ${serverInfo?.gameStatus?.gameId ? 'gameStatus' : 'solanaGameId'})`,
      );
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Failed to fetch game counter:`, error);
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
      setBalance(BigInt(tokenAccount.amount.toString()));

      console.log(
        `💰 SPL Token Balance for ${walletAddress}: ${tokenAccount.amount.toString()} tokens`,
      );
    } catch (err) {
      const error = err as Error;
      console.log(
        `ℹ️ No SPL token account found for ${walletAddress} (${tokenMintAddress.slice(0, 8)}...)`,
      );
      setError(null); // Don't treat missing token account as error
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
 * Hook to get current game token information dynamically from server
 * 优化：直接从 /serverinfo 获取 token 信息，避免额外的 API 调用
 */
export const useCurrentGameToken = () => {
  const [tokenInfo, setTokenInfo] = useState<{
    tokenMint: string;
    tokenSymbol: string;
    tokenName: string;
    isSOL: boolean;
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
        console.log('🔄 Using fallback token mint from server config');
      }

      if (!tokenMint) {
        throw new Error('Token mint information not available');
      }

      // Map token address to symbol and name
      let tokenSymbol = 'UNKNOWN';
      let tokenName = 'Unknown Token';

      // 使用 tokenInfo 中的信息，或基于 tokenMint 地址判断
      if (
        tokenInfoData?.isSOL ||
        tokenMint === 'So11111111111111111111111111111111111111112'
      ) {
        tokenSymbol = 'SOL';
        tokenName = 'Solana';
      } else if (
        tokenInfoData?.isUSDC ||
        tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
      ) {
        tokenSymbol = 'USDC';
        tokenName = 'USD Coin';
      } else {
        // Try to get token metadata from on-chain (simplified)
        tokenSymbol = tokenMint.slice(0, 4) + '...';
        tokenName = 'Custom Token';
      }

      const gameTokenInfo = {
        tokenMint,
        tokenSymbol,
        tokenName,
        isSOL:
          tokenInfoData?.isSOL ||
          tokenMint === 'So11111111111111111111111111111111111111112',
        isUSDC:
          tokenInfoData?.isUSDC ||
          tokenMint === 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
        gameId: gameStatus.gameId?.toString() || '0',
        tier: 'low', // 默认 tier，可以从服务器配置获取
        canBuyTickets: true, // 默认允许购买
        retrievalMethod: 'serverinfo-optimized', // 标记为优化版本
      };

      setTokenInfo(gameTokenInfo);

      console.log('🎯 Current game token info from serverinfo:', {
        symbol: tokenSymbol,
        address: tokenMint.slice(0, 8) + '...',
        gameId: gameTokenInfo.gameId,
        method: 'serverinfo-optimized',
        source: gameStatus.tokenMint ? 'gameStatus' : 'fallback',
      });
    } catch (err) {
      const error = err as Error;
      console.error(
        '❌ Failed to fetch current game token from serverinfo:',
        error,
      );
      setError(error);
      setTokenInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

      console.log(`🎯 Tier pricing for ${tier}:`, {
        entranceFee: Number(config.entranceFee) / LAMPORTS_PER_SOL,
        killReward: Number(config.killReward) / LAMPORTS_PER_SOL,
      });
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Failed to get tier pricing for ${tier}:`, error);
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
    // Return appropriate balance based on token type
    if (gameToken.data?.isSOL) {
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
  const { connection } = useConnection();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!gameId || !playerAddress || !connection) {
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

      console.log(
        `🎫 Player ticket for game ${gameId}:`,
        result.ticket ? 'HAS TICKET' : 'NO TICKET',
      );
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Failed to fetch player ticket:`, error);
      setError(error);
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, playerAddress, connection]);

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
  const { connection } = useConnection();
  const [vault, setVault] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVault = useCallback(async () => {
    if (!gameId || !connection) {
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

      console.log(`🏦 Game vault ${gameId}:`, result.vault);
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Failed to fetch game vault:`, error);
      setError(error);
      setVault(null);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, connection]);

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
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Return Solana wallet state
  const isConnected = connected;
  const address = publicKey?.toString();

  // Only log on connection state changes, not every render
  useEffect(() => {
    console.log(
      `🔗 useBlockchain: Solana - Connected: ${isConnected}, Address: ${address?.slice(0, 10)}...`,
    );
  }, [isConnected, address]);

  // Placeholder implementations for backward compatibility
  const useGameFullInfo = useCallback(
    (gameId: number) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useActiveGames = useCallback(
    (level: number = 0, limit: number = 10) => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerCurrentGames = useCallback(
    (playerAddress: string) => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useGameStats = useCallback(
    (startTime: number, endTime: number) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerStats = useCallback(
    (playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerCompleteRewards = useCallback(
    (gameId: number, playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerAllRewards = useCallback(
    (playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerDashboard = useCallback(
    (playerAddress: string) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerClaimableGames = useCallback(
    (playerAddress: string, maxGames: number = 25) => ({
      data: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // Game operations - buy ticket implementation with dynamic token and tier support
  const buyTicket = useCallback(
    async (gameId: number, tier: string = 'low', playerLevel: number = 1) => {
      if (!isConnected || !address) {
        throw new Error('Wallet not connected');
      }

      try {
        console.log(
          `🎫 Buying ticket for game ${gameId}, tier: ${tier}, level: ${playerLevel}`,
        );

        // Get tier pricing to determine the correct amount
        const tierPricing = await new Promise<any>((resolve, reject) => {
          const tierConfigs = {
            low: { entranceFee: BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL)) },
            medium: {
              entranceFee: BigInt(Math.floor(0.05 * LAMPORTS_PER_SOL)),
            },
            high: { entranceFee: BigInt(Math.floor(0.1 * LAMPORTS_PER_SOL)) },
          };
          const config = tierConfigs[tier as keyof typeof tierConfigs];
          if (config) resolve(config);
          else reject(new Error(`Invalid tier: ${tier}`));
        });

        const amount = tierPricing.entranceFee.toString();

        // Call server to handle ticket purchase with tier validation
        const serverUrl =
          localStorage.getItem('selectedServer') || 'localhost:8000';
        const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
        const buyTicketUrl = `${protocol}://${serverUrl}/api/buy-ticket`;

        const response = await fetch(buyTicketUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId,
            amount,
            walletAddress: address,
            tier,
            playerLevel,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to buy ticket');
        }

        console.log(
          `✅ Secure ticket purchased successfully - Tier: ${tier}, TX: ${result.txHash}`,
        );
        return result;
      } catch (error) {
        console.error(`❌ Failed to buy ticket:`, error);
        throw error;
      }
    },
    [isConnected, address],
  );

  const joinGame = useCallback(
    (gameId: number, tier: string = 'low', playerLevel: number = 1) => {
      console.log(
        `🎮 Joining game ${gameId} with tier ${tier} and level ${playerLevel}`,
      );
      return buyTicket(gameId, tier, playerLevel);
    },
    [buyTicket],
  );

  const smartJoinGame = useCallback(
    (level: number = 0, maxWaitTime: number = 300) => {
      console.log(
        `🎮 Smart joining Solana game level ${level} - TODO: implement`,
      );
    },
    [],
  );

  const joinMultipleGames = useCallback((gameIds: number[]) => {
    console.log(
      `🎮 Joining multiple Solana games ${gameIds} - TODO: implement`,
    );
  }, []);

  // Reward claiming - placeholder implementations
  const claimGameReward = useCallback(
    (gameId: number, claimType: ClaimType = ClaimType.ALL) => {
      console.log(
        `💰 Claiming Solana rewards for game ${gameId}, type ${claimType} - TODO: implement`,
      );
    },
    [],
  );

  const claimAllPlayerRewards = useCallback(
    (claimType: ClaimType = ClaimType.ALL, maxGames: number = 25) => {
      console.log(
        `💰 Claiming all Solana rewards, type ${claimType}, max ${maxGames} games - TODO: implement`,
      );
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
    (level: number = 0) => ({
      data: BigInt(1000000), // 0.001 SOL in lamports
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useLevelConfig = useCallback(
    (level: number) => ({
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
    (gameId: number) => ({
      data: [] as string[],
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerNonce = useCallback(
    (playerAddress: string) => ({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const usePlayerScore = useCallback(
    (gameId: number, playerAddress: string) => ({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  const useCanClaimReward = useCallback(
    (gameId: number, playerAddress: string) => ({
      data: false,
      isLoading: false,
      error: null,
      refetch: () => {},
    }),
    [],
  );

  // SPL Token allowance (placeholder)
  const useSPLAllowance = useCallback(
    (owner: string, spender: string) => ({
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
    (spenderOrAmount: string | bigint, amount?: bigint) => {
      console.log(`🪙 Approving SPL tokens - TODO: implement`);
    },
    [],
  );

  const approveSPLToGameProgram = useCallback((amount: bigint) => {
    console.log(`🪙 Approving SPL to game program - TODO: implement`);
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
