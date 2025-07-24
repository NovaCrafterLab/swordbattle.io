// 区块链控制器
// 提供区块链相关的API端点 - 支持Solana和BSC服务

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IsString, IsNumberString } from 'class-validator';
import { BlockchainService } from './blockchain.service';
import { SolanaBlockchainService } from './solana-blockchain.service';

// 数据传输对象
export class SignScoreDto {
  @IsNumberString()
  gameId: string;

  @IsString()
  playerAddress: string;

  @IsNumberString()
  kills: string;

  @IsNumberString()
  score: string;

  @IsNumberString()
  nonce: string;
}

@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly solanaBlockchainService: SolanaBlockchainService,
  ) {}

  // 获取优先服务（Solana优先，BSC作为后备）
  private getActiveService() {
    if (this.solanaBlockchainService.isAvailable()) {
      return this.solanaBlockchainService;
    }
    return this.blockchainService;
  }

  // 获取区块链服务状态
  @Get('status')
  getStatus() {
    return {
      solana: {
        available: this.solanaBlockchainService.isAvailable(),
        config: this.solanaBlockchainService.getConfig(),
      },
      bsc: {
        available: this.blockchainService.isAvailable(),
        config: this.blockchainService.getConfig(),
      },
      activeService: this.solanaBlockchainService.isAvailable()
        ? 'solana'
        : 'bsc',
    };
  }

  // Solana专用状态端点
  @Get('solana/status')
  getSolanaStatus() {
    return {
      available: this.solanaBlockchainService.isAvailable(),
      config: this.solanaBlockchainService.getConfig(),
    };
  }

  // Solana专用测试端点
  @Get('solana/test')
  async testSolanaService() {
    try {
      const result = await this.solanaBlockchainService.testService();
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取游戏信息
  @Get('games/:gameId')
  async getGameInfo(@Param('gameId') gameId: string) {
    try {
      const service = this.getActiveService();
      const gameInfo = await service.getGameInfo(parseInt(gameId));
      return {
        success: true,
        data: gameInfo,
        service: this.solanaBlockchainService.isAvailable() ? 'solana' : 'bsc',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取游戏玩家列表
  @Get('games/:gameId/players')
  async getGamePlayers(@Param('gameId') gameId: string) {
    try {
      const service = this.getActiveService();
      const players = await service.getGamePlayers(parseInt(gameId));
      return {
        success: true,
        data: players,
        service: this.solanaBlockchainService.isAvailable() ? 'solana' : 'bsc',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取玩家信息
  @Get('games/:gameId/players/:playerAddress')
  async getPlayerInfo(
    @Param('gameId') gameId: string,
    @Param('playerAddress') playerAddress: string,
  ) {
    try {
      const service = this.getActiveService();
      const playerInfo = await service.getPlayerInfo(
        parseInt(gameId),
        playerAddress,
      );
      return {
        success: true,
        data: playerInfo,
        service: this.solanaBlockchainService.isAvailable() ? 'solana' : 'bsc',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Solana专用：获取用户Token余额
  @Get('solana/balance/:userAddress')
  async getUserTokenBalance(@Param('userAddress') userAddress: string) {
    try {
      if (!this.solanaBlockchainService.isAvailable()) {
        throw new Error('Solana service not available');
      }

      const balance =
        await this.solanaBlockchainService.getUserTokenBalance(userAddress);
      return { success: true, data: balance };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Solana专用：获取Token信息
  @Get('solana/token-info')
  async getTokenInfo() {
    try {
      if (!this.solanaBlockchainService.isAvailable()) {
        throw new Error('Solana service not available');
      }

      const tokenInfo = await this.solanaBlockchainService.getTokenInfo();
      return { success: true, data: tokenInfo };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Solana专用：检查用户票据
  @Get('solana/games/:gameId/ticket/:userAddress')
  async checkUserTicket(
    @Param('gameId') gameId: string,
    @Param('userAddress') userAddress: string,
  ) {
    try {
      if (!this.solanaBlockchainService.isAvailable()) {
        throw new Error('Solana service not available');
      }

      const ticketInfo = await this.solanaBlockchainService.hasUserTicket(
        parseInt(gameId),
        userAddress,
      );
      return { success: true, data: ticketInfo };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Solana专用：获取游戏Vault信息
  @Get('solana/games/:gameId/vault')
  async getGameVaultInfo(@Param('gameId') gameId: string) {
    try {
      if (!this.solanaBlockchainService.isAvailable()) {
        throw new Error('Solana service not available');
      }

      const vaultInfo = await this.solanaBlockchainService.getGameVaultInfo(
        parseInt(gameId),
      );
      return { success: true, data: vaultInfo };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==================== 兼容BSC接口 ====================

  // 游戏分数（BSC专用，Solana返回空）
  @Get('games/:gameId/scores')
  async getGameScores(@Param('gameId') gameId: string) {
    if (this.solanaBlockchainService.isAvailable()) {
      // Solana服务没有分数概念，返回空数组
      return { success: true, data: [], service: 'solana' };
    }

    // BSC服务返回空数组（因为现在分数通过其他方式获取）
    return { success: true, data: [], service: 'bsc' };
  }

  // 游戏排名（BSC专用，Solana返回空）
  @Get('games/:gameId/rankings')
  async getGameRankings(@Param('gameId') gameId: string) {
    if (this.solanaBlockchainService.isAvailable()) {
      // Solana服务没有排名概念，返回空数组
      return { success: true, data: [], service: 'solana' };
    }

    // BSC服务返回空数组（因为现在排名通过其他方式获取）
    return { success: true, data: [], service: 'bsc' };
  }

  // 获取玩家nonce（BSC专用）
  @Get('players/:playerAddress/nonce')
  async getPlayerNonce(@Param('playerAddress') playerAddress: string) {
    try {
      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务没有nonce概念，返回0
        return { success: true, data: { nonce: 0 }, service: 'solana' };
      }

      const nonce = await this.blockchainService.getPlayerNonce(playerAddress);
      return { success: true, data: { nonce }, service: 'bsc' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取入场费
  @Get('entry-fee')
  async getEntryFee() {
    try {
      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务返回默认入场费
        return { success: true, data: { entryFee: '1' }, service: 'solana' };
      }

      const entryFee = await this.blockchainService.getEntryFee();
      return { success: true, data: { entryFee }, service: 'bsc' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取游戏计数器
  @Get('game-counter')
  async getGameCounter() {
    try {
      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务返回模拟的游戏计数器
        return { success: true, data: { counter: 1 }, service: 'solana' };
      }

      const counter = await this.blockchainService.getGameCounter();
      return { success: true, data: { counter }, service: 'bsc' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 签名分数提交（BSC专用）
  @Post('sign-score')
  async signScoreSubmission(@Body() signScoreDto: SignScoreDto) {
    try {
      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务不支持分数签名，返回模拟签名
        return {
          success: true,
          data: { signature: 'solana_mock_signature' },
          service: 'solana',
          note: 'Solana service does not support score signing',
        };
      }

      const { gameId, playerAddress, kills, score, nonce } = signScoreDto;

      // 转换字符串为整数
      const gameIdNum = parseInt(gameId);
      const killsNum = parseInt(kills);
      const scoreNum = parseInt(score);
      const nonceNum = parseInt(nonce);

      // 验证转换结果
      if (
        isNaN(gameIdNum) ||
        isNaN(killsNum) ||
        isNaN(scoreNum) ||
        isNaN(nonceNum)
      ) {
        throw new Error(
          `Invalid numeric parameters: gameId=${gameIdNum}, kills=${killsNum}, score=${scoreNum}, nonce=${nonceNum}`,
        );
      }

      if (!playerAddress) {
        throw new Error('Invalid player address');
      }

      const signature = await this.blockchainService.signScoreSubmission(
        gameIdNum,
        playerAddress,
        killsNum,
        scoreNum,
        nonceNum,
      );

      return { success: true, data: { signature }, service: 'bsc' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取最新游戏列表
  @Get('games')
  async getRecentGames(@Query('limit') limit?: string) {
    try {
      const maxGames = limit ? parseInt(limit) : 10;
      const service = this.getActiveService();

      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务返回模拟游戏列表
        const games = [];
        for (let i = 1; i <= maxGames; i++) {
          const gameInfo = await service.getGameInfo(i);
          games.push({ gameId: i, ...gameInfo });
        }
        return { success: true, data: games, service: 'solana' };
      }

      // BSC服务逻辑
      const gameCounter = await this.blockchainService.getGameCounter();
      const games = [];
      for (let i = gameCounter; i > 0 && games.length < maxGames; i--) {
        try {
          const gameInfo = await this.blockchainService.getGameInfo(i);
          games.push({ gameId: i, ...gameInfo });
        } catch (error) {
          continue;
        }
      }

      return { success: true, data: games, service: 'bsc' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取玩家游戏历史
  @Get('players/:playerAddress/history')
  async getPlayerGameHistory(
    @Param('playerAddress') playerAddress: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const maxGames = limit ? parseInt(limit) : 20;

      if (this.solanaBlockchainService.isAvailable()) {
        // Solana服务返回空历史记录
        return {
          success: true,
          data: {
            playerAddress,
            totalGames: 0,
            games: [],
          },
          service: 'solana',
        };
      }

      const gameHistory = await this.blockchainService.getPlayerGameHistory(
        playerAddress,
        maxGames,
      );

      return {
        success: true,
        data: {
          playerAddress,
          totalGames: gameHistory.length,
          games: gameHistory,
        },
        service: 'bsc',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
