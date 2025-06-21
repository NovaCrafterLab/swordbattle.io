// 区块链控制器
// 提供区块链相关的API端点

import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { IsString, IsNumberString, IsEthereumAddress } from 'class-validator';
import { BlockchainService } from './blockchain.service';

// 数据传输对象
export class SignScoreDto {
  @IsNumberString()
  gameId: string;

  @IsEthereumAddress()
  playerAddress: string;

  @IsNumberString()
  score: string;

  @IsNumberString()
  nonce: string;
}

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // 获取区块链服务状态
  @Get('status')
  getStatus() {
    return {
      available: this.blockchainService.isAvailable(),
      config: this.blockchainService.getConfig(),
    };
  }

  // 获取游戏信息
  @Get('games/:gameId')
  async getGameInfo(@Param('gameId') gameId: string) {
    try {
      const gameInfo = await this.blockchainService.getGameInfo(parseInt(gameId));
      return { success: true, data: gameInfo };
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
      const players = await this.blockchainService.getGamePlayers(parseInt(gameId));
      return { success: true, data: players };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取游戏分数
  @Get('games/:gameId/scores')
  async getGameScores(@Param('gameId') gameId: string) {
    try {
      const scores = await this.blockchainService.getGameScores(parseInt(gameId));
      return { success: true, data: scores };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取游戏排名
  @Get('games/:gameId/rankings')
  async getGameRankings(@Param('gameId') gameId: string) {
    try {
      const rankings = await this.blockchainService.getGameRankings(parseInt(gameId));
      return { success: true, data: rankings };
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
      const playerInfo = await this.blockchainService.getPlayerInfo(
        parseInt(gameId),
        playerAddress,
      );
      return { success: true, data: playerInfo };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取玩家nonce
  @Get('players/:playerAddress/nonce')
  async getPlayerNonce(@Param('playerAddress') playerAddress: string) {
    try {
      const nonce = await this.blockchainService.getPlayerNonce(playerAddress);
      return { success: true, data: { nonce } };
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
      const entryFee = await this.blockchainService.getEntryFee();
      return { success: true, data: { entryFee } };
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
      const counter = await this.blockchainService.getGameCounter();
      return { success: true, data: { counter } };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 签名分数提交
  @Post('sign-score')
  async signScoreSubmission(@Body() signScoreDto: SignScoreDto) {
    try {
      console.log('Received sign-score request:', signScoreDto);
      
      const { gameId, playerAddress, score, nonce } = signScoreDto;
      
      // 直接转换字符串为整数
      const gameIdNum = parseInt(gameId);
      const scoreNum = parseInt(score);
      const nonceNum = parseInt(nonce);
      
      console.log('Parsed parameters:', { gameIdNum, scoreNum, nonceNum, playerAddress });
      
      // 验证转换结果
      if (isNaN(gameIdNum) || isNaN(scoreNum) || isNaN(nonceNum)) {
        console.error('Invalid numeric parameters:', { gameIdNum, scoreNum, nonceNum });
        throw new Error(`Invalid numeric parameters: gameId=${gameIdNum}, score=${scoreNum}, nonce=${nonceNum}`);
      }
      
      if (!playerAddress) {
        throw new Error('Invalid player address');
      }
      
      console.log('Calling blockchain service with:', { gameIdNum, playerAddress, scoreNum, nonceNum });
      
      const signature = await this.blockchainService.signScoreSubmission(
        gameIdNum,
        playerAddress,
        scoreNum,
        nonceNum,
      );
      
      console.log('Signature generated successfully');
      return { success: true, data: { signature } };
    } catch (error) {
      console.error('Error in sign-score endpoint:', error);
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取最新游戏列表（可选：用于前端显示）
  @Get('games')
  async getRecentGames(@Query('limit') limit?: string) {
    try {
      const maxGames = limit ? parseInt(limit) : 10;
      const gameCounter = await this.blockchainService.getGameCounter();
      
      const games = [];
      for (let i = gameCounter; i > 0 && games.length < maxGames; i--) {
        try {
          const gameInfo = await this.blockchainService.getGameInfo(i);
          games.push({ gameId: i, ...gameInfo });
        } catch (error) {
          // 跳过有问题的游戏
          continue;
        }
      }
      
      return { success: true, data: games };
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
    @Query('limit') limit?: string
  ) {
    try {
      const maxGames = limit ? parseInt(limit) : 20;
      const gameHistory = await this.blockchainService.getPlayerGameHistory(playerAddress, maxGames);
      
      return { 
        success: true, 
        data: {
          playerAddress,
          totalGames: gameHistory.length,
          games: gameHistory
        }
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} 