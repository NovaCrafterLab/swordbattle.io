// client/src/index.tsx

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { load } from 'recaptcha-v3';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { bsc, bscTestnet } from 'wagmi/chains';
import { fallback, http } from 'viem';
import { ENVIRONMENT, BSC_MAINNET_RPC_POOL, BSC_TESTNET_RPC_POOL } from './config/walletConfig';

import App from './ui/App';
import { GlobalLeaderboard } from './ui/GlobalLeaderboard';
import Profile from './ui/Profile';
import { store } from './redux/store';
import { config } from './config';

import './global.scss';

const router = createHashRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: 'leaderboard',
      element: <GlobalLeaderboard />,
    },
    {
      path: 'profile',
      element: <Profile />,
    },
  ],
  {
    basename: config.basename,
  },
);
let debugMode = false;

try {
  debugMode = window.location.search.includes('debugAlertMode');
} catch (e) {}
if (config.recaptchaClientKey) {
  load(config.recaptchaClientKey).then((recaptcha) => {
    console.log('recaptcha loaded');
    if (debugMode) alert('recaptcha loaded');

    // emit custom recaptchaLoaded event to let other parts of the app know that recaptcha is ready
    const event = new CustomEvent('recaptchaLoaded', { detail: true });
    window.dispatchEvent(event);
    (window as any).recaptcha = recaptcha as any;
  });
}

// check if have queryparam called instantStart=true
// if so, start the game instantly
(window as any).instantStart = false;
try {
  (window as any).instantStart =
    window.location.search.includes('instantStart=true');
} catch (e) {}
const root = ReactDOM.createRoot(document.getElementById('root') as Element);
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  });

// RainbowKit/Wagmi 配置
const createFallbackTransport = (rpcUrls: readonly string[]) => {
  return fallback(
    rpcUrls.map(url =>
      http(url, {
        timeout: 10000,
        retryCount: 2,
        retryDelay: 1000,
      })
    )
  );
};
const supportedChains = ENVIRONMENT.isDev ? [bscTestnet] : [bsc];
const wagmiConfig = getDefaultConfig({
  appName: 'Swordbattle.io',
  projectId: 'demo', // 无需 WalletConnect Project ID
  chains: supportedChains as any,
  transports: ENVIRONMENT.isDev
    ? { [bscTestnet.id]: createFallbackTransport(BSC_TESTNET_RPC_POOL) }
    : { [bsc.id]: createFallbackTransport(BSC_MAINNET_RPC_POOL) },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
     
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
