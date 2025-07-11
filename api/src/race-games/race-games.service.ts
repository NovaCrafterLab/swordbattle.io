import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceGame } from './race-games.entity';
import {
  SaveRaceGameDTO,
  UpdateRaceGameDTO,
  GetPlayerHistoryDTO,
} from './race-games.dto';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class RaceGamesService {
  private readonly logger = new Logger(RaceGamesService.name);

  constructor(
    @InjectRepository(RaceGame)
    private readonly raceGameRepository: Repository<RaceGame>,
    private readonly blockchainService: BlockchainService,
  ) {}

  /**
   * 保存或更新比赛游戏数据
   */
  async saveRaceGame(data: SaveRaceGameDTO): Promise<RaceGame> {
    try {
      // 检查是否已存在相同的记录
      const existingGame = await this.raceGameRepository.findOne({
        where: {
          gameId: data.gameId,
          playerAddress: data.playerAddress.toLowerCase(),
        },
      });

      if (existingGame) {
        // 更新现有记录
        Object.assign(existingGame, data);
        existingGame.playerAddress = data.playerAddress.toLowerCase();
        return await this.raceGameRepository.save(existingGame);
      } else {
        // 创建新记录
        const newGame = this.raceGameRepository.create(data);
        newGame.playerAddress = data.playerAddress.toLowerCase();
        return await this.raceGameRepository.save(newGame);
      }
    } catch (error) {
      this.logger.error(`Failed to save race game data:`, error);
      throw error;
    }
  }

  /**
   * 更新比赛游戏数据
   */
  async updateRaceGame(
    gameId: number,
    playerAddress: string,
    data: UpdateRaceGameDTO,
  ): Promise<RaceGame> {
    try {
      const game = await this.raceGameRepository.findOne({
        where: {
          gameId,
          playerAddress: playerAddress.toLowerCase(),
        },
      });

      if (!game) {
        throw new Error(
          `Race game not found: gameId=${gameId}, player=${playerAddress}`,
        );
      }

      Object.assign(game, data);
      return await this.raceGameRepository.save(game);
    } catch (error) {
      this.logger.error(`Failed to update race game data:`, error);
      throw error;
    }
  }

  /**
   * 获取玩家的比赛历史
   */
  async getPlayerHistory(
    playerAddress: string,
    params: GetPlayerHistoryDTO = {},
  ): Promise<{
    games: RaceGame[];
    total: number;
    totalRewards: string;
    totalGames: number;
    winCount: number;
    winRate: number;
  }> {
    try {
      const { limit = 50, offset = 0 } = params;
      const normalizedAddress = playerAddress.toLowerCase();

      // 获取游戏列表
      const [games, total] = await this.raceGameRepository.findAndCount({
        where: { playerAddress: normalizedAddress },
        order: { gameId: 'DESC' },
        take: limit,
        skip: offset,
      });

      // 计算统计数据
      const allGames = await this.raceGameRepository.find({
        where: { playerAddress: normalizedAddress },
      });

      const totalRewards = allGames.reduce((sum, game) => {
        return sum + parseFloat(game.rewardAmount || '0');
      }, 0);

      const totalGames = allGames.length;
      const winCount = allGames.filter((game) => game.isWinner).length;
      const winRate = totalGames > 0 ? (winCount / totalGames) * 100 : 0;

      return {
        games,
        total,
        totalRewards: totalRewards.toString(),
        totalGames,
        winCount,
        winRate,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get player history for ${playerAddress}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 获取特定游戏的所有玩家数据
   */
  async getGamePlayers(gameId: number): Promise<RaceGame[]> {
    try {
      return await this.raceGameRepository.find({
        where: { gameId },
        order: { rank: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to get game players for game ${gameId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 批量保存比赛游戏数据
   */
  async saveRaceGamesBatch(games: SaveRaceGameDTO[]): Promise<RaceGame[]> {
    try {
      const savedGames: RaceGame[] = [];

      for (const gameData of games) {
        const savedGame = await this.saveRaceGame(gameData);
        savedGames.push(savedGame);
      }

      return savedGames;
    } catch (error) {
      this.logger.error(`Failed to save race games batch:`, error);
      throw error;
    }
  }

  /**
   * 更新玩家的奖励领取状态
   */
  async updateClaimStatus(
    gameId: number,
    playerAddress: string,
    claimed: boolean,
  ): Promise<RaceGame> {
    return this.updateRaceGame(gameId, playerAddress, { hasClaimed: claimed });
  }

  /**
   * 批量更新奖励信息（异步延迟更新使用）
   */
  async updateRewardsBatch(
    rewardUpdates: Array<{
      gameId: number;
      playerAddress: string;
      rewardAmount: string;
      hasClaimed: boolean;
      isWinner: boolean;
    }>,
  ): Promise<RaceGame[]> {
    try {
      const updatedGames: RaceGame[] = [];

      for (const update of rewardUpdates) {
        const game = await this.raceGameRepository.findOne({
          where: {
            gameId: update.gameId,
            playerAddress: update.playerAddress.toLowerCase(),
          },
        });

        if (game) {
          // 更新奖励信息
          game.rewardAmount = update.rewardAmount;
          game.hasClaimed = update.hasClaimed;
          game.isWinner = update.isWinner;
          game.updatedAt = new Date();

          const savedGame = await this.raceGameRepository.save(game);
          updatedGames.push(savedGame);

          this.logger.log(
            `Updated rewards for game ${update.gameId}, player ${update.playerAddress}: ${update.rewardAmount} USD1`,
          );
        } else {
          this.logger.warn(
            `Game not found for reward update: gameId=${update.gameId}, player=${update.playerAddress}`,
          );
        }
      }

      return updatedGames;
    } catch (error) {
      this.logger.error(`Failed to update rewards batch:`, error);
      throw error;
    }
  }

  /**
   * 同步特定玩家的区块链奖励数据到数据库
   */
  async syncPlayerRewardsFromBlockchain(playerAddress: string): Promise<{
    updatedGames: RaceGame[];
    updatedCount: number;
  }> {
    try {
      this.logger.log(
        `Starting blockchain reward sync for player: ${playerAddress}`,
      );

      const normalizedAddress = playerAddress.toLowerCase();

      // 获取该玩家在数据库中的所有游戏记录
      const playerGames = await this.raceGameRepository.find({
        where: { playerAddress: normalizedAddress },
        order: { gameId: 'DESC' },
      });

      if (playerGames.length === 0) {
        this.logger.log(`No games found for player ${playerAddress}`);
        return { updatedGames: [], updatedCount: 0 };
      }

      this.logger.log(
        `Found ${playerGames.length} games for player ${playerAddress}, syncing rewards...`,
      );

      const updatedGames: RaceGame[] = [];

      for (const game of playerGames) {
        try {
          // 使用新的GameAggregator获取玩家完整奖励信息
          const playerCompleteRewards =
            await this.blockchainService.getPlayerCompleteRewards(
              game.gameId,
              playerAddress,
            );

          if (playerCompleteRewards) {
            // 解析PlayerCompleteRewards结构
            const {
              usdRewards,
              nclabRewards,
              usdClaimable,
              nclabClaimable,
              usdClaimed,
              nclabClaimed,
            } = playerCompleteRewards;

            const totalReward = Number(usdRewards) + Number(nclabRewards);
            const rewardAmount = (totalReward / 1e18).toString(); // 转换为以太币单位
            const hasClaimed = usdClaimed && nclabClaimed; // 全部领取才算领取
            const isWinner = totalReward > 0;

            // 检查是否需要更新
            const needsUpdate =
              game.rewardAmount !== rewardAmount ||
              game.hasClaimed !== hasClaimed ||
              game.isWinner !== isWinner;

            if (needsUpdate) {
              game.rewardAmount = rewardAmount;
              game.hasClaimed = hasClaimed;
              game.isWinner = isWinner;
              game.updatedAt = new Date();

              const savedGame = await this.raceGameRepository.save(game);
              updatedGames.push(savedGame);

              this.logger.log(
                `Updated game ${game.gameId} for player ${playerAddress}: reward=${rewardAmount}, claimed=${hasClaimed}`,
              );
            }
          }
        } catch (error) {
          this.logger.error(
            `Failed to sync rewards for game ${game.gameId}, player ${playerAddress}:`,
            error,
          );
          // 继续处理其他游戏，不因为单个游戏失败而停止整个同步过程
        }
      }

      this.logger.log(
        `Blockchain reward sync completed for player ${playerAddress}: ${updatedGames.length} games updated`,
      );

      return {
        updatedGames,
        updatedCount: updatedGames.length,
      };
    } catch (error) {
      this.logger.error(
        `Failed to sync player rewards from blockchain for ${playerAddress}:`,
        error,
      );
      throw error;
    }
  }
}
