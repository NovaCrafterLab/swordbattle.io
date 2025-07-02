// api/src/clans/clans.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clan } from './clan.entity';
import { Account } from '../accounts/account.entity';
import { ClansService } from './clans.service';
import { ClansController } from './clans.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clan, Account]),
    forwardRef(() => AccountsModule),
    forwardRef(() => AuthModule),
  ],
  providers: [ClansService],
  controllers: [ClansController],
  exports: [ClansService],
})
export class ClansModule {}
