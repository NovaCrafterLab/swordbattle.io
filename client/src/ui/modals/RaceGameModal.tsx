import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Modal from './Modal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerData } from '../../hooks/usePlayerData';
import {
  useBlockchain,
  useCurrentGameToken,
  useTierPricing,
  useDynamicTokenBalance,
} from '../../hooks/useBlockchain';
import './RaceGameModal.scss';

interface RaceGameModalProps {
  serverUrl: string;
  onClose: () => void;
  onJoinGame: (walletAddress?: string) => void;
}

const RaceGameModal: React.FC<RaceGameModalProps> = ({
  serverUrl,
  onClose,
  onJoinGame,
}) => {
  const { publicKey, connected: isConnected } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const address = publicKey?.toString();
  const blockchain = useBlockchain();
  const gameState = useGameState(serverUrl);
  const playerData = usePlayerData();

  // 🚀 Dynamic token and tier information
  const gameToken = useCurrentGameToken();
  const currentTier = gameToken.data?.tier || 'low';
  const tierPricing = useTierPricing(currentTier);
  const dynamicBalance = useDynamicTokenBalance(address || '');

  const [isJoining, setIsJoining] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txStep, setTxStep] = useState<
    'idle' | 'approving' | 'joining' | 'waiting'
  >('idle');
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Get entry fee from tier pricing (dynamic) or fallback to default
  const entryFeeAmount =
    tierPricing.data?.entranceFee ||
    BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL));

  // Get level display name from tier
  const getLevelDisplayName = (tier: string) => {
    switch (tier) {
      case 'low':
        return 'LOW';
      case 'medium':
        return 'MEDIUM';
      case 'high':
        return 'HIGH';
      default:
        return 'UNKNOWN';
    }
  };

  // Get level display color from tier
  const getLevelDisplayColor = (tier: string) => {
    switch (tier) {
      case 'low':
        return '#10b981'; // 绿色
      case 'medium':
        return '#f59e0b'; // 橙色
      case 'high':
        return '#ef4444'; // 红色
      default:
        return '#6b7280'; // 灰色
    }
  };

  // Check balance using dynamic token balance
  const hasSufficientBalance =
    dynamicBalance.data && dynamicBalance.data >= entryFeeAmount;
  const needsApproval = !gameToken.data?.isSOL && !hasSufficientBalance; // Only for non-SOL tokens

  // Stable refresh functions to prevent dependency issues
  const refreshGameData = useCallback(() => {
    return gameState.refreshGameData();
  }, [gameState]);

  const refreshTokenData = useCallback(() => {
    return Promise.allSettled([gameToken.refetch(), tierPricing.refetch()]);
  }, [gameToken, tierPricing]);

  const refreshWalletData = useCallback(() => {
    if (isConnected && address) {
      return Promise.allSettled([
        playerData.refreshPlayerData(),
        dynamicBalance.refetch(),
      ]);
    }
    return Promise.resolve();
  }, [isConnected, address, playerData, dynamicBalance]);

  // Initial data refresh when component mounts - prevent cascading updates
  useEffect(() => {
    let mounted = true;

    const performInitialRefresh = async () => {
      if (!mounted) return;

      try {
        await Promise.allSettled([refreshGameData(), refreshTokenData()]);
      } catch (error) {
        console.warn('Initial refresh failed:', error);
      }
    };

    performInitialRefresh();

    return () => {
      mounted = false;
    };
  }, [refreshGameData, refreshTokenData]);

  // Monitor wallet connection state changes - optimize to prevent loops
  useEffect(() => {
    if (isConnected && address) {
      let mounted = true;

      const refreshWalletDataInternal = async () => {
        if (!mounted) return;

        try {
          await refreshWalletData();
        } catch (error) {
          console.warn('Wallet data refresh failed:', error);
        }
      };

      refreshWalletDataInternal();

      return () => {
        mounted = false;
      };
    }
  }, [isConnected, address, refreshWalletData]);

  // Auto-refresh mechanism - reduce frequency and add proper cleanup
  useEffect(() => {
    // Only run auto-refresh if component is still mounted and no critical operations are pending
    if (txStep !== 'idle' || blockchain.isWritePending) {
      return; // Skip auto-refresh during transactions
    }

    const autoRefreshInterval = setInterval(() => {
      // Additional check to ensure component is still active
      if (txStep === 'idle' && !blockchain.isWritePending) {
        // Batch refresh operations to avoid rapid successive calls
        Promise.allSettled([
          refreshGameData(),
          refreshTokenData(),
          refreshWalletData(),
        ]).catch((error) => {
          console.warn('Auto-refresh failed:', error);
        });
      }
    }, 15000); // Increased to 15 seconds to reduce load

    return () => clearInterval(autoRefreshInterval);
  }, [
    txStep,
    blockchain.isWritePending,
    refreshGameData,
    refreshTokenData,
    refreshWalletData,
  ]);

  // Refresh data when gameId changes - use stable reference and debounce
  useEffect(() => {
    if (gameState.gameId !== null && gameState.gameId !== undefined) {
      // Debounce rapid gameId changes
      const timeoutId = setTimeout(() => {
        refreshTokenData().catch((error: any) => {
          console.warn('GameId change refresh failed:', error);
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.gameId, refreshTokenData]);

  /**
   * 连接钱包
   */
  const handleConnectWallet = async () => {
    try {
      openWalletModal(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  /**
   * 授权USD1代币
   */
  const handleApproval = async () => {
    if (!address || !entryFeeAmount) return;

    try {
      setIsApproving(true);
      setTxStep('approving');

      // 授权足够的金额（入场费 * 10，避免频繁授权）
      const approvalAmount = entryFeeAmount * BigInt(10);
      blockchain.approveUSD1(approvalAmount);
    } catch (error) {
      console.error('Failed to approve USD1:', error);
      setTxStep('idle');
    } finally {
      setIsApproving(false);
    }
  };

  /**
   * 加入游戏 - 使用动态token和分层定价
   */
  const handleJoinGame = async () => {
    if (!address) {
      console.error('No wallet address available');
      return;
    }

    if (gameState.gameId === null || gameState.gameId === undefined) {
      console.error('No game ID available');
      return;
    }

    if (!gameToken.data) {
      console.error('Game token information not available');
      return;
    }

    try {
      setIsJoining(true);
      setTxStep('joining');

      // Use dynamic tier and player level (default level 1 for now)
      const playerLevel = 1; // TODO: Get from player profile
      const txResult = await blockchain.joinGame(
        gameState.gameId,
        currentTier,
        playerLevel,
      );

      console.log('🎯 Joined game with dynamic token and tier:', {
        gameId: gameState.gameId,
        tier: currentTier,
        tokenSymbol: gameToken.data.tokenSymbol,
        entranceFee: Number(entryFeeAmount) / LAMPORTS_PER_SOL,
        txHash: txResult.txHash,
      });
    } catch (error) {
      console.error('Failed to join game:', error);
      setTxStep('idle');
    } finally {
      setIsJoining(false);
    }
  };

  // 监听交易状态
  useEffect(() => {
    if (blockchain.isConfirmed && txStep !== 'idle') {
      if (txStep === 'approving') {
        // 授权完成，刷新数据
        refreshWalletData()
          .then(() => {
            setTxStep('idle');
          })
          .catch((error: any) => {
            console.error('Error refreshing player data:', error);
            setTxStep('idle');
          });
      } else if (txStep === 'joining') {
        // 加入游戏完成
        refreshGameData();
        setTxStep('waiting');

        // 进入游戏
        setTimeout(() => {
          onJoinGame(address);
          onClose();
        }, 1000);
      }
    }
  }, [
    blockchain.isConfirmed,
    txStep,
    refreshWalletData,
    refreshGameData,
    onJoinGame,
    onClose,
    address,
  ]);

  /**
   * 获取按钮状态和文本
   */
  const getActionButton = () => {
    // 添加调试信息
    if (!isConnected) {
      return (
        <button
          className="race-btn race-btn-primary"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
      );
    }

    // 简化状态判断：只检查服务器是否为比赛服务器且区块链已启用
    if (!gameState.isRaceServer) {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          {gameState.error ? 'CONNECTION ERROR' : 'CONNECTING...'}
        </button>
      );
    }

    // 如果玩家已加入游戏
    if (gameState.isPlayerJoined) {
      return (
        <button
          className="race-btn race-btn-success"
          onClick={() => {
            onJoinGame(address);
            onClose();
          }}
        >
          Enter Game (Joined)
        </button>
      );
    }

    // 检查余额
    if (!hasSufficientBalance) {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          Insufficient {gameToken.data?.tokenSymbol || 'Token'} Balance
        </button>
      );
    }

    // 检查授权 (only for non-SOL tokens)
    if (needsApproval && !gameToken.data?.isSOL) {
      return (
        <button
          className="race-btn race-btn-warning"
          onClick={handleApproval}
          disabled={isApproving || blockchain.isWritePending}
        >
          {isApproving || (blockchain.isWritePending && txStep === 'approving')
            ? 'Approving...'
            : `Approve ${(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)} ${gameToken.data?.tokenSymbol || 'Tokens'}`}
        </button>
      );
    }

    // 默认：显示加入游戏按钮
    const isDisabled =
      isJoining ||
      blockchain.isWritePending ||
      gameState.gameId === null ||
      gameState.gameId === undefined;

    return (
      <button
        className="race-btn race-btn-primary"
        onClick={handleJoinGame}
        disabled={isDisabled}
      >
        {isJoining || (blockchain.isWritePending && txStep === 'joining')
          ? 'Joining...'
          : `Join Game`}
      </button>
    );
  };

  const modalContent = (
    <div className="race-game-modal">
      <div className="race-header">
        <h2>🏆 Race Game</h2>
        <div className="race-server-info">
          <span className="server-url">{new URL(serverUrl).hostname}</span>
          {gameState.isRaceServer && <span className="race-badge">RACE</span>}
          {gameState.isRaceServer && gameToken.data && (
            <div className="game-tier-info">
              <span
                className="level-badge"
                style={{
                  backgroundColor: getLevelDisplayColor(currentTier),
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75em',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  border: `1px solid ${getLevelDisplayColor(currentTier)}dd`,
                }}
              >
                {getLevelDisplayName(currentTier)} TIER
              </span>
              <span
                className="token-badge"
                style={{
                  backgroundColor: '#2d3748',
                  color: '#90cdf4',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7em',
                  fontWeight: 'bold',
                  border: '1px solid #4a5568',
                  marginLeft: '6px',
                }}
              >
                {gameToken.data.tokenSymbol}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="race-content">
        {/* 游戏状态 */}
        <div className="game-status">
          <div className="status-indicator">
            <span
              className={`status-dot ${gameState.getGameStatusColor()}`}
            ></span>
            <span className="status-text">
              {gameState.isRaceServer
                ? `Race Server Ready • ${gameState.gameState.registeredCount} players joined`
                : gameState.error || 'Connecting to server...'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {gameState.gameId !== null && gameState.gameId !== undefined && (
              <div
                className="game-id"
                style={{
                  backgroundColor: '#2d3748',
                  color: '#90cdf4',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  border: '1px solid #4a5568',
                }}
              >
                Game #{gameState.gameId}
                {gameToken.data && (
                  <span
                    style={{
                      fontSize: '0.8em',
                      color: '#a0aec0',
                      marginLeft: '4px',
                      fontWeight: 'normal',
                    }}
                  >
                    (
                    {gameToken.data.retrievalMethod ===
                    'on-chain-dynamic-enhanced'
                      ? '🔗 Enhanced'
                      : gameToken.data.retrievalMethod === 'on-chain-dynamic'
                        ? '🔗 On-chain'
                        : '⚙️ Config'}
                    )
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => {
                // Debounce refresh button clicks to prevent spam
                const now = Date.now();
                if (now - lastRefreshTime < 2000) return; // 2 second debounce
                setLastRefreshTime(now);

                // Batch all refresh operations using stable functions
                Promise.allSettled([
                  refreshGameData(),
                  refreshTokenData(),
                  refreshWalletData(),
                ]).catch((error) => {
                  console.warn('Manual refresh failed:', error);
                });
              }}
              className="race-btn race-btn-secondary"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              🔄 Refresh All
            </button>
          </div>
        </div>

        {/* 游戏信息 - 使用动态token和tier信息 */}
        {gameState.isRaceServer && gameToken.data && (
          <div className="game-info">
            <div className="info-grid">
              <div className="info-item">
                <label>🎯 Game ID</label>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: '#90cdf4',
                    fontSize: '1.1em',
                  }}
                >
                  #{gameState.gameId || 'Loading...'}
                </span>
              </div>
              <div className="info-item tier-highlight">
                <label>⚡ Game Tier</label>
                <div className="tier-display">
                  <span
                    className="tier-name"
                    style={{
                      color: getLevelDisplayColor(currentTier),
                      fontWeight: 'bold',
                      fontSize: '1.1em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {tierPricing.data?.tierName ||
                      getLevelDisplayName(currentTier)}
                  </span>
                  <span
                    className="tier-level"
                    style={{
                      fontSize: '0.8em',
                      marginLeft: '6px',
                      color: '#9ca3af',
                      fontWeight: 'normal',
                    }}
                  >
                    ({currentTier})
                  </span>
                </div>
                <div
                  className="tier-level-range"
                  style={{
                    fontSize: '0.75em',
                    color: '#6b7280',
                    marginTop: '2px',
                  }}
                >
                  Level{' '}
                  {tierPricing.data
                    ? `${tierPricing.data.minLevel}-${tierPricing.data.maxLevel}`
                    : '---'}
                </div>
              </div>
              <div className="info-item">
                <label>💰 Payment Token</label>
                <span style={{ fontWeight: 'bold' }}>
                  {gameToken.data.tokenSymbol}
                  <span
                    style={{
                      fontSize: '0.8em',
                      color: '#888',
                      marginLeft: '4px',
                    }}
                  >
                    (
                    {gameToken.data.retrievalMethod?.includes('enhanced')
                      ? '🔗 Enhanced'
                      : gameToken.data.retrievalMethod?.includes('on-chain')
                        ? '🔗 On-chain'
                        : '⚙️ Config'}
                    )
                  </span>
                </span>
              </div>
              <div className="info-item entry-fee-highlight">
                <label>🎫 Entry Fee</label>
                <div className="fee-display">
                  <span
                    className="fee-amount"
                    style={{
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      fontSize: '1.15em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}
                  </span>
                  <span
                    className="fee-token"
                    style={{
                      fontWeight: 'bold',
                      color: '#e5e7eb',
                      fontSize: '0.9em',
                      marginLeft: '4px',
                    }}
                  >
                    {gameToken.data.tokenSymbol}
                  </span>
                </div>
                <div
                  className="fee-tier-info"
                  style={{
                    fontSize: '0.75em',
                    color: '#9ca3af',
                    marginTop: '2px',
                    fontStyle: 'italic',
                  }}
                >
                  {getLevelDisplayName(currentTier)} tier pricing
                </div>
              </div>
              <div className="info-item">
                <label>🏆 Kill Reward</label>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  {tierPricing.data
                    ? (
                        Number(tierPricing.data.killReward) / LAMPORTS_PER_SOL
                      ).toFixed(4)
                    : '---'}{' '}
                  {gameToken.data.tokenSymbol}
                </span>
              </div>
              <div className="info-item">
                <label>📊 Level Range</label>
                <span>
                  {tierPricing.data
                    ? `${tierPricing.data.minLevel}-${tierPricing.data.maxLevel}`
                    : '---'}
                </span>
              </div>
              <div className="info-item">
                <label>👥 Players</label>
                <span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {gameState.gameState.registeredCount}
                  </span>
                  {' joined • '}
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                    {gameState.gameState.playerCount}
                  </span>
                  {' active'}
                </span>
              </div>
              <div className="info-item">
                <label>🪙 Token Mint</label>
                <span
                  style={{
                    fontSize: '0.8em',
                    fontFamily: 'monospace',
                    backgroundColor: '#2d3748',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#e2e8f0',
                  }}
                >
                  {gameToken.data.tokenMint.slice(0, 8)}...
                  {gameToken.data.tokenMint.slice(-4)}
                </span>
              </div>
            </div>
            {tierPricing.data && (
              <div
                className="tier-description"
                style={{
                  fontSize: '0.85em',
                  color: '#666',
                  marginTop: '12px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  fontStyle: 'italic',
                  border: '1px solid #e9ecef',
                }}
              >
                💡 {tierPricing.data.description}
              </div>
            )}
          </div>
        )}

        {/* 玩家钱包信息 - 使用动态token balance */}
        {isConnected && (
          <div className="wallet-info">
            <div
              className="wallet-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>
                🔑 Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              {gameToken.data && (
                <span
                  style={{
                    fontSize: '0.8em',
                    color: '#888',
                    padding: '2px 6px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                  }}
                >
                  {gameToken.data.tokenSymbol} Game
                </span>
              )}
            </div>
            <div
              className="balance-info"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>
                  💰 {gameToken.data?.tokenSymbol || 'Token'} Balance:
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: hasSufficientBalance ? '#10b981' : '#ef4444',
                    fontSize: '1.05em',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {dynamicBalance.isLoading ? (
                    <span style={{ opacity: 0.7 }}>⏳ Loading...</span>
                  ) : (
                    <span>
                      {(
                        Number(dynamicBalance.data || BigInt(0)) /
                        LAMPORTS_PER_SOL
                      ).toFixed(4)}{' '}
                      {gameToken.data?.tokenSymbol || ''}
                    </span>
                  )}
                </span>
              </div>
              {gameToken.data && (
                <div
                  style={{
                    fontSize: '0.8em',
                    color: '#64748b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>🪙 Token Mint:</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      backgroundColor: '#e2e8f0',
                      padding: '2px 4px',
                      borderRadius: '3px',
                    }}
                  >
                    {gameToken.data.tokenMint.slice(0, 8)}...
                    {gameToken.data.tokenMint.slice(-4)}
                  </span>
                </div>
              )}
              {!hasSufficientBalance && gameToken.data && (
                <div
                  style={{
                    fontSize: '0.8em',
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                  }}
                >
                  ⚠️ Insufficient balance! Need at least{' '}
                  {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
                  {gameToken.data.tokenSymbol}
                </div>
              )}
            </div>
            {gameToken.isLoading && (
              <div
                className="loading-hint"
                style={{
                  fontSize: '12px',
                  color: '#888',
                  marginTop: '6px',
                  padding: '4px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '4px',
                  border: '1px solid #bae6fd',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease',
                }}
              >
                🎯 Loading game token information...
              </div>
            )}
            {(gameToken.isLoading || tierPricing.isLoading) && (
              <div
                className="loading-hint"
                style={{
                  fontSize: '12px',
                  color: '#888',
                  marginTop: '4px',
                  padding: '4px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '4px',
                  border: '1px solid #bae6fd',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease',
                }}
              >
                💡 Fetching dynamic pricing and balance...
              </div>
            )}
          </div>
        )}

        {/* 错误信息 - 包含动态token获取错误 */}
        {(gameState.error ||
          playerData.error ||
          gameToken.error ||
          tierPricing.error ||
          dynamicBalance.error) && (
          <div className="error-message">
            {String(
              gameState.error ||
                playerData.error ||
                gameToken.error ||
                tierPricing.error ||
                dynamicBalance.error,
            )}
          </div>
        )}

        {/* 交易状态 - 更新为支持动态token */}
        {txStep !== 'idle' && (
          <div className="tx-status">
            {txStep === 'approving' &&
              `⏳ Approving ${gameToken.data?.tokenSymbol || 'token'}...`}
            {txStep === 'joining' && `⏳ Joining ${currentTier} tier game...`}
            {txStep === 'waiting' &&
              '✅ Transaction confirmed! Entering game...'}
          </div>
        )}
      </div>

      <div className="race-actions">
        {getActionButton()}
        <button className="race-btn race-btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      child={modalContent}
      close={onClose}
      className="race-game-modal-wrapper"
    />
  );
};

export default RaceGameModal;
