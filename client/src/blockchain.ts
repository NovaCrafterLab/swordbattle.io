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

// Create a random RPC connection for blockchain operations with timeout protection
export const createRandomRPCConnection = () => {
  const rpcManager = SolanaRPCManager.getInstance();
  const selectedRpc = rpcManager.getCurrentRPC();

  // Enhanced logging to show Helius endpoint usage
  const rpcEndpoint = selectedRpc.split('/').pop() || selectedRpc;
  const isHelius = selectedRpc.includes('helius-rpc.com');
  const apiKey = isHelius
    ? selectedRpc.split('api-key=')[1]?.substring(0, 8) + '...'
    : 'N/A';

  try {
    // 🔧 添加超时保护：为 Connection 对象添加默认超时配置
    const connection = new Connection(selectedRpc, {
      commitment: 'confirmed',
      httpHeaders: {
        'Content-Type': 'application/json',
      },
      // 设置 15 秒超时
      fetch: (url, options) => {
        const timeoutId = setTimeout(() => {}, 15000);

        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(15000), // 15秒超时
        }).finally(() => clearTimeout(timeoutId));
      },
    });

    return connection;
  } catch (error) {
    console.error(`❌ Failed to create RPC connection: ${error}`);
    const fallbackRpc = rpcManager.markCurrentRPCFailed();

    // 尝试创建备用连接，同样带超时保护
    return new Connection(fallbackRpc, {
      commitment: 'confirmed',
      fetch: (url, options) =>
        fetch(url, {
          ...options,
          signal: AbortSignal.timeout(15000),
        }),
    });
  }
};

// Create a robust RPC connection with automatic retry on network failures and timeout
export const createRobustRPCConnection = async <T>(
  operation: (connection: Connection) => Promise<T>,
  maxRetries: number = 3,
): Promise<T> => {
  const rpcManager = SolanaRPCManager.getInstance();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const selectedRpc = rpcManager.getCurrentRPC();

      // 🔧 添加超时保护和增强错误处理
      const connection = new Connection(selectedRpc, {
        commitment: 'confirmed',
        fetch: (url, options) => {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  `RPC connection timeout after 15 seconds for ${selectedRpc.split('/').pop()}`,
                ),
              );
            }, 15000);
          });

          const fetchPromise = fetch(url, {
            ...options,
            signal: AbortSignal.timeout(15000),
          });

          return Promise.race([fetchPromise, timeoutPromise]);
        },
      });

      // 添加操作超时保护，防止操作本身卡死
      const operationWithTimeout = Promise.race([
        operation(connection),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                `Operation timeout after 20 seconds (attempt ${attempt + 1}/${maxRetries})`,
              ),
            );
          }, 20000); // 20秒操作超时
        }),
      ]);

      const result = await operationWithTimeout;

      // If successful, return the result
      return result;
    } catch (error) {
      lastError = error as Error;

      // If this is a network error and we have more retries, try next RPC
      if (
        attempt < maxRetries - 1 &&
        (error instanceof TypeError ||
          (error as any).message?.includes('Failed to fetch') ||
          (error as any).message?.includes('fetch') ||
          (error as any).message?.includes('timeout') ||
          (error as any).message?.includes('Connection timeout') ||
          (error as any).message?.includes('network'))
      ) {
        const newRpc = rpcManager.markCurrentRPCFailed();

        // Wait a bit before retrying with exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏱️ Waiting ${backoffDelay}ms before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
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
