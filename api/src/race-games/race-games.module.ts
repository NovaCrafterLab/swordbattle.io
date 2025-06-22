import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceGame } from './race-games.entity';
import { RaceGamesService } from './race-games.service';
import { RaceGamesController } from './race-games.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RaceGame]),
    BlockchainModule,
  ],
  controllers: [RaceGamesController],
  providers: [RaceGamesService],
  exports: [RaceGamesService],
})
export class RaceGamesModule {} 