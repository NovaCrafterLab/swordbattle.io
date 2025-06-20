import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useBlockchain } from './useBlockchain';

// 游戏状态类型
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

  // 获取当前游戏ID
  const { data: gameCounter } = blockchain.useGameCounter();
  
  // 获取入场费
  const { data: entryFee } = blockchain.useEntryFee();

  // 获取游戏信息
  const currentGameId = gameCounter ? Number(gameCounter) : 0;
  const { data: gameInfo, refetch: refetchGameInfo } = blockchain.useGameInfo(currentGameId);
  
  // 获取游戏玩家列表
  const { data: gamePlayers, refetch: refetchPlayers } = blockchain.useGamePlayers(currentGameId);

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
      if (info.gameStatus) {
        setGameState(prev => ({
          ...prev,
          gameId: info.gameStatus.gameId,
          phase: info.gameStatus.phase,
          playerCount: info.gameStatus.activePlayersCount,
          registeredCount: info.gameStatus.registeredPlayersCount,
          lastUpdated: Date.now(),
        }));
      }
    } catch (err) {
      console.error('Failed to fetch server info:', err);
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

    const newGameState: GameState = {
      gameId: currentGameId,
      phase: serverInfo?.gameStatus?.phase || 'initializing',
      playerCount: serverInfo?.playerCnt || 0,
      registeredCount: playersArray.length,
      entryFee: entryFeeBigInt,
      totalPrize: entryFeeBigInt * BigInt(playersArray.length),
      isPlayerJoined,
      canJoin: !isPlayerJoined && (serverInfo?.gameStatus?.phase === 'waiting'),
      timeRemaining: 0, // TODO: 计算剩余时间
      lastUpdated: Date.now(),
    };

    setGameState(newGameState);
  }, [gameCounter, entryFee, currentGameId, serverInfo, gamePlayers, isPlayerJoined]);

  /**
   * 刷新游戏数据
   */
  const refreshGameData = useCallback(async () => {
    await Promise.all([
      refetchGameInfo(),
      refetchPlayers(),
      fetchServerInfo(),
    ]);
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

    fetchServerInfo();
    const interval = setInterval(fetchServerInfo, 5000); // 每5秒刷新一次

    return () => clearInterval(interval);
  }, [fetchServerInfo]);

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