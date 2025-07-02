// api/src/clans/clan.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Account } from 'src/accounts/account.entity';
import { config } from 'src/config';

@Entity({ name: 'clans' })
@Unique(['tag'])
export class Clan {
  /* == auto fields == */
  @PrimaryGeneratedColumn()
  id: number;       // PK

  @CreateDateColumn()
  created_at: Date; // create time

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: Account;   // clan owner

  /* == client input == */
  @Column({ length: config.clanLength[1] })
  tag: string;          // short tag

  @Column({ length: 64 })
  name: string;         // full name

  @Column({ default: '#ffffff' })
  color: string;        // main color

  @Column({ default: '' })
  badge_file: string;   // badge img

  @Column({ type: 'text', default: '' })
  description: string;  // intro

  @Column({ default: true })
  is_public: boolean;   // open join?

  /* == server managed == */
  @Column({ default: 1000 })
  elo: number;          // rating

  @Column({ default: 0 })
  points: number;       // quest pts

  @Column({ default: 50 })
  members_cap: number;  // member max

  @UpdateDateColumn({ nullable: true })
  last_activity: Date;  // last play

  /* == relations == */
  @OneToMany(() => Account, (account) => account.clan)
  members: Account[];
}
