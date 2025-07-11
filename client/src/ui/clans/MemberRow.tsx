// client/src/ui/clans/MemberRow.tsx
// switched to module scss + sb-clans-cm-* class names

import React from 'react';
import { ClanMember, ClanRole } from './types';
import styles from './MemberRow.module.scss'; // ← new import

interface Props {
  member: ClanMember;
  selfRole: ClanRole | null;
  isSelf: boolean;
  onKick: (id: number) => void;
  onToggleAdmin: (id: number) => void;
  onTransferOwner: (id: number) => void;
}

const roleLabel: Record<ClanRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

const MemberRow: React.FC<Props> = ({
  member,
  selfRole,
  isSelf,
  onKick,
  onToggleAdmin,
  onTransferOwner,
}) => {
  /* permission helpers */
  const canKick =
    (selfRole === 'owner' && !isSelf) ||
    (selfRole === 'admin' && member.clan_role === 'member');
  const canToggleAdmin =
    selfRole === 'owner' && member.clan_role !== 'owner' && !isSelf;
  const canTransfer =
    selfRole === 'owner' && member.clan_role !== 'owner' && !isSelf;

  /* render */
  return (
    <div className={styles['sb-clans-cm-row']}>
      <span className={styles['sb-clans-cm-name']}>{member.username}</span>
      <span className={styles['sb-clans-cm-role']}>
        {roleLabel[member.clan_role]}
      </span>

      {/* action buttons */}
      {canTransfer && (
        <button
          className={styles['sb-clans-cm-btn']}
          onClick={() => onTransferOwner(member.id)}
          title="Transfer ownership"
        >
          Transfer
        </button>
      )}

      {canToggleAdmin && (
        <button
          className={styles['sb-clans-cm-btn']}
          onClick={() => onToggleAdmin(member.id)}
          title={member.clan_role === 'admin' ? 'Remove admin' : 'Make admin'}
        >
          {member.clan_role === 'admin' ? 'Demote' : 'Promote'}
        </button>
      )}

      {canKick && (
        <button
          className={styles['sb-clans-cm-btn']}
          onClick={() => onKick(member.id)}
          title="Kick from clan"
        >
          Kick
        </button>
      )}
    </div>
  );
};

export default MemberRow;
