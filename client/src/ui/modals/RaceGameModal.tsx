import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Modal from './Modal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useSolanaVault } from '../../hooks/useSolanaVault';
import { useWalletCheck } from '../../hooks/useWalletCheck';
import {
  useCurrentGameToken,
  useTierPricing,
  useDynamicTokenBalance,
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
  const solanaVault = useSolanaVault();
  const { walletStatus, showInstallPrompt } = useWalletCheck();

  // 🔍 Debug: Log props and game state
  console.log('🔍 RaceGameModal Debug:', {
    serverUrl,
    isRaceServer: gameState.isRaceServer,
    gameId: gameState.gameId,
    phase: gameState.phase,
    error: gameState.error,
    serverInfo: gameState.serverInfo,
    isLoading: gameState.isLoading,
    txStatus: solanaVault.txStatus,
    currentTxHash: solanaVault.currentTxHash,
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
   * 连接钱包 - 首先检查是否安装了钱包插件
   */
  const handleConnectWallet = async () => {
    try {
      // 检查是否已安装钱包插件
      if (!walletStatus.isInstalled) {
        console.log(
          '🔒 No Solana wallet detected, showing installation prompt',
        );
        showInstallPrompt('phantom'); // 默认推荐 Phantom 钱包
        return;
      }

      console.log(
        '✅ Solana wallet detected, opening wallet modal:',
        walletStatus.detectedWallets,
      );
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
   * 加入游戏 - 使用新的安全前端交易流程
   */
  const handleJoinGame = async () => {
    console.log('🎮 Starting secure handleJoinGame...');

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

    console.log('✅ Initial checks passed:', {
      address,
      gameId: gameState.gameId,
      gameToken: gameToken.data,
      currentTier,
    });

    try {
      setIsJoining(true);
      setTxStep('joining');

      console.log('💰 Calculating tier pricing...');

      // Get tier pricing to determine the correct amount
      const tierConfigs = {
        low: { entranceFee: BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL)) },
        medium: { entranceFee: BigInt(Math.floor(0.05 * LAMPORTS_PER_SOL)) },
        high: { entranceFee: BigInt(Math.floor(0.1 * LAMPORTS_PER_SOL)) },
      };

      const config = tierConfigs[currentTier as keyof typeof tierConfigs];
      if (!config) {
        throw new Error(`Invalid tier: ${currentTier}`);
      }

      console.log('🎯 Tier configuration:', {
        tier: currentTier,
        entranceFee: config.entranceFee.toString(),
        entranceFeeSOL: Number(config.entranceFee) / LAMPORTS_PER_SOL,
      });

      // Get token mint from game token data
      let tokenMint;
      try {
        const { PublicKey } = await import('@solana/web3.js');

        // Use token mint from environment or default to test token
        const tokenMintAddress =
          process.env.REACT_APP_TOKEN_MINT ||
          'Hk4BerAoKbemG277HShrk8DSHiMEUKbm6D23RKhLDLKq'; // Test SBTT token

        tokenMint = new PublicKey(tokenMintAddress);
        console.log('🪙 Using token mint:', tokenMint.toString());
      } catch (error) {
        console.error('❌ Failed to create token mint PublicKey:', error);
        throw new Error('Invalid token mint configuration');
      }

      // Ensure we have a valid game ID from server before proceeding
      const actualGameId = gameState.gameId;
      console.log('🎮 Using confirmed game ID from server:', actualGameId);

      console.log('🚀 About to call secure solanaVault.buyTicket with:', {
        gameId: actualGameId,
        amount: config.entranceFee.toString(),
        tokenMint: tokenMint.toString(),
        tier: currentTier,
        expectedAmount: config.entranceFee.toString(),
      });

      // 🔒 Use new secure frontend transaction flow
      // This will trigger wallet popup and handle all security validation
      const txResult = await solanaVault.buyTicket(
        actualGameId,
        config.entranceFee,
        tokenMint,
        currentTier,
        config.entranceFee, // expected amount for validation
      );

      console.log('🎯 Successfully joined game with secure transaction:', {
        gameId: actualGameId,
        tier: currentTier,
        tokenSymbol: gameToken.data.tokenSymbol,
        entranceFee: Number(config.entranceFee) / LAMPORTS_PER_SOL,
        txHash: txResult,
      });

      // 🔧 Wait for transaction completion and state sync
      console.log(
        '✅ Transaction completed successfully, preparing to enter game...',
      );

      // Refresh game data to ensure server recognizes player
      await gameState.refreshGameData();

      // Wait a moment for state synchronization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now safe to enter the game
      onJoinGame(address);
      onClose();
    } catch (error) {
      console.error('❌ handleJoinGame failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error details:', errorMessage);
      setTxStep('idle');
    } finally {
      setIsJoining(false);
    }
  };

  // 🔧 修复：简化交易状态监听，适配新的安全交易流程
  useEffect(() => {
    // Handle legacy txStep states for backward compatibility
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
        // 加入游戏中 - 等待新的安全交易流程完成
        console.log('⏳ Secure transaction in progress...');
        // txStep will be reset in handleJoinGame when transaction completes
      }
    }

    // Handle new secure transaction status
    if (solanaVault.txStatus === 'completed') {
      // Transaction completed successfully, refresh data
      Promise.allSettled([
        gameState.refreshGameData(),
        playerData.refreshPlayerData(),
        dynamicBalance.refetch(),
      ]).catch((error: any) => {
        console.warn('Error refreshing data after transaction:', error);
      });
    }
  }, [txStep, solanaVault.txStatus, playerData, dynamicBalance, gameState]); // 🎯 修复依赖

  /**
   * 获取按钮状态和文本 - 优化设计
   */
  const getActionButton = () => {
    if (!isConnected) {
      // 检查是否已安装钱包插件
      if (!walletStatus.isInstalled) {
        return (
          <button className="race-btn warning" onClick={handleConnectWallet}>
            Install Solana Wallet
          </button>
        );
      }

      // 如果已安装钱包，显示检测到的钱包信息
      const walletInfo =
        walletStatus.detectedWallets.length > 0
          ? ` (${walletStatus.detectedWallets.join(', ')} detected)`
          : '';

      return (
        <button className="race-btn primary" onClick={handleConnectWallet}>
          Connect Wallet{walletInfo}
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
          Enter Game (Joined)
        </button>
      );
    }

    if (!hasSufficientBalance) {
      return (
        <button className="race-btn disabled" disabled>
          ⚠️ Insufficient {gameToken.data?.tokenSymbol || 'Token'} Balance
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
              Approve {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
              {gameToken.data?.tokenSymbol || 'Tokens'}
            </>
          )}
        </button>
      );
    }

    // Check if transaction is in progress
    const isTransactionInProgress =
      solanaVault.txStatus !== 'idle' || isJoining;

    const isDisabled =
      isJoining ||
      gameState.gameId === null ||
      gameState.gameId === undefined ||
      isTransactionInProgress;

    // Show different button states based on transaction status
    if (solanaVault.txStatus === 'signing') {
      return (
        <button className="race-btn warning" disabled>
          Confirm in Wallet
        </button>
      );
    }

    if (
      solanaVault.txStatus === 'sending' ||
      solanaVault.txStatus === 'confirming'
    ) {
      return (
        <button className="race-btn warning" disabled>
          Transaction Processing...
        </button>
      );
    }

    if (solanaVault.txStatus === 'verifying') {
      return (
        <button className="race-btn warning" disabled>
          Verifying Ticket...
        </button>
      );
    }

    if (solanaVault.txStatus === 'completed') {
      return (
        <button
          className="race-btn success"
          onClick={() => {
            onJoinGame(address);
            onClose();
          }}
        >
          Enter Game (Purchased)
        </button>
      );
    }

    // Show loading state when game ID is not available
    if (gameState.gameId === null || gameState.gameId === undefined) {
      return (
        <button className="race-btn disabled" disabled>
          <ClockIcon />
          Waiting for Game ID...
        </button>
      );
    }

    return (
      <button
        className="race-btn primary"
        onClick={handleJoinGame}
        disabled={isDisabled || isJoining || solanaVault.isLoading}
      >
        {isJoining || solanaVault.isLoading ? 'Joining...' : <>Join Race</>}
      </button>
    );
  };

  const modalContent = (
    <div className="race-game-modal">
      {/* Header - Clean and Modern */}
      <div className="race-header">
        <div className="header-content">
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

      {/* Content - Game Status Full Width + Two Column Layout */}
      <div className="race-content">
        {/* Game Status - Enhanced Server Status Display */}
        <div
          className={`game-status ${gameState.isRaceServer ? 'ready' : gameState.error ? 'error' : 'connecting'}`}
        >
          <div className="status-info">
            <span
              className={`status-dot ${gameState.getGameStatusColor()}`}
            ></span>
            <span className="status-text">
              {gameState.isRaceServer
                ? `🏁 Race Server Active • ${gameState.gameState.registeredCount} players ready • Game #${gameState.gameId || 'Loading...'}`
                : gameState.error
                  ? `❌ Connection Failed: ${gameState.error}`
                  : '🔄 Connecting to race server...'}
            </span>
          </div>

          {/* 右侧控制区域 */}
          <div className="status-controls">
            {/* 服务器状态指示器 */}
            <div
              className={`server-indicator ${gameState.isRaceServer ? 'online' : gameState.error ? 'error' : 'connecting'}`}
            >
              {gameState.isRaceServer ? (
                <>
                  <svg
                    className="indicator-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="indicator-text">READY</span>
                </>
              ) : gameState.error ? (
                <>
                  <svg
                    className="indicator-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="indicator-text">ERROR</span>
                </>
              ) : (
                <>
                  <svg
                    className="indicator-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L5.05 4.05zM5.05 4.05L4.343 4.757a1 1 0 101.414 1.414L5.05 4.05zM14.95 15.95L15.657 15.243a1 1 0 10-1.414-1.414L14.95 15.95z" />
                  </svg>
                  <span className="indicator-text">CONNECTING</span>
                </>
              )}
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
              title="Refresh game data"
            ></button>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="race-content-grid">
          {/* Left Column - Race Information */}
          <div className="race-info-column">
            {/* Stats Grid - Clean 2x2 layout */}
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
                  <div className="stat-icon level">⚡</div>
                  <div className="stat-label">Game ID</div>
                  <div className="stat-value">
                    #{gameState.gameId || 'Loading...'}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Status - Enhanced with detailed wallet interaction states */}
            {(txStep !== 'idle' || solanaVault.txStatus !== 'idle') && (
              <div className="tx-status">
                <div className="tx-step-indicator">
                  {solanaVault.txStatus === 'building' && (
                    <div className="tx-step active">
                      🔧 Building transaction...
                    </div>
                  )}
                  {solanaVault.txStatus === 'signing' && (
                    <div className="tx-step active">
                      💳 Please confirm transaction in your wallet...
                    </div>
                  )}
                  {solanaVault.txStatus === 'sending' && (
                    <div className="tx-step active">
                      📡 Sending transaction to blockchain...
                    </div>
                  )}
                  {solanaVault.txStatus === 'confirming' && (
                    <div className="tx-step active">
                      ⏳ Waiting for blockchain confirmation...
                      {solanaVault.currentTxHash && (
                        <div className="tx-hash">
                          TX: {solanaVault.currentTxHash.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  )}
                  {solanaVault.txStatus === 'verifying' && (
                    <div className="tx-step active">
                      🔍 Verifying ticket creation...
                    </div>
                  )}
                  {solanaVault.txStatus === 'completed' && (
                    <div className="tx-step completed">
                      ✅ Transaction completed successfully!
                    </div>
                  )}

                  {/* Fallback to old states for backward compatibility */}
                  {solanaVault.txStatus === 'idle' &&
                    txStep === 'approving' && (
                      <div className="tx-step active">
                        ⏳ Approving {gameToken.data?.tokenSymbol || 'token'}...
                      </div>
                    )}
                  {solanaVault.txStatus === 'idle' && txStep === 'joining' && (
                    <div className="tx-step active">
                      ⏳ Joining {currentTier} tier game...
                    </div>
                  )}
                  {solanaVault.txStatus === 'idle' && txStep === 'waiting' && (
                    <div className="tx-step active">
                      ✅ Transaction confirmed! Entering game...
                    </div>
                  )}
                </div>

                {/* Show transaction hash if available */}
                {solanaVault.currentTxHash && (
                  <div className="tx-hash-info">
                    <a
                      href={`https://solscan.io/tx/${solanaVault.currentTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-hash-link"
                    >
                      View on Solscan
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Wallet Information */}
          <div className="wallet-info-column">
            {/* Wallet Detection Status - Show when not connected */}
            {!isConnected && (
              <div className="wallet-detection-status">
                <div className="detection-header">
                  <span className="detection-title">Wallet Detection</span>
                </div>

                <div className="detection-info">
                  {walletStatus.isInstalled ? (
                    <div className="detection-success">
                      ✅ Detected: {walletStatus.detectedWallets.join(', ')}
                    </div>
                  ) : (
                    <div className="detection-warning">
                      ⚠️ No Solana wallet detected. Install Phantom or Solflare
                      to continue.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wallet Section - Simplified Design */}
            {isConnected && (
              <div className="wallet-section">
                <div className="wallet-header">
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
                      title={
                        dynamicBalance.isLoading
                          ? 'Loading...'
                          : `${(Number(dynamicBalance.data || BigInt(0)) / LAMPORTS_PER_SOL).toFixed(6)} ${gameToken.data?.tokenSymbol || ''}`
                      }
                    >
                      {dynamicBalance.isLoading
                        ? 'Loading...'
                        : `${(Number(dynamicBalance.data || BigInt(0)) / LAMPORTS_PER_SOL).toFixed(4)} ${gameToken.data?.tokenSymbol || ''}`}
                    </span>
                  </div>

                  <div className="balance-item">
                    <span className="balance-label">Required</span>
                    <span
                      className="balance-value"
                      title={`${(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(6)} ${gameToken.data?.tokenSymbol || ''}`}
                    >
                      {(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)}{' '}
                      {gameToken.data?.tokenSymbol || ''}
                    </span>
                  </div>
                </div>

                {!hasSufficientBalance && gameToken.data && (
                  <div className="insufficient-warning">
                    ⚠️ Insufficient balance! Need at least{' '}
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
              dynamicBalance.error ||
              solanaVault.error) && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                  {String(
                    solanaVault.error?.message || // Prioritize vault errors (user-friendly)
                      gameState.error ||
                      playerData.error ||
                      gameToken.error ||
                      tierPricing.error ||
                      dynamicBalance.error,
                  )}
                </div>
                {solanaVault.error && (
                  <button
                    className="error-retry-btn"
                    onClick={() => {
                      // Clear vault error and allow user to retry
                      solanaVault.error = null;
                      setTxStep('idle');
                    }}
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="race-actions">
        {getActionButton()}

        {/* Test wallet button - for debugging */}
        {isConnected && (
          <button
            className="race-btn secondary"
            onClick={async () => {
              try {
                const testResult = await solanaVault.testWalletConnection();
                if (testResult) {
                  alert(
                    '✅ Wallet test successful! Plugin should have appeared.',
                  );
                } else {
                  alert('❌ Wallet test failed! Check console for details.');
                }
              } catch (error) {
                console.error('Wallet test error:', error);
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                alert('❌ Wallet test error: ' + errorMessage);
              }
            }}
          >
            Test Wallet
          </button>
        )}

        <button className="race-btn secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  return <Modal child={modalContent} className="race-game-modal-wrapper" />;
};

export default RaceGameModal;
