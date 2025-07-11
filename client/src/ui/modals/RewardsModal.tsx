import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Modal from './Modal';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useBlockchain, PlayerDashboard } from '../../hooks/useBlockchain';
import './RewardsModal.scss';

interface RewardsModalProps {
  onClose: () => void;
}

interface GameReward {
  gameId: number;
  score: number;
  reward: bigint; // 总奖励
  usdReward: bigint; // USD奖励
  nclabReward: bigint; // NCLab奖励
  hasClaimed: boolean; // 是否已领取任何奖励
  usdClaimed: boolean; // USD是否已领取
  nclabClaimed: boolean; // NCLab是否已领取
  usdClaimable: boolean; // USD是否可领取
  nclabClaimable: boolean; // NCLab是否可领取
  nclabClaimableTime?: number; // NCLab可领取时间
  rank: number;
  isWinner: boolean;
  timestamp?: number;
  level?: number; // 游戏级别：0=LOW, 1=MEDIUM, 2=HIGH
  fragmentReward?: bigint; // 碎片奖励
  // Solana奖励字段
  solanaReward?: number; // Solana奖励金额 (SOL)
  solanaClaimed?: boolean; // Solana奖励是否已领取
  solanaClaimable?: boolean; // Solana奖励是否可领取
  rewardType?: 'BSC' | 'Solana'; // 奖励类型
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const wallet = useWallet();
  const {
    publicKey,
    connected: isConnected,
    signTransaction,
    sendTransaction,
  } = wallet;
  const signAndSendTransaction = (wallet as any).signAndSendTransaction;
  const address = publicKey?.toString();
  const blockchain = useBlockchain();
  const playerData = usePlayerData();

  // 调试钱包状态
  useEffect(() => {
    console.log('🔗 Wallet state debug:', {
      connected: isConnected,
      publicKey: publicKey?.toString(),
      hasSignTransaction: !!signTransaction,
      hasSendTransaction: !!sendTransaction,
      hasSignAndSendTransaction: !!signAndSendTransaction,
    });
  }, [
    isConnected,
    publicKey,
    signTransaction,
    sendTransaction,
    signAndSendTransaction,
  ]);

  // 获取玩家仪表板数据（包含碎片余额、奖励等所有信息）
  const { data: playerDashboardRaw } = blockchain.usePlayerDashboard(
    address || '',
  );
  const playerDashboard = playerDashboardRaw as PlayerDashboard | null;

