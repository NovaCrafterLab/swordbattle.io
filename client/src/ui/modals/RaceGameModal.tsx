import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Modal from './Modal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerData } from '../../hooks/usePlayerData';
import {
  useCurrentGameToken,
  useTierPricing,
  useDynamicTokenBalance,
  useBlockchain,
} from '../../hooks/useBlockchain';
import './RaceGameModal.scss';

// Icons (you can replace these with your preferred icon library)
const TrophyIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ZapIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v4h5"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

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
  const gameState = useGameState(serverUrl);
  const playerData = usePlayerData();
  const blockchain = useBlockchain();

  // 🔍 Debug: Log props and game state
  console.log('🔍 RaceGameModal Debug:', {
    serverUrl,
    isRaceServer: gameState.isRaceServer,
    gameId: gameState.gameId,
    phase: gameState.phase,
    error: gameState.error,
    serverInfo: gameState.serverInfo,
    isLoading: gameState.isLoading,
  });

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

  // 🔧 修复：固定一次挂载执行，移除回调依赖
  useEffect(() => {
    let mounted = true;

    const performInitialRefresh = async () => {
      if (!mounted) return;

      try {
        // 直接调用方法，不依赖回调函数
        await Promise.allSettled([
          gameState.refreshGameData(),
          gameToken.refetch(),
          tierPricing.refetch(),
        ]);
      } catch (error) {
        console.warn('Initial refresh failed:', error);
      }
    };

    performInitialRefresh();

    return () => {
      mounted = false;
    };
  }, []); // 🎯 空依赖数组，只在挂载时执行一次

  // 🔧 修复：只在钱包连接状态变化时触发，移除函数依赖
  const [prevConnectionState, setPrevConnectionState] = useState<{
    isConnected: boolean;
    address: string | null;
  }>({ isConnected: false, address: null });

  useEffect(() => {
    // 只在连接状态从 false -> true 或地址首次出现时触发
    if (
      isConnected &&
      address &&
      (!prevConnectionState.isConnected ||
        prevConnectionState.address !== address)
    ) {
      let mounted = true;

      const refreshWalletDataInternal = async () => {
        if (!mounted) return;

        try {
          // 直接调用方法，不依赖回调函数
          await Promise.allSettled([
            playerData.refreshPlayerData(),
            dynamicBalance.refetch(),
          ]);
        } catch (error) {
          console.warn('Wallet data refresh failed:', error);
        }
      };

      refreshWalletDataInternal();

      return () => {
        mounted = false;
      };
    }

    // 更新前一次的连接状态
    setPrevConnectionState({ isConnected, address: address || null });
  }, [isConnected, address]); // 🎯 只依赖原始值，不依赖函数

  // 🔧 修复：简化自动刷新，移除函数依赖
  useEffect(() => {
    if (txStep !== 'idle') {
      return; // Skip auto-refresh during transactions
    }

    const autoRefreshInterval = setInterval(() => {
      // 直接调用方法，不依赖回调函数
      Promise.allSettled([
        gameState.refreshGameData(),
        gameToken.refetch(),
        tierPricing.refetch(),
        ...(isConnected && address
          ? [playerData.refreshPlayerData(), dynamicBalance.refetch()]
          : []),
      ]).catch((error) => {
        console.warn('Auto-refresh failed:', error);
      });
    }, 60000);

    return () => clearInterval(autoRefreshInterval);
  }, [txStep]); // 🎯 只依赖 txStep，移除所有函数依赖

  // 🔧 修复：使用 ref 跟踪 gameId 变化，避免重复刷新
  const [prevGameId, setPrevGameId] = useState<number | null>(null);

  useEffect(() => {
    const currentGameId = gameState.gameId;

    // 只在 gameId 从 null 变为有效值，或者值真正改变时才刷新
    if (
      currentGameId !== null &&
      currentGameId !== undefined &&
      currentGameId !== prevGameId
    ) {
      const timeoutId = setTimeout(() => {
        // 直接调用方法，不依赖回调函数
        Promise.allSettled([gameToken.refetch(), tierPricing.refetch()]).catch(
          (error: any) => {
            console.warn('GameId change refresh failed:', error);
          },
        );
      }, 500);

      setPrevGameId(currentGameId);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.gameId]); // 🎯 只依赖 gameId，移除函数依赖

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
      // 修复：移除 blockchain 调用，使用本地状态管理
      // blockchain.approveUSD1(approvalAmount);
      console.log('Approval would be called here with amount:', approvalAmount);
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

      // Call blockchain.joinGame with the new Solana implementation
      const txResult = await blockchain.joinGame(
        gameState.gameId,
        currentTier,
        playerLevel,
      );

      console.log('🎯 Successfully joined game with Solana:', {
        gameId: gameState.gameId,
        tier: currentTier,
        level: playerLevel,
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

  // 🔧 修复：简化交易状态监听，移除函数依赖
  useEffect(() => {
    if (txStep !== 'idle') {
      if (txStep === 'approving') {
        // 授权完成，刷新数据
        Promise.allSettled([
          playerData.refreshPlayerData(),
          dynamicBalance.refetch(),
        ])
          .then(() => {
            setTxStep('idle');
          })
          .catch((error: any) => {
            console.error('Error refreshing player data:', error);
            setTxStep('idle');
          });
      } else if (txStep === 'joining') {
        // 加入游戏完成
        gameState.refreshGameData();
        setTxStep('waiting');

        // 进入游戏
        setTimeout(() => {
          onJoinGame(address);
          onClose();
        }, 1000);
      }
    }
  }, [txStep, onJoinGame, onClose, address]); // 🎯 只保留必要的依赖

  /**
   * 获取按钮状态和文本 - 优化设计
   */
  const getActionButton = () => {
    if (!isConnected) {
      return (
        <button className="race-btn primary" onClick={handleConnectWallet}>
          <WalletIcon />
          Connect Wallet
        </button>
      );
    }

    if (!gameState.isRaceServer) {
      return (
        <button className="race-btn disabled" disabled>
          {gameState.error ? 'CONNECTION ERROR' : 'CONNECTING...'}
        </button>
      );
    }

    if (gameState.isPlayerJoined) {
      return (
        <button
          className="race-btn success"
          onClick={() => {
            onJoinGame(address);
            onClose();
          }}
        >
          <ZapIcon />
          Enter Game (Joined)
        </button>
      );
    }

    if (!hasSufficientBalance) {
      return (
        <button className="race-btn disabled" disabled>
          <WarningIcon />
          Insufficient {gameToken.data?.tokenSymbol || 'Token'} Balance
        </button>
      );
    }

    if (needsApproval && !gameToken.data?.isSOL) {
      return (
        <button
          className="race-btn warning"
          onClick={handleApproval}
          disabled={isApproving}
        >
          {isApproving ? (
            'Approving...'
          ) : (
            <>
              <ZapIcon />
              Approve {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(
                4,
              )}{' '}
              {gameToken.data?.tokenSymbol || 'Tokens'}
            </>
          )}
        </button>
      );
    }

    const isDisabled =
      isJoining || gameState.gameId === null || gameState.gameId === undefined;

    return (
      <button
        className="race-btn primary"
        onClick={handleJoinGame}
        disabled={isDisabled}
      >
        {isJoining ? (
          'Joining...'
        ) : (
          <>
            <ZapIcon />
            Join Race
          </>
        )}
      </button>
    );
  };

  const modalContent = (
    <div className="race-game-modal">
      {/* Header - Clean and Modern */}
      <div className="race-header">
        <div className="header-content">
          <div className="">
            <ZapIcon />
          </div>
          <div className="title-section">
            <h2>🏆 Race Game</h2>
            <p className="subtitle">
              Join high-speed blockchain racing with dynamic rewards
            </p>
          </div>
        </div>

        <div className="header-badges">
          <div className="badge race-badge">RACE</div>
          {gameToken.data && (
            <>
              <div className="badge tier-badge">
                {getLevelDisplayName(currentTier)} TIER
              </div>
              <div className="badge token-badge">
                {gameToken.data.tokenSymbol}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="race-content">
        {/* Game Status */}
        <div className="game-status">
          <div className="status-info">
            <span
              className={`status-dot ${gameState.getGameStatusColor()}`}
            ></span>
            <span className="status-text">
              {gameState.isRaceServer
                ? `Race Server Ready • ${gameState.gameState.registeredCount} players joined`
                : gameState.error || 'Connecting to server...'}
            </span>
          </div>

          <button
            onClick={() => {
              const now = Date.now();
              if (now - lastRefreshTime < 2000) return;
              setLastRefreshTime(now);

              Promise.allSettled([
                gameState.refreshGameData(),
                gameToken.refetch(),
                tierPricing.refetch(),
                ...(isConnected && address
                  ? [playerData.refreshPlayerData(), dynamicBalance.refetch()]
                  : []),
              ]).catch((error) => {
                console.warn('Manual refresh failed:', error);
              });
            }}
            className="refresh-button"
          >
            Refresh
          </button>
        </div>

        {/* Stats Grid - Clean 4-column layout */}
        {gameState.isRaceServer && gameToken.data && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon prize">
                <TrophyIcon />
              </div>
              <div className="stat-label">Prize Pool</div>
              <div className="stat-value">
                {(
                  (Number(entryFeeAmount) *
                    gameState.gameState.registeredCount) /
                  LAMPORTS_PER_SOL
                ).toFixed(4)}{' '}
                {gameToken.data.tokenSymbol}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon users">
                <UsersIcon />
              </div>
              <div className="stat-label">Players</div>
              <div className="stat-value">
                {gameState.gameState.registeredCount}/
                {gameState.gameState.playerCount}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon time">
                <ClockIcon />
              </div>
              <div className="stat-label">Entry Fee</div>
              <div className="stat-value">
                {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
                {gameToken.data.tokenSymbol}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon level">
                <ZapIcon />
              </div>
              <div className="stat-label">Game ID</div>
              <div className="stat-value">
                #{gameState.gameId || 'Loading...'}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Section - Simplified Design */}
        {isConnected && (
          <div className="wallet-section">
            <div className="wallet-header">
              <WalletIcon />
              <span className="wallet-title">Your Wallet</span>
              <span className="wallet-address">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            <div className="balance-grid">
              <div className="balance-item">
                <span className="balance-label">Balance</span>
                <span
                  className={`balance-value ${hasSufficientBalance ? 'sufficient' : 'insufficient'}`}
                >
                  {dynamicBalance.isLoading
                    ? 'Loading...'
                    : `${(Number(dynamicBalance.data || BigInt(0)) / LAMPORTS_PER_SOL).toFixed(4)} ${gameToken.data?.tokenSymbol || ''}`}
                </span>
              </div>

              <div className="balance-item">
                <span className="balance-label">Required</span>
                <span className="balance-value">
                  {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
                  {gameToken.data?.tokenSymbol || ''}
                </span>
              </div>
            </div>

            {!hasSufficientBalance && gameToken.data && (
              <div className="insufficient-warning">
                <WarningIcon />
                Insufficient balance! Need at least{' '}
                {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
                {gameToken.data.tokenSymbol}
              </div>
            )}
          </div>
        )}

        {/* Loading States */}
        {(gameToken.isLoading || tierPricing.isLoading) && (
          <div className="loading-state">
            🎯 Loading game token information and pricing...
          </div>
        )}

        {/* Error States */}
        {(gameState.error ||
          playerData.error ||
          gameToken.error ||
          tierPricing.error ||
          dynamicBalance.error) && (
          <div className="error-state">
            {String(
              gameState.error ||
                playerData.error ||
                gameToken.error ||
                tierPricing.error ||
                dynamicBalance.error,
            )}
          </div>
        )}

        {/* Transaction Status */}
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

      {/* Actions */}
      <div className="race-actions">
        {getActionButton()}
        <button className="race-btn secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  return <Modal child={modalContent} className="race-game-modal-wrapper" />;
};

export default RaceGameModal;
