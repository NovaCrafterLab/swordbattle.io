import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'race_games' })
@Index(['playerAddress', 'gameId'], { unique: true }) // 防重复
@Index(['playerAddress', 'createdAt']) // 查询优化
export class RaceGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'game_id' })
  gameId: number;

  @Column({ name: 'player_address', length: 50, nullable: true })
  playerAddress: string;

  @Column({ default: 0 })
  score: number;

  @Column({
    name: 'reward_amount',
    type: 'decimal',
    precision: 36,
    scale: 18,
    default: '0',
  })
  rewardAmount: string; // 存储为字符串以保持精度

  @Column({ name: 'has_claimed', default: false })
  hasClaimed: boolean;

  @Column({ default: 0 })
  rank: number;

  @Column({ name: 'is_winner', default: false })
  isWinner: boolean;

  @Column({ name: 'game_ended', default: false })
  gameEnded: boolean;

  @Column({ name: 'game_ended_at', type: 'timestamp', nullable: true })
  gameEndedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
