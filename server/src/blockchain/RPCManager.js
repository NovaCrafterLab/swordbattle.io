// RPC故障转移管理器
// 处理RPC节点的健康检查和自动切换

class RPCManager {
  constructor(rpcPool) {
    this.rpcPool = rpcPool;
    this.currentIndex = 0;
    this.failedRpcs = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 5 * 60 * 1000; // 5分钟
    
    console.log(`RPC Manager initialized with ${rpcPool.length} nodes`);
  }

  getCurrentRPC() {
    return this.rpcPool[this.currentIndex];
  }

  getAvailableRPCs() {
    return this.rpcPool.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed() {
    const currentRpc = this.getCurrentRPC();
    console.warn(`RPC ${currentRpc} 标记为失败，切换到下一个节点`);
    this.failedRpcs.add(this.currentIndex);
    this.switchToNextRPC();
    const newRpc = this.getCurrentRPC();
    console.log(`切换到RPC: ${newRpc}`);
    return newRpc;
  }

  switchToNextRPC() {
    const availableIndices = this.rpcPool.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index)
    );
    
    if (availableIndices.length === 0) {
      console.warn('所有RPC节点都失败，重置失败列表');
      this.failedRpcs.clear();
      this.currentIndex = 0;
      return;
    }
    
    const currentAvailableIndex = availableIndices.indexOf(this.currentIndex);
    const nextIndex = (currentAvailableIndex + 1) % availableIndices.length;
    this.currentIndex = availableIndices[nextIndex];
  }

  async healthCheck() {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    this.lastHealthCheck = now;

    console.log('开始RPC健康检查...');
    
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
              console.log(`RPC ${rpc} 已恢复正常`);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        console.warn(`RPC ${rpc} 健康检查失败:`, error.message);
        this.failedRpcs.add(index);
        return { index, status: 'failed', rpc };
      }
    });

    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'healthy'
    ).length;
    
    console.log(`RPC健康检查完成: ${healthyCount}/${this.rpcPool.length} 节点正常`);
    
    // 如果当前RPC节点不可用，自动切换
    if (this.failedRpcs.has(this.currentIndex)) {
      console.log('当前RPC节点不可用，自动切换...');
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
      console.log(`手动切换到RPC[${index}]: ${this.getCurrentRPC()}`);
      return this.getCurrentRPC();
    }
    throw new Error(`Invalid RPC index: ${index}`);
  }

  // 重置所有失败状态
  resetFailedRPCs() {
    const previousFailedCount = this.failedRpcs.size;
    this.failedRpcs.clear();
    console.log(`重置了 ${previousFailedCount} 个失败的RPC节点状态`);
    return this.getStats();
  }

  // 获取延迟最低的RPC（简单实现）
  async findFastestRPC() {
    console.log('测试RPC节点延迟...');
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
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => r.latency < Infinity)
      .sort((a, b) => a.latency - b.latency);

    if (validResults.length > 0) {
      const fastest = validResults[0];
      console.log(`最快的RPC: ${fastest.rpc} (延迟: ${fastest.latency}ms)`);
      this.currentIndex = fastest.index;
      return fastest;
    }

    console.warn('没有找到可用的RPC节点');
    return null;
  }
}

module.exports = RPCManager; 