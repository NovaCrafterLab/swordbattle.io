// api/src/clans/clans.controller.ts
// REST routes for Clan operations

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountGuard, AccountRequest } from 'src/auth/guards/account.guard';
import { ClansService } from './clans.service';
import { CreateClanDto } from './clans.dto';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) { }

  /* == create == */
  @Post()
  @UseGuards(AccountGuard)
  async create(@Body() dto: CreateClanDto, @Req() req: AccountRequest) {
    const clan = await this.clansService.create(dto, req.account);
    return { success: true, clan };
  }

  /* == join == */
  @Post('join/:tag')
  @UseGuards(AccountGuard)
  async join(@Param('tag') tag: string, @Req() req: AccountRequest) {
    const res = await this.clansService.join(req.account, tag);
    return res;
  }

  /* == leave == */
  @Post('leave')
  @UseGuards(AccountGuard)
  async leave(@Req() req: AccountRequest) {
    const res = await this.clansService.leave(req.account);
    return res;
  }

  /* == detail == */
  @Get('info/:key')
  async getOne(@Param('key') key: string) {
    const clan = /^\d+$/.test(key)
      ? await this.clansService.findById(Number(key))
      : await this.clansService.findByTag(key.toUpperCase());
    if (!clan) return { error: 'Clan not found' };
    return clan;
  }
}
