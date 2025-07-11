// client/src/blockchain.ts - Solana-Only Configuration
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { SOLANA_ENVIRONMENT, SOLANA_RPC_POOLS } from './config/walletConfig';

// ========================================
// SOLANA CONFIGURATION
// ========================================
// Determine network based on environment
export const network = SOLANA_ENVIRONMENT.isDev
  ? WalletAdapterNetwork.Devnet
  : WalletAdapterNetwork.Mainnet;

// Create Solana connection with RPC pool
export const createSolanaConnection = () => {
  const rpcPool = SOLANA_ENVIRONMENT.isDev
    ? SOLANA_RPC_POOLS.devnet
    : SOLANA_RPC_POOLS.mainnet;

  console.log(
    `🔗 Creating Solana connection: ${SOLANA_ENVIRONMENT.networkName}, RPC pool size: ${rpcPool.length}`,
  );
  return new Connection(rpcPool[0], 'confirmed');
};

// Default Solana connection instance
export const connection = createSolanaConnection();

// Supported Solana wallet adapters
export const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// Solana network endpoint (fallback to default if RPC pool fails)
export const endpoint = SOLANA_ENVIRONMENT.isDev
  ? clusterApiUrl(WalletAdapterNetwork.Devnet)
  : clusterApiUrl(WalletAdapterNetwork.Mainnet);

// Export wallet adapter network for components
export { WalletAdapterNetwork };

// Export environment info for debugging
export const BLOCKCHAIN_INFO = {
  type: 'SOLANA',
  network: SOLANA_ENVIRONMENT.networkName,
  cluster: SOLANA_ENVIRONMENT.cluster,
  isDev: SOLANA_ENVIRONMENT.isDev,
  commitment: SOLANA_ENVIRONMENT.commitment,
  rpcCount: SOLANA_ENVIRONMENT.isDev
    ? SOLANA_RPC_POOLS.devnet.length
    : SOLANA_RPC_POOLS.mainnet.length,
};
