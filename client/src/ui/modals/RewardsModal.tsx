import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Modal from './Modal';
import { useBlockchain } from '../../hooks/useBlockchain';
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

  const [solanaRewards, setSolanaRewards] = useState<GameReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingGameId, setClaimingGameId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState<'all' | 'claimable'>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 防重复调用保护
  const globalClaimLock = useRef<Set<number>>(new Set());

  // 获取Solana奖励数据
  const fetchSolanaRewards = useCallback(
    async (bustCache = false) => {
      if (!address) return;

      try {
        setIsLoading(true);
        const url = bustCache
          ? `http://localhost:8080/race-games/players/${address}/games?t=${Date.now()}`
          : `http://localhost:8080/race-games/players/${address}/games`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          const solanaRewardsData: GameReward[] = data.data.games.map(
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

          setSolanaRewards(solanaRewardsData);
        }
      } catch (error) {
        setFetchError('Failed to fetch reward data');
      } finally {
        setIsLoading(false);
      }
    },
    [address],
  );

  // 组件挂载时获取数据
  useEffect(() => {
    if (address && isConnected) {
      fetchSolanaRewards();
    } else {
      setIsLoading(false);
    }
  }, [address, isConnected, fetchSolanaRewards]);

  // 监听交易确认状态，自动刷新数据
  useEffect(() => {
    if (blockchain.isConfirmed && claimingGameId) {
      setClaimingGameId(null);
      // 延迟刷新确保区块链状态更新
      setTimeout(() => {
        fetchSolanaRewards(true);
      }, 2000);
    }
  }, [blockchain.isConfirmed, claimingGameId, fetchSolanaRewards]);

  // 领取单个游戏奖励
  const handleClaimReward = async (gameId: number) => {
    if (!address || globalClaimLock.current.has(gameId)) return;

    try {
      globalClaimLock.current.add(gameId);
      setClaimingGameId(gameId);

      await blockchain.claimGameReward(gameId);

      // 乐观更新前端状态
      setSolanaRewards((prev) =>
        prev.map((reward) =>
          reward.gameId === gameId
            ? { ...reward, solanaClaimed: true, solanaClaimable: false }
            : reward,
        ),
      );
    } catch (error) {
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
            {address.slice(0, 6)}...{address.slice(-4)}
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
                {unclaimedSolanaRewards.toFixed(6)} SOL
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
                          🌟 {reward.solanaReward.toFixed(6)} SOL
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
