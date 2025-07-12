// client/src/blockchain.ts - Solana-Only Configuration
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import {
  SOLANA_ENVIRONMENT,
  SOLANA_RPC_POOLS,
  SolanaRPCManager,
} from './config/walletConfig';

// ========================================
// SOLANA CONFIGURATION
// ========================================
// Determine network based on environment
export const network = SOLANA_ENVIRONMENT.isDev
  ? WalletAdapterNetwork.Devnet
  : WalletAdapterNetwork.Mainnet;

// Create Solana connection with RPC pool and random selection
export const createSolanaConnection = () => {
  const rpcPool = SOLANA_ENVIRONMENT.isDev
    ? SOLANA_RPC_POOLS.devnet
    : SOLANA_RPC_POOLS.mainnet;

  // Use RPC manager for random selection and failover
  const rpcManager = SolanaRPCManager.getInstance();
  const selectedRpc = rpcManager.getCurrentRPC();

  try {
    return new Connection(selectedRpc, 'confirmed');
  } catch (error) {
    const fallbackRpc = rpcManager.markCurrentRPCFailed();
    return new Connection(fallbackRpc, 'confirmed');
  }
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

// Export RPC manager for advanced usage
export const getRPCManager = () => SolanaRPCManager.getInstance();

// Create a random RPC connection for blockchain operations
export const createRandomRPCConnection = () => {
  const rpcManager = SolanaRPCManager.getInstance();
  const selectedRpc = rpcManager.getCurrentRPC();

  console.log(`📡 Using random RPC: ${selectedRpc.split('/').pop()}`);

  try {
    return new Connection(selectedRpc, 'confirmed');
  } catch (error) {
    const fallbackRpc = rpcManager.markCurrentRPCFailed();
    return new Connection(fallbackRpc, 'confirmed');
  }
};

// Create a robust RPC connection with automatic retry on network failures
export const createRobustRPCConnection = async <T>(
  operation: (connection: Connection) => Promise<T>,
  maxRetries: number = 3,
): Promise<T> => {
  const rpcManager = SolanaRPCManager.getInstance();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const selectedRpc = rpcManager.getCurrentRPC();

      const connection = new Connection(selectedRpc, 'confirmed');
      const result = await operation(connection);

      // If successful, return the result
      return result;
    } catch (error) {
      lastError = error as Error;
      // If this is a network error and we have more retries, try next RPC
      if (
        attempt < maxRetries - 1 &&
        (error instanceof TypeError ||
          (error as any).message?.includes('Failed to fetch') ||
          (error as any).message?.includes('fetch'))
      ) {
        const newRpc = rpcManager.markCurrentRPCFailed();
        console.log(`🔄 Switching to next RPC: ${newRpc.split('/').pop()}`);

        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw (
    lastError ||
    new Error(`All RPC attempts failed after ${maxRetries} retries`)
  );
};

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
  currentRpc: (() => {
    try {
      return SolanaRPCManager.getInstance().getCurrentRPC().split('/').pop();
    } catch {
      return 'default';
    }
  })(),
  rpcManager: 'enabled',
};
