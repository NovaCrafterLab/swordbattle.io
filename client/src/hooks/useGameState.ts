import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useBlockchain } from './useBlockchain';
import logger from '@/utils/logger';

export type GamePhase = 'initializing' | 'waiting' | 'active' | 'ending' | 'ended';

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
  const { address } = useAccount();
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

  // 获取当前游戏ID - 优先使用服务器返回的gameId
  const { data: gameCounter } = blockchain.useGameCounter();

  // 添加gameCounter调试信息
  logger.debug('🎯 GameCounter debug:', {
    gameCounter,
    gameCounterType: typeof gameCounter,
    gameCounterValue: gameCounter,
    isNumber: typeof gameCounter === 'number',
    isBigInt: typeof gameCounter === 'bigint',
    isGreaterEqualZero: (typeof gameCounter === 'number' && gameCounter >= 0) || (typeof gameCounter === 'bigint' && gameCounter >= 0n),
    condition: (gameCounter !== null && gameCounter !== undefined),
    serverGameId: serverInfo?.gameStatus?.gameId,
  });

  // 获取入场费
  const { data: entryFee } = blockchain.useEntryFee();

  // 获取游戏信息 - 优先使用服务器的gameId，否则使用区块链的gameCounter
  const currentGameId = (() => {
    // 优先使用服务器返回的gameId（这是当前活跃游戏的ID）
    if (serverInfo?.gameStatus?.gameId !== null && serverInfo?.gameStatus?.gameId !== undefined) {
      return serverInfo.gameStatus.gameId;
    }

    // 如果服务器没有返回gameId，使用区块链的gameCounter
    if (gameCounter === null || gameCounter === undefined) return null;
    if (typeof gameCounter === 'number') return gameCounter;
    if (typeof gameCounter === 'bigint') return Number(gameCounter);
    return null;
  })();

  logger.debug('🎮 CurrentGameId calculation:', {
    gameCounter,
    serverGameId: serverInfo?.gameStatus?.gameId,
    currentGameId,
    gameCounterType: typeof gameCounter,
    source: serverInfo?.gameStatus?.gameId !== null && serverInfo?.gameStatus?.gameId !== undefined ? 'server' : 'blockchain',
  });

  const { data: gameInfo, refetch: refetchGameInfo } = blockchain.useGameInfo(currentGameId || 0);

  // 获取游戏玩家列表
  const { data: gamePlayers, refetch: refetchPlayers } = blockchain.useGamePlayers(currentGameId || 0);

  // 检查玩家是否已加入
  const isPlayerJoined = address && gamePlayers && Array.isArray(gamePlayers) ?
    gamePlayers.includes(address.toLowerCase() as `0x${string}`) : false;

  /**
   * 获取服务器信息
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
      setServerInfo(info);
      // 更新游戏状态
      // if (info.gameStatus) {
      //   logger.info('🎮 Server returned gameStatus:', info.gameStatus);
      //   setGameState(prev => ({
      //     ...prev,
      //     gameId: info.gameStatus.gameId,
      //     phase: info.gameStatus.phase,
      //     playerCount: info.gameStatus.activePlayersCount,
      //     registeredCount: info.gameStatus.registeredPlayersCount,
      //     lastUpdated: Date.now(),
      //   }));
      // }
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
    if (!gameCounter || !entryFee) return;

    const playersArray = Array.isArray(gamePlayers) ? gamePlayers : [];
    const entryFeeBigInt = typeof entryFee === 'bigint' ? entryFee : BigInt(String(entryFee || 0));

    // 简化状态逻辑：主要依赖区块链数据
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
      canJoin: !isPlayerJoined && (phase === 'waiting'),
      timeRemaining: 0, // TODO: 计算剩余时间
      lastUpdated: Date.now(),
    };

    // logger.info('🎮 Game state updated:', {
    //   gameCounter,
    //   currentGameId,
    //   gameId: newGameState.gameId,
    //   phase: newGameState.phase,
    //   isRaceServer: serverInfo?.isRaceServer,
    //   blockchainEnabled: serverInfo?.blockchainEnabled,
    // });

    setGameState(newGameState);
  }, [gameCounter, entryFee, currentGameId, serverInfo, gamePlayers, isPlayerJoined]);

  /**
   * 刷新游戏数据
   */
  const refreshGameData = useCallback(async () => {
    logger.info('🔄 Refreshing game data...');

    // 强制刷新区块链数据
    const refreshPromises = [
      refetchGameInfo(),
      refetchPlayers(),
      fetchServerInfo(),
    ].filter(Boolean);

    await Promise.all(refreshPromises);

    logger.info('✅ Game data refreshed');
  }, [refetchGameInfo, refetchPlayers, fetchServerInfo]);

  /**
   * 检查服务器是否为比赛服务器
   */
  const isRaceServer = serverInfo?.isRaceServer && serverInfo?.blockchainEnabled;

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

  // 定期刷新数据
  useEffect(() => {
    if (!serverUrl) return;

    // 立即获取一次数据
    fetchServerInfo();

    // 然后定期刷新
    const interval = setInterval(() => {
      fetchServerInfo();
    }, 3000); // 改为3秒刷新一次，更频繁

    return () => clearInterval(interval);
  }, [fetchServerInfo]);

  // 在 modal 首次打开时立即刷新所有数据
  useEffect(() => {
    if (serverUrl) {
      logger.info('🎯 Initial data fetch for modal...');
      refreshGameData();
    }
  }, [serverUrl, refreshGameData]);

  // 更新游戏状态
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

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
