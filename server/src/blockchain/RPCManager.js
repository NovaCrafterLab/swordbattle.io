// RPC故障转移管理器
// 处理RPC节点的健康检查和自动切换

class RPCManager {
  constructor(rpcPool) {
    this.rpcPool = rpcPool;
    // 随机选择初始RPC节点
    this.currentIndex = Math.floor(Math.random() * rpcPool.length);
    this.failedRpcs = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 5 * 60 * 1000; // 5分钟

    console.log(
      `📡 RPC Manager: ${rpcPool.length} nodes available, starting with random node`,
    );
  }

  getCurrentRPC() {
    return this.rpcPool[this.currentIndex];
  }

  getAvailableRPCs() {
    return this.rpcPool.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed() {
    const currentRpc = this.getCurrentRPC();
    console.warn(`🔄 RPC failed, switching: ${currentRpc.split('/').pop()}`);
    this.failedRpcs.add(this.currentIndex);
    this.switchToNextRPC();
    const newRpc = this.getCurrentRPC();
    console.log(`✅ Switched to: ${newRpc.split('/').pop()}`);
    return newRpc;
  }

  switchToNextRPC() {
    const availableIndices = this.rpcPool
      .map((_, index) => index)
      .filter((index) => !this.failedRpcs.has(index));

    if (availableIndices.length === 0) {
      console.warn(
        '⚠️  All RPC nodes failed, resetting and selecting random node',
      );
      this.failedRpcs.clear();
      this.currentIndex = Math.floor(Math.random() * this.rpcPool.length);
      return;
    }

    // 从可用节点中随机选择一个（排除当前节点）
    const otherAvailableIndices = availableIndices.filter(
      (index) => index !== this.currentIndex,
    );
    if (otherAvailableIndices.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * otherAvailableIndices.length,
      );
      this.currentIndex = otherAvailableIndices[randomIndex];
    } else {
      // 如果只有当前节点可用，保持不变
      this.currentIndex = availableIndices[0];
    }
  }

  async healthCheck() {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    this.lastHealthCheck = now;

    // 减少健康检查日志的频率

    const healthPromises = this.rpcPool.map(async (rpc, index) => {
      try {
        const response = await fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            // RPC节点恢复正常
            if (this.failedRpcs.has(index)) {
              this.failedRpcs.delete(index);
              console.log(`✅ RPC recovered: ${rpc.split('/').pop()}`);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        // 只在首次失败时记录日志
        if (!this.failedRpcs.has(index)) {
          console.warn(`❌ RPC failed: ${rpc.split('/').pop()}`);
        }
        this.failedRpcs.add(index);
        return { index, status: 'failed', rpc };
      }
    });

    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'healthy',
    ).length;

    // 只在节点状态有变化时记录日志
    if (healthyCount !== this.rpcPool.length - this.failedRpcs.size) {
      console.log(
        `📊 RPC health: ${healthyCount}/${this.rpcPool.length} nodes healthy`,
      );
    }

    // 如果当前RPC节点不可用，自动切换
    if (this.failedRpcs.has(this.currentIndex)) {
      this.switchToNextRPC();
    }

    return this.getStats();
  }

  getStats() {
    return {
      total: this.rpcPool.length,
      available: this.rpcPool.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      current: this.getCurrentRPC(),
      currentIndex: this.currentIndex,
      failedRpcs: Array.from(this.failedRpcs).map((i) => this.rpcPool[i]),
      failedIndices: Array.from(this.failedRpcs),
      lastHealthCheck: this.lastHealthCheck,
      nextHealthCheck: this.lastHealthCheck + this.healthCheckInterval,
    };
  }

  // 手动切换到指定RPC
  switchToRPC(index) {
    if (index >= 0 && index < this.rpcPool.length) {
      this.currentIndex = index;
      console.log(
        `🔧 Manual switch to RPC[${index}]: ${this.getCurrentRPC().split('/').pop()}`,
      );
      return this.getCurrentRPC();
    }
    throw new Error(`Invalid RPC index: ${index}`);
  }

  // 重置所有失败状态
  resetFailedRPCs() {
    const previousFailedCount = this.failedRpcs.size;
    this.failedRpcs.clear();
    console.log(`🔄 Reset ${previousFailedCount} failed RPC nodes`);
    return this.getStats();
  }

  // 获取延迟最低的RPC（简单实现）
  async findFastestRPC() {
    const latencyTests = this.rpcPool.map(async (rpc, index) => {
      if (this.failedRpcs.has(index)) {
        return { index, rpc, latency: Infinity };
      }

      try {
        const startTime = Date.now();
        const response = await fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const latency = Date.now() - startTime;
          return { index, rpc, latency };
        }
        return { index, rpc, latency: Infinity };
      } catch (error) {
        return { index, rpc, latency: Infinity };
      }
    });

    const results = await Promise.allSettled(latencyTests);
    const validResults = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((r) => r.latency < Infinity)
      .sort((a, b) => a.latency - b.latency);

    if (validResults.length > 0) {
      const fastest = validResults[0];
      this.currentIndex = fastest.index;
      return fastest;
    }

    return null;
  }
}

module.exports = RPCManager;
