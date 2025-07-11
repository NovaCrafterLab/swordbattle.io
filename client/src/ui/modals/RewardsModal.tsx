import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
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
  rewardType: 'BSC'; // 标记为BSC奖励
}

interface SolanaGameReward {
  gameId: number;
  ticketAmount: string;
  hasWithdrawn: boolean;
  hasReward: boolean;
  rewardAmount: string;
  rewardSOL: string;
  canClaim: boolean;
  gameFinalized: boolean;
  tokenMint: string;
  rewardType: 'Solana'; // 标记为Solana奖励
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const { publicKey, connected: isConnected } = useWallet();
  const address = publicKey?.toString();
  const blockchain = useBlockchain();
  const playerData = usePlayerData();

  // 获取玩家仪表板数据（包含碎片余额、奖励等所有信息）
  const { data: playerDashboardRaw } = blockchain.usePlayerDashboard(
    address || '',
  );
  const playerDashboard = playerDashboardRaw as PlayerDashboard | null;

  // 获取Solana游戏历史
  const solanaGameHistoryConfig = blockchain.useSolanaGameHistory(
    address || '',
  );
  const {
    data: solanaGameHistory,
    isLoading: isSolanaLoading,
    refetch: refetchSolana,
  } = useQuery(solanaGameHistoryConfig);

