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
  solanaEnabled: boolean;
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

  // 获取入场费
  const { data: entryFee } = blockchain.useEntryFee();

  // 获取游戏信息 - 直接使用服务器返回的稳定gameId
  const currentGameId = useMemo(() => {
    // 确保gameCounter是一个有效的数字（包括0）
    if (typeof gameCounter === 'number' && gameCounter >= 0) {
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

  // 检查玩家是否已加入 - 使用 useMemo 优化性能
  const isPlayerJoined = useMemo(() => {
    return address && gamePlayers && Array.isArray(gamePlayers)
      ? gamePlayers.includes(address)
      : false;
  }, [address, gamePlayers]);

  // —— 用 useMemo 提取最细粒度的标量依赖 ——

  // 2) 服务器状态：phase 和 isRaceServer
  const serverPhase = serverInfo?.gameStatus?.phase;
  const isRaceServer = useMemo(() => {
    const result = !!(
      serverInfo?.isRaceServer && serverInfo?.blockchainEnabled
    );

    // 🔍 Debug: Log race server detection
    logger.debug('🔍 Race server detection:', {
      isRaceServer: serverInfo?.isRaceServer,
      blockchainEnabled: serverInfo?.blockchainEnabled,
      solanaEnabled: serverInfo?.solanaEnabled,
      serverType: serverInfo?.serverType,
      result,
      serverInfo: !!serverInfo,
    });

    return result;
  }, [serverInfo?.isRaceServer, serverInfo?.blockchainEnabled]);

  // 3) 玩家列表长度
  const registeredCount = useMemo(() => {
    return Array.isArray(gamePlayers) ? gamePlayers.length : 0;
  }, [gamePlayers]);

  // 4) 入场费 - 转换为 BigInt
  const entryFeeBigInt = useMemo(() => {
    return typeof entryFee === 'bigint'
      ? entryFee
      : BigInt(String(entryFee || 0));
  }, [entryFee]);

  // 5) 服务器玩家数量
  const serverPlayerCount = serverInfo?.playerCnt || 0;

  /**
   * 获取服务器信息 - 优化为减少重复调用，修复连接问题
   */
  const fetchServerInfo = useCallback(async () => {
    if (!serverUrl) {
      console.warn('⚠️ No serverUrl provided to fetchServerInfo');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 🔧 修复：确保URL格式正确
      const cleanServerUrl = serverUrl.replace(/\/$/, ''); // 移除末尾斜杠
      const finalUrl = cleanServerUrl.startsWith('http')
        ? `${cleanServerUrl}/serverinfo`
        : `http://${cleanServerUrl}/serverinfo`;

      console.log('🔗 Fetching server info from:', finalUrl);

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // 添加超时处理
        signal: AbortSignal.timeout(10000), // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const info: ServerInfo = await response.json();

      // 🔍 Debug: Log server info for race server detection
      logger.debug('🔍 Server info received:', {
        isRaceServer: info.isRaceServer,
        blockchainEnabled: info.blockchainEnabled,
        solanaEnabled: info.solanaEnabled,
        serverType: info.serverType,
        gameStatus: info.gameStatus,
        gameId: info.gameStatus?.gameId,
        phase: info.gameStatus?.phase,
        timestamp: info.timestamp,
        url: finalUrl,
      });

      // 只在信息真正变化时更新状态
      setServerInfo((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(info)) {
          return prev; // 没有变化，返回原对象
        }
        return info;
      });
    } catch (err) {
      const error = err as Error;
      const errorMessage =
        error.name === 'TimeoutError'
          ? `Server connection timeout (${serverUrl})`
          : error.message;

      logger.error('Failed to fetch server info:', {
        serverUrl,
        error: errorMessage,
        errorType: error.name,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [serverUrl]);

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

    // 🔍 Debug: Log server URL
    logger.debug('🔍 useGameState serverUrl:', serverUrl);

    let mounted = true;

    // 立即获取一次数据
    const initialFetch = async () => {
      if (mounted) {
        try {
          // 🔧 修复：确保URL格式正确
          const cleanServerUrl = serverUrl.replace(/\/$/, '');
          const finalUrl = cleanServerUrl.startsWith('http')
            ? `${cleanServerUrl}/serverinfo`
            : `http://${cleanServerUrl}/serverinfo`;

          console.log('🔗 Initial fetch from:', finalUrl);

          const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
          });

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
            const error = err as Error;
            const errorMessage =
              error.name === 'TimeoutError'
                ? `Server connection timeout (${serverUrl})`
                : error.message;
            setError(errorMessage);

            logger.error('Initial fetch failed:', {
              serverUrl,
              error: errorMessage,
              errorType: error.name,
            });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 移除unstable refetch依赖

  // —— Effect A：单纯同步 gameId ——
  useEffect(() => {
    if (currentGameId === null) return;
    setGameState((prev) => {
      // 只更新 gameId，保留其它字段不变
      if (prev.gameId === currentGameId) return prev;
      logger.debug('🎮 GameId changed:', {
        from: prev.gameId,
        to: currentGameId,
      });
      return { ...prev, gameId: currentGameId };
    });
  }, [currentGameId]);

  // —— Effect B：监听业务字段变化，带"值比较"守卫 ——
  useEffect(() => {
    if (currentGameId === null) return; // 还没拿到 ID，就不更新

    // 1) 决定 phase：优先用链上/服务端的 phase，否则如果是 race server 则默认 waiting
    const phase: GamePhase = serverPhase
      ? serverPhase
      : isRaceServer
        ? 'waiting'
        : 'initializing';

    // 2) 计算 canJoin
    const canJoin = phase === 'waiting' && !isPlayerJoined;

    // 3) 计算 totalPrize
    const totalPrize = entryFeeBigInt * BigInt(registeredCount);

    // 4) 构造下一版 state
    const nextState: GameState = {
      gameId: currentGameId,
      phase,
      playerCount: serverPlayerCount,
      registeredCount,
      entryFee: entryFeeBigInt,
      totalPrize,
      isPlayerJoined,
      canJoin,
      timeRemaining: 0, // 先保留原样 / TODO
      lastUpdated: Date.now(),
    };

    // 5) 只有当关键字段真的变了，才 setState
    setGameState((prev) => {
      const noChange =
        prev.phase === nextState.phase &&
        prev.registeredCount === nextState.registeredCount &&
        prev.entryFee === nextState.entryFee &&
        prev.totalPrize === nextState.totalPrize &&
        prev.isPlayerJoined === nextState.isPlayerJoined &&
        prev.canJoin === nextState.canJoin &&
        prev.playerCount === nextState.playerCount;

      if (noChange) {
        return prev; // 同一个引用，不会触发重新渲染
      }
      return nextState;
    });
  }, [
    currentGameId,
    serverPhase,
    isRaceServer,
    registeredCount,
    entryFeeBigInt,
    isPlayerJoined,
    serverPlayerCount,
  ]);

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
