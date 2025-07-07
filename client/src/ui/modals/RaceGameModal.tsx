import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Modal from './Modal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useBlockchain } from '../../hooks/useBlockchain';
import './RaceGameModal.scss';

interface RaceGameModalProps {
  serverUrl: string;
  onClose: () => void;
  onJoinGame: (walletAddress?: string) => void;
}

const RaceGameModal: React.FC<RaceGameModalProps> = ({ serverUrl, onClose, onJoinGame }) => {
  const { publicKey, connected: isConnected } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const address = publicKey?.toString();
  const blockchain = useBlockchain();
  const gameState = useGameState(serverUrl);
  const playerData = usePlayerData();

  const [isJoining, setIsJoining] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'joining' | 'waiting'>('idle');

  // 从服务器获取游戏级别，如果没有则默认为LOW(0)
  const gameLevel = gameState.serverInfo?.blockchainConfig?.gameLevel ?? 0; // 0=LOW, 1=MEDIUM, 2=HIGH
  
  // 获取级别配置
  const { data: levelConfig } = blockchain.useLevelConfig(gameLevel);
  
  // 获取入场费（优先使用级别配置，否则使用默认值）
  const { data: defaultEntryFee } = blockchain.useEntryFee();
  const entryFeeAmount = (levelConfig?.entryFee && typeof levelConfig.entryFee === 'bigint') 
    ? levelConfig.entryFee 
    : (typeof defaultEntryFee === 'bigint' ? defaultEntryFee : BigInt(0.01 * LAMPORTS_PER_SOL)); // 默认0.01 SOL

  // 获取级别显示名称
  const getLevelDisplayName = (level: number) => {
    switch (level) {
      case 0: return 'LOW';
      case 1: return 'MEDIUM';
      case 2: return 'HIGH';
      default: return 'UNKNOWN';
    }
  };

  // 获取级别显示颜色
  const getLevelDisplayColor = (level: number) => {
    switch (level) {
      case 0: return '#10b981'; // 绿色
      case 1: return '#f59e0b'; // 橙色
      case 2: return '#ef4444'; // 红色
      default: return '#6b7280'; // 灰色
    }
  };

  // 检查是否需要授权
  const needsApproval = playerData.needsApproval(entryFeeAmount);
  const hasSufficientBalance = playerData.hasSufficientBalance(entryFeeAmount);

  // 组件挂载时立即刷新数据
  useEffect(() => {
    gameState.refreshGameData();
  }, []);

  // 监听钱包连接状态，主动刷新玩家数据
  useEffect(() => {
    if (isConnected && address) {
      playerData.refreshPlayerData();
    }
  }, [isConnected, address]);

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
   * 加入游戏
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

    try {
      setIsJoining(true);
      setTxStep('joining');
      
      const txResult = await blockchain.joinGame(gameState.gameId);
      
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
        playerData.refreshPlayerData().then(() => {
          setTxStep('idle');
        }).catch((error) => {
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
  }, [blockchain.isConfirmed, txStep]);

  /**
   * 获取按钮状态和文本
   */
  const getActionButton = () => {
    // 添加调试信息
    if (!isConnected) {
      return (
        <button className="race-btn race-btn-primary" onClick={handleConnectWallet}>
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
        <button className="race-btn race-btn-success" onClick={() => { 
          onJoinGame(address); 
          onClose(); 
        }}>
          Enter Game (Joined)
        </button>
      );
    }

    // 检查余额
    if (!hasSufficientBalance) {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          Insufficient USD1 Balance
        </button>
      );
    }

    // 检查授权
    if (needsApproval) {
      return (
        <button 
          className="race-btn race-btn-warning" 
          onClick={handleApproval}
          disabled={isApproving || blockchain.isWritePending}
        >
          {isApproving || (blockchain.isWritePending && txStep === 'approving') 
            ? 'Approving...' 
            : `Approve ${(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)} SOL`}
        </button>
      );
    }

    // 默认：显示加入游戏按钮
    const isDisabled = isJoining || blockchain.isWritePending || (gameState.gameId === null || gameState.gameId === undefined);

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
          {gameState.isRaceServer && gameState.serverInfo?.blockchainConfig && (
            <span 
              className="level-badge"
              style={{ 
                backgroundColor: getLevelDisplayColor(gameLevel),
                color: 'white',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.7em',
                fontWeight: 'bold'
              }}
            >
              {getLevelDisplayName(gameLevel)}
            </span>
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
              <div className="game-id">Game #{gameState.gameId}</div>
            )}
            <button 
              onClick={() => {
                gameState.refreshGameData();
                if (isConnected && address) {
                  playerData.refreshPlayerData();
                }
              }}
              className="race-btn race-btn-secondary"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* 游戏信息 */}
        {gameState.isRaceServer && (
          <div className="game-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Game Level</label>
                <span style={{ color: getLevelDisplayColor(gameLevel) }}>
                  {getLevelDisplayName(gameLevel)}
                </span>
              </div>
              <div className="info-item">
                <label>Entry Fee</label>
                <span>{(Number(entryFeeAmount) / LAMPORTS_PER_SOL).toFixed(4)} SOL</span>
              </div>
              <div className="info-item">
                <label>Total Prize</label>
                <span>{(Number(gameState.gameState.totalPrize) / LAMPORTS_PER_SOL).toFixed(4)} SOL</span>
              </div>
              <div className="info-item">
                <label>Players</label>
                <span>{gameState.gameState.registeredCount} joined</span>
              </div>
              <div className="info-item">
                <label>Active</label>
                <span>{gameState.gameState.playerCount} playing</span>
              </div>
            </div>
          </div>
        )}

        {/* 玩家钱包信息 */}
        {isConnected && (
          <div className="wallet-info">
            <div className="wallet-header">
              <span>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <div className="balance-info">
              <span>
                SOL Balance: {
                  playerData.isBalanceLoading 
                    ? '⏳ Loading...' 
                    : (Number(typeof playerData.usd1Balance === 'bigint' ? playerData.usd1Balance : BigInt(0)) / LAMPORTS_PER_SOL).toFixed(4)
                }
              </span>
              {gameState.isRaceServer && (
                <span>
                  Allowance: {
                    playerData.isAllowanceLoading 
                      ? '⏳ Loading...' 
                      : (Number(typeof playerData.allowance === 'bigint' ? playerData.allowance : BigInt(0)) / LAMPORTS_PER_SOL).toFixed(4)
                  }
                </span>
              )}
            </div>
            {(playerData.isBalanceLoading || playerData.isAllowanceLoading) && (
              <div className="loading-hint" style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                💡 First-time loading may take a few seconds...
              </div>
            )}
          </div>
        )}

        {/* 错误信息 */}
        {(gameState.error || playerData.error) && (
          <div className="error-message">
            {gameState.error || playerData.error}
          </div>
        )}

        {/* 交易状态 */}
        {txStep !== 'idle' && (
          <div className="tx-status">
            {txStep === 'approving' && '⏳ Approving USD1 token...'}
            {txStep === 'joining' && '⏳ Joining game...'}
            {txStep === 'waiting' && '✅ Transaction confirmed! Entering game...'}
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
    <Modal child={modalContent} close={onClose} className="race-game-modal-wrapper" />
  );
};

export default RaceGameModal;