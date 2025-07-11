// client/src/ui/clans/types.ts
// Clan domain models (Phase 2 ready)

export type ClanRole = 'owner' | 'admin' | 'member';

export interface ClanBrief {
  id: number;
  tag: string;
  name: string;
  color: string;
  elo: number;
  members: number;
}

export interface ClanMember {
  id: number;
  username: string;
  clan_role: ClanRole;
}

export interface ClanDetail extends ClanBrief {
  description: string;
  is_public: boolean;
  badge_file: string;
  owner_id: number;
  members_cap: number;
  points: number;
}
