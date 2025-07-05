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
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const blockchain = useBlockchain();
  const playerData = usePlayerData();

  // 获取碎片余额和冷却状态
  const { data: fragmentBalance } = blockchain.useFragmentBalance(address || '');
  const { data: cooldownStatus } = blockchain.useCooldownStatus(address || '');
  const { data: pendingRewards } = blockchain.usePendingRewards(address || '');

  const [gameRewards, setGameRewards] = useState<GameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [showFilter, setShowFilter] = useState<'all' | 'claimable'>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // 重试函数
  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
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

  // 简化的数据获取逻辑 - 当playerData更新时同步到组件状态
  useEffect(() => {
    // 修改条件：只要playerData加载完成且有playerProfile就同步数据（包括空数据）
    if (!playerData.isLoading && playerData.playerProfile?.gameHistory !== undefined) {
      const gameRewardsData: GameReward[] = playerData.playerProfile.gameHistory.map(game => ({
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
      }));
      
      setGameRewards(gameRewardsData);
      setIsLoading(false);
    }
  }, [playerData.isLoading, playerData.playerProfile]);

  // 手动重试时重新获取数据
  useEffect(() => {
    if (retryTrigger > 0 && address && isConnected) {
      setIsLoading(true);
      setFetchError(null);
      // 强制刷新，不使用缓存数据
      playerData.refreshPlayerData();
    }
  }, [retryTrigger, address, isConnected]);

  /**
   * 领取单个游戏奖励 (所有类型)
   */
  const handleClaimReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      blockchain.claimGameReward(gameId, address);
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
      blockchain.claimUSDRewards(gameId, address);
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
      blockchain.claimNclabRewards(gameId, address);
    } catch (error) {
      console.error('Failed to claim NCLab reward:', error);
      setClaimingGameId(null);
    }
  };

  /**
   * 领取所有奖励
   */
  const handleClaimAllRewards = async () => {
    if (!address) return;

    try {
      setClaimingAll(true);
      blockchain.claimAllGameRewards(address);
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
      case 0: return { text: 'LOW', color: '#10b981' };
      case 1: return { text: 'MEDIUM', color: '#f59e0b' };
      case 2: return { text: 'HIGH', color: '#ef4444' };
      default: return { text: 'UNKNOWN', color: '#6b7280' };
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
  const unclaimedUsdRewards = gameRewards
    .filter(reward => reward.usdClaimable)
    .reduce((sum, reward) => sum + reward.usdReward, BigInt(0));
  const unclaimedNclabRewards = gameRewards
    .filter(reward => reward.nclabClaimable)
    .reduce((sum, reward) => sum + reward.nclabReward, BigInt(0));
  const totalGames = gameRewards.length;
  const winCount = gameRewards.filter(reward => reward.isWinner).length;
  const winRate = totalGames > 0 ? (winCount / totalGames * 100).toFixed(1) : '0';

  // 可claim的奖励数量
  const claimableUsdCount = gameRewards.filter(reward => reward.usdClaimable).length;
  const claimableNclabCount = gameRewards.filter(reward => reward.nclabClaimable).length;
  const claimableCount = claimableUsdCount + claimableNclabCount;
  const claimableAmount = unclaimedUsdRewards + unclaimedNclabRewards;

  // 根据过滤条件过滤对局
  const filteredRewards = showFilter === 'claimable' 
    ? gameRewards.filter(reward => reward.usdClaimable || reward.nclabClaimable)
    : gameRewards;

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
            <p>Fetching game history from database and reward info from blockchain</p>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '16px' }}>
              💾 Database → Game history, scores, rankings<br/>
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
              <span className="stat-value">{formatEther(totalRewards)} USD1</span>
            </div>
            <div className="stat-item">
              <label>Available to Claim</label>
              <span className="stat-value claimable">{formatEther(claimableAmount)} USD1</span>
            </div>
            <div className="stat-item">
              <label>Fragment Balance</label>
              <span className="stat-value" style={{ color: '#9333ea' }}>
                {fragmentBalance ? formatEther(fragmentBalance as bigint) : '0'} ⚡
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
                
                {/* 批量领取按钮 */}
                {claimableCount > 1 && (
                  <button 
                    onClick={handleClaimAllRewards}
                    disabled={claimingAll || (cooldownStatus ? !cooldownStatus.canClaim : false)}
                    className="filter-btn"
                    style={{ 
                      fontSize: '12px', 
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      opacity: (claimingAll || (cooldownStatus ? !cooldownStatus.canClaim : false)) ? 0.6 : 1
                    }}
                  >
                    {claimingAll ? '🔄 Claiming...' : `💰 Claim All (${claimableCount})`}
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
                        {reward.level !== undefined && (
                          <span 
                            className="level-badge"
                            style={{ 
                              backgroundColor: getLevelDisplay(reward.level).color,
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7em',
                              fontWeight: 'bold'
                            }}
                          >
                            {getLevelDisplay(reward.level).text}
                          </span>
                        )}
                        <span className="rank">{getRankDisplay(reward.rank)}</span>
                        {reward.timestamp && (
                          <span className="time">{formatTime(reward.timestamp)}</span>
                        )}
                      </div>
                      
                      <div className="game-stats">
                        <span className="score">Score: {reward.score.toLocaleString()}</span>
                        <div className="reward-amounts">
                          <span className={`reward-amount ${reward.usdReward > BigInt(0) ? 'positive' : 'zero'}`}>
                            💰 {formatEther(reward.usdReward)} USD1
                          </span>
                          {reward.nclabReward > BigInt(0) && (
                            <span className={`reward-amount ${reward.nclabReward > BigInt(0) ? 'positive' : 'zero'}`}>
                              ⚡ {formatEther(reward.nclabReward)} NCLab
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="reward-actions">
                      {reward.usdReward > BigInt(0) || reward.nclabReward > BigInt(0) ? (
                        <div className="claim-buttons">
                          {reward.usdReward > BigInt(0) && (
                            reward.usdClaimed ? (
                              <span className="claimed-badge">💰 USD Claimed</span>
                            ) : reward.usdClaimable ? (
                              <button
                                className="claim-btn usd"
                                onClick={() => handleClaimUSDReward(reward.gameId)}
                                disabled={claimingGameId === reward.gameId || blockchain.isWritePending}
                              >
                                {claimingGameId === reward.gameId ? 'Claiming...' : '💰 Claim USD'}
                              </button>
                            ) : (
                              <span className="not-claimable">💰 USD Not Claimable</span>
                            )
                          )}
                          {reward.nclabReward > BigInt(0) && (
                            reward.nclabClaimed ? (
                              <span className="claimed-badge">⚡ NCLab Claimed</span>
                            ) : reward.nclabClaimable ? (
                              <button
                                className="claim-btn nclab"
                                onClick={() => handleClaimNclabReward(reward.gameId)}
                                disabled={claimingGameId === reward.gameId || blockchain.isWritePending}
                              >
                                {claimingGameId === reward.gameId ? 'Claiming...' : '⚡ Claim NCLab'}
                              </button>
                            ) : (
                              <span className="not-claimable">⚡ NCLab Cooldown</span>
                            )
                          )}
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

  return <Modal child={modalContent} close={onClose} className="rewards-modal-wrapper" />;
};

export default RewardsModal; 