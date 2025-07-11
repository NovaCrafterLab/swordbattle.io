import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Modal from './Modal';
import { useBlockchain, useCurrentGameToken } from '../../hooks/useBlockchain';
import { useToast } from '../components/Toast';
import './RewardsModal.scss';

interface RewardsModalProps {
  onClose: () => void;
}

interface GameReward {
  gameId: number;
  kills: number;
  solanaReward: number;
  solanaClaimed: boolean;
  solanaClaimable: boolean;
  timestamp?: number;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const wallet = useWallet();
  const { publicKey, connected: isConnected } = wallet;
  const address = publicKey?.toString();
  const blockchain = useBlockchain();
  const gameToken = useCurrentGameToken();
  const { addToast } = useToast();

  const [solanaRewards, setSolanaRewards] = useState<GameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState<'all' | 'claimable'>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // 防重复调用保护
  const globalClaimLock = useRef<Set<number>>(new Set());
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 从链上同步奖励状态
  const syncRewardStatusFromChain = useCallback(
    async (gameRewards: GameReward[]) => {
      if (!address || gameRewards.length === 0) return gameRewards;

      try {
        // 分批处理，避免大量并发请求
        const batchSize = 5;
        const batches = [];
        for (let i = 0; i < gameRewards.length; i += batchSize) {
          batches.push(gameRewards.slice(i, i + batchSize));
        }

        let syncedRewards = [...gameRewards];

        for (const batch of batches) {
          await Promise.allSettled(
            batch.map(async (reward) => {
              try {
                // 查询链上奖励状态
                const response = await fetch(
                  `http://localhost:8080/race-games/players/${address}/rewards/${reward.gameId}/chain-status`,
                );

                if (response.ok) {
                  const chainData = await response.json();
                  if (chainData.success && chainData.data) {
                    const chainClaimed = chainData.data.claimed || false;
                    const chainClaimable = chainData.data.claimable || false;

                    // 如果链上状态与数据库不一致，以链上为准
                    if (
                      chainClaimed !== reward.solanaClaimed ||
                      chainClaimable !== reward.solanaClaimable
                    ) {
                      const originalIndex = gameRewards.findIndex(
                        (r) => r.gameId === reward.gameId,
                      );
                      if (originalIndex !== -1) {
                        syncedRewards[originalIndex] = {
                          ...reward,
                          solanaClaimed: chainClaimed,
                          solanaClaimable: chainClaimable,
                        };
                      }
                    }
                  }
                }
              } catch (error) {
                console.warn(
                  `Failed to sync chain status for game ${reward.gameId}:`,
                  error,
                );
              }
            }),
          );

          // 批次间短暂延迟，避免过载
          if (batches.indexOf(batch) < batches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        return syncedRewards;
      } catch (error) {
        console.error('Failed to sync reward status from chain:', error);
        return gameRewards; // 同步失败时返回原始数据
      }
    },
    [address],
  );

  // 获取Solana奖励数据
  const fetchSolanaRewards = useCallback(
    async (bustCache = false, syncWithChain = true) => {
      if (!address) return;

      try {
        setIsLoading(true);
        const url = bustCache
          ? `http://localhost:8080/race-games/players/${address}/games?t=${Date.now()}`
          : `http://localhost:8080/race-games/players/${address}/games`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          let solanaRewardsData: GameReward[] = data.data.games.map(
            (game: any) => {
              const reward = parseFloat(game.reward || '0');
              const claimable = !game.hasClaimed && game.gameEnded;
              // 从score推算kills (score = kills * 100)
              const kills = Math.floor((game.score || 0) / 100);

              return {
                gameId: game.gameId,
                kills,
                solanaReward: reward,
                solanaClaimed: game.hasClaimed || false,
                solanaClaimable: claimable,
                timestamp: game.timestamp,
              };
            },
          );

          // 与链上数据同步
          if (syncWithChain) {
            solanaRewardsData =
              await syncRewardStatusFromChain(solanaRewardsData);
          }

          setSolanaRewards(solanaRewardsData);
        }
      } catch (error) {
        setFetchError('Failed to fetch reward data');
      } finally {
        setIsLoading(false);
      }
    },
    [address, syncRewardStatusFromChain],
  );

  // 组件挂载时获取数据
  useEffect(() => {
    if (address && isConnected) {
      fetchSolanaRewards();
    } else {
      setIsLoading(false);
    }
  }, [address, isConnected, fetchSolanaRewards]);

  // 定期同步链上状态
  useEffect(() => {
    if (!address || !isConnected || solanaRewards.length === 0) {
      return;
    }

    // 设置定期同步（每30秒）
    const syncInterval = setInterval(async () => {
      try {
        const syncedRewards = await syncRewardStatusFromChain(solanaRewards);

        // 检查是否有状态变化
        const hasChanges = syncedRewards.some((syncedReward, index) => {
          const originalReward = solanaRewards[index];
          return (
            syncedReward.solanaClaimed !== originalReward.solanaClaimed ||
            syncedReward.solanaClaimable !== originalReward.solanaClaimable
          );
        });

        if (hasChanges) {
          setSolanaRewards(syncedRewards);
          addToast('info', 'Reward status updated from blockchain');
        }
      } catch (error) {
        console.error('Periodic sync failed:', error);
      }
    }, 30000); // 30秒同步一次

    syncIntervalRef.current = syncInterval;

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [
    address,
    isConnected,
    solanaRewards,
    syncRewardStatusFromChain,
    addToast,
  ]);

  // 监听交易确认状态，自动刷新数据
  useEffect(() => {
    if (blockchain.isConfirmed && claimingGameId) {
      setClaimingGameId(null);
      // 延迟刷新确保区块链状态更新，并强制同步链上状态
      setTimeout(() => {
        fetchSolanaRewards(true, true);
      }, 2000);
    }
  }, [blockchain.isConfirmed, claimingGameId, fetchSolanaRewards]);

  // 手动刷新函数
  const handleManualRefresh = async () => {
    if (isManualRefreshing) return;

    try {
      setIsManualRefreshing(true);
      await fetchSolanaRewards(true, true); // 强制刷新数据库和链上数据
      addToast('success', 'Rewards refreshed successfully');
    } catch (error) {
      addToast('error', 'Failed to refresh rewards');
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // 领取单个游戏奖励
  const handleClaimReward = async (gameId: number) => {
    if (!address || globalClaimLock.current.has(gameId)) return;

    try {
      globalClaimLock.current.add(gameId);
      setClaimingGameId(gameId);

      await blockchain.claimGameReward(gameId);

      // 获取奖励金额用于显示
      const reward = solanaRewards.find((r) => r.gameId === gameId);
      const tokenSymbol = gameToken.data?.tokenSymbol || 'SOL';

      // 显示成功提示
      if (reward) {
        addToast(
          'success',
          `Successfully claimed ${reward.solanaReward.toFixed(6)} ${tokenSymbol} from Game #${gameId}!`,
        );
      }

      // 乐观更新前端状态
      setSolanaRewards((prev) =>
        prev.map((reward) =>
          reward.gameId === gameId
            ? { ...reward, solanaClaimed: true, solanaClaimable: false }
            : reward,
        ),
      );
    } catch (error) {
      addToast(
        'error',
        `Failed to claim reward from Game #${gameId}. Please try again.`,
      );
      setClaimingGameId(null);
    } finally {
      globalClaimLock.current.delete(gameId);
    }
  };

  // 计算统计数据
  const unclaimedSolanaRewards = solanaRewards
    .filter((reward) => reward.solanaClaimable)
    .reduce((sum, reward) => sum + reward.solanaReward, 0);

  const totalGames = solanaRewards.length;

  // 获取当前token symbol
  const tokenSymbol = gameToken.data?.tokenSymbol || 'SOL';

  // 根据过滤条件过滤对局
  const filteredRewards =
    showFilter === 'claimable'
      ? solanaRewards.filter((reward) => reward.solanaClaimable)
      : solanaRewards;

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  const modalContent = (
    <div className="rewards-modal">
      <div className="rewards-header">
        <h2>🏆 My Rewards</h2>
        {address && (
          <div className="player-address">
            <div className="address-content">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isManualRefreshing}
              className="refresh-btn"
              title="Refresh rewards"
            >
              {isManualRefreshing ? '⏳' : '🔄'}
            </button>
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="not-connected">
          <p>Please connect your wallet to view rewards</p>
        </div>
      ) : isLoading ? (
        <div className="rewards-loading">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <h3>Loading Your Rewards...</h3>
            <p>Fetching game history and reward info</p>
          </div>
        </div>
      ) : (
        <>
          {/* 统计概览 - 只显示Available to Claim和Games Played */}
          <div className="rewards-stats">
            <div className="stat-item">
              <label>Available to Claim</label>
              <span className="stat-value claimable">
                {unclaimedSolanaRewards.toFixed(6)} {tokenSymbol}
              </span>
            </div>
            <div className="stat-item">
              <label>Games Played</label>
              <span className="stat-value">{totalGames}</span>
            </div>
          </div>

          {/* 奖励历史 */}
          <div className="rewards-history">
            <div className="history-header">
              <h3>Reward History</h3>

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
                  Claimable (
                  {solanaRewards.filter((r) => r.solanaClaimable).length})
                </button>
              </div>
            </div>

            {fetchError ? (
              <div className="error-state">
                <p>❌ {fetchError}</p>
                <button onClick={() => fetchSolanaRewards(true)}>Retry</button>
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="empty-state">
                <p>No rewards found</p>
              </div>
            ) : (
              <div className="rewards-list">
                {filteredRewards.map((reward) => (
                  <div key={reward.gameId} className="reward-item">
                    <div className="reward-info">
                      <div className="game-info">
                        <span className="game-id">Game #{reward.gameId}</span>
                        <span className="time">
                          {formatTime(reward.timestamp)}
                        </span>
                      </div>

                      <div className="game-stats">
                        <span className="kills">Kills: {reward.kills}</span>
                        <span className="reward-amount">
                          🌟 {reward.solanaReward.toFixed(6)} {tokenSymbol}
                        </span>
                      </div>
                    </div>

                    <div className="reward-actions">
                      {reward.solanaClaimed ? (
                        <span className="claimed-badge">✅ Claimed</span>
                      ) : reward.solanaClaimable ? (
                        <button
                          onClick={() => handleClaimReward(reward.gameId)}
                          disabled={claimingGameId === reward.gameId}
                          className="claim-btn"
                        >
                          {claimingGameId === reward.gameId
                            ? 'Claiming...'
                            : 'Claim'}
                        </button>
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