  const [gameRewards, setGameRewards] = useState<GameReward[]>([]);
  const [solanaRewards, setSolanaRewards] = useState<GameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [showFilter, setShowFilter] = useState<
    'all' | 'claimable' | 'BSC' | 'Solana'
  >('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // 使用useRef跟踪正在进行的交易，防止React严格模式导致的重复调用
  const activeClaimRef = useRef<number | null>(null);

  // 全局交易锁，防止任何形式的重复调用
  const globalClaimLock = useRef<Set<number>>(new Set());

  // 重试函数
  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1);
  };

  // 组件挂载时立即刷新playerData
  useEffect(() => {
    if (address && isConnected) {
      // 每次打开RewardsModal都强制刷新数据，确保显示最新奖励
      setIsLoading(true);
      playerData.refreshPlayerData();
    } else {
      // 如果没有连接钱包，设置为非加载状态
      setIsLoading(false);
    }
  }, [address, isConnected]); // 依赖address和isConnected，确保钱包状态变化时重新执行

  // 获取Solana游戏历史数据
  const [solanaGameHistory, setSolanaGameHistory] = useState<any>(null);
  const [isSolanaLoading, setIsSolanaLoading] = useState(false);

  // 状态验证：确保前端状态与后端状态一致
  const validateClaimStatus = useCallback(
    async (gameId: number) => {
      console.log(`🔍 Validating claim status for game ${gameId}`);
      try {
        const response = await fetch(
          `http://localhost:8080/race-games/players/${address}/games?t=${Date.now()}`,
        );
        const data = await response.json();

        if (data.success) {
          const game = data.data.games.find((g: any) => g.gameId === gameId);
          if (game) {
            const shouldBeClaimed = game.hasClaimed;

            // 检查前端状态是否与后端一致
            setSolanaRewards((prev) => {
              const currentGame = prev.find((r) => r.gameId === gameId);
              if (
                currentGame &&
                currentGame.solanaClaimed !== shouldBeClaimed
              ) {
                console.log(
                  `🔧 Correcting state mismatch for game ${gameId}: frontend=${currentGame.solanaClaimed}, backend=${shouldBeClaimed}`,
                );
                return prev.map((reward) =>
                  reward.gameId === gameId
                    ? {
                        ...reward,
                        solanaClaimed: shouldBeClaimed,
                        solanaClaimable:
                          !shouldBeClaimed && reward.solanaReward! > 0,
                      }
                    : reward,
                );
              }
              return prev;
            });

            console.log(
              `✅ Claim status validation completed for game ${gameId}: ${shouldBeClaimed ? 'claimed' : 'not claimed'}`,
            );
          }
        }
      } catch (error) {
        console.warn(
          `⚠️ Failed to validate claim status for game ${gameId}:`,
          error,
        );
      }
    },
    [address],
  );

  // 获取Solana奖励数据
  const fetchSolanaRewards = useCallback(
    async (bustCache = false) => {
      if (!address) {
        console.log('⚠️ No address provided for Solana rewards fetch');
        return;
      }

      console.log(
        `🔍 Fetching Solana rewards for address: ${address}${bustCache ? ' (cache-busted)' : ''}`,
      );

      try {
        setIsSolanaLoading(true);
        // 添加timestamp参数破坏缓存
        const url = bustCache
          ? `http://localhost:8080/race-games/players/${address}/games?t=${Date.now()}`
          : `http://localhost:8080/race-games/players/${address}/games`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('📊 Solana rewards API response:', data);

        if (data.success) {
          setSolanaGameHistory(data);
          console.log('✅ Solana game history set successfully');
        } else {
          console.error('❌ API returned success: false', data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch Solana rewards:', error);
      } finally {
        setIsSolanaLoading(false);
      }
    },
    [address],
  );

  // 在组件挂载时获取Solana奖励
  useEffect(() => {
    console.log('🔄 Solana rewards fetch effect triggered:', {
      address,
      isConnected,
      retryTrigger,
      shouldFetch: address && isConnected,
    });

    if (address && isConnected) {
      console.log('🚀 Calling fetchSolanaRewards...');
      fetchSolanaRewards();
    } else {
      console.log(
        '⚠️ Skipping fetchSolanaRewards - missing address or not connected',
      );
    }
  }, [address, isConnected, retryTrigger, fetchSolanaRewards]);

  // 简化的数据获取逻辑 - 当playerData更新时同步到组件状态
  useEffect(() => {
    // 修改条件：只要playerData加载完成且有playerProfile就同步数据（包括空数据）
    if (
      !playerData.isLoading &&
      playerData.playerProfile?.gameHistory !== undefined
    ) {
      const gameRewardsData: GameReward[] =
        playerData.playerProfile.gameHistory.map((game) => ({
          gameId: game.gameId,
          score: game.score,
          reward: game.reward,
          usdReward: game.usdReward,
          nclabReward: game.nclabReward,
          hasClaimed: game.hasClaimed,
          usdClaimed: game.usdClaimed,
          nclabClaimed: game.nclabClaimed,
          usdClaimable: game.usdClaimable,
          nclabClaimable: game.nclabClaimable,
          nclabClaimableTime: game.nclabClaimableTime,
          rank: game.rank,
          isWinner: game.isWinner,
          timestamp: game.timestamp,
          level: game.level,
          rewardType: 'BSC',
        }));

      setGameRewards(gameRewardsData);
      setIsLoading(false);
    }
  }, [playerData.isLoading, playerData.playerProfile]);

  // 处理Solana游戏历史数据
  useEffect(() => {
    console.log('🔍 Solana game history effect triggered:', {
      solanaGameHistory: !!solanaGameHistory,
      success: solanaGameHistory?.success,
      hasData: !!solanaGameHistory?.data,
      gamesCount: solanaGameHistory?.data?.games?.length,
    });

    if (solanaGameHistory && solanaGameHistory.success) {
      console.log('🔍 Processing Solana game history:', solanaGameHistory);

      const solanaRewardsData: GameReward[] = solanaGameHistory.data.games.map(
        (game: any) => {
          const reward = parseFloat(game.reward || '0');
          const claimable = !game.hasClaimed && game.gameEnded;

          console.log(`🎮 Game ${game.gameId}:`, {
            reward,
            hasClaimed: game.hasClaimed,
            gameEnded: game.gameEnded,
            claimable,
          });

          return {
            gameId: game.gameId,
            score: game.score || 0,
            reward: BigInt(0), // BSC字段，设为0
            usdReward: BigInt(0), // BSC字段，设为0
            nclabReward: BigInt(0), // BSC字段，设为0
            hasClaimed: game.hasClaimed || false,
            usdClaimed: false, // BSC字段
            nclabClaimed: false, // BSC字段
            usdClaimable: false, // BSC字段
            nclabClaimable: false, // BSC字段
            rank: game.rank || 1,
            isWinner: game.isWinner || false,
            timestamp: game.timestamp,
            level: 0, // 默认低级别
            // Solana特有字段
            solanaReward: reward,
            solanaClaimed: game.hasClaimed || false,
            solanaClaimable: claimable,
            rewardType: 'Solana',
          };
        },
      );

      setSolanaRewards(solanaRewardsData);
      console.log(
        `✅ Loaded ${solanaRewardsData.length} Solana rewards:`,
        solanaRewardsData,
      );
    } else {
      console.log('⚠️ Solana game history not ready or failed:', {
        exists: !!solanaGameHistory,
        success: solanaGameHistory?.success,
        error: solanaGameHistory?.error,
      });
    }
  }, [solanaGameHistory]);

  // 手动重试时重新获取数据
  useEffect(() => {
    if (retryTrigger > 0 && address && isConnected) {
      setIsLoading(true);
      setFetchError(null);
      // 强制刷新，不使用缓存数据
      playerData.refreshPlayerData();
    }
  }, [retryTrigger, address, isConnected]);

  // 监听交易确认状态，自动刷新数据
  useEffect(() => {
    if (blockchain.isConfirmed && (claimingGameId || claimingAll)) {
      // 交易确认后，刷新玩家数据
      console.log('🎉 交易确认，刷新奖励数据...');
      setClaimingGameId(null);
      setClaimingAll(false);

      // 立即刷新数据，然后再次延迟刷新确保状态同步
      playerData.refreshPlayerData();

      // 延迟2秒后再次刷新，确保区块链状态完全更新
      setTimeout(() => {
        playerData.refreshPlayerData();
        console.log('🔄 二次刷新奖励数据完成');
      }, 2000);
    }
  }, [blockchain.isConfirmed, claimingGameId, claimingAll]);

  /**
   * 领取单个游戏奖励 (所有类型)
   */
  const handleClaimReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      blockchain.claimGameReward(gameId);
    } catch (error) {
      console.error('Failed to claim reward:', error);
      setClaimingGameId(null);
    }
  };

  /**
   * 领取指定游戏的USD奖励
   */
  const handleClaimUSDReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      blockchain.claimUSDRewards(gameId);
    } catch (error) {
      console.error('Failed to claim USD reward:', error);
      setClaimingGameId(null);
    }
  };

  /**
   * 领取指定游戏的NCLab奖励
   */
  const handleClaimNclabReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      blockchain.claimNclabRewards(gameId);
    } catch (error) {
      console.error('Failed to claim NCLab reward:', error);
      setClaimingGameId(null);
    }
  };

  /**
   * 测试钱包连接和服务器连接
   */
  const testWalletConnection = async () => {
    console.log('🧪 Starting comprehensive connection test...');

    // 1. 测试钱包状态
    console.log('🔗 Wallet state:', {
      connected: isConnected,
      publicKey: publicKey?.toString(),
      hasSignTransaction: !!signTransaction,
      hasSendTransaction: !!sendTransaction,
      hasSignAndSendTransaction: !!signAndSendTransaction,
    });

    if (!isConnected || !publicKey) {
      console.error('❌ Wallet not connected');
      alert('Please connect your wallet first');
      return;
    }

    // 2. 测试服务器连接
    try {
      console.log('🧪 Testing server connection...');
      const serverUrl =
        localStorage.getItem('selectedServer') || 'localhost:8000';
      const protocol = serverUrl.includes('localhost') ? 'http' : 'https';
      const pingUrl = `${protocol}://${serverUrl}/ping`;

      console.log(`📡 Testing ping to: ${pingUrl}`);
      const pingResponse = await fetch(pingUrl);

      if (pingResponse.ok) {
        const pingResult = await pingResponse.text();
        console.log(`✅ Server ping successful: ${pingResult}`);
      } else {
        throw new Error(
          `Ping failed: ${pingResponse.status} ${pingResponse.statusText}`,
        );
      }
    } catch (error) {
      console.error('❌ Server connection test failed:', error);
      alert(
        `Server connection failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return;
    }

    // 3. 测试Solana数据获取
    try {
      console.log('🧪 Testing Solana data fetch...');
      await fetchSolanaRewards();
      console.log('✅ Solana data fetch completed');
    } catch (error) {
      console.error('❌ Solana data fetch failed:', error);
    }

    // 4. 测试claim API
    try {
      console.log('🧪 Testing blockchain.claimGameReward function...');
      console.log(
        '📞 blockchain.claimGameReward type:',
        typeof blockchain.claimGameReward,
      );

      // Test with game 518
      await blockchain.claimGameReward(518);
    } catch (error) {
      console.error('❌ Claim test failed:', error);
      alert(
        `Claim test failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  /**
   * 领取指定游戏的Solana奖励
   */
  const handleClaimSolanaReward = useCallback(
    async (gameId: number) => {
      const timestamp = Date.now();
      const callId = `${gameId}-${timestamp}`;
      console.log(
        `🎯 [${callId}] handleClaimSolanaReward called for game ${gameId}`,
      );
      console.log(
        `🔗 [${callId}] Address: ${address}, Connected: ${isConnected}`,
      );
      console.log(`🔒 [${callId}] Current claiming state: ${claimingGameId}`);
      console.log(`📍 [${callId}] ActiveClaimRef: ${activeClaimRef.current}`);
      console.log(
        `🧵 [${callId}] Call stack:`,
        new Error().stack?.split('\n').slice(1, 4),
      );

      // 三重防重复调用保护
      if (globalClaimLock.current.has(gameId)) {
        console.warn(
          `⚠️ [${callId}] GLOBAL LOCK: Already claiming reward for game ${gameId}, ignoring duplicate call`,
        );
        return;
      }

      if (activeClaimRef.current === gameId) {
        console.warn(
          `⚠️ [${callId}] REF CHECK: Already claiming reward for game ${gameId}, ignoring duplicate call`,
        );
        return;
      }

      if (claimingGameId === gameId) {
        console.warn(
          `⚠️ [${callId}] STATE CHECK: Already claiming reward for game ${gameId}, ignoring duplicate call`,
        );
        return;
      }

      if (claimingGameId !== null || activeClaimRef.current !== null) {
        const currentClaim = claimingGameId || activeClaimRef.current;
        console.warn(
          `⚠️ [${callId}] BUSY: Already claiming reward for game ${currentClaim}, please wait`,
        );
        alert(`Please wait, already claiming reward for game ${currentClaim}`);
        return;
      }

      if (!address) {
        console.error('❌ No wallet address available');
        alert('Please connect your wallet first');
        return;
      }

      try {
        console.log(`🚀 [${callId}] Starting claim process for game ${gameId}`);

        // 设置三重保护
        globalClaimLock.current.add(gameId);
        activeClaimRef.current = gameId;
        setClaimingGameId(gameId);

        console.log(`🔒 [${callId}] All locks set for game ${gameId}`);

        console.log(`📞 Calling blockchain.claimGameReward(${gameId})`);
        console.log(
          '🔧 blockchain.claimGameReward function:',
          blockchain.claimGameReward,
        );

        const result = await blockchain.claimGameReward(gameId);
        console.log(`✅ Claim result:`, result);

        // 1. 立即更新前端状态（乐观更新）
        console.log(
          `🚀 Optimistically updating frontend state for game ${gameId}`,
        );
        setSolanaRewards((prev) =>
          prev.map((reward) =>
            reward.gameId === gameId
              ? { ...reward, solanaClaimed: true, solanaClaimable: false }
              : reward,
          ),
        );

        // 2. 更新数据库中的领取状态（带重试）
        console.log(`📝 Updating claim status in database for game ${gameId}`);
        let dbUpdateSuccess = false;
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const updateResponse = await fetch(
              `http://localhost:8080/race-games/games/${gameId}/players/${address}/claim`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimed: true }),
              },
            );

            if (updateResponse.ok) {
              console.log(
                `✅ Database claim status updated for game ${gameId} (attempt ${attempt})`,
              );
              dbUpdateSuccess = true;
              break;
            } else {
              console.warn(
                `⚠️ Database update attempt ${attempt} failed: ${updateResponse.statusText}`,
              );
              if (attempt === maxRetries) {
                console.error(
                  `❌ All ${maxRetries} database update attempts failed for game ${gameId}`,
                );
              }
            }
          } catch (dbError) {
            console.warn(
              `⚠️ Database update attempt ${attempt} error:`,
              dbError,
            );
            if (attempt === maxRetries) {
              console.error(
                `❌ All ${maxRetries} database update attempts failed for game ${gameId}`,
              );
            }
          }

          // 如果不是最后一次尝试，等待1秒再重试
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // 3. 刷新Solana奖励数据（立即 + 延迟验证）
        console.log(`🔄 Refreshing Solana rewards data`);
        await fetchSolanaRewards(true); // 破坏缓存的立即刷新

        // 延迟验证：2秒后再次检查状态确保一致性
        setTimeout(async () => {
          console.log(
            `🔍 Delayed verification: re-checking state for game ${gameId}`,
          );
          try {
            await validateClaimStatus(gameId);
            console.log(`✅ Delayed verification completed for game ${gameId}`);
          } catch (error) {
            console.warn(
              `⚠️ Delayed verification failed for game ${gameId}:`,
              error,
            );
          }
        }, 2000);

        // 清除三重保护
        globalClaimLock.current.delete(gameId);
        activeClaimRef.current = null;
        setClaimingGameId(null);
        console.log(
          `🎉 [${callId}] Claim process completed for game ${gameId}, all locks cleared`,
        );

        // 显示成功消息
        const successMessage = dbUpdateSuccess
          ? `Successfully claimed reward for game ${gameId}! Status updated in database. Transaction: ${result}`
          : `Successfully claimed reward for game ${gameId}! Transaction: ${result}\n(Note: Database sync may take a moment)`;

        alert(successMessage);
      } catch (error) {
        console.error(
          `❌ Failed to claim Solana reward for game ${gameId}:`,
          error,
        );

        // 提供更详细的错误信息
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;

          // 检查常见错误类型
          if (errorMessage.includes('User rejected')) {
            errorMessage = 'Transaction was cancelled by user';
          } else if (errorMessage.includes('insufficient funds')) {
            errorMessage = 'Insufficient SOL for transaction fees';
          } else if (errorMessage.includes('already withdrawn')) {
            errorMessage = 'Reward has already been claimed';
          } else if (errorMessage.includes('Network')) {
            errorMessage =
              'Network connection error. Please check your internet connection.';
          }
        }

        alert(errorMessage);

        // 清除三重保护
        globalClaimLock.current.delete(gameId);
        activeClaimRef.current = null;
        setClaimingGameId(null);
        console.log(
          `💥 [${callId}] Claim failed for game ${gameId}, all locks cleared`,
        );
      }
    },
    [
      address,
      isConnected,
      claimingGameId,
      blockchain,
      fetchSolanaRewards,
      validateClaimStatus,
    ],
  );

  /**
   * 领取所有奖励
   */
  const handleClaimAllRewards = async () => {
    if (!address) return;

    try {
      setClaimingAll(true);
      blockchain.claimAllPlayerRewards();
    } catch (error) {
      console.error('Failed to claim all rewards:', error);
      setClaimingAll(false);
    }
  };

  /**
   * 获取游戏级别显示
   */
  const getLevelDisplay = (level?: number) => {
    switch (level) {
      case 0:
        return { text: 'LOW', color: '#10b981' };
      case 1:
        return { text: 'MEDIUM', color: '#f59e0b' };
      case 2:
        return { text: 'HIGH', color: '#ef4444' };
      default:
        return { text: 'UNKNOWN', color: '#6b7280' };
    }
  };

  /**
   * 获取排名显示
   */
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇 1st';
    if (rank === 2) return '🥈 2nd';
    if (rank === 3) return '🥉 3rd';
    return `#${rank}`;
  };

  /**
   * 格式化时间
   */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // 监听交易确认
  useEffect(() => {
    if (blockchain.isConfirmed && claimingGameId) {
      // 更新奖励状态
      setGameRewards((prev) =>
        prev.map((reward) =>
          reward.gameId === claimingGameId
            ? { ...reward, hasClaimed: true }
            : reward,
        ),
      );
      setClaimingGameId(null);

      // 刷新玩家数据
      playerData.refreshPlayerData();
    }
  }, [blockchain.isConfirmed, claimingGameId]);

  // 合并BSC和Solana奖励，避免重复游戏ID
  const solanaGameIds = new Set(solanaRewards.map((r) => r.gameId));
  const filteredBscRewards = gameRewards.filter(
    (r) => !solanaGameIds.has(r.gameId),
  );
  const allRewards = [...filteredBscRewards, ...solanaRewards];

  console.log('🔍 Reward merge debug:', {
    bscRewards: gameRewards.length,
    solanaRewards: solanaRewards.length,
    solanaGameIds: Array.from(solanaGameIds),
    filteredBscRewards: filteredBscRewards.length,
    totalRewards: allRewards.length,
    // 详细的Solana奖励信息
    solanaRewardsDetail: solanaRewards.map((r) => ({
      gameId: r.gameId,
      solanaReward: r.solanaReward,
      solanaClaimable: r.solanaClaimable,
      solanaClaimed: r.solanaClaimed,
      rewardType: r.rewardType,
    })),
  });

  // 计算统计数据
  const totalRewards = gameRewards.reduce(
    (sum, reward) => sum + reward.reward,
    BigInt(0),
  );
  const unclaimedUsdRewards = gameRewards
    .filter((reward) => reward.usdClaimable)
    .reduce((sum, reward) => sum + reward.usdReward, BigInt(0));
  const unclaimedNclabRewards = gameRewards
    .filter((reward) => reward.nclabClaimable)
    .reduce((sum, reward) => sum + reward.nclabReward, BigInt(0));

  // Solana奖励统计
  const unclaimedSolanaRewards = solanaRewards
    .filter((reward) => reward.solanaClaimable)
    .reduce((sum, reward) => sum + (reward.solanaReward || 0), 0);

  const totalGames = allRewards.length;
  const winCount = allRewards.filter((reward) => reward.isWinner).length;
  const winRate =
    totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(1) : '0';

  // 可claim的奖励数量
  const claimableUsdCount = gameRewards.filter(
    (reward) => reward.usdClaimable,
  ).length;
  const claimableNclabCount = gameRewards.filter(
    (reward) => reward.nclabClaimable,
  ).length;
  const claimableSolanaCount = solanaRewards.filter(
    (reward) => reward.solanaClaimable,
  ).length;
  const claimableCount =
    claimableUsdCount + claimableNclabCount + claimableSolanaCount;
  const claimableAmount = unclaimedUsdRewards + unclaimedNclabRewards;

  // 根据过滤条件过滤对局
  const filteredRewards = (() => {
    let result;
    switch (showFilter) {
      case 'claimable':
        result = allRewards.filter(
          (reward) =>
            reward.usdClaimable ||
            reward.nclabClaimable ||
            reward.solanaClaimable,
        );
        break;
      case 'BSC':
        result = filteredBscRewards; // 使用过滤后的BSC奖励
        break;
      case 'Solana':
        result = solanaRewards;
        break;
      default:
        result = allRewards;
        break;
    }

    console.log('🔍 Filtered rewards debug:', {
      showFilter,
      allRewardsCount: allRewards.length,
      filteredResultCount: result.length,
      filteredRewardsDetail: result.map((r) => ({
        gameId: r.gameId,
        rewardType: r.rewardType,
        solanaReward: r.solanaReward,
        solanaClaimable: r.solanaClaimable,
        usdReward: r.usdReward?.toString(),
        usdClaimable: r.usdClaimable,
      })),
    });

    return result;
  })();

  // 检查是否正在获取数据
  const isDataLoading = isLoading || playerData.isLoading;

  const modalContent = (
    <div className="rewards-modal">
      <div className="rewards-header">
        <h2>🏆 My Rewards</h2>
        {address && (
          <div className="player-address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="not-connected">
          <p>Please connect your wallet to view rewards</p>
        </div>
      ) : isDataLoading ? (
        // 完整的加载状态UI - 避免显示空的统计信息
        <div className="rewards-loading">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <h3>Loading Your Rewards...</h3>
            <p>
              Fetching game history from database and reward info from
              blockchain
            </p>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '16px' }}>
              💾 Database → Game history, scores, rankings
              <br />
              🔗 Blockchain → Real-time reward amounts, claim status
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 统计概览 */}
          <div className="rewards-stats">
            <div className="stat-item">
              <label>Total Rewards</label>
              <span className="stat-value">
                {(Number(totalRewards) / LAMPORTS_PER_SOL).toFixed(4)} SOL
              </span>
            </div>
            <div className="stat-item">
              <label>Available to Claim</label>
              <span className="stat-value claimable">
                {(Number(claimableAmount) / LAMPORTS_PER_SOL).toFixed(4)} SOL
              </span>
            </div>
            <div className="stat-item">
              <label>Games Played</label>
              <span className="stat-value">{totalGames}</span>
            </div>
            <div className="stat-item">
              <label>Win Rate</label>
              <span className="stat-value">{winRate}%</span>
            </div>
          </div>

          {/* 奖励历史 */}
          <div className="rewards-history">
            <div className="history-header">
              <h3>Reward History</h3>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {/* 过滤选项 */}
                <div className="filter-options">
                  <button
                    className={`filter-btn ${showFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setShowFilter('all')}
                  >
                    All ({totalGames})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'claimable' ? 'active' : ''}`}
                    onClick={() => setShowFilter('claimable')}
                  >
                    Claimable ({claimableCount})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'BSC' ? 'active' : ''}`}
                    onClick={() => setShowFilter('BSC')}
                  >
                    BSC ({filteredBscRewards.length})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'Solana' ? 'active' : ''}`}
                    onClick={() => setShowFilter('Solana')}
                  >
                    Solana ({solanaRewards.length})
                  </button>

                  {/* 测试按钮 */}
                  <button
                    className="filter-btn"
                    onClick={testWalletConnection}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      marginLeft: '10px',
                    }}
                  >
                    🧪 Test Claim
                  </button>
                </div>

                {/* 批量领取按钮 */}
                {claimableCount > 1 && (
                  <button
                    onClick={handleClaimAllRewards}
                    disabled={
                      claimingAll ||
                      (playerDashboard
                        ? !playerDashboard.hasClaimableRewards
                        : false)
                    }
                    className="filter-btn"
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      opacity:
                        claimingAll ||
                        (playerDashboard
                          ? !playerDashboard.hasClaimableRewards
                          : false)
                          ? 0.6
                          : 1,
                    }}
                  >
                    {claimingAll
                      ? '🔄 Claiming...'
                      : `💰 Claim All (${claimableCount})`}
                  </button>
                )}

                {/* 刷新按钮 */}
                <button
                  onClick={handleRetry}
                  className="filter-btn"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {fetchError ? (
              <div className="error-state">
                <p>❌ {fetchError}</p>
                <button className="retry-btn" onClick={handleRetry}>
                  🔄 Retry
                </button>
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="no-rewards">
                {showFilter === 'claimable' ? (
                  <>
                    <p>No claimable rewards found</p>
                    <p>All your rewards have been claimed!</p>
                  </>
                ) : (
                  <>
                    <p>No game rewards found</p>
                    <p>Play some race games to earn rewards!</p>
                  </>
                )}
              </div>
            ) : (
              <div className="rewards-list">
                {filteredRewards.map((reward) => (
                  <div
                    key={reward.gameId}
                    className={`reward-item ${reward.isWinner ? 'winner' : 'loser'}`}
                  >
                    <div className="reward-info">
                      <div className="game-info">
                        <span className="game-id">Game #{reward.gameId}</span>
                        {reward.level !== undefined && (
                          <span
                            className="level-badge"
                            style={{
                              backgroundColor: getLevelDisplay(reward.level)
                                .color,
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7em',
                              fontWeight: 'bold',
                            }}
                          >
                            {getLevelDisplay(reward.level).text}
                          </span>
                        )}
                        <span className="rank">
                          {getRankDisplay(reward.rank)}
                        </span>
                        {reward.timestamp && (
                          <span className="time">
                            {formatTime(reward.timestamp)}
                          </span>
                        )}
                      </div>

                      <div className="game-stats">
                        <span className="score">
                          Score: {reward.score.toLocaleString()}
                        </span>
                        <div className="reward-amounts">
                          {reward.rewardType === 'Solana' ? (
                            // Solana奖励显示
                            <span
                              className={`reward-amount ${(reward.solanaReward || 0) > 0 ? 'positive' : 'zero'}`}
                            >
                              🌟 {(reward.solanaReward || 0).toFixed(6)} SOL
                            </span>
                          ) : (
                            // BSC奖励显示
                            <>
                              <span
                                className={`reward-amount ${reward.usdReward > BigInt(0) ? 'positive' : 'zero'}`}
                              >
                                💰{' '}
                                {(
                                  Number(reward.usdReward) / LAMPORTS_PER_SOL
                                ).toFixed(4)}{' '}
                                SOL
                              </span>
                              {reward.nclabReward > BigInt(0) && (
                                <span
                                  className={`reward-amount ${reward.nclabReward > BigInt(0) ? 'positive' : 'zero'}`}
                                >
                                  ⚡{' '}
                                  {(
                                    Number(reward.nclabReward) /
                                    LAMPORTS_PER_SOL
                                  ).toFixed(4)}{' '}
                                  SPL
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="reward-actions">
                      {reward.rewardType === 'Solana' ? (
                        // Solana奖励claim按钮
                        (reward.solanaReward || 0) > 0 ? (
                          <div className="claim-buttons">
                            {reward.solanaClaimed ? (
                              <span className="claimed-badge">
                                🌟 Solana Claimed
                              </span>
                            ) : reward.solanaClaimable ? (
                              <button
                                className="claim-btn solana"
                                onClick={() =>
                                  handleClaimSolanaReward(reward.gameId)
                                }
                                disabled={
                                  claimingGameId === reward.gameId ||
                                  blockchain.isWritePending
                                }
                              >
                                {claimingGameId === reward.gameId
                                  ? 'Claiming...'
                                  : '🌟 Claim SOL'}
                              </button>
                            ) : (
                              <span className="not-claimable">
                                🌟 SOL Not Claimable
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="no-reward">No reward</span>
                        )
                      ) : // BSC奖励claim按钮
                      reward.usdReward > BigInt(0) ||
                        reward.nclabReward > BigInt(0) ? (
                        <div className="claim-buttons">
                          {reward.usdReward > BigInt(0) &&
                            (reward.usdClaimed ? (
                              <span className="claimed-badge">
                                💰 USD Claimed
                              </span>
                            ) : reward.usdClaimable ? (
                              <button
                                className="claim-btn usd"
                                onClick={() =>
                                  handleClaimUSDReward(reward.gameId)
                                }
                                disabled={
                                  claimingGameId === reward.gameId ||
                                  blockchain.isWritePending
                                }
                              >
                                {claimingGameId === reward.gameId
                                  ? 'Claiming...'
                                  : '💰 Claim USD'}
                              </button>
                            ) : (
                              <span className="not-claimable">
                                💰 USD Not Claimable
                              </span>
                            ))}
                          {reward.nclabReward > BigInt(0) &&
                            (reward.nclabClaimed ? (
                              <span className="claimed-badge">
                                ⚡ NCLab Claimed
                              </span>
                            ) : reward.nclabClaimable ? (
                              <button
                                className="claim-btn nclab"
                                onClick={() =>
                                  handleClaimNclabReward(reward.gameId)
                                }
                                disabled={
                                  claimingGameId === reward.gameId ||
                                  blockchain.isWritePending
                                }
                              >
                                {claimingGameId === reward.gameId
                                  ? 'Claiming...'
                                  : '⚡ Claim NCLab'}
                              </button>
                            ) : (
                              <span className="not-claimable">
                                ⚡ NCLab Cooldown
                              </span>
                            ))}
                        </div>
                      ) : (
                        <span className="no-reward">No reward</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="rewards-actions">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      child={modalContent}
      close={onClose}
      className="rewards-modal-wrapper"
    />
  );
};

export default RewardsModal;
