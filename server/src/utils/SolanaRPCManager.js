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
        'https://rpc.ankr.com/solana_devnet',
        // Removed invalid demo endpoints that cause 401/429 errors
      ];

// Solana Mainnet RPC池配置 (使用Helius API密钥)
const SOLANA_MAINNET_RPC_POOL =
  RPC_API_KEYS.length > 0
    ? RPC_API_KEYS.map(
        (key) => `https://mainnet.helius-rpc.com/?api-key=${key}`,
      )
    : [
        'https://api.mainnet-beta.solana.com',
        'https://rpc.ankr.com/solana',
        // Removed invalid demo endpoints that cause 401/429 errors
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

    // 🎯 时间窗口轮换策略：10分钟保持同一RPC，减少WebSocket重连
    this.currentRpcIndex = Math.floor(Math.random() * CURRENT_RPC_POOL.length);
    this.currentRPC = CURRENT_RPC_POOL[this.currentRpcIndex];
    this.lastRotation = Date.now();
    this.rotationInterval = 10 * 60 * 1000; // 10分钟轮换间隔

    this.failedRpcs = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 5 * 60 * 1000; // 5分钟
    this.connections = new Map(); // 连接缓存用于复用

    Logger.server.info('Solana RPC Manager (Server) initialized', {
      environment: isDev ? 'devnet' : 'mainnet',
      poolSize: CURRENT_RPC_POOL.length,
      heliusKeys: RPC_API_KEYS.length,
      rotationMode: 'time-window', // 标识使用时间窗口模式
      rotationInterval: '10 minutes',
      currentRPC: this.currentRPC.split('/').pop(),
      loadBalancing: '每10分钟轮换RPC节点，保持连接稳定性',
    });
  }

  getCurrentRPC() {
    const now = Date.now();

    // 检查是否需要轮换RPC（时间到期或当前RPC失败）
    if (this.shouldRotateRPC(now)) {
      this.rotateToNextHealthyRPC();
    }

    return this.currentRPC;
  }

  /**
   * 检查是否需要轮换RPC
   */
  shouldRotateRPC(now) {
    // 时间到期需要轮换
    if (now - this.lastRotation > this.rotationInterval) {
      return true;
    }

    // 当前RPC失败需要立即轮换
    if (this.failedRpcs.has(this.currentRpcIndex)) {
      return true;
    }

    return false;
  }

  /**
   * 轮换到下一个健康的RPC
   */
  rotateToNextHealthyRPC() {
    const previousRPC = this.currentRPC;
    const previousIndex = this.currentRpcIndex;

    // 获取新的健康RPC
    const newRpcInfo = this.selectNextHealthyRPC();

    if (newRpcInfo) {
      this.currentRPC = newRpcInfo.rpc;
      this.currentRpcIndex = newRpcInfo.index;
      this.lastRotation = Date.now();

      // 清理旧连接缓存
      this.cleanupOldConnections(previousRPC);

      Logger.server.info('🔄 RPC rotated (time-window strategy)', {
        from: previousRPC.split('/').pop(),
        to: this.currentRPC.split('/').pop(),
        reason: this.failedRpcs.has(previousIndex) ? 'failure' : 'time-window',
        availableCount: this.getAvailableRPCs().length,
        nextRotationIn: `${Math.round(this.rotationInterval / 60000)} minutes`,
      });
    } else {
      Logger.server.warn(
        'No healthy RPC available for rotation, keeping current',
      );
    }
  }

  /**
   * 选择下一个健康的RPC
   */
  selectNextHealthyRPC() {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      Logger.server.warn(
        'No healthy RPC nodes available, resetting failed list',
      );
      this.failedRpcs.clear();
      // 重置后选择随机RPC
      const randomIndex = Math.floor(Math.random() * CURRENT_RPC_POOL.length);
      return {
        rpc: CURRENT_RPC_POOL[randomIndex],
        index: randomIndex,
      };
    }

    // 优先选择不同于当前的RPC
    const otherAvailableIndices = availableIndices.filter(
      (index) => index !== this.currentRpcIndex,
    );

    let selectedIndex;
    if (otherAvailableIndices.length > 0) {
      // 从其他可用RPC中随机选择
      const randomIdx = Math.floor(
        Math.random() * otherAvailableIndices.length,
      );
      selectedIndex = otherAvailableIndices[randomIdx];
    } else {
      // 如果只有当前RPC可用，保持使用当前的
      selectedIndex = this.currentRpcIndex;
    }

    return {
      rpc: CURRENT_RPC_POOL[selectedIndex],
      index: selectedIndex,
    };
  }

  getAvailableRPCs() {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  /**
   * 创建当前RPC的连接实例 - 使用连接缓存复用
   */
  createConnection(commitment = 'confirmed') {
    const currentRpc = this.getCurrentRPC();
    const connectionKey = `${currentRpc}-${commitment}`;

    // 尝试复用现有连接
    if (this.connections.has(connectionKey)) {
      const existingConnection = this.connections.get(connectionKey);
      Logger.server.debug('🔗 Reusing existing connection', {
        rpc: currentRpc.split('/').pop(),
        commitment,
        cacheSize: this.connections.size,
      });
      return existingConnection;
    }

    // 创建新连接并缓存
    const connection = new Connection(currentRpc, commitment);
    this.connections.set(connectionKey, connection);

    Logger.server.debug('🆕 Created new connection', {
      rpc: currentRpc.split('/').pop(),
      commitment,
      cacheSize: this.connections.size,
    });

    return connection;
  }

  /**
   * 获取连接实例 - 使用时间窗口策略的稳定连接
   */
  getCurrentConnection(commitment = 'confirmed') {
    return this.createConnection(commitment);
  }

  /**
   * 清理旧RPC的连接缓存
   */
  cleanupOldConnections(oldRpc) {
    const keysToDelete = [];

    for (const [key, connection] of this.connections.entries()) {
      if (key.startsWith(oldRpc)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      this.connections.delete(key);
    });

    if (keysToDelete.length > 0) {
      Logger.server.debug('🧹 Cleaned up old connections', {
        oldRpc: oldRpc.split('/').pop(),
        cleanedConnections: keysToDelete.length,
        remainingConnections: this.connections.size,
      });
    }
  }

  markCurrentRPCFailed() {
    const currentRpc = this.currentRPC;
    Logger.server.warn('Marking current RPC as failed', {
      rpc: currentRpc.split('/').pop(),
      index: this.currentRpcIndex,
    });

    // 标记当前RPC为失败
    this.failedRpcs.add(this.currentRpcIndex);

    // 清理失败RPC的连接缓存
    this.cleanupOldConnections(currentRpc);

    // 立即轮换到新的健康RPC（故障时不等待时间窗口）
    this.rotateToNextHealthyRPC();
    const newRpc = this.currentRPC;

    Logger.server.info('🚨 Switched to new RPC due to failure', {
      from: currentRpc.split('/').pop(),
      to: newRpc.split('/').pop(),
      availableCount: this.getAvailableRPCs().length,
      reason: 'RPC failure',
    });

    return newRpc;
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
    // 统计可用的Helius节点数量
    const availableRpcs = this.getAvailableRPCs();
    const heliusCount = availableRpcs.filter((rpc) =>
      rpc.includes('helius-rpc.com'),
    ).length;
    const totalHeliusCount = CURRENT_RPC_POOL.filter((rpc) =>
      rpc.includes('helius-rpc.com'),
    ).length;

    const now = Date.now();
    const timeSinceLastRotation = now - this.lastRotation;
    const timeUntilNextRotation = Math.max(
      0,
      this.rotationInterval - timeSinceLastRotation,
    );

    return {
      total: CURRENT_RPC_POOL.length,
      available: CURRENT_RPC_POOL.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      rotationMode: 'time-window', // 标识使用时间窗口模式
      rotationInterval: `${Math.round(this.rotationInterval / 60000)} minutes`,
      currentRPC: this.currentRPC.split('/').pop(),
      timeSinceRotation: `${Math.round(timeSinceLastRotation / 60000)} minutes`,
      nextRotationIn: `${Math.round(timeUntilNextRotation / 60000)} minutes`,
      loadBalanced: true, // 标识负载均衡已启用
      heliusAvailable: heliusCount,
      heliusTotal: totalHeliusCount,
      failedRpcs: Array.from(this.failedRpcs).map((i) => CURRENT_RPC_POOL[i]),
      environment: isDev ? 'devnet' : 'mainnet',
      heliusKeys: RPC_API_KEYS.length,
      cachedConnections: this.connections.size,
      note: 'Uses time-window rotation (10min) to balance stability and load distribution',
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
