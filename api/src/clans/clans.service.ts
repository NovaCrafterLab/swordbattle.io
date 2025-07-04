// api/src/clans/clans.service.ts
import { Injectable, BadRequestException, forwardRef, Inject, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clan } from './clan.entity';
import { Account } from 'src/accounts/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { CLAN_SKIN_MAP } from './clan-skins.map';
import { validateTag } from './validateTag';
import { UpdateClanDto } from './clans.dto';

@Injectable()
export class ClansService {
  constructor(
    @InjectRepository(Clan) private clanRepo: Repository<Clan>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
  ) { }

  /* ---------- skin helpers ---------- */

  /** give clan-bound skins if not owned */
  private grantSkins(acc: Account, tag: string) {
    const skins = CLAN_SKIN_MAP[tag] ?? [];
    if (!skins.length) return;
    skins.forEach((id) => {
      if (!acc.skins.owned.includes(id)) acc.skins.owned.push(id);
    });
  }

  /** remove clan-bound skins and unequip if needed */
  private revokeSkins(acc: Account, tag: string) {
    const skins = CLAN_SKIN_MAP[tag] ?? [];
    if (!skins.length) return;
    acc.skins.owned = acc.skins.owned.filter((id) => !skins.includes(id));
    if (skins.includes(acc.skins.equipped)) acc.skins.equipped = 1;
  }

  /* == create new clan == */
  async create(data: Partial<Clan>, owner: Account) {
    const err = validateTag(data.tag);
    if (err) throw new BadRequestException(err);

    if (await this.clanRepo.exist({ where: { tag: data.tag } }))
      throw new BadRequestException('Tag taken');

    const clan = this.clanRepo.create({
      ...data,
      tag: data.tag.toUpperCase(),
      owner,
    });
    const saved = await this.clanRepo.save(clan);

    owner.clan = saved;
    owner.clan_tag = saved.tag;
    owner.clan_role = 'owner';
    await this.accountRepo.save(owner);

    return this.clanRepo.findOne({ where: { id: saved.id }, relations: ['owner'] });
  }

  /* == @deprecated helper: find or create by tag == */
  async findOrCreateByTag(tag: string, owner?: Account) {
    const up = tag.toUpperCase();
    let clan = await this.clanRepo.findOne({ where: { tag: up } });
    if (!clan) clan = await this.create({ tag: up, name: up }, owner);
    return clan;
  }

  /* == join clan == */
  async join(acc: Account, rawTag: string) {
    const tag = rawTag.toUpperCase();
    const clan = await this.clanRepo.findOne({ where: { tag } });
    if (!clan) return { error: 'Clan not found' };
    if (!clan.is_public) return { error: 'Clan is private' };

    acc.clan = clan;
    acc.clan_tag = clan.tag;
    acc.clan_role = 'member';
    this.grantSkins(acc, clan.tag);

    await this.accountRepo.save(acc);
    return { success: true };
  }

