// Server-side Solana RPC Manager for load balancing and failover
const { Connection } = require('@solana/web3.js');
const Logger = require('./Logger');

// Helius RPC API Keys Pool (server-side)
const RPC_API_KEYS_RAW = process.env.RPC_API_KEYS_POOL || '';
const RPC_API_KEYS = RPC_API_KEYS_RAW.split(',').filter(
  (key) => key.trim().length > 0,
);

// Environment detection
const isDev =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_BUILD_ENV === 'development';

// Solana Devnet RPC池配置 (使用Helius API密钥)
const SOLANA_DEVNET_RPC_POOL =
  RPC_API_KEYS.length > 0
    ? RPC_API_KEYS.map((key) => `https://devnet.helius-rpc.com/?api-key=${key}`)
    : [
        'https://api.devnet.solana.com',
        'https://devnet.helius-rpc.com/?api-key=demo',
        'https://rpc.ankr.com/solana_devnet',
        'https://solana-devnet.g.alchemy.com/v2/demo',
      ];

// Solana Mainnet RPC池配置 (使用Helius API密钥)
const SOLANA_MAINNET_RPC_POOL =
  RPC_API_KEYS.length > 0
    ? RPC_API_KEYS.map(
        (key) => `https://mainnet.helius-rpc.com/?api-key=${key}`,
      )
    : [
        'https://api.mainnet-beta.solana.com',
        'https://mainnet.helius-rpc.com/?api-key=demo',
        'https://rpc.ankr.com/solana',
        'https://solana-mainnet.g.alchemy.com/v2/demo',
      ];

// RPC池配置
const SOLANA_RPC_POOLS = {
  devnet: SOLANA_DEVNET_RPC_POOL,
  mainnet: SOLANA_MAINNET_RPC_POOL,
};

// 根据环境选择RPC池
const CURRENT_RPC_POOL = isDev
  ? SOLANA_DEVNET_RPC_POOL
  : SOLANA_MAINNET_RPC_POOL;

/**
 * Server-side Solana RPC Manager for health checking and failover
 */
class SolanaRPCManager {
  constructor() {
    // Debug: Check RPC pool configuration
    Logger.server.info('🔍 DEBUG - RPC Pool Configuration', {
      environment: isDev ? 'devnet' : 'mainnet',
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_BUILD_ENV: process.env.REACT_APP_BUILD_ENV,
      RPC_API_KEYS_count: RPC_API_KEYS.length,
      CURRENT_RPC_POOL_length: CURRENT_RPC_POOL.length,
      CURRENT_RPC_POOL: CURRENT_RPC_POOL,
    });

    if (CURRENT_RPC_POOL.length === 0) {
      throw new Error('RPC pool is empty - no RPC endpoints available');
    }

    // 随机选择初始RPC节点，避免所有服务器都使用同一个RPC
    this.currentRpcIndex = Math.floor(Math.random() * CURRENT_RPC_POOL.length);
    this.failedRpcs = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 5 * 60 * 1000; // 5分钟
    this.connections = new Map(); // 缓存连接对象

    Logger.server.info('Solana RPC Manager (Server) initialized', {
      environment: isDev ? 'devnet' : 'mainnet',
      poolSize: CURRENT_RPC_POOL.length,
      heliusKeys: RPC_API_KEYS.length,
      initialRpcIndex: this.currentRpcIndex,
      initialRpc: this.getCurrentRPC().split('/').pop(),
    });
  }

  getCurrentRPC() {
    return CURRENT_RPC_POOL[this.currentRpcIndex];
  }

