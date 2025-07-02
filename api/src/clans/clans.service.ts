// api/src/clans/clans.service.ts
import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clan } from './clan.entity';
import { Account } from 'src/accounts/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { CLAN_SKIN_MAP } from './clan-skins.map';
import { validateTag } from './validateTag';

@Injectable()
export class ClansService {
  constructor(
    @InjectRepository(Clan) private clanRepo: Repository<Clan>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
  ) { }

  /* == create new clan == */
  async create(data: Partial<Clan>, owner: Account) {
    const err = validateTag(data.tag);
    if (err) throw new BadRequestException(err);

    const exists = await this.clanRepo.findOne({ where: { tag: data.tag } });
    if (exists) throw new BadRequestException('Tag taken');

    const clan = this.clanRepo.create({
      ...data,
      tag: data.tag.toUpperCase(),
      owner,
    });
    return this.clanRepo.save(clan);
  }

  /* == helper: find or create by tag == */
  async findOrCreateByTag(tag: string, owner?: Account) {
    const up = tag.toUpperCase();
    let clan = await this.clanRepo.findOne({ where: { tag: up } });
    if (!clan) clan = await this.create({ tag: up, name: up }, owner);
    return clan;
  }

  /* == join clan == */
  async join(account: Account, tag: string) {
    const clan = await this.findOrCreateByTag(tag, account);

    /* sync old string for legacy client */
    account.clan_tag = clan.tag;
    account.clan = clan;

    /* grant clan skin */
    const skinIds = CLAN_SKIN_MAP[clan.tag] ?? [];
    if (skinIds.length) {
      const { owned, equipped } = account.skins;
      skinIds.forEach((id) => {
        if (!owned.includes(id)) owned.push(id);
      });
      /* TODO: auto equipped：if (skinIds.length && !equipped) equipped = skinIds[0]; */
      account.skins = { owned, equipped };
    }

    await this.accountRepo.save(account);
    return { success: true };
  }

  /* == leave clan == */
  async leave(account: Account) {
    account.clan = null;
    account.clan_tag = '';
    await this.accountRepo.save(account);
    return { success: true };
  }

  /* == get clan by id == */
  async findById(id: number) {
    return this.clanRepo.findOne({ where: { id } });
  }

  /* == get clan by tag == */
  async findByTag(tag: string) {
    return this.clanRepo.findOne({ where: { tag } });
  }
}
