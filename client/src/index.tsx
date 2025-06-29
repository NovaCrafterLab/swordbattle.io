// client/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

import { router } from './router';
import { wagmiConfig } from './blockchain';
import { initRecaptcha } from './utils/recaptcha';
import { store } from './redux/store';
import { config } from './config';
import './global.scss';

/* global flags */
const qs = window.location.search;
const debug = qs.includes('debugAlertMode');
(window as any).instantStart = qs.includes('instantStart=true');

/* recaptcha */
if (config.recaptchaClientKey) initRecaptcha(config.recaptchaClientKey, debug);

/* disable context menu */
document.addEventListener('contextmenu', e => e.preventDefault());

/* react-query */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 3, staleTime: 5 * 60_000 } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>,
);
