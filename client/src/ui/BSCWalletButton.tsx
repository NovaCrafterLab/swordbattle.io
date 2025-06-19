import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './BSCWalletButton.scss';

const BSCWalletButton: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    className="wallet-button connect"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button 
                    className="wallet-button error"
                    onClick={openChainModal}
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <button 
                  className="wallet-button connected"
                  onClick={openAccountModal}
                >
                  {account.displayName}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default BSCWalletButton; 