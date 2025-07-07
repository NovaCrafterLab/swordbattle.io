import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import './BSCWalletButton.scss';

const SolanaWalletButton: React.FC = () => {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        try {
          const lamports = await connection.getBalance(publicKey);
          setBalance(lamports / LAMPORTS_PER_SOL);
        } catch (error) {
          console.warn('Failed to fetch balance:', error);
          setBalance(null);
        }
      };
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, connection]);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      // 可以添加提示
      console.log('Address copied to clipboard');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  if (!connected) {
    return (
      <div className="wallet-button-container">
        <button 
          className="wallet-button connect"
          onClick={() => setVisible(true)}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-button-container" style={{ position: 'relative' }}>
      <button 
        className="wallet-button connected"
        onClick={() => setShowDropdown(!showDropdown)}
        title={publicKey?.toString()}
      >
        {publicKey ? 
          `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` :
          'Connected'
        }
      </button>
      
      {showDropdown && (
        <div 
          className="wallet-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#1a1a2e',
            border: '1px solid #4a90e2',
            borderRadius: '8px',
            marginTop: '5px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ padding: '12px', borderBottom: '1px solid #333' }}>
            <div style={{ color: '#87CEEB', fontSize: '12px', marginBottom: '4px' }}>
              Balance
            </div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>
              {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
            </div>
          </div>
          
          <button
            onClick={copyAddress}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              color: '#87CEEB',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: '1px solid #333'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a4e'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            📋 Copy Address
          </button>
          
          <button
            onClick={handleDisconnect}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              color: '#ff6b6b',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a4e'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🚪 Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default SolanaWalletButton;