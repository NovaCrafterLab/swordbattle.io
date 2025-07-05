// api/src/clans/clans.controller.ts
// ++ add list & members routes

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountGuard, AccountRequest } from 'src/auth/guards/account.guard';
import { ClansService } from './clans.service';
import { CreateClanDto, ListClansQueryDto, UpdateClanDto } from './clans.dto';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) { }

  /* == list with pagination & search == */
  @Get()
  async list(@Query() query: ListClansQueryDto) {
    return this.clansService.findMany(query);
  }

  /* == members of a clan == */
  @Get(':tag/members')
  async members(@Param('tag') tag: string) {
    return this.clansService.findMembers(tag.toUpperCase());
  }

  /* == create == */
  @Post() @UseGuards(AccountGuard) async create(
    @Body() dto: CreateClanDto,
    @Req() req: AccountRequest,
  ) {
    const clan = await this.clansService.create(dto, req.account);
    return { success: true, clan };
  }

  /* == join == */
  @Post('join/:tag') @UseGuards(AccountGuard) async join(
    @Param('tag') tag: string,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.join(req.account, tag);
  }

  /* == leave == */
  @Post('leave') @UseGuards(AccountGuard) async leave(@Req() req: AccountRequest) {
    return this.clansService.leave(req.account);
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

  /* == update clan (owner) == */
  @Patch(':tag') @UseGuards(AccountGuard) async update(
    @Param('tag') tag: string,
    @Body() dto: UpdateClanDto,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.updateClan(tag.toUpperCase(), dto, req.account);
  }

  /* == transfer ownership == */
  @Post(':tag/transfer/:accountId') @UseGuards(AccountGuard) async transfer(
    @Param('tag') tag: string,
    @Param('accountId') accountId: number,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.transferOwner(tag.toUpperCase(), req.account, accountId);
  }

  /* == kick (owner / admin) == */
  @Post(':tag/kick/:accountId') @UseGuards(AccountGuard) async kick(
    @Param('tag') tag: string,
    @Param('accountId') accountId: number,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.kickMember(tag.toUpperCase(), req.account, accountId);
  }

  /* == promote (owner) == */
  @Post(':tag/promote/:accountId') @UseGuards(AccountGuard) async promote(
    @Param('tag') tag: string,
    @Param('accountId') accountId: number,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.toggleAdmin(tag.toUpperCase(), req.account, accountId);
  }

  /* == add member (owner/admin) == */
  @Post(':tag/add/:accountId') @UseGuards(AccountGuard) async addMember(
    @Param('tag') tag: string,
    @Param('accountId') accountId: number,
    @Req() req: AccountRequest,
  ) {
    return this.clansService.addMember(tag.toUpperCase(), req.account, accountId);
  }
}