  getAvailableRPCs() {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  /**
   * 创建新的随机RPC连接
   */
  createRandomConnection(commitment = 'confirmed') {
    const randomRpc = this.getRandomAvailableRPC();
    const connectionKey = `${randomRpc}_${commitment}`;

    // 复用连接对象以提高性能
    if (!this.connections.has(connectionKey)) {
      this.connections.set(
        connectionKey,
        new Connection(randomRpc, commitment),
      );
      Logger.server.debug('Created new RPC connection', {
        rpc: randomRpc.split('/').pop(),
        commitment,
      });
    }

    return this.connections.get(connectionKey);
  }

  /**
   * 获取当前默认连接
   */
  getCurrentConnection(commitment = 'confirmed') {
    const currentRpc = this.getCurrentRPC();
    const connectionKey = `${currentRpc}_${commitment}`;

    if (!this.connections.has(connectionKey)) {
      this.connections.set(
        connectionKey,
        new Connection(currentRpc, commitment),
      );
      Logger.server.debug('Created default RPC connection', {
        rpc: currentRpc.split('/').pop(),
        commitment,
      });
    }

    return this.connections.get(connectionKey);
  }

  markCurrentRPCFailed() {
    const currentRpc = this.getCurrentRPC();
    Logger.server.warn('Marking current RPC as failed', {
      rpc: currentRpc.split('/').pop(),
      index: this.currentRpcIndex,
    });

    this.failedRpcs.add(this.currentRpcIndex);

    // 清理失败RPC的连接缓存
    const failedConnections = Array.from(this.connections.keys()).filter(
      (key) => key.startsWith(currentRpc),
    );
    failedConnections.forEach((key) => this.connections.delete(key));

    this.switchToNextRPC();
    const newRpc = this.getCurrentRPC();

    Logger.server.info('Switched to new RPC', {
      from: currentRpc.split('/').pop(),
      to: newRpc.split('/').pop(),
      availableCount: this.getAvailableRPCs().length,
    });

    return newRpc;
  }

  /**
   * 获取随机可用的RPC节点
   */
  getRandomAvailableRPC() {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      Logger.server.warn('No available RPC nodes, resetting failed list');
      this.failedRpcs.clear();
      // 清理所有连接缓存，重新开始
      this.connections.clear();
      this.currentRpcIndex = Math.floor(
        Math.random() * CURRENT_RPC_POOL.length,
      );
      return this.getCurrentRPC();
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const selectedIndex = availableIndices[randomIndex];
    return CURRENT_RPC_POOL[selectedIndex];
  }

  switchToNextRPC() {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      Logger.server.warn('All RPC nodes failed, resetting failed list');
      this.failedRpcs.clear();
      this.connections.clear();
      this.currentRpcIndex = Math.floor(
        Math.random() * CURRENT_RPC_POOL.length,
      );
      return;
    }

    // 从可用节点中随机选择一个（排除当前节点）
    const otherAvailableIndices = availableIndices.filter(
      (index) => index !== this.currentRpcIndex,
    );

    if (otherAvailableIndices.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * otherAvailableIndices.length,
      );
      this.currentRpcIndex = otherAvailableIndices[randomIndex];
    } else {
      // 如果只有当前节点可用，保持不变
      this.currentRpcIndex = availableIndices[0];
    }
  }

  async healthCheck() {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    this.lastHealthCheck = now;

    Logger.server.info('Starting RPC health check', {
      totalNodes: CURRENT_RPC_POOL.length,
      failedNodes: this.failedRpcs.size,
    });

    const healthPromises = CURRENT_RPC_POOL.map(async (rpc, index) => {
      try {
        const response = await fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'getHealth',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result === 'ok') {
            if (this.failedRpcs.has(index)) {
              Logger.server.info('RPC node recovered', {
                rpc: rpc.split('/').pop(),
                index,
              });
              this.failedRpcs.delete(index);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        Logger.server.warn('RPC health check failed', {
          rpc: rpc.split('/').pop(),
          index,
          error: error.message,
        });
        this.failedRpcs.add(index);

        // 清理失败RPC的连接缓存
        const failedConnections = Array.from(this.connections.keys()).filter(
          (key) => key.startsWith(rpc),
        );
        failedConnections.forEach((key) => this.connections.delete(key));

        return { index, status: 'failed', rpc };
      }
    });

    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'healthy',
    ).length;

    Logger.server.info('RPC health check completed', {
      healthy: healthyCount,
      total: CURRENT_RPC_POOL.length,
      failed: this.failedRpcs.size,
      heliusKeys: RPC_API_KEYS.length,
      environment: isDev ? 'devnet' : 'mainnet',
    });
  }

  getStats() {
    return {
      total: CURRENT_RPC_POOL.length,
      available: CURRENT_RPC_POOL.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      current: this.getCurrentRPC(),
      failedRpcs: Array.from(this.failedRpcs).map((i) => CURRENT_RPC_POOL[i]),
      environment: isDev ? 'devnet' : 'mainnet',
      heliusKeys: RPC_API_KEYS.length,
      cachedConnections: this.connections.size,
    };
  }

  /**
   * 清理所有连接缓存（用于重启或重新配置）
   */
  clearConnections() {
    this.connections.clear();
    Logger.server.info('Cleared all RPC connection cache');
  }
}

// 单例模式
let instance = null;

module.exports = {
  SolanaRPCManager,
  getInstance: () => {
    if (!instance) {
      instance = new SolanaRPCManager();
    }
    return instance;
  },
  // 导出池配置用于其他模块
  SOLANA_RPC_POOLS,
  CURRENT_RPC_POOL,
  RPC_API_KEYS,
};