  const [gameRewards, setGameRewards] = useState<GameReward[]>([]);
  const [solanaRewards, setSolanaRewards] = useState<SolanaGameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [showFilter, setShowFilter] = useState<
    'all' | 'claimable' | 'bsc' | 'solana'
  >('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

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
  }, [address, isConnected, playerData]); // 依赖address和isConnected，确保钱包状态变化时重新执行

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
  }, [playerData.isLoading, playerData.playerProfile, playerData]);

  // 手动重试时重新获取数据
  useEffect(() => {
    if (retryTrigger > 0 && address && isConnected) {
      setIsLoading(true);
      setFetchError(null);
      // 强制刷新，不使用缓存数据
      playerData.refreshPlayerData();
    }
  }, [retryTrigger, address, isConnected, playerData]);

  // 处理Solana游戏历史数据
  useEffect(() => {
    if (solanaGameHistory && solanaGameHistory.success) {
      const solanaRewardsData: SolanaGameReward[] =
        solanaGameHistory.gameHistory.map((game: any) => ({
          gameId: game.gameId,
          ticketAmount: game.ticketAmount,
          hasWithdrawn: game.hasWithdrawn,
          hasReward: game.hasReward,
          rewardAmount: game.rewardAmount,
          rewardSOL: game.rewardSOL,
          canClaim: game.canClaim,
          gameFinalized: game.gameFinalized,
          tokenMint: game.tokenMint,
          rewardType: 'Solana',
        }));

      setSolanaRewards(solanaRewardsData);
      console.log(`✅ Loaded ${solanaRewardsData.length} Solana rewards`);
    }
  }, [solanaGameHistory]);

  // 监听交易确认状态，自动刷新数据
  useEffect(() => {
    if (blockchain.isConfirmed && (claimingGameId || claimingAll)) {
      // 交易确认后，刷新玩家数据
      console.log('🎉 交易确认，刷新奖励数据...');
      setClaimingGameId(null);
      setClaimingAll(false);

      // 立即刷新数据，然后再次延迟刷新确保状态同步
      playerData.refreshPlayerData();
      refetchSolana(); // 同时刷新Solana数据

      // 延迟2秒后再次刷新，确保区块链状态完全更新
      setTimeout(() => {
        playerData.refreshPlayerData();
        refetchSolana();
        console.log('🔄 二次刷新奖励数据完成');
      }, 2000);
    }
  }, [
    blockchain.isConfirmed,
    claimingGameId,
    claimingAll,
    refetchSolana,
    playerData,
  ]);

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
   * 领取Solana游戏奖励
   */
  const handleClaimSolanaReward = async (gameId: number) => {
    if (!address) return;

    try {
      setClaimingGameId(gameId);
      await blockchain.claimGameReward(gameId);
    } catch (error) {
      console.error('Failed to claim Solana reward:', error);
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

  // 计算统计数据（合并BSC和Solana）
  const totalBscRewards = gameRewards.reduce(
    (sum, reward) => sum + reward.reward,
    BigInt(0),
  );
  const totalSolanaRewards = solanaRewards.reduce(
    (sum, reward) =>
      sum + BigInt(Math.floor(parseFloat(reward.rewardSOL) * LAMPORTS_PER_SOL)),
    BigInt(0),
  );
  const totalRewards = totalBscRewards + totalSolanaRewards;

  const unclaimedUsdRewards = gameRewards
    .filter((reward) => reward.usdClaimable)
    .reduce((sum, reward) => sum + reward.usdReward, BigInt(0));
  const unclaimedNclabRewards = gameRewards
    .filter((reward) => reward.nclabClaimable)
    .reduce((sum, reward) => sum + reward.nclabReward, BigInt(0));
  const unclaimedSolanaRewards = solanaRewards
    .filter((reward) => reward.canClaim)
    .reduce(
      (sum, reward) =>
        sum +
        BigInt(Math.floor(parseFloat(reward.rewardSOL) * LAMPORTS_PER_SOL)),
      BigInt(0),
    );

  const totalGames = gameRewards.length + solanaRewards.length;
  const winCount = gameRewards.filter((reward) => reward.isWinner).length;
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
    (reward) => reward.canClaim,
  ).length;
  const claimableCount =
    claimableUsdCount + claimableNclabCount + claimableSolanaCount;
  const claimableAmount =
    unclaimedUsdRewards + unclaimedNclabRewards + unclaimedSolanaRewards;

  // 根据过滤条件过滤对局（合并BSC和Solana）
  const allRewards = [...gameRewards, ...solanaRewards];

  const filteredRewards = (() => {
    switch (showFilter) {
      case 'claimable':
        return allRewards.filter((reward) => {
          if (reward.rewardType === 'BSC') {
            return reward.usdClaimable || reward.nclabClaimable;
          } else {
            return reward.canClaim;
          }
        });
      case 'bsc':
        return allRewards.filter((reward) => reward.rewardType === 'BSC');
      case 'solana':
        return allRewards.filter((reward) => reward.rewardType === 'Solana');
      default:
        return allRewards;
    }
  })();

  // 按gameId降序排序（最新的在前）
  filteredRewards.sort((a, b) => b.gameId - a.gameId);

  // 检查是否正在获取数据
  const isDataLoading = isLoading || playerData.isLoading || isSolanaLoading;

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
                    All Games ({totalGames})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'claimable' ? 'active' : ''}`}
                    onClick={() => setShowFilter('claimable')}
                  >
                    Claimable ({claimableCount})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'bsc' ? 'active' : ''}`}
                    onClick={() => setShowFilter('bsc')}
                  >
                    BSC ({gameRewards.length})
                  </button>
                  <button
                    className={`filter-btn ${showFilter === 'solana' ? 'active' : ''}`}
                    onClick={() => setShowFilter('solana')}
                  >
                    Solana ({solanaRewards.length})
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
                  onClick={() => {
                    handleRetry();
                    refetchSolana();
                  }}
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
                    key={`${reward.rewardType}-${reward.gameId}`}
                    className={`reward-item ${
                      reward.rewardType === 'BSC'
                        ? reward.isWinner
                          ? 'winner'
                          : 'loser'
                        : reward.hasReward
                          ? 'winner'
                          : 'loser'
                    }`}
                  >
                    <div className="reward-info">
                      <div className="game-info">
                        <span className="game-id">Game #{reward.gameId}</span>
                        <span
                          className="reward-type-badge"
                          style={{
                            backgroundColor:
                              reward.rewardType === 'BSC'
                                ? '#f59e0b'
                                : '#10b981',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7em',
                            fontWeight: 'bold',
                          }}
                        >
                          {reward.rewardType}
                        </span>
                        {reward.rewardType === 'BSC' &&
                          reward.level !== undefined && (
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
                        {reward.rewardType === 'BSC' && (
                          <span className="rank">
                            {getRankDisplay(reward.rank)}
                          </span>
                        )}
                        {reward.rewardType === 'BSC' && reward.timestamp && (
                          <span className="time">
                            {formatTime(reward.timestamp)}
                          </span>
                        )}
                      </div>

                      <div className="game-stats">
                        {reward.rewardType === 'BSC' ? (
                          <>
                            <span className="score">
                              Score: {reward.score.toLocaleString()}
                            </span>
                            <div className="reward-amounts">
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
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="ticket-amount">
                              Ticket: {reward.ticketAmount} tokens
                            </span>
                            <div className="reward-amounts">
                              <span
                                className={`reward-amount ${reward.hasReward ? 'positive' : 'zero'}`}
                              >
                                🏆 {reward.rewardSOL} SOL
                              </span>
                              <span className="status-badge">
                                {reward.gameFinalized
                                  ? '✅ Finalized'
                                  : '⏳ Pending'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="reward-actions">
                      {reward.rewardType === 'BSC' ? (
                        // BSC奖励操作
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
                        )
                      ) : // Solana奖励操作
                      reward.hasReward ? (
                        <div className="claim-buttons">
                          {reward.hasWithdrawn ? (
                            <span className="claimed-badge">
                              🏆 SOL Claimed
                            </span>
                          ) : reward.canClaim ? (
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
                                : '🏆 Claim SOL'}
                            </button>
                          ) : (
                            <span className="not-claimable">
                              🏆 Not Claimable
                            </span>
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

  return (
    <Modal
      child={modalContent}
      close={onClose}
      className="rewards-modal-wrapper"
    />
  );
};

export default RewardsModal;
