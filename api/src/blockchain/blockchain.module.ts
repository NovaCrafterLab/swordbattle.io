// 区块链模块
// 支持Solana和BSC区块链服务

import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { SolanaBlockchainService } from './solana-blockchain.service';
import { SolanaRPCManager } from './solana-rpc-manager.service';
import { BlockchainController } from './blockchain.controller';

@Module({
  controllers: [BlockchainController],
  providers: [
    // Legacy BSC服务 (DEPRECATED)
    BlockchainService,
    // 新的Solana服务
    SolanaBlockchainService,
    SolanaRPCManager,
  ],
  exports: [
    BlockchainService, // 保持向后兼容
    SolanaBlockchainService, // 新的主要服务
    SolanaRPCManager,
  ],
})
export class BlockchainModule {}
