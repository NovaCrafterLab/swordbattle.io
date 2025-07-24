// Solana RPC健康检查和故障转移管理器
// 与client/server的SolanaRPCManager保持一致的功能

import { Injectable, Logger } from '@nestjs/common';
import { CURRENT_RPC_POOL } from './solana-blockchain.config';

@Injectable()
export class SolanaRPCManager {
  private static instance: SolanaRPCManager;
  private readonly logger = new Logger(SolanaRPCManager.name);
  private currentRpcIndex: number;
  private failedRpcs = new Set<number>();
  private lastHealthCheck = 0;
  private readonly healthCheckInterval = 5 * 60 * 1000; // 5分钟

  constructor() {
    // 随机选择初始RPC节点，避免所有API实例都使用同一个RPC
    this.currentRpcIndex = Math.floor(Math.random() * CURRENT_RPC_POOL.length);
    this.logger.log(
      `📡 Solana RPC Manager initialized with ${CURRENT_RPC_POOL.length} endpoints`,
    );
    this.logger.log(
      `🎯 Starting with random endpoint: ${this.getCurrentRPC().split('/').pop()}`,
    );
  }

  static getInstance(): SolanaRPCManager {
    if (!SolanaRPCManager.instance) {
      SolanaRPCManager.instance = new SolanaRPCManager();
    }
    return SolanaRPCManager.instance;
  }

  getCurrentRPC(): string {
    return CURRENT_RPC_POOL[this.currentRpcIndex];
  }

  getAvailableRPCs(): string[] {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed(): string {
    const currentRpc = this.getCurrentRPC();
    this.logger.warn(
      `🔄 RPC failed, switching: ${currentRpc.split('/').pop()}`,
    );
    this.failedRpcs.add(this.currentRpcIndex);
    this.switchToNextRPC();
    const newRpc = this.getCurrentRPC();
    this.logger.log(`✅ Switched to: ${newRpc.split('/').pop()}`);
    return newRpc;
  }

  /**
   * 获取随机可用的RPC节点
   */
  getRandomAvailableRPC(): string {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      this.logger.warn('⚠️ 没有可用的RPC节点，重置失败列表');
      this.failedRpcs.clear();
      this.currentRpcIndex = Math.floor(
        Math.random() * CURRENT_RPC_POOL.length,
      );
      return this.getCurrentRPC();
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    this.currentRpcIndex = availableIndices[randomIndex];
    return this.getCurrentRPC();
  }

  private switchToNextRPC(): void {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      this.logger.warn(
        '⚠️ All RPC nodes failed, resetting and selecting random node',
      );
      this.failedRpcs.clear();
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

  async healthCheck(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    this.lastHealthCheck = now;

    this.logger.debug('🏥 Starting RPC health check...');

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
              this.logger.log(`✨ RPC recovered: ${rpc.split('/').pop()}`);
              this.failedRpcs.delete(index);
            }
            return { index, status: 'healthy', rpc };
          }
        }
        throw new Error('Invalid response');
      } catch (error) {
        if (!this.failedRpcs.has(index)) {
          this.logger.warn(
            `❌ RPC failed health check: ${rpc.split('/').pop()}`,
          );
        }
        this.failedRpcs.add(index);
        return { index, status: 'failed', rpc };
      }
    });

    const results = await Promise.allSettled(healthPromises);
    const healthyCount = results.filter(
      (result) =>
        result.status === 'fulfilled' && result.value.status === 'healthy',
    ).length;

    this.logger.debug(
      `🏥 Health check completed: ${healthyCount}/${CURRENT_RPC_POOL.length} healthy`,
    );
  }

  getStats() {
    const isHelius = this.getCurrentRPC().includes('helius-rpc.com');
    const apiKey = isHelius
      ? this.getCurrentRPC().split('api-key=')[1]?.substring(0, 8) + '...'
      : 'N/A';

    return {
      total: CURRENT_RPC_POOL.length,
      available: CURRENT_RPC_POOL.length - this.failedRpcs.size,
      failed: this.failedRpcs.size,
      current: this.getCurrentRPC().split('/').pop(),
      currentFullUrl: this.getCurrentRPC(),
      isHelius,
      apiKey,
      failedRpcs: Array.from(this.failedRpcs).map((i) =>
        CURRENT_RPC_POOL[i].split('/').pop(),
      ),
      cluster:
        process.env.BUILD_ENV === 'development' ? 'devnet' : 'mainnet-beta',
      lastHealthCheck: new Date(this.lastHealthCheck).toISOString(),
    };
  }

  /**
   * 创建带有超时保护的fetch函数
   */
  createTimeoutFetch(timeoutMs: number = 15000) {
    return (url: string, options?: RequestInit) => {
      const timeoutId = setTimeout(() => {}, timeoutMs);

      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      }).finally(() => clearTimeout(timeoutId));
    };
  }

  /**
   * 执行具有重试机制的RPC操作
   */
  async executeWithRetry<T>(
    operation: (rpcUrl: string) => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const selectedRpc = this.getCurrentRPC();
        const result = await operation(selectedRpc);
        return result;
      } catch (error) {
        lastError = error as Error;

        // 如果这是网络错误且还有重试次数，切换到下一个RPC
        if (
          attempt < maxRetries - 1 &&
          (error instanceof TypeError ||
            (error as any).message?.includes('Failed to fetch') ||
            (error as any).message?.includes('fetch') ||
            (error as any).message?.includes('timeout') ||
            (error as any).message?.includes('Connection timeout') ||
            (error as any).message?.includes('network'))
        ) {
          this.markCurrentRPCFailed();

          // 指数退避延迟
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
          this.logger.debug(`⏱️ Waiting ${backoffDelay}ms before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }
      }
    }

    throw (
      lastError ||
      new Error(`All RPC attempts failed after ${maxRetries} retries`)
    );
  }
}
