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
  const [isLoading, setIsLoading] = useState(false);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);

  /**
   * 获取玩家历史奖励数据
   * TODO: 这里需要从合约事件或后端API获取完整的历史数据
   */
  const fetchRewardsHistory = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // 模拟数据 - 实际应该从链上事件或后端API获取
      const mockRewards: GameReward[] = [
        {
          gameId: 3,
          score: 1250,
          reward: BigInt('50000000000000000000'), // 50 USD1
          hasClaimed: true,
          rank: 1,
          isWinner: true,
          timestamp: Date.now() - 86400000 * 2, // 2天前
        },
        {
          gameId: 2,
          score: 890,
          reward: BigInt('20000000000000000000'), // 20 USD1
          hasClaimed: false,
          rank: 3,
          isWinner: true,
          timestamp: Date.now() - 86400000 * 5, // 5天前
        },
        {
          gameId: 1,
          score: 450,
          reward: BigInt('0'), // 0 USD1
          hasClaimed: false,
          rank: 8,
          isWinner: false,
          timestamp: Date.now() - 86400000 * 7, // 7天前
        },
      ];

      setGameRewards(mockRewards);
    } catch (error) {
      console.error('Failed to fetch rewards history:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // 组件加载时获取数据
  useEffect(() => {
    if (isConnected) {
      fetchRewardsHistory();
    }
  }, [isConnected]);

  // 计算统计数据
  const totalRewards = gameRewards.reduce((sum, reward) => sum + reward.reward, BigInt(0));
  const unclaimedRewards = gameRewards
    .filter(reward => !reward.hasClaimed && reward.reward > BigInt(0))
    .reduce((sum, reward) => sum + reward.reward, BigInt(0));
  const totalGames = gameRewards.length;
  const winCount = gameRewards.filter(reward => reward.isWinner).length;
  const winRate = totalGames > 0 ? (winCount / totalGames * 100).toFixed(1) : '0';

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
            <h3>Reward History</h3>
            
            {isLoading ? (
              <div className="loading">Loading rewards...</div>
            ) : gameRewards.length === 0 ? (
              <div className="no-rewards">
                <p>No game rewards found</p>
                <p>Play some race games to earn rewards!</p>
              </div>
            ) : (
              <div className="rewards-list">
                {gameRewards.map((reward) => (
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