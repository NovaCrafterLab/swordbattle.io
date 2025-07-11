import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEthereumAddress,
} from 'class-validator';

export class SaveRaceGameDTO {
  @IsNumber()
  gameId: number;

  @IsEthereumAddress()
  playerAddress: string;

  @IsNumber()
  score: number;

  @IsString()
  rewardAmount: string;

  @IsBoolean()
  @IsOptional()
  hasClaimed?: boolean;

  @IsNumber()
  @IsOptional()
  rank?: number;

  @IsBoolean()
  @IsOptional()
  isWinner?: boolean;

  @IsBoolean()
  @IsOptional()
  gameEnded?: boolean;

  @IsOptional()
  gameEndedAt?: Date;
}

export class UpdateRaceGameDTO {
  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  rewardAmount?: string;

  @IsOptional()
  @IsBoolean()
  hasClaimed?: boolean;

  @IsOptional()
  @IsNumber()
  rank?: number;

  @IsOptional()
  @IsBoolean()
  isWinner?: boolean;

  @IsOptional()
  @IsBoolean()
  gameEnded?: boolean;

  @IsOptional()
  gameEndedAt?: Date;
}

export class GetPlayerHistoryDTO {
  @IsOptional()
  @IsNumber()
  limit?: number = 50;

  @IsOptional()
  @IsNumber()
  offset?: number = 0;
}
