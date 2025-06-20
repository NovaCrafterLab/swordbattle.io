import React, { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import Modal from './Modal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerData } from '../../hooks/usePlayerData';
import { useBlockchain } from '../../hooks/useBlockchain';
import { formatEther, parseEther } from 'viem';
import './RaceGameModal.scss';

interface RaceGameModalProps {
  serverUrl: string;
  onClose: () => void;
  onJoinGame: () => void;
}

const RaceGameModal: React.FC<RaceGameModalProps> = ({ serverUrl, onClose, onJoinGame }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const blockchain = useBlockchain();
  const gameState = useGameState(serverUrl);
  const playerData = usePlayerData();

  const [isJoining, setIsJoining] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'joining' | 'waiting'>('idle');

  // 获取入场费
  const { data: entryFee } = blockchain.useEntryFee();
  const entryFeeAmount = typeof entryFee === 'bigint' ? entryFee : parseEther('10'); // 默认10 USD1

  // 检查是否需要授权
  const needsApproval = playerData.needsApproval(entryFeeAmount);
  const hasSufficientBalance = playerData.hasSufficientBalance(entryFeeAmount);

  /**
   * 连接钱包
   */
  const handleConnectWallet = async () => {
    try {
      const connector = connectors[0]; // 使用第一个连接器（通常是MetaMask）
      if (connector) {
        connect({ connector });
      }
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
    if (!address || !gameState.gameId) return;

    try {
      setIsJoining(true);
      setTxStep('joining');
      
      blockchain.joinGame(gameState.gameId);
      
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
        playerData.refreshPlayerData();
        setTxStep('idle');
      } else if (txStep === 'joining') {
        // 加入游戏完成
        gameState.refreshGameData();
        setTxStep('waiting');
        
        // 进入游戏
        setTimeout(() => {
          onJoinGame();
          onClose();
        }, 1000);
      }
    }
  }, [blockchain.isConfirmed, txStep]);

  /**
   * 获取按钮状态和文本
   */
  const getActionButton = () => {
    if (!isConnected) {
      return (
        <button className="race-btn race-btn-primary" onClick={handleConnectWallet}>
          Connect Wallet
        </button>
      );
    }

    if (!gameState.isRaceServer) {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          SERVER NOT AVAILABLE
        </button>
      );
    }

    if (gameState.phase !== 'waiting') {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          {gameState.phase === 'initializing' ? 'Game Initializing...' : 
           gameState.phase === 'active' ? 'Game In Progress' :
           gameState.phase === 'ending' ? 'Game Ending...' :
           gameState.phase === 'ended' ? 'Game Ended' : 'Game Not Available'}
        </button>
      );
    }

    if (gameState.isPlayerJoined) {
      return (
        <button className="race-btn race-btn-success" onClick={() => { onJoinGame(); onClose(); }}>
          Enter Game (Joined)
        </button>
      );
    }

    if (!hasSufficientBalance) {
      return (
        <button className="race-btn race-btn-disabled" disabled>
          Insufficient USD1 Balance
        </button>
      );
    }

    if (needsApproval) {
      return (
        <button 
          className="race-btn race-btn-warning" 
          onClick={handleApproval}
          disabled={isApproving || blockchain.isWritePending}
        >
          {isApproving || (blockchain.isWritePending && txStep === 'approving') 
            ? 'Approving...' 
            : `Approve ${formatEther(entryFeeAmount)} USD1`}
        </button>
      );
    }

    return (
      <button 
        className="race-btn race-btn-primary" 
        onClick={handleJoinGame}
        disabled={isJoining || blockchain.isWritePending}
      >
        {isJoining || (blockchain.isWritePending && txStep === 'joining') 
          ? 'Joining...' 
          : `Join Game (${formatEther(entryFeeAmount)} USD1)`}
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
        </div>
      </div>

      <div className="race-content">
        {/* 游戏状态 */}
        <div className="game-status">
          <div className="status-indicator">
            <span 
              className={`status-dot ${gameState.getGameStatusColor()}`}
            ></span>
            <span className="status-text">{gameState.getGameStatusText()}</span>
          </div>
          
          {gameState.gameId && (
            <div className="game-id">Game #{gameState.gameId}</div>
          )}
        </div>

        {/* 游戏信息 */}
        {gameState.isRaceServer && (
          <div className="game-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Entry Fee</label>
                <span>{formatEther(entryFeeAmount)} USD1</span>
              </div>
              <div className="info-item">
                <label>Total Prize</label>
                <span>{formatEther(gameState.gameState.totalPrize)} USD1</span>
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
              <span>USD1 Balance: {formatEther(playerData.usd1Balance)}</span>
              {gameState.isRaceServer && (
                <span>Allowance: {formatEther(playerData.allowance)}</span>
              )}
            </div>
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

  return <Modal child={modalContent} close={onClose} className="race-game-modal-wrapper" />;
};

export default RaceGameModal; 