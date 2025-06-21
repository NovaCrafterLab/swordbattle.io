import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Modal from './Modal';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useBlockchain } from '../../hooks/useBlockchain';
import { formatEther } from 'viem';
import './RewardsModal.scss';

interface RewardsModalProps {
  onClose: () => void;
}

interface GameReward {
  gameId: number;
  score: number;
  reward: bigint;
  hasClaimed: boolean;
  rank: number;
  isWinner: boolean;
  timestamp?: number;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const blockchain = useBlockchain();
  const playerData = usePlayerData();

  const [gameRewards, setGameRewards] = useState<GameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState<'all' | 'claimable'>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // 重试函数
  const handleRetry = () => {
    console.log('🔄 Retry triggered...');
    setRetryTrigger(prev => prev + 1);
  };

  // 组件挂载时立即刷新playerData
  useEffect(() => {
    console.log('🔍 RewardsModal: Component mounted, triggering immediate refresh');
    if (address && isConnected) {
      // 立即检查是否已有缓存的数据
      if (playerData.playerProfile?.gameHistory && playerData.playerProfile.gameHistory.length > 0) {
        console.log('🔍 RewardsModal: Found existing data on mount, using immediately');
        const gameRewardsData: GameReward[] = playerData.playerProfile.gameHistory.map(game => ({
          gameId: game.gameId,
          score: game.score,
          reward: game.reward,
          hasClaimed: game.hasClaimed,
          rank: game.rank,
          isWinner: game.isWinner,
          timestamp: Date.now() - (game.gameId * 86400000),
        }));
        setGameRewards(gameRewardsData);
        setIsLoading(false);
      } else {
        // 如果没有缓存数据，立即刷新
        console.log('🔍 RewardsModal: No cached data, refreshing playerData');
        playerData.refreshPlayerData();
      }
    } else {
      // 如果没有连接钱包，设置为非加载状态
      setIsLoading(false);
    }
  }, [address, isConnected]); // 依赖address和isConnected，确保钱包状态变化时重新执行

  // 简化的数据获取逻辑 - 当playerData更新时同步到组件状态
  useEffect(() => {
    if (!playerData.isLoading && 
        playerData.playerProfile?.gameHistory && 
        playerData.playerProfile.gameHistory.length > 0) {
      
      console.log('🔍 RewardsModal: PlayerData updated, syncing to component state');
      const gameRewardsData: GameReward[] = playerData.playerProfile.gameHistory.map(game => ({
        gameId: game.gameId,
        score: game.score,
        reward: game.reward,
        hasClaimed: game.hasClaimed,
        rank: game.rank,
        isWinner: game.isWinner,
        timestamp: Date.now() - (game.gameId * 86400000),
      }));
      
      console.log('🔍 RewardsModal: Setting gameRewards with', gameRewardsData.length, 'items');
      setGameRewards(gameRewardsData);
      setIsLoading(false);
    }
  }, [playerData.isLoading, playerData.playerProfile]);

  // 手动重试时重新获取数据
  useEffect(() => {
    if (retryTrigger > 0 && address && isConnected) {
      console.log('🔍 RewardsModal: Manual retry triggered');
      setIsLoading(true);
      setFetchError(null);
      playerData.refreshPlayerData();
    }
  }, [retryTrigger]);

  /**
   * 领取奖励
   */
  const handleClaimReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      blockchain.claimReward(gameId);
    } catch (error) {
      console.error('Failed to claim reward:', error);
      setClaimingGameId(null);
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
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
      setGameRewards(prev => 
        prev.map(reward => 
          reward.gameId === claimingGameId 
            ? { ...reward, hasClaimed: true }
            : reward
        )
      );
      setClaimingGameId(null);
      
      // 刷新玩家数据
      playerData.refreshPlayerData();
    }
  }, [blockchain.isConfirmed, claimingGameId]);

  // 计算统计数据
  const totalRewards = gameRewards.reduce((sum, reward) => sum + reward.reward, BigInt(0));
  const unclaimedRewards = gameRewards
    .filter(reward => !reward.hasClaimed && reward.reward > BigInt(0))
    .reduce((sum, reward) => sum + reward.reward, BigInt(0));
  const totalGames = gameRewards.length;
  const winCount = gameRewards.filter(reward => reward.isWinner).length;
  const winRate = totalGames > 0 ? (winCount / totalGames * 100).toFixed(1) : '0';

  // 根据过滤条件过滤对局
  const filteredRewards = showFilter === 'claimable' 
    ? gameRewards.filter(reward => reward.reward > BigInt(0) && !reward.hasClaimed)
    : gameRewards;

  const claimableCount = gameRewards.filter(reward => reward.reward > BigInt(0) && !reward.hasClaimed).length;

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
            <p>Fetching your game history and rewards from the blockchain</p>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '16px' }}>
              💡 First-time loading may take a few seconds...
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 统计概览 */}
          <div className="rewards-stats">
            <div className="stat-item">
              <label>Total Rewards</label>
              <span className="stat-value">{formatEther(totalRewards)} USD1</span>
            </div>
            <div className="stat-item">
              <label>Unclaimed</label>
              <span className="stat-value unclaimed">{formatEther(unclaimedRewards)} USD1</span>
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
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* 过滤选项 */}
                <div className="filter-options">
                  <button 
                    className={`filter-btn ${showFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setShowFilter('all')}
                  >
                    All Games ({totalGames})
                  </button>
                  <button 
                    className={`filter-btn ${showFilter === 'claimable' ? 'active' : ''}`}
                    onClick={() => setShowFilter('claimable')}
                  >
                    Claimable ({claimableCount})
                  </button>
                </div>
                
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
                <button 
                  className="retry-btn"
                  onClick={handleRetry}
                >
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
                        <span className="rank">{getRankDisplay(reward.rank)}</span>
                        {reward.timestamp && (
                          <span className="time">{formatTime(reward.timestamp)}</span>
                        )}
                      </div>
                      
                      <div className="game-stats">
                        <span className="score">Score: {reward.score.toLocaleString()}</span>
                        <span className={`reward-amount ${reward.reward > BigInt(0) ? 'positive' : 'zero'}`}>
                          {formatEther(reward.reward)} USD1
                        </span>
                      </div>
                    </div>

                    <div className="reward-actions">
                      {reward.reward > BigInt(0) ? (
                        reward.hasClaimed ? (
                          <span className="claimed-badge">✅ Claimed</span>
                        ) : (
                          <button
                            className="claim-btn"
                            onClick={() => handleClaimReward(reward.gameId)}
                            disabled={claimingGameId === reward.gameId || blockchain.isWritePending}
                          >
                            {claimingGameId === reward.gameId ? 'Claiming...' : 'Claim'}
                          </button>
                        )
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

  return <Modal child={modalContent} close={onClose} className="rewards-modal-wrapper" />;
};

export default RewardsModal; 