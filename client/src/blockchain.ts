// client/src/blockchain.ts
import { fallback, http } from 'viem';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { ENVIRONMENT, BSC_MAINNET_RPC_POOL, BSC_TESTNET_RPC_POOL } from './config/walletConfig';

const createTransport = (urls: readonly string[]) =>
  fallback(urls.map(url => http(url, { timeout: 10000, retryCount: 2, retryDelay: 1000 })));

export const wagmiConfig = getDefaultConfig({
  appName: 'Swordbattle.io',
  projectId: 'demo',
  chains: ENVIRONMENT.isDev ? ([bscTestnet] as const) : ([bsc] as const),
  transports: ENVIRONMENT.isDev
    ? { [bscTestnet.id]: createTransport(BSC_TESTNET_RPC_POOL) }
    : { [bsc.id]: createTransport(BSC_MAINNET_RPC_POOL) },
});
