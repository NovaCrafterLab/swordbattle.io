// Solana RPC健康检查和故障转移管理器
// 与client/server的SolanaRPCManager保持一致的功能

import { Injectable, Logger } from '@nestjs/common';
import { CURRENT_RPC_POOL } from './solana-blockchain.config';

@Injectable()
export class SolanaRPCManager {
  private static instance: SolanaRPCManager;
  private readonly logger = new Logger(SolanaRPCManager.name);
  private currentRpcIndex: number;
  private currentRPC: string;
  private lastRotation: number;
  private readonly rotationInterval: number;
  private failedRpcs = new Set<number>();
  private lastHealthCheck = 0;
  private readonly healthCheckInterval = 5 * 60 * 1000; // 5分钟

  constructor() {
    // 🎯 时间窗口轮换策略：10分钟保持同一RPC，API层优化
    this.currentRpcIndex = Math.floor(Math.random() * CURRENT_RPC_POOL.length);
    this.currentRPC = CURRENT_RPC_POOL[this.currentRpcIndex];
    this.lastRotation = Date.now();
    this.rotationInterval = 10 * 60 * 1000; // 10分钟轮换间隔

    this.logger.log(
      `📡 Solana RPC Manager (API) initialized with ${CURRENT_RPC_POOL.length} endpoints`,
    );
    this.logger.log(`🎯 API层使用时间窗口轮换策略：每10分钟轮换RPC节点`);
    this.logger.log(`🔗 当前RPC: ${this.currentRPC.split('/').pop()}`);
  }

  static getInstance(): SolanaRPCManager {
    if (!SolanaRPCManager.instance) {
      SolanaRPCManager.instance = new SolanaRPCManager();
    }
    return SolanaRPCManager.instance;
  }

  getCurrentRPC(): string {
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
  private shouldRotateRPC(now: number): boolean {
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
  private rotateToNextHealthyRPC(): void {
    const previousRPC = this.currentRPC;
    const previousIndex = this.currentRpcIndex;

    // 获取新的健康RPC
    const newRpcInfo = this.selectNextHealthyRPC();

    if (newRpcInfo) {
      this.currentRPC = newRpcInfo.rpc;
      this.currentRpcIndex = newRpcInfo.index;
      this.lastRotation = Date.now();

      this.logger.log('🔄 API RPC rotated (time-window strategy)', {
        from: previousRPC.split('/').pop(),
        to: this.currentRPC.split('/').pop(),
        reason: this.failedRpcs.has(previousIndex) ? 'failure' : 'time-window',
        availableCount: this.getAvailableRPCs().length,
        nextRotationIn: `${Math.round(this.rotationInterval / 60000)} minutes`,
      });
    } else {
      this.logger.warn(
        'No healthy RPC available for rotation, keeping current',
      );
    }
  }

  /**
   * 选择下一个健康的RPC
   */
  private selectNextHealthyRPC(): { rpc: string; index: number } | null {
    const availableIndices = CURRENT_RPC_POOL.map((_, index) => index).filter(
      (index) => !this.failedRpcs.has(index),
    );

    if (availableIndices.length === 0) {
      this.logger.warn('No healthy RPC nodes available, resetting failed list');
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

    let selectedIndex: number;
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

  getAvailableRPCs(): string[] {
    return CURRENT_RPC_POOL.filter((_, index) => !this.failedRpcs.has(index));
  }

  markCurrentRPCFailed(): string {
    const currentRpc = this.currentRPC;
    this.logger.warn(
      `🔄 API RPC failed, switching: ${currentRpc.split('/').pop()}`,
    );

    // 标记当前RPC为失败
    this.failedRpcs.add(this.currentRpcIndex);

    // 立即轮换到新的健康RPC（故障时不等待时间窗口）
    this.rotateToNextHealthyRPC();
    const newRpc = this.currentRPC;

    this.logger.log(
      `🚨 API switched to new RPC due to failure: ${newRpc.split('/').pop()}`,
    );
    return newRpc;
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
      heliusAvailable: heliusCount,
      heliusTotal: totalHeliusCount,
      loadBalanced: true, // 标识负载均衡已启用
      failedRpcs: Array.from(this.failedRpcs).map((i) =>
        CURRENT_RPC_POOL[i].split('/').pop(),
      ),
      cluster:
        process.env.BUILD_ENV === 'development' ? 'devnet' : 'mainnet-beta',
      lastHealthCheck: new Date(this.lastHealthCheck).toISOString(),
      note: 'Uses time-window rotation (10min) for API layer stability',
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
   * 执行具有重试机制的RPC操作 - 使用时间窗口策略
   */
  async executeWithRetry<T>(
    operation: (rpcUrl: string) => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // 使用当前RPC（时间窗口策略）
        const selectedRpc = this.getCurrentRPC();
        this.logger.debug(
          `🎯 Attempt ${attempt + 1}: Using current RPC ${selectedRpc.split('/').pop()}`,
        );

        const result = await operation(selectedRpc);
        this.logger.debug(
          `✅ Request succeeded with RPC ${selectedRpc.split('/').pop()}`,
        );
        return result;
      } catch (error) {
        lastError = error as Error;

        // 检查是否是网络错误，如果是则标记当前RPC失败
        if (
          error instanceof TypeError ||
          (error as any).message?.includes('Failed to fetch') ||
          (error as any).message?.includes('fetch') ||
          (error as any).message?.includes('timeout') ||
          (error as any).message?.includes('Connection timeout') ||
          (error as any).message?.includes('network')
        ) {
          this.logger.warn(
            `❌ Network error detected, marking current RPC as failed`,
          );
          this.markCurrentRPCFailed(); // 这会触发立即轮换到新RPC
        }

        if (attempt < maxRetries - 1) {
          // 指数退避延迟
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
          this.logger.debug(
            `⏱️ Waiting ${backoffDelay}ms before retrying with next RPC...`,
          );
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
