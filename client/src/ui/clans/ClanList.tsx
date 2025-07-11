// client/src/ui/clans/ClanList.tsx
// switched to module scss + sb-clans-cl-* class names

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useClans, useJoinClan, useLeaveClan } from './api';
import ClanCreate from './ClanCreate';
import { setClanTag } from '@/redux/account/slice';
import { selectAccount } from '@/redux/account/selector';
import { useToast } from '@/ui/components/Toast';
import styles from './ClanList.module.scss'; // <— changed

const PAGE_SIZE = 20;

const ClanList: React.FC = () => {
  /* local ui state */
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  /* global state */
  const { clan_tag } = useSelector(selectAccount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* data fetch */
  const { data, isPending, refetch } = useClans(page, q);
  const { addToast } = useToast();

  /* mutations */
  const { mutate: joinClan, isPending: joining } = useJoinClan();
  const { mutate: leaveClan, isPending: leaving } = useLeaveClan();

  /* handlers */
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const onCreated = (tag: string) => navigate(`/clans/${tag}`);

  const handleJoin = (tag: string) => {
    joinClan(tag, {
      onSuccess: () => {
        dispatch(setClanTag(tag));
        addToast('success', `Joined ${tag}`);
      },
      onError: (e: any) => addToast('error', e?.message || 'Join failed'),
    });
  };

  const handleLeave = () => {
    leaveClan(undefined, {
      onSuccess: () => {
        dispatch(setClanTag(''));
        addToast('success', 'Left clan');
      },
      onError: (e: any) => addToast('error', e?.message || 'Leave failed'),
    });
  };

  /* render rows */
  const renderRows = () => {
    if (isPending) return <p>Loading…</p>;
    if (!data?.data?.length) return <p>No clans found</p>;

    return data.data.map((c) => (
      <div key={c.id} className={styles['sb-clans-cl-item']}>
        <div
          className={styles['sb-clans-cl-main']}
          onClick={() => navigate(`/clans/${c.tag}`)}
          role="button"
        >
          <span className={styles['sb-clans-cl-name']}>{c.name}</span>
          <span className={styles['sb-clans-cl-tag']}>[{c.tag}]</span>
          <span className={styles['sb-clans-cl-meta']}>
            {c.members} members • Elo {c.elo}
          </span>
        </div>

        {clan_tag !== c.tag && (
          <button
            className={styles['sb-clans-cl-btn']}
            disabled={joining || leaving}
            onClick={() => handleJoin(c.tag)}
          >
            Join
          </button>
        )}
      </div>
    ));
  };

  return (
    <main className={styles['sb-clans-cl-page']}>
      {/* toolbar */}
      <div className={styles['sb-clans-cl-toolbar']}>
        <form onSubmit={onSearch} className={styles['sb-clans-cl-search']}>
          <input
            className={styles['sb-clans-cl-input']}
            type="text"
            placeholder="Search clans…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className={styles['sb-clans-cl-btn']} type="submit">
            Search
          </button>
        </form>

        <div className={styles['sb-clans-cl-actions']}>
          {clan_tag && (
            <button
              className={`${styles['sb-clans-cl-btn']} ${styles['sb-clans-cl-leave']}`}
              disabled={leaving || joining}
              onClick={handleLeave}
            >
              Leave [{clan_tag}]
            </button>
          )}
          <button
            className={styles['sb-clans-cl-btn']}
            onClick={() => setShowCreate(true)}
          >
            Create Clan
          </button>
        </div>
      </div>

      {/* list */}
      <div className={styles['sb-clans-cl-rows']}>{renderRows()}</div>

      {/* pagination */}
      {data && data.total > PAGE_SIZE && (
        <div className={styles['sb-clans-cl-pages']}>
          <button
            className={styles['sb-clans-cl-btn']}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>
          <span>
            {page} / {Math.ceil(data.total / PAGE_SIZE)}
          </span>
          <button
            className={styles['sb-clans-cl-btn']}
            onClick={() =>
              setPage((p) =>
                p < Math.ceil(data.total / PAGE_SIZE) ? p + 1 : p,
              )
            }
            disabled={page >= Math.ceil(data.total / PAGE_SIZE)}
          >
            Next ›
          </button>
        </div>
      )}

      {/* modal */}
      <ClanCreate
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={onCreated}
      />
    </main>
  );
};

export default ClanList;
