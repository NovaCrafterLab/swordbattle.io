import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useBlockchain } from './useBlockchain';
import { getSwordBattleContract } from '../config/walletConfig';

// 玩家数据类型
export interface PlayerGameData {
  gameId: number;
  score: number;
  reward: bigint;
  hasClaimed: boolean;
  rank: number;
  isWinner: boolean;
}

export interface PlayerProfile {
  address: string;
  usd1Balance: bigint;
  allowance: bigint;
  nonce: number;
  gameHistory: PlayerGameData[];
  totalRewards: bigint;
  totalGamesPlayed: number;
  winRate: number;
}

/**
 * 玩家数据管理hook
 */
export const usePlayerData = () => {
  const { address } = useAccount();
  const blockchain = useBlockchain();

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取USD1余额
  const { data: usd1Balance, refetch: refetchBalance } = blockchain.useUSD1Balance(address || '');

  // 获取USD1授权额度
  const { data: allowance, refetch: refetchAllowance } = blockchain.useUSD1Allowance(
    address || '',
    getSwordBattleContract().address
  );

  // 获取玩家nonce
  const { data: playerNonce, refetch: refetchNonce } = blockchain.usePlayerNonce(address || '');

  /**
   * 获取玩家特定游戏的数据
   */
  const getPlayerGameData = useCallback(async (gameId: number): Promise<PlayerGameData | null> => {
    if (!address) return null;

    try {
      // 获取玩家分数
      const { data: score } = blockchain.usePlayerScore(gameId, address);
      
      // 获取玩家奖励
      const { data: reward } = blockchain.usePlayerReward(gameId, address);
      
      // 检查是否已领取
      const { data: hasClaimed } = blockchain.useHasClaimedReward(gameId, address);

      const rewardBigInt = typeof reward === 'bigint' ? reward : BigInt(String(reward || 0));
      const hasClaimedBool = typeof hasClaimed === 'boolean' ? hasClaimed : false;

      return {
        gameId,
        score: score ? Number(score) : 0,
        reward: rewardBigInt,
        hasClaimed: hasClaimedBool,
        rank: 0, // TODO: 计算排名
        isWinner: rewardBigInt > BigInt(0),
      };
    } catch (err) {
      console.error(`Failed to get player data for game ${gameId}:`, err);
      return null;
    }
  }, [address, blockchain]);

  /**
   * 获取玩家游戏历史数据
   */
  const getPlayerHistory = useCallback(async (gameIds: number[]): Promise<PlayerGameData[]> => {
    if (!address || gameIds.length === 0) return [];

    try {
      const gameDataPromises = gameIds.map(gameId => getPlayerGameData(gameId));
      const gameDataResults = await Promise.all(gameDataPromises);
      
      return gameDataResults.filter((data): data is PlayerGameData => data !== null);
    } catch (err) {
      console.error('Failed to get player history:', err);
      return [];
    }
  }, [address, getPlayerGameData]);

  /**
   * 从API服务器获取玩家游戏历史
   */
  const fetchPlayerGameHistory = useCallback(async (): Promise<PlayerGameData[]> => {
    if (!address) return [];

    try {
      console.log('🎯 Fetching player game history from API for:', address);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || process.env.REACT_APP_API || 'http://localhost:8080'}/blockchain/players/${address}/history?limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📊 API game history response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch game history');
      }
      
      // 转换API数据为组件需要的格式
      const gameHistory: PlayerGameData[] = result.data.games.map((game: any) => ({
        gameId: game.gameId,
        score: game.score,
        reward: BigInt(Math.floor(parseFloat(game.reward) * 1e18)), // 转换为wei
        hasClaimed: game.hasClaimed,
        rank: game.rank || 0,
        isWinner: game.isWinner,
      }));
      
      console.log('🏆 Processed game history:', gameHistory);
      return gameHistory;
    } catch (err) {
      console.error('❌ Failed to fetch player game history:', err);
      return [];
    }
  }, [address]);

  /**
   * 刷新玩家数据
   */
  const refreshPlayerData = useCallback(async () => {
    if (!address) {
      setPlayerProfile(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 刷新基础数据并等待结果
      const [balanceResult, allowanceResult, nonceResult] = await Promise.all([
        refetchBalance(),
        refetchAllowance(),
        refetchNonce(),
      ]);

      // 从API获取玩家游戏历史
      const gameHistory = await fetchPlayerGameHistory();

      // 计算统计数据
      const totalRewards = gameHistory.reduce((sum, game) => sum + game.reward, BigInt(0));
      const totalGamesPlayed = gameHistory.length;
      const winCount = gameHistory.filter(game => game.isWinner).length;
      const winRate = totalGamesPlayed > 0 ? (winCount / totalGamesPlayed) * 100 : 0;

      // 使用最新获取的数据
      const latestBalance = balanceResult.data || BigInt(0);
      const latestAllowance = allowanceResult.data || BigInt(0);
      const latestNonce = nonceResult.data || 0;

      const usd1BalanceBigInt = typeof latestBalance === 'bigint' ? latestBalance : BigInt(String(latestBalance || 0));
      const allowanceBigInt = typeof latestAllowance === 'bigint' ? latestAllowance : BigInt(String(latestAllowance || 0));

      const profile: PlayerProfile = {
        address,
        usd1Balance: usd1BalanceBigInt,
        allowance: allowanceBigInt,
        nonce: latestNonce ? Number(latestNonce) : 0,
        gameHistory,
        totalRewards,
        totalGamesPlayed,
        winRate,
      };

      setPlayerProfile(profile);
    } catch (err) {
      console.error('Failed to refresh player data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [address, refetchBalance, refetchAllowance, refetchNonce, fetchPlayerGameHistory]);

  /**
   * 检查是否需要授权USD1代币
   */
  const needsApproval = useCallback((amount: bigint): boolean => {
    const currentAllowance = (typeof allowance === 'bigint' ? allowance : null) || 
                            playerProfile?.allowance || 
                            BigInt(0);
    return currentAllowance < amount;
  }, [allowance, playerProfile]);

  /**
   * 检查是否有足够的USD1余额
   */
  const hasSufficientBalance = useCallback((amount: bigint): boolean => {
    const currentBalance = (typeof usd1Balance === 'bigint' ? usd1Balance : null) || 
                          playerProfile?.usd1Balance || 
                          BigInt(0);
    return currentBalance >= amount;
  }, [usd1Balance, playerProfile]);

  /**
   * 格式化USD1金额
   */
  const formatUSD1Amount = useCallback((amount: bigint): string => {
    return formatEther(amount);
  }, []);

  /**
   * 获取玩家等级（基于总奖励）
   */
  const getPlayerLevel = useCallback((): number => {
    if (!playerProfile) return 1;
    
    const totalRewardsEth = Number(formatEther(playerProfile.totalRewards));
    
    // 简单的等级计算：每100 USD1为一级
    return Math.floor(totalRewardsEth / 100) + 1;
  }, [playerProfile]);

  /**
   * 获取玩家称号
   */
  const getPlayerTitle = useCallback((): string => {
    const level = getPlayerLevel();
    const winRate = playerProfile?.winRate || 0;

    if (level >= 10 && winRate >= 80) return 'Legendary Warrior';
    if (level >= 7 && winRate >= 70) return 'Master Fighter';
    if (level >= 5 && winRate >= 60) return 'Skilled Combatant';
    if (level >= 3 && winRate >= 50) return 'Experienced Player';
    if (level >= 2) return 'Novice Fighter';
    return 'Newcomer';
  }, [getPlayerLevel, playerProfile]);

  // 当地址变化时刷新数据
  useEffect(() => {
    if (address) {
      console.log('🔄 usePlayerData: Address changed, refreshing data for:', address);
      refreshPlayerData();
    } else {
      console.log('🔄 usePlayerData: No address, clearing profile');
      setPlayerProfile(null);
    }
  }, [address]); // 只依赖address，避免无限循环

  return {
    playerProfile,
    isLoading,
    error,
    refreshPlayerData,
    getPlayerGameData,
    getPlayerHistory,
    fetchPlayerGameHistory,
    needsApproval,
    hasSufficientBalance,
    formatUSD1Amount,
    getPlayerLevel,
    getPlayerTitle,
    
    // 便捷访问 - 改进逻辑，优先使用实时数据
    address,
    usd1Balance: (typeof usd1Balance === 'bigint' ? usd1Balance : null) || 
                 playerProfile?.usd1Balance || 
                 BigInt(0),
    allowance: (typeof allowance === 'bigint' ? allowance : null) || 
               playerProfile?.allowance || 
               BigInt(0),
    nonce: (typeof playerNonce === 'number' ? playerNonce : null) || 
           playerProfile?.nonce || 
           0,
    isConnected: !!address,
    
    // 添加数据获取状态
    isBalanceLoading: !usd1Balance && !!address,
    isAllowanceLoading: !allowance && !!address,
  };
}; 