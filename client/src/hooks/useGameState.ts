import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBlockchain } from './useBlockchain';
import logger from '@/utils/logger';

export type GamePhase =
  | 'initializing'
  | 'waiting'
  | 'active'
  | 'ending'
  | 'ended';

export interface GameState {
  gameId: number | null;
  phase: GamePhase;
  playerCount: number;
  registeredCount: number;
  entryFee: bigint;
  totalPrize: bigint;
  isPlayerJoined: boolean;
  canJoin: boolean;
  timeRemaining: number;
  lastUpdated: number;
}

export interface ServerInfo {
  tps: number;
  entityCnt: number;
  playerCnt: number;
  realPlayersCnt: number;
  serverType: string;
  isRaceServer: boolean;
  environment: any;
  blockchainEnabled: boolean;
  blockchainStatus: any;
  blockchainConfig?: {
    gameLevel: number;
    environment: string;
    chainId: number;
  };
  gameStatus: any;
  timestamp: number;
}

/**
 * 游戏状态管理hook
 */
export const useGameState = (serverUrl?: string) => {
  const { publicKey } = useWallet();
  const address = publicKey?.toString();
  const blockchain = useBlockchain();

  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    phase: 'initializing',
    playerCount: 0,
    registeredCount: 0,
    entryFee: BigInt(0),
    totalPrize: BigInt(0),
    isPlayerJoined: false,
    canJoin: false,
    timeRemaining: 0,
    lastUpdated: 0,
  });

  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前游戏ID - 使用稳定的服务器获取方式
  const { data: gameCounter } = blockchain.useGameCounter();

  // 添加gameCounter调试信息
  logger.debug('🎯 GameCounter debug:', {
    gameCounter,
    gameCounterType: typeof gameCounter,
    gameCounterValue: gameCounter,
    isNumber: typeof gameCounter === 'number',
    isBigInt: typeof gameCounter === 'bigint',
    isGreaterEqualZero:
      (typeof gameCounter === 'number' && gameCounter >= 0) ||
      (typeof gameCounter === 'bigint' && gameCounter >= 0n),
    condition: gameCounter !== null && gameCounter !== undefined,
    serverGameId: serverInfo?.gameStatus?.gameId,
  });

  // 获取入场费
  const { data: entryFee } = blockchain.useEntryFee();

  // 获取游戏信息 - 直接使用服务器返回的稳定gameId
  const currentGameId = useMemo(() => {
    // 确保gameCounter是一个有效的数字
    if (typeof gameCounter === 'number' && gameCounter > 0) {
      return gameCounter;
    }
    return null;
  }, [gameCounter]);

  logger.debug('🎮 CurrentGameId calculation:', {
    gameCounter,
    serverGameId: serverInfo?.gameStatus?.gameId,
    currentGameId,
    gameCounterType: typeof gameCounter,
    source:
      serverInfo?.gameStatus?.gameId !== null &&
      serverInfo?.gameStatus?.gameId !== undefined
        ? 'server'
        : 'blockchain',
  });

  const { refetch: refetchGameInfo } = blockchain.useGameInfo(
    currentGameId || 0,
  );

  // 获取游戏玩家列表
  const { data: gamePlayers, refetch: refetchPlayers } =
    blockchain.useGamePlayers(currentGameId || 0);

  // 检查玩家是否已加入
  const isPlayerJoined =
    address && gamePlayers && Array.isArray(gamePlayers)
      ? gamePlayers.includes(address)
      : false;

  /**
   * 获取服务器信息 - 优化为减少重复调用
   */
  const fetchServerInfo = useCallback(async () => {
    if (!serverUrl) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${serverUrl}/serverinfo`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const info: ServerInfo = await response.json();

      // 只在信息真正变化时更新状态
      setServerInfo((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(info)) {
          return prev; // 没有变化，返回原对象
        }
        return info;
      });
    } catch (err) {
      logger.error('Failed to fetch server info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [serverUrl]);

  /**
   * 更新游戏状态
   */
  const updateGameState = useCallback(() => {
    // 只有当有有效的gameId时才更新状态
    if (!currentGameId || currentGameId <= 0) return;

    const playersArray = Array.isArray(gamePlayers) ? gamePlayers : [];
    const entryFeeBigInt =
      typeof entryFee === 'bigint' ? entryFee : BigInt(String(entryFee || 0));

    // 简化状态逻辑：主要依赖服务器数据
    const phase: GamePhase = (() => {
      if (serverInfo?.gameStatus?.phase) {
        return serverInfo.gameStatus.phase;
      }
      // 如果服务器连通且是比赛服务器，默认为等待状态
      if (serverInfo?.isRaceServer && serverInfo?.blockchainEnabled) {
        return 'waiting';
      }
      return 'initializing';
    })();

    const newGameState: GameState = {
      gameId: currentGameId,
      phase,
      playerCount: serverInfo?.playerCnt || 0,
      registeredCount: playersArray.length,
      entryFee: entryFeeBigInt,
      totalPrize: entryFeeBigInt * BigInt(playersArray.length),
      isPlayerJoined,
      canJoin: !isPlayerJoined && phase === 'waiting',
      timeRemaining: 0, // TODO: 计算剩余时间
      lastUpdated: Date.now(),
    };

    // 只在gameId真正变化时记录日志
    setGameState((prev) => {
      if (prev.gameId !== newGameState.gameId) {
        logger.debug('🎮 GameId changed:', {
          from: prev.gameId,
          to: newGameState.gameId,
        });
      }
      return newGameState;
    });
  }, [currentGameId, serverInfo, gamePlayers, isPlayerJoined, entryFee]);

  /**
   * 刷新游戏数据 - 添加防抖机制防止频繁调用
   */
  const refreshGameData = useCallback(async () => {
    logger.info('🔄 Refreshing game data...');

    try {
      // 使用Promise.allSettled避免单个失败影响整体
      const refreshPromises = [
        refetchGameInfo?.(),
        refetchPlayers?.(),
        fetchServerInfo(),
      ].filter(Boolean);

      const results = await Promise.allSettled(refreshPromises);

      // 检查是否有失败的请求
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        logger.warn('⚠️ Some refresh operations failed:', failed);
      } else {
        logger.info('✅ Game data refreshed successfully');
      }
    } catch (error) {
      logger.error('❌ Failed to refresh game data:', error);
    }
  }, [refetchGameInfo, refetchPlayers, fetchServerInfo]);

  /**
   * 检查服务器是否为比赛服务器
   */
  const isRaceServer =
    serverInfo?.isRaceServer && serverInfo?.blockchainEnabled;

  /**
   * 获取游戏状态显示文本
   */
  const getGameStatusText = () => {
    switch (gameState.phase) {
      case 'initializing':
        return 'Initializing game...';
      case 'waiting':
        return `Waiting for players (${gameState.registeredCount} joined)`;
      case 'active':
        return `Game in progress (${gameState.playerCount} players)`;
      case 'ending':
        return 'Game ending...';
      case 'ended':
        return 'Game ended';
      default:
        return 'Unknown status';
    }
  };

  /**
   * 获取游戏状态颜色
   */
  const getGameStatusColor = () => {
    switch (gameState.phase) {
      case 'initializing':
        return 'orange';
      case 'waiting':
        return 'blue';
      case 'active':
        return 'green';
      case 'ending':
        return 'yellow';
      case 'ended':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // 定期刷新数据 - 修复无限循环和过度请求
  useEffect(() => {
    if (!serverUrl) return;

    let mounted = true;

    // 立即获取一次数据
    const initialFetch = async () => {
      if (mounted) {
        try {
          const response = await fetch(`${serverUrl}/serverinfo`);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const info: ServerInfo = await response.json();
          if (mounted) {
            setServerInfo(info);
            setError(null);
          }
        } catch (err) {
          if (mounted) {
            setError(err instanceof Error ? err.message : 'Unknown error');
          }
        }
      }
    };

    initialFetch();

    // 修复：减少到90秒一次，避免过于频繁的请求和 429 错误
    const interval = setInterval(() => {
      if (mounted) {
        initialFetch();
      }
    }, 90000); // 从30秒增加到90秒

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [serverUrl]); // 只依赖serverUrl，避免依赖循环

  // 初始化数据获取 - 只在组件挂载时执行一次
  useEffect(() => {
    if (serverUrl) {
      logger.info('🎯 Initial data fetch for modal...');

      // 使用Promise.allSettled避免单个请求失败影响其他请求
      Promise.allSettled([refetchGameInfo?.(), refetchPlayers?.()]).catch(
        (error) => {
          logger.error('Initial data fetch error:', error);
        },
      );
    }
  }, [serverUrl, refetchGameInfo, refetchPlayers]); // 添加refetch依赖但确保它们是稳定的

  // 更新游戏状态 - 使用稳定的依赖项，避免过度更新
  useEffect(() => {
    updateGameState();
  }, [currentGameId, serverInfo, gamePlayers, isPlayerJoined, entryFee]); // 直接依赖数据而不是函数

  return {
    gameState,
    serverInfo,
    isLoading,
    error,
    isRaceServer,
    refreshGameData,
    getGameStatusText,
    getGameStatusColor,

    // 便捷访问
    gameId: gameState.gameId,
    phase: gameState.phase,
    canJoin: gameState.canJoin,
    isPlayerJoined: gameState.isPlayerJoined,
  };
};
