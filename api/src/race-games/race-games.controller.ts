import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RaceGamesService } from './race-games.service';
import { SaveRaceGameDTO, UpdateRaceGameDTO, GetPlayerHistoryDTO } from './race-games.dto';
import { ServerGuard } from 'src/auth/guards/server.guard';

@Controller('race-games')
export class RaceGamesController {
  constructor(private readonly raceGamesService: RaceGamesService) {}

  // 保存比赛游戏数据（由游戏服务器调用）
  @Post('save')
  @UseGuards(ServerGuard)
  async saveRaceGame(@Body() data: SaveRaceGameDTO) {
    try {
      const game = await this.raceGamesService.saveRaceGame(data);
      return { success: true, data: game };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 批量保存比赛游戏数据
  @Post('save-batch')
  @UseGuards(ServerGuard)
  async saveRaceGamesBatch(@Body() data: { games: SaveRaceGameDTO[] }) {
    try {
      const games = await this.raceGamesService.saveRaceGamesBatch(data.games);
      return { success: true, data: { games, count: games.length } };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取玩家比赛历史（替代区块链查询）
  @Get('players/:playerAddress/history')
  async getPlayerHistory(
    @Param('playerAddress') playerAddress: string,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    try {
      const limit = limitStr ? parseInt(limitStr) : 50;
      const offset = offsetStr ? parseInt(offsetStr) : 0;

      const result = await this.raceGamesService.getPlayerHistory(playerAddress, {
        limit,
        offset,
      });

      // 转换为前端期望的格式
      const games = result.games.map(game => ({
        gameId: game.gameId,
        score: game.score,
        reward: game.rewardAmount,
        hasClaimed: game.hasClaimed,
        rank: game.rank,
        isWinner: game.isWinner,
        timestamp: game.gameEndedAt?.getTime() || game.createdAt.getTime(),
        gameEnded: game.gameEnded,
      }));

      return {
        success: true,
        data: {
          playerAddress,
          totalGames: result.totalGames,
          totalRewards: result.totalRewards,
          winCount: result.winCount,
          winRate: result.winRate,
          games,
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 简化的玩家历史端点（无查询参数验证）
  @Get('players/:playerAddress/games')
  async getPlayerGames(@Param('playerAddress') playerAddress: string) {
    try {
      const result = await this.raceGamesService.getPlayerHistory(playerAddress, {
        limit: 50,
        offset: 0,
      });

      // 转换为前端期望的格式
      const games = result.games.map(game => ({
        gameId: game.gameId,
        score: game.score,
        reward: game.rewardAmount,
        hasClaimed: game.hasClaimed,
        rank: game.rank,
        isWinner: game.isWinner,
        timestamp: game.gameEndedAt?.getTime() || game.createdAt.getTime(),
        gameEnded: game.gameEnded,
      }));

      return {
        success: true,
        data: {
          playerAddress,
          totalGames: result.totalGames,
          totalRewards: result.totalRewards,
          winCount: result.winCount,
          winRate: result.winRate,
          games,
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取特定游戏的所有玩家
  @Get('games/:gameId/players')
  async getGamePlayers(@Param('gameId') gameId: string) {
    try {
      const players = await this.raceGamesService.getGamePlayers(parseInt(gameId));
      return { success: true, data: players };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 更新玩家奖励领取状态
  @Put('games/:gameId/players/:playerAddress/claim')
  async updateClaimStatus(
    @Param('gameId') gameId: string,
    @Param('playerAddress') playerAddress: string,
    @Body() data: { claimed: boolean },
  ) {
    try {
      const game = await this.raceGamesService.updateClaimStatus(
        parseInt(gameId),
        playerAddress,
        data.claimed,
      );
      return { success: true, data: game };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 更新比赛游戏数据
  @Put('games/:gameId/players/:playerAddress')
  @UseGuards(ServerGuard)
  async updateRaceGame(
    @Param('gameId') gameId: string,
    @Param('playerAddress') playerAddress: string,
    @Body() data: UpdateRaceGameDTO,
  ) {
    try {
      const game = await this.raceGamesService.updateRaceGame(
        parseInt(gameId),
        playerAddress,
        data,
      );
      return { success: true, data: game };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 批量更新奖励信息（由游戏服务器异步调用）
  @Put('update-rewards')
  @UseGuards(ServerGuard)
  async updateRewards(@Body() data: { games: Array<{
    gameId: number;
    playerAddress: string;
    rewardAmount: string;
    hasClaimed: boolean;
    isWinner: boolean;
  }> }) {
    try {
      const updatedGames = await this.raceGamesService.updateRewardsBatch(data.games);
      return { 
        success: true, 
        data: { 
          games: updatedGames, 
          count: updatedGames.length 
        } 
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 手动同步特定玩家的区块链奖励数据
  @Post('players/:playerAddress/sync-rewards')
  async syncPlayerRewards(@Param('playerAddress') playerAddress: string) {
    try {
      const result = await this.raceGamesService.syncPlayerRewardsFromBlockchain(playerAddress);
      return { 
        success: true, 
        message: `Successfully synced ${result.updatedCount} game rewards for player ${playerAddress}`,
        data: { 
          updatedGames: result.updatedGames, 
          updatedCount: result.updatedCount 
        } 
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 健康检查
  @Get('ping')
  ping() {
    return { success: true, message: 'Race Games API is running' };
  }

  // 调试配置（临时）
  @Get('debug/config')
  debugConfig() {
    const { config } = require('src/config');
    return { 
      success: true, 
      serverSecret: config.serverSecret,
      serverSecretLength: config.serverSecret?.length || 0,
      isProduction: config.isProduction
    };
  }

  // 创建测试数据（仅用于开发测试）
  @Post('test/create-sample-data/:playerAddress')
  async createSampleData(@Param('playerAddress') playerAddress: string) {
    try {
      const sampleGames: SaveRaceGameDTO[] = [
        {
          gameId: 259,
          playerAddress,
          score: 60,
          rewardAmount: '5.0',
          hasClaimed: true,
          rank: 1,
          isWinner: true,
          gameEnded: true,
          gameEndedAt: new Date(Date.now() - 86400000), // 1天前
        },
        {
          gameId: 256,
          playerAddress,
          score: 0,
          rewardAmount: '5.0',
          hasClaimed: false,
          rank: 1,
          isWinner: true,
          gameEnded: true,
          gameEndedAt: new Date(Date.now() - 2 * 86400000), // 2天前
        },
        {
          gameId: 253,
          playerAddress,
          score: 0,
          rewardAmount: '5.0',
          hasClaimed: false,
          rank: 1,
          isWinner: true,
          gameEnded: true,
          gameEndedAt: new Date(Date.now() - 3 * 86400000), // 3天前
        },
      ];

      const savedGames = await this.raceGamesService.saveRaceGamesBatch(sampleGames);
      return { 
        success: true, 
        message: 'Sample data created successfully',
        data: { games: savedGames, count: savedGames.length }
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 添加单个游戏记录（用于手动测试）
  @Post('test/add-game')
  async addTestGame(@Body() data: SaveRaceGameDTO) {
    try {
      const savedGame = await this.raceGamesService.saveRaceGame(data);
      return { 
        success: true, 
        message: 'Game data added successfully',
        data: savedGame
      };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} 