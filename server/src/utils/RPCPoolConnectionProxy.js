/**
 * RPC Pool Connection Proxy
 *
 * This proxy class wraps a Solana Connection and dynamically routes all method calls
 * through the RPC Pool manager for load balancing and failover support.
 *
 * It ensures that VaultSDK and other Solana operations can transparently benefit
 * from RPC Pool features without code changes.
 */

const Logger = require('./Logger');

class RPCPoolConnectionProxy {
  constructor(rpcManager, commitment = 'confirmed') {
    this.rpcManager = rpcManager;
    this.commitment = commitment;

    // Create a Proxy that intercepts all property access
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        // If the property exists on our proxy class, use it
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        // For all other properties, delegate to the current RPC connection
        return target._getConnectionProperty(prop);
      },
    });
  }

  /**
   * Get a property from the current RPC connection with failover support
   */
  _getConnectionProperty(prop) {
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const connection = this.rpcManager.getCurrentConnection(
          this.commitment,
        );
        const value = connection[prop];

        // If it's a function, wrap it to handle RPC failures
        if (typeof value === 'function') {
          return this._wrapMethod(prop, value, connection);
        }

        // For properties, return directly
        return value;
      } catch (error) {
        lastError = error;
        Logger.server.warn(
          `Failed to get property ${prop} from RPC connection`,
          {
            attempt: attempt + 1,
            error: error.message,
          },
        );

        if (attempt < maxRetries - 1) {
          this.rpcManager.markCurrentRPCFailed();
        }
      }
    }

    throw new Error(
      `Failed to get property ${prop} after ${maxRetries} attempts: ${lastError?.message}`,
    );
  }

  /**
   * Wrap a connection method to handle RPC failures with automatic failover
   */
  _wrapMethod(methodName, originalMethod, connection) {
    return async (...args) => {
      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // For the first attempt, use the provided connection
          // For retries, get a fresh connection from the pool
          const currentConnection =
            attempt === 0
              ? connection
              : this.rpcManager.getCurrentConnection(this.commitment);

          const method = currentConnection[methodName];
          if (typeof method !== 'function') {
            throw new Error(`Method ${methodName} is not a function`);
          }

          // Log RPC usage for important operations
          if (this._isImportantOperation(methodName)) {
            Logger.server.debug(
              `🔗 RPC Pool: ${methodName} via ${this.rpcManager.getCurrentRPC()?.split('/').pop()}`,
            );
          }

          const result = await method.apply(currentConnection, args);
          return result;
        } catch (error) {
          lastError = error;

          const isRetryableError = this._isRetryableError(error);
          const shouldRetry = attempt < maxRetries - 1 && isRetryableError;

          if (shouldRetry) {
            Logger.server.warn(`🔄 RPC Pool: ${methodName} failed, retrying`, {
              attempt: attempt + 1,
              maxRetries,
              error: error.message,
              rpc: this.rpcManager.getCurrentRPC()?.split('/').pop(),
            });

            // Mark current RPC as failed and switch to next one
            this.rpcManager.markCurrentRPCFailed();
          } else {
            // Log final failure
            Logger.server.error(
              `❌ RPC Pool: ${methodName} failed after ${attempt + 1} attempts`,
              {
                error: error.message,
                isRetryable: isRetryableError,
              },
            );
            break;
          }
        }
      }

      throw new Error(
        `RPC Pool: ${methodName} failed after ${maxRetries} attempts: ${lastError?.message}`,
      );
    };
  }

  /**
   * Check if this is an important operation that should be logged
   */
  _isImportantOperation(methodName) {
    const importantOperations = [
      'getAccountInfo',
      'getProgramAccounts',
      'sendTransaction',
      'confirmTransaction',
      'getTransaction',
      'getLatestBlockhash',
      'simulateTransaction',
    ];
    return importantOperations.includes(methodName);
  }

  /**
   * Check if an error is retryable (network/RPC errors)
   */
  _isRetryableError(error) {
    if (!error || !error.message) return false;

    const errorMessage = error.message.toLowerCase();
    const retryablePatterns = [
      'network',
      'timeout',
      'connection',
      'enotfound',
      'fetch',
      'rpc',
      '429',
      'rate limit',
      'too many requests',
      'service unavailable',
      '503',
      '502',
      '500',
    ];

    return retryablePatterns.some((pattern) => errorMessage.includes(pattern));
  }

  /**
   * Get current RPC information for debugging
   */
  getCurrentRPCInfo() {
    return {
      url: this.rpcManager.getCurrentRPC(),
      commitment: this.commitment,
      stats: this.rpcManager.getStats?.() || null,
    };
  }

  /**
   * Force connection refresh
   */
  refreshConnection() {
    Logger.server.info('🔄 RPC Pool: Forcing connection refresh');
    return this.rpcManager.getCurrentConnection(this.commitment);
  }
}

module.exports = RPCPoolConnectionProxy;
