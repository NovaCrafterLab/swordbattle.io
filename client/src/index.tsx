// client/src/index.tsx - Solana-Only Support

// Polyfills for Node.js modules in browser
import { Buffer } from 'buffer';
import process from 'process';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Solana Wallet Adapter imports
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
// Solana Wallet Adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';
import { refreshAccountAsync } from '@/redux/account/slice';
import { ToastProvider, ToastContainer } from '@/ui/components/Toast';
import { router } from './router';
import { network, endpoint, wallets, BLOCKCHAIN_INFO } from './blockchain';
import { initRecaptcha } from './utils/recaptcha';
import { store } from './redux/store';
import { config } from './config';
import './styles/sb-tokens.css';
import './global.scss';

// Make Buffer and process globally available
(window as any).Buffer = Buffer;
(window as any).process = process;

/* dispatch refresh so account.id and clan_tag are loaded even on deep link */
store.dispatch(refreshAccountAsync());

/* global flags */
const qs = window.location.search;
const debug = qs.includes('debugAlertMode');
(window as any).instantStart = qs.includes('instantStart=true');

/* recaptcha */
if (config.recaptchaClientKey) initRecaptcha(config.recaptchaClientKey, debug);

/* disable context menu */
document.addEventListener('contextmenu', (e) => e.preventDefault());

/* react-query */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 3, staleTime: 5 * 60_000 } },
});

// Solana Wallet Providers Component
const SolanaWalletProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use RPC endpoint with fallback
  const rpcEndpoint = useMemo(() => {
    return endpoint || clusterApiUrl(network);
  }, []);

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SolanaWalletProviders>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </ToastProvider>
    </Provider>
  </SolanaWalletProviders>,
);
