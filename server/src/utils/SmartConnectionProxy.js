/**
 * Smart Connection Proxy
 *
 * 智能连接代理 - 根据操作类型自动选择最佳RPC连接策略
 * 专用节点优先，故障时自动切换到Helius池
 */

const Logger = require('./Logger');

class SmartConnectionProxy {
  constructor(rpcManager, operationType = 'general', commitment = 'confirmed') {
    this.rpcManager = rpcManager;
    this.operationType = operationType;
    this.commitment = commitment;
    this.currentConnection = null;
    this.connectionStrategy = 'unknown';

    // 初始化连接
    this._initializeConnection();

    // Create a Proxy that intercepts all property access
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        // If the property exists on our proxy class, use it
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        // For all other properties, delegate to the current connection
        return target._getConnectionProperty(prop);
      },
    });
  }

  /**
   * 初始化连接 - 选择最佳策略
   */
  async _initializeConnection() {
    try {
      this.currentConnection = await this.rpcManager.createSmartConnection(
        this.operationType,
        this.commitment,
      );
      this.connectionStrategy = 'smart-routed';

      Logger.server.debug('🏗️ Smart connection proxy initialized', {
        operationType: this.operationType,
        commitment: this.commitment,
        strategy: this.connectionStrategy,
      });
    } catch (error) {
      Logger.server.warn(
        '❌ Smart connection initialization failed, using fallback',
        {
          operationType: this.operationType,
          error: error.message,
        },
      );

      // Fallback to Helius pool
      this.currentConnection = this.rpcManager.getCurrentConnection(
        this.commitment,
      );
      this.connectionStrategy = 'helius-fallback';
    }
  }

  /**
   * Get a property from the current connection with intelligent failover
   */
  _getConnectionProperty(prop) {
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Ensure we have a connection
        if (!this.currentConnection) {
          this._initializeConnection();
        }

        const value = this.currentConnection[prop];

        // If it's a function, wrap it to handle RPC failures with smart failover
        if (typeof value === 'function') {
          return this._wrapMethod(prop, value);
        }

        // For properties, return directly
        return value;
      } catch (error) {
        lastError = error;
        Logger.server.warn(
          `Failed to get property ${prop} from smart connection`,
          {
            attempt: attempt + 1,
            operationType: this.operationType,
            currentStrategy: this.connectionStrategy,
            error: error.message,
          },
        );

        if (attempt < maxRetries - 1) {
          this._switchConnectionStrategy();
        }
      }
    }

    throw new Error(
      `Failed to get property ${prop} after ${maxRetries} smart connection attempts: ${lastError?.message}`,
    );
  }

  /**
   * 智能切换连接策略
   */
  async _switchConnectionStrategy() {
    try {
      if (this.connectionStrategy === 'smart-routed') {
        // 从智能路由切换到专用节点
        this.currentConnection = this.rpcManager.createDedicatedConnection(
          this.commitment,
        );
        this.connectionStrategy = 'dedicated-direct';
        Logger.server.info('🔄 Switched to dedicated connection strategy');
      } else if (this.connectionStrategy === 'dedicated-direct') {
        // 从专用节点切换到Helius池
        this.currentConnection = this.rpcManager.getCurrentConnection(
          this.commitment,
        );
        this.connectionStrategy = 'helius-pool';
        Logger.server.info('🔄 Switched to Helius pool strategy');
      } else {
        // 从Helius池切换到负载均衡
        this.currentConnection = this.rpcManager.createLoadBalancedConnection(
          this.commitment,
        );
        this.connectionStrategy = 'load-balanced';
        Logger.server.info('🔄 Switched to load-balanced strategy');
      }
    } catch (error) {
      Logger.server.error('❌ Failed to switch connection strategy', {
        currentStrategy: this.connectionStrategy,
        operationType: this.operationType,
        error: error.message,
      });

      // Last resort: basic Helius pool connection
      this.currentConnection = this.rpcManager.getCurrentConnection(
        this.commitment,
      );
      this.connectionStrategy = 'emergency-fallback';
    }
  }

  /**
   * Wrap a connection method to handle failures with intelligent strategy switching
   */
  _wrapMethod(methodName, originalMethod) {
    return async (...args) => {
      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Ensure we have a connection
          if (!this.currentConnection) {
            await this._initializeConnection();
          }

          const method = this.currentConnection[methodName];
          if (typeof method !== 'function') {
            throw new Error(`Method ${methodName} is not a function`);
          }

          // Log important operations
          if (this._isImportantOperation(methodName)) {
            Logger.server.debug(
              `🏗️ Smart Connection: ${methodName} via ${this.connectionStrategy}`,
              {
                operationType: this.operationType,
                strategy: this.connectionStrategy,
              },
            );
          }

          const result = await method.apply(this.currentConnection, args);
          return result;
        } catch (error) {
          lastError = error;

          const isRetryableError = this._isRetryableError(error);
          const shouldRetry = attempt < maxRetries - 1 && isRetryableError;

          if (shouldRetry) {
            Logger.server.warn(
              `🔄 Smart Connection: ${methodName} failed, switching strategy`,
              {
                attempt: attempt + 1,
                maxRetries,
                operationType: this.operationType,
                currentStrategy: this.connectionStrategy,
                error: error.message,
              },
            );

            // Switch to next strategy
            await this._switchConnectionStrategy();
          } else {
            Logger.server.error(
              `❌ Smart Connection: ${methodName} failed after ${attempt + 1} attempts`,
              {
                operationType: this.operationType,
                finalStrategy: this.connectionStrategy,
                error: error.message,
                isRetryable: isRetryableError,
              },
            );
            break;
          }
        }
      }

      throw new Error(
        `Smart Connection: ${methodName} failed after ${maxRetries} attempts with strategy switching: ${lastError?.message}`,
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
      'sendRawTransaction',
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
      'socket hang up',
      'connection reset',
    ];

    return retryablePatterns.some((pattern) => errorMessage.includes(pattern));
  }

  /**
   * Get current connection information for debugging
   */
  getConnectionInfo() {
    return {
      operationType: this.operationType,
      commitment: this.commitment,
      strategy: this.connectionStrategy,
      isConnected: !!this.currentConnection,
      timestamp: Date.now(),
    };
  }

  /**
   * Force connection refresh with strategy reset
   */
  async refreshConnection() {
    Logger.server.info('🔄 Smart Connection: Forcing connection refresh');
    this.connectionStrategy = 'unknown';
    await this._initializeConnection();
    return this.currentConnection;
  }
}

module.exports = SmartConnectionProxy;