  /* == leave clan == */
  async leave(acc: Account) {
    if (acc.clan_role === 'owner')
      throw new ForbiddenException('Transfer owner before leaving');

    this.revokeSkins(acc, acc.clan_tag);
    acc.clan = null;
    acc.clan_tag = '';
    acc.clan_role = 'member';
    await this.accountRepo.save(acc);

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

  /* == list clans with pagination & search == */
  async findMany(opts: { page?: number; size?: number; q?: string }) {
    const page = Math.max(1, opts.page || 1);
    const size = Math.min(Math.max(1, opts.size || 20), 50);
    const skip = (page - 1) * size;

    const qb = this.clanRepo
      .createQueryBuilder('clan')
      .leftJoin('accounts', 'acc', 'acc.clan_id = clan.id')
      .select([
        'clan.id   AS id',
        'clan.tag  AS tag',
        'clan.name AS name',
        'clan.color AS color',
        'clan.elo  AS elo',
        'COUNT(acc.id) AS members',
      ])
      .groupBy('clan.id');

    if (opts.q) {
      qb.andWhere('(clan.tag ILIKE :q OR clan.name ILIKE :q)', {
        q: `%${opts.q}%`,
      });
    }

    const total = await qb.getCount(); // total rows before pagination
    const data = await qb.orderBy('clan.elo', 'DESC').skip(skip).take(size).getRawMany();

    return { data, total, page, size };
  }

  /* == list members of a clan == */
  async findMembers(tag: string) {
    const clan = await this.findByTag(tag.toUpperCase());
    if (!clan) return { error: 'Clan not found' };

    const members = await this.accountRepo.find({
      where: { clan: { id: clan.id } },
      select: { id: true, username: true, clan_role: true },
      order: { clan_role: 'ASC', id: 'ASC' }, // owner first
    });

    return { clan: { tag: clan.tag, name: clan.name }, members };
  }

  /* -- manual invite for private clans (owner / admin) -- */
  async addMember(tag: string, actor: Account, targetId: number) {
    if (!actor.clan) {
      actor = await this.accountRepo.findOne({
        where: { id: actor.id },
        relations: ['clan'],
      });
    }

    const clan = await this.clanRepo.findOne({ where: { tag } });
    if (!clan) throw new BadRequestException('Clan not found');
    if (clan.is_public) throw new BadRequestException('Clan is already public');
    if (!actor.clan || actor.clan.id !== clan.id)
      throw new ForbiddenException('Not in clan');
    if (actor.clan_role === 'member')
      throw new ForbiddenException('No permission');

    const target = await this.accountRepo.findOne({
      where: { id: targetId },
      relations: ['clan'],
    });

    if (!target || target.clan || target.clan_tag)
      throw new BadRequestException('Target already in clan');

    target.clan = clan;
    target.clan_tag = clan.tag;
    target.clan_role = 'member';
    this.grantSkins(target, clan.tag);

    await this.accountRepo.save(target);
    return { success: true };
  }

  /* == update clan (owner only) == */
  async updateClan(tag: string, dto: UpdateClanDto, owner: Account) {
    const clan = await this.clanRepo.findOne({
      where: { tag },
      relations: ['owner'],
    });
    if (!clan) throw new BadRequestException('Clan not found');
    if (clan.owner.id !== owner.id)
      throw new ForbiddenException('Not clan owner');

    Object.assign(clan, dto);
    return this.clanRepo.save(clan);
  }

  /* == transfer ownership == */
  async transferOwner(tag: string, from: Account, toId: number) {
    const clan = await this.clanRepo.findOne({
      where: { tag },
      relations: ['owner'],
    });
    if (!clan) throw new BadRequestException('Clan not found');
    if (clan.owner.id !== from.id)
      throw new ForbiddenException('Not clan owner');

    const target = await this.accountRepo.findOne({
      where: { id: toId, clan: { id: clan.id } },
    });
    if (!target) throw new BadRequestException('Target not in clan');

    from.clan_role = 'member';
    target.clan_role = 'owner';
    clan.owner = target;

    await this.accountRepo.save([from, target]);
    await this.clanRepo.save(clan);
    return { success: true };
  }

  /* == kick member == */
  async kickMember(tag: string, actor: Account, targetId: number) {
    if (!actor.clan)
      actor = await this.accountRepo.findOne({
        where: { id: actor.id },
        relations: ['clan'],
      });

    const clan = await this.clanRepo.findOne({ where: { tag } });
    if (!clan) throw new BadRequestException('Clan not found');
    if (!actor.clan || actor.clan.id !== clan.id)
      throw new ForbiddenException('Not in clan');

    const target = await this.accountRepo.findOne({
      where: { id: targetId, clan: { id: clan.id } },
    });
    if (!target) throw new BadRequestException('Target not in clan');
    if (actor.id === target.id) throw new BadRequestException('Cannot kick self');

    if (actor.clan_role === 'member')
      throw new ForbiddenException('No permission');
    if (actor.clan_role === 'admin' && target.clan_role !== 'member')
      throw new ForbiddenException('Admins can only kick members');

    this.revokeSkins(target, clan.tag);
    target.clan = null;
    target.clan_tag = '';
    target.clan_role = 'member';
    await this.accountRepo.save(target);

    return { success: true };
  }

  /* == promote / demote admin == */
  async toggleAdmin(tag: string, actor: Account, targetId: number) {
    const clan = await this.clanRepo.findOne({ where: { tag }, relations: ['owner'] });
    if (!clan) throw new BadRequestException('Clan not found');
    if (clan.owner.id !== actor.id)
      throw new ForbiddenException('Not clan owner');

    const target = await this.accountRepo.findOne({
      where: { id: targetId, clan: { id: clan.id } },
    });
    if (!target) throw new BadRequestException('Target not in clan');
    if (target.id === actor.id)
      throw new BadRequestException('Cannot change self');

    target.clan_role = target.clan_role === 'admin' ? 'member' : 'admin';
    await this.accountRepo.save(target);
    return { success: true, role: target.clan_role };
  }
}
