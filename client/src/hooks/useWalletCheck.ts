// Hook to check if Solana wallet is installed
import { useEffect, useState } from 'react';

interface WalletStatus {
  isInstalled: boolean;
  isPhantom: boolean;
  isSolflare: boolean;
  detectedWallets: string[];
}

export const useWalletCheck = () => {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    isInstalled: false,
    isPhantom: false,
    isSolflare: false,
    detectedWallets: [],
  });

  useEffect(() => {
    const checkWallets = () => {
      const detectedWallets: string[] = [];

      // Check for Phantom wallet
      const isPhantom = !!(window as any).solana?.isPhantom;
      if (isPhantom) {
        detectedWallets.push('Phantom');
      }

      // Check for Solflare wallet
      const isSolflare = !!(window as any).solflare?.isSolflare;
      if (isSolflare) {
        detectedWallets.push('Solflare');
      }

      // Check for general Solana provider
      const hasSolanaProvider = !!(window as any).solana;

      const isInstalled = hasSolanaProvider || isPhantom || isSolflare;

      setWalletStatus({
        isInstalled,
        isPhantom,
        isSolflare,
        detectedWallets,
      });
    };

    // Check immediately
    checkWallets();

    // Check again after a short delay (wallets might inject later)
    const timeout = setTimeout(checkWallets, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const getInstallationUrl = (walletName: string = 'phantom') => {
    const urls = {
      phantom: 'https://phantom.app/download',
      solflare: 'https://solflare.com/download',
    };
    return urls[walletName as keyof typeof urls] || urls.phantom;
  };

  const showInstallPrompt = (walletName: string = 'phantom') => {
    const installUrl = getInstallationUrl(walletName);

    if (
      window.confirm(
        `🔒 Solana wallet not detected!\n\n` +
          `To join the game, you need to install a Solana wallet.\n\n` +
          `Recommended: ${walletName.charAt(0).toUpperCase() + walletName.slice(1)} Wallet\n\n` +
          `Click OK to open the installation page.`,
      )
    ) {
      window.open(installUrl, '_blank');
    }
  };

  return {
    walletStatus,
    showInstallPrompt,
    getInstallationUrl,
  };
};
