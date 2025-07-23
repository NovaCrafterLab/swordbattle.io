import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  formatDisplayAmount,
} from '../../hooks/useBlockchain';
import { useToast } from '../components/Toast';
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
  const { addToast } = useToast();

  // Dynamic token and tier information
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
  const [isRefreshing, setIsRefreshing] = useState(false); // 添加刷新状态标记

  // 使用 ref 存储稳定的刷新函数引用
  const refreshDataRef = useRef<() => Promise<void>>();

  // Get entry fee from tier pricing (dynamic) - no fallback, must come from server
  const entryFeeAmount = tierPricing.data?.entranceFee;

  // Helper function to safely format entry fee amount using smart formatting
  const formatEntryFee = (amount?: bigint) => {
    // 统一使用9位小数（SOL标准）
    return formatDisplayAmount(amount, 9);
  };

  // Get token display information - 统一使用LBG作为代币名称
  const getTokenDisplayInfo = () => {
    return {
      symbol: 'LBG',
      name: 'LETSBONKGAME Token',
    };
  };

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
    dynamicBalance.data &&
    entryFeeAmount &&
    dynamicBalance.data >= entryFeeAmount;
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
        // Silent failure - no console output
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
          // Handle specific errors that might occur during data refresh
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (
            errorMessage.includes('StructError') ||
            errorMessage.includes('failed to get info about account')
          ) {
            // This is likely a token account structure error, show user-friendly message
            addToast(
              'info',
              'Token account data loading issue. This is normal for new accounts.',
              3000,
            );
          }
          // Other errors are silently handled
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

  // 统一的数据刷新函数 - 使用 ref 避免依赖循环
  const refreshData = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime < 1000) return; // 防抖保护：5秒内只能刷新一次
    setLastRefreshTime(now);
    setIsRefreshing(true);

    try {
      await Promise.allSettled([
        gameState.refreshGameData(),
        gameToken.refetch(),
        tierPricing.refetch(),
        ...(isConnected && address
          ? [playerData.refreshPlayerData(), dynamicBalance.refetch()]
          : []),
      ]);
    } catch (error) {
      // Silent failure - no console output
    } finally {
      setIsRefreshing(false);
    }
  }, [lastRefreshTime, isRefreshing]); // 最小化依赖

  // 将稳定的刷新函数存储在 ref 中
  refreshDataRef.current = refreshData;

  // 🔧 修复：使用稳定引用的自动刷新，避免定时器重复创建
  useEffect(() => {
    if (txStep !== 'idle' || isRefreshing) {
      return; // Skip auto-refresh during transactions or when already refreshing
    }

    const autoRefreshInterval = setInterval(() => {
      refreshDataRef.current?.();
    }, 30000); // 增加到180秒，减少频率

    return () => clearInterval(autoRefreshInterval);
  }, [txStep, isRefreshing]); // 使用稳定的依赖

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
            // Handle token/pricing data refresh errors
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            if (
              errorMessage.includes('StructError') ||
              errorMessage.includes('failed to get info about account')
            ) {
              console.warn(
                'Token data refresh issue (normal for new accounts):',
                errorMessage,
              );
            }
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
        showInstallPrompt('phantom'); // 默认推荐 Phantom 钱包
        return;
      }

      openWalletModal(true);
    } catch (error) {
      addToast('error', 'Failed to connect wallet');
    }
  };

  /**
   * 授权USD1代币
   */
  const handleApproval = async () => {
    if (!address || !entryFeeAmount) {
      addToast('error', 'Entry fee information not available');
      return;
    }

    try {
      setIsApproving(true);
      setTxStep('approving');

      // 授权足够的金额（入场费 * 10，避免频繁授权）
      const approvalAmount = entryFeeAmount * BigInt(10);
      // TODO: 实现实际的授权逻辑
      addToast('info', 'Approval functionality to be implemented');
    } catch (error) {
      addToast('error', 'Failed to approve tokens');
      setTxStep('idle');
    } finally {
      setIsApproving(false);
    }
  };

  /**
   * 加入游戏 - 使用新的安全前端交易流程
   */
  const handleJoinGame = async () => {
    if (!address) {
      addToast('error', 'No wallet address available');
      return;
    }

    if (
      gameState.gameId === null ||
      gameState.gameId === undefined ||
      typeof gameState.gameId !== 'number'
    ) {
      addToast('error', 'No valid game ID available');
      return;
    }

    if (!gameToken.data) {
      addToast(
        'error',
        'Game token information not available. Please wait for server synchronization.',
      );
      return;
    }

    if (!gameToken.data.tokenMint) {
      addToast(
        'error',
        'Server token mint configuration is missing. Cannot proceed with transaction.',
      );
      return;
    }

    try {
      setIsJoining(true);
      setTxStep('joining');

      // Use dynamic tier pricing instead of hardcoded values with enhanced validation
      if (!tierPricing.data) {
        throw new Error(
          `Tier pricing not available for ${currentTier}. Server configuration may be incomplete.`,
        );
      }

      if (!tierPricing.data.entranceFee || tierPricing.data.entranceFee <= 0) {
        throw new Error(
          `Invalid entrance fee configuration for ${currentTier} tier. Fee: ${tierPricing.data.entranceFee}`,
        );
      }

      const config = {
        entranceFee: tierPricing.data.entranceFee,
      };

      // Get token mint from server-provided game token data
      let tokenMint;
      try {
        const { PublicKey } = await import('@solana/web3.js');

        // Use token mint from server configuration, not environment variables
        if (!gameToken.data?.tokenMint) {
          throw new Error('Token mint not available from server configuration');
        }

        const tokenMintAddress = gameToken.data.tokenMint.toString();
        console.log('🔍 DEBUG - Server token mint address:', tokenMintAddress);
        tokenMint = new PublicKey(tokenMintAddress);
        console.log('🔍 DEBUG - Token mint PublicKey:', tokenMint.toString());
      } catch (error) {
        console.error('❌ Invalid server token mint configuration:', error);
        throw new Error(
          'Server token mint configuration is invalid or unavailable',
        );
      }

      // 🔍 DEBUG - Log all parameters before calling buyTicket
      console.log('🔍 DEBUG - buyTicket parameters:', {
        gameId: gameState.gameId,
        amount: config.entranceFee?.toString(),
        tokenMint: tokenMint?.toString(),
        tier: currentTier,
        expectedAmount: config.entranceFee?.toString(),
      });

      // � DEBUG - Log tier pricing data
      console.log('🔍 DEBUG - tierPricing data:', {
        tierPricingData: tierPricing.data,
        entranceFee: tierPricing.data?.entranceFee?.toString(),
        entryFeeAmount: entryFeeAmount?.toString(),
        currentTier,
      });

      // �🔒 Use secure frontend transaction flow
      // TypeScript assertion: we've already checked gameId is a valid number above
      const gameIdNumber = gameState.gameId as number;
      const txResult = await solanaVault.buyTicket(
        gameIdNumber,
        config.entranceFee,
        tokenMint,
        currentTier,
        config.entranceFee,
      );

      // Show success toast with transaction details
      const tokenInfo = getTokenDisplayInfo();
      addToast(
        'success',
        `Successfully joined ${currentTier.toUpperCase()} tier game! Entry fee: ${formatEntryFee(config.entranceFee)} ${tokenInfo.symbol}`,
        5000,
      );

      // Show transaction hash if available
      if (txResult) {
        addToast(
          'info',
          `Transaction: ${txResult.slice(0, 8)}...${txResult.slice(-8)}`,
          8000,
        );
      }

      // Wait for transaction completion and state sync
      await gameState.refreshGameData();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now safe to enter the game
      onJoinGame(address);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // 🚨 紧急修复：在显示错误前检查交易是否实际成功，并验证票据状态
      if (solanaVault.currentTxHash) {
        console.warn(
          '⚠️ Error occurred but transaction hash exists, checking ticket status...',
        );

        try {
          console.log(
            '🎫 Attempting ticket verification for error recovery in handleJoinGame...',
          );

          // 等待一下让区块链处理
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const gameIdNumber = gameState.gameId as number;
          const eligibility =
            await solanaVault.checkGameEntryEligibility(gameIdNumber);

          console.log('🔍 HandleJoinGame error recovery result:', {
            hasTicket: eligibility.hasTicket,
            canEnter: eligibility.canEnter,
            reason: eligibility.reason,
          });

          if (eligibility.canEnter && eligibility.hasTicket) {
            addToast(
              'success',
              '✅ 交易已成功完成，票据验证通过，正在进入游戏...',
              3000,
            );

            // 交易成功且有有效票据，进入游戏
            setTimeout(() => {
              onJoinGame(address);
              onClose();
            }, 1000);
            return; // 重要：不执行后续的错误处理
          } else if (eligibility.hasTicket) {
            addToast('success', '✅ 交易成功，票据已获得！', 3000);
            // 刷新数据以反映新的票据状态
            await gameState.refreshGameData();
            return;
          } else {
            addToast(
              'info',
              '⚠️ 交易可能成功但票据状态待确认，请稍后重试或联系客服',
              5000,
            );
          }
        } catch (recoveryError) {
          console.warn(
            '⚠️ Ticket verification in error recovery failed:',
            recoveryError,
          );
        }
      }

      // 🚨 改进错误消息：提供更具体和有用的错误信息
      let userFriendlyError = errorMessage;

      // 根据不同的错误类型提供相应的解决方案
      if (errorMessage.includes('交易提交完全失败')) {
        userFriendlyError =
          '网络连接问题导致交易无法提交，请检查网络连接后重试';
      } else if (errorMessage.includes('无效的交易签名格式')) {
        userFriendlyError = '交易格式错误，请刷新页面后重试';
      } else if (errorMessage.includes('Invalid transaction signature')) {
        userFriendlyError = '交易未正确生成，可能是网络问题，请重试';
      } else if (errorMessage.includes('failed to get signature status')) {
        userFriendlyError =
          '区块链网络繁忙，无法确认交易状态，请稍后查看交易记录';
      } else if (errorMessage.includes('WrongSize')) {
        userFriendlyError = '网络数据格式错误，请刷新页面后重试';
      } else if (errorMessage.includes('insufficient funds')) {
        userFriendlyError = '账户余额不足，请充值后重试';
      } else if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('user rejected')
      ) {
        userFriendlyError = '您取消了交易签名';
      } else if (errorMessage.includes('timeout')) {
        userFriendlyError = '网络超时，请检查网络连接后重试';
      } else if (errorMessage.includes('fetch')) {
        userFriendlyError = '网络连接失败，请检查网络后重试';
      }

      addToast('error', `支付失败: ${userFriendlyError}`, 8000); // 延长显示时间便于用户阅读
      setTxStep('idle');
    } finally {
      setIsJoining(false);
    }
  };

  // 🔧 修复：优化交易状态监听，避免重复刷新
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
            // Silent failure - no console output
            setTxStep('idle');
          });
      } else if (txStep === 'joining') {
        // 加入游戏中 - 等待新的安全交易流程完成
        // txStep will be reset in handleJoinGame when transaction completes
      }
    }

    // Handle new secure transaction status - 只在完成时刷新一次
    if (solanaVault.txStatus === 'completed' && !isRefreshing) {
      // 延迟3秒后刷新，给服务器时间处理交易
      setTimeout(() => {
        refreshDataRef.current?.();
      }, 3000);
    }
  }, [txStep, solanaVault.txStatus, isRefreshing]); // 添加 isRefreshing 防止重复

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

    // Check for server configuration issues
    if (!gameToken.data || !gameToken.data.tokenMint) {
      return (
        <button className="race-btn disabled" disabled>
          ⚠️ Server Configuration Missing
        </button>
      );
    }

    if (!tierPricing.data || !tierPricing.data.entranceFee) {
      return (
        <button className="race-btn disabled" disabled>
          ⚠️ Tier Pricing Unavailable
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
      const tokenInfo = getTokenDisplayInfo();
      return (
        <button className="race-btn disabled" disabled>
          ⚠️ Insufficient {tokenInfo.symbol} Balance
        </button>
      );
    }

    if (needsApproval && !gameToken.data?.isSOL) {
      const tokenInfo = getTokenDisplayInfo();
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
              Approve {formatEntryFee(entryFeeAmount)} {tokenInfo.symbol}
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
          Confirm in Wallet (Single Popup)
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
          进入游戏 (支付成功)
        </button>
      );
    }

    // 处理交易错误但可能成功的情况
    if (solanaVault.error && solanaVault.currentTxHash) {
      return (
        <button
          className="race-btn warning"
          onClick={async () => {
            try {
              console.log(
                '🎫 Ticket verification from error button started...',
              );

              // 使用票据验证代替交易状态恢复
              const gameIdNumber = gameState.gameId as number;
              const eligibility =
                await solanaVault.checkGameEntryEligibility(gameIdNumber);

              console.log('🔍 Error button verification result:', {
                hasTicket: eligibility.hasTicket,
                canEnter: eligibility.canEnter,
                reason: eligibility.reason,
              });

              if (eligibility.canEnter && eligibility.hasTicket) {
                onJoinGame(address);
                onClose();
              } else if (eligibility.hasTicket) {
                addToast('success', '✅ 票据验证通过！', 3000);
                await gameState.refreshGameData();
              } else {
                addToast('info', '⚠️ 请检查交易状态或联系客服', 3000);
              }
            } catch (error) {
              console.error(
                '❌ Error button ticket verification failed:',
                error,
              );
              addToast('error', '无法验证票据状态', 3000);
            }
          }}
        >
          验证票据状态
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
        disabled={
          isDisabled ||
          isJoining ||
          solanaVault.isLoading ||
          solanaVault.isProcessing
        }
      >
        {isJoining || solanaVault.isLoading || solanaVault.isProcessing ? (
          'Joining...'
        ) : (
          <>Join Race</>
        )}
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
                {getTokenDisplayInfo().symbol}
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
                ? '🏁 Race Server Active'
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
              onClick={() => refreshDataRef.current?.()}
              className="refresh-button"
              title="Refresh game data"
              disabled={isRefreshing}
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
                    {(() => {
                      if (
                        entryFeeAmount !== undefined &&
                        entryFeeAmount !== null &&
                        typeof gameState.gameState.registeredCount ===
                          'number' &&
                        gameState.gameState.registeredCount >= 0
                      ) {
                        const prizePoolAmount =
                          entryFeeAmount *
                          BigInt(gameState.gameState.registeredCount);
                        // 特殊处理 0 值情况
                        if (prizePoolAmount === 0n) {
                          return '0';
                        }
                        return formatDisplayAmount(prizePoolAmount, 9);
                      }
                      return 'Loading...';
                    })()}{' '}
                    {getTokenDisplayInfo().symbol}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon users">
                    <UsersIcon />
                  </div>
                  <div className="stat-label">Players</div>
                  <div className="stat-value">
                    {typeof gameState.gameState.registeredCount === 'number' &&
                    typeof gameState.gameState.playerCount === 'number'
                      ? `${gameState.gameState.registeredCount}/${gameState.gameState.playerCount}`
                      : 'Loading...'}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon time">
                    <ClockIcon />
                  </div>
                  <div className="stat-label">Entry Fee</div>
                  <div className="stat-value">
                    {formatEntryFee(entryFeeAmount)}{' '}
                    {getTokenDisplayInfo().symbol}
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
                      💳 Please confirm transaction in your wallet (optimized
                      single-step)...
                    </div>
                  )}
                  {solanaVault.txStatus === 'sending' && (
                    <div className="tx-step active">
                      📡 Sending transaction directly to blockchain (no
                      additional popup)...
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
                      🎫 正在验证票据创建状态...
                      <div className="verify-info">
                        交易已提交成功，正在确认票据是否已创建完成
                      </div>
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
                        ⏳ Approving {getTokenDisplayInfo().symbol}...
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

                {/* Show transaction hash if available - 资金保护机制 */}
                {solanaVault.currentTxHash && (
                  <div className="tx-hash-info">
                    <div className="tx-success-notice">
                      <span className="success-icon">✅</span>
                      <span className="success-text">交易已提交成功</span>
                    </div>
                    <a
                      href={`https://solscan.io/tx/${solanaVault.currentTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-hash-link"
                      title={`交易哈希: ${solanaVault.currentTxHash}`}
                    >
                      查看交易详情 ({solanaVault.currentTxHash.slice(0, 8)}...)
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
                          : `${formatDisplayAmount(dynamicBalance.data, 9)} ${getTokenDisplayInfo().symbol}`
                      }
                    >
                      {dynamicBalance.isLoading
                        ? 'Loading...'
                        : `${formatDisplayAmount(dynamicBalance.data, 9)} ${getTokenDisplayInfo().symbol}`}
                    </span>
                  </div>

                  <div className="balance-item">
                    <span className="balance-label">Required</span>
                    <span
                      className="balance-value"
                      title={
                        entryFeeAmount
                          ? `${formatEntryFee(entryFeeAmount)} ${getTokenDisplayInfo().symbol}`
                          : 'Loading...'
                      }
                    >
                      {formatEntryFee(entryFeeAmount)}{' '}
                      {getTokenDisplayInfo().symbol}
                    </span>
                  </div>
                </div>

                {!hasSufficientBalance && gameToken.data && (
                  <div className="insufficient-warning">
                    ⚠️ Insufficient balance! Need at least{' '}
                    {formatEntryFee(entryFeeAmount)}{' '}
                    {getTokenDisplayInfo().symbol}
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

            {/* Error States with Recovery Options */}
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

                {/* 添加恢复选项 */}
                <div className="error-actions">
                  {solanaVault.error && solanaVault.currentTxHash && (
                    <button
                      className="error-recovery-btn"
                      onClick={async () => {
                        try {
                          console.log(
                            '🎫 Manual ticket verification started...',
                          );

                          // 使用票据验证代替交易状态恢复
                          const gameIdNumber = gameState.gameId as number;
                          const eligibility =
                            await solanaVault.checkGameEntryEligibility(
                              gameIdNumber,
                            );

                          console.log('🔍 Manual verification result:', {
                            hasTicket: eligibility.hasTicket,
                            canEnter: eligibility.canEnter,
                            reason: eligibility.reason,
                          });

                          if (eligibility.canEnter && eligibility.hasTicket) {
                            addToast(
                              'success',
                              '✅ 票据验证通过，正在进入游戏...',
                              3000,
                            );
                            setTimeout(() => {
                              onJoinGame(address);
                              onClose();
                            }, 1000);
                          } else if (eligibility.hasTicket) {
                            addToast('success', '✅ 票据验证通过！', 3000);
                            await gameState.refreshGameData();
                          } else {
                            addToast(
                              'info',
                              '⚠️ 未找到有效票据。交易可能仍在处理中，请稍后重试。',
                              5000,
                            );
                          }
                        } catch (error) {
                          console.error(
                            '❌ Manual ticket verification failed:',
                            error,
                          );
                          addToast(
                            'error',
                            '无法验证票据状态，请稍后重试或联系客服',
                            3000,
                          );
                        }
                      }}
                    >
                      检查票据状态
                    </button>
                  )}

                  {solanaVault.error && (
                    <button
                      className="error-retry-btn"
                      onClick={() => {
                        // Clear vault error and allow user to retry
                        solanaVault.error = null;
                        setTxStep('idle');
                      }}
                    >
                      重试支付
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Configuration Status Display */}
            {(!gameToken.data || !tierPricing.data) && (
              <div className="config-status">
                <div className="config-header">Configuration Status</div>
                <div className="config-items">
                  <div
                    className={`config-item ${gameToken.data ? 'ready' : 'loading'}`}
                  >
                    <span className="config-icon">
                      {gameToken.data ? '✅' : '⏳'}
                    </span>
                    <span className="config-text">
                      Token Configuration{' '}
                      {gameToken.isLoading
                        ? '(Loading...)'
                        : gameToken.data
                          ? '(Ready)'
                          : '(Failed)'}
                    </span>
                  </div>
                  <div
                    className={`config-item ${tierPricing.data ? 'ready' : 'loading'}`}
                  >
                    <span className="config-icon">
                      {tierPricing.data ? '✅' : '⏳'}
                    </span>
                    <span className="config-text">
                      Tier Pricing{' '}
                      {tierPricing.isLoading
                        ? '(Loading...)'
                        : tierPricing.data
                          ? '(Ready)'
                          : '(Failed)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
