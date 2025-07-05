// client/src/ui/clans/ClanDetail.tsx
// swiched to module scss + sb-clans-cd-* / sb-clans-cm-* class names

import React, { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAccount } from '@/redux/account/selector'
import {
  useClanDetail,
  useClanMembers,
  useKickMember,
  useToggleAdmin,
  useTransferOwner,
  useUpdateClan,
  useAddMember,
} from './api'
import MemberRow from './MemberRow'
import { ClanRole } from './types'
import styles from './ClanDetail.module.scss'            // <— changed

type TabKey = 'overview' | 'members' | 'settings'

const ClanDetail: React.FC = () => {
  const { tag = '' } = useParams<{ tag: string }>()
  const [tab, setTab] = useState<TabKey>('overview')

  /* data */
  const { data: detail, isPending: loadingDetail } = useClanDetail(tag)
  const { data: memberData, isPending: loadingMembers } = useClanMembers(tag)

  /* mutations */
  const kick = useKickMember(tag)
  const toggleAdmin = useToggleAdmin(tag)
  const transfer = useTransferOwner(tag)
  const updateClan = useUpdateClan(tag)
  const addMember = useAddMember(tag)

  /* viewer role */
  const account = useSelector(selectAccount)
  const selfRole: ClanRole | null = useMemo(() => {
    if (detail && detail.owner_id === account.id) return 'owner'
    const row = memberData?.members.find((m) => m.id === account.id)
    return row?.clan_role ?? null
  }, [detail, memberData, account.id])

  /* invite */
  const [inviteId, setInviteId] = useState('')

  /* render blocks */
  const renderOverview = () => {
    if (loadingDetail) return <p>Loading…</p>
    if (!detail) return <p>Clan not found</p>
    return (
      <div className={styles['sb-clans-cd-card']}>
        <h2>
          {detail.name} <span className={styles['sb-clans-cd-tag']}>[{detail.tag}]</span>
        </h2>
        <p>{detail.description || 'No description.'}</p>
        <p>Members: {detail.members}</p>
        <p>Elo: {detail.elo}</p>
        <p>Public: {detail.is_public ? 'Yes' : 'No'}</p>
      </div>
    )
  }

  const renderMembers = () => {
    if (loadingMembers) return <p>Loading…</p>
    if (!memberData) return <p>No data</p>

    if (memberData.members.length === 0) {
      return (
        <p className={styles['sb-clans-cd-empty']}>
          No members yet. Invite some friends!
        </p>
      )
    }

    return (
      <div>
        {/* invite form for private clans */}
        {detail && !detail.is_public && selfRole && (
          <div className={styles['sb-clans-cd-invite']}>
            <input
              className={styles['sb-clans-cd-input']}
              type="number"
              placeholder="User ID to invite"
              value={inviteId}
              onChange={(e) => setInviteId(e.target.value)}
            />
            <button
              className={styles['sb-clans-cd-btn']}
              onClick={() =>
                addMember.mutate(Number(inviteId), {
                  onSuccess: () => setInviteId(''),
                })
              }
              disabled={!inviteId || addMember.isPending}
            >
              {addMember.isPending ? 'Inviting…' : 'Invite'}
            </button>
          </div>
        )}


        {/* member rows */}
        <div className={styles['sb-clans-cd-list']}>
          {memberData.members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              selfRole={selfRole}
              isSelf={m.id === account.id}
              onKick={kick.mutate}
              onToggleAdmin={toggleAdmin.mutate}
              onTransferOwner={transfer.mutate}
            />
          ))}
        </div>
      </div>
    )
  }

  /* settings form */
  const [form, setForm] = useState({
    name: '',
    description: '',
    is_public: false,
    color: '#ffffff',
  })

  useEffect(() => {
    if (detail) {
      setForm({
        name: detail.name,
        description: detail.description,
        is_public: detail.is_public,
        color: detail.color,
      })
    }
  }, [detail])

  const renderSettings = () => {
    if (selfRole !== 'owner') return <p>Owner only.</p>
    if (!detail) return null
    return (
      <form
        className={styles['sb-clans-cd-form']}
        onSubmit={(e) => {
          e.preventDefault()
          updateClan.mutate(form)
        }}
      >
        <label className={styles['sb-clans-cd-label']}>
          Name
          <input
            className={styles['sb-clans-cd-input']}
            type="text"
            maxLength={64}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className={styles['sb-clans-cd-label']}>
          Description
          <textarea
            className={styles['sb-clans-cd-input']}
            maxLength={256}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </label>

        <label className={styles['sb-clans-cd-inline']}>
          <input
            type="checkbox"
            checked={form.is_public}
            onChange={(e) =>
              setForm({ ...form, is_public: e.target.checked })
            }
          />
          Public clan (anyone can join)
        </label>

        <label className={styles['sb-clans-cd-label']}>
          Color
          <input
            className={styles['sb-clans-cd-input']}
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </label>

        <button
          className={styles['sb-clans-cd-btn']}
          type="submit"
          disabled={updateClan.isPending}
        >
          {updateClan.isPending ? 'Saving…' : 'Save'}
        </button>
      </form>
    )
  }

  return (
    <main className={styles['sb-clans-cd-page']}>
      {/* tab bar */}
      <div className={styles['sb-clans-cd-tabs']}>
        {(['overview', 'members', 'settings'] as TabKey[]).map((k) => (
          <div
            key={k}
            className={`${styles['sb-clans-cd-tab']} ${tab === k ? styles['active'] : ''
              }`}
            onClick={() => setTab(k)}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </div>
        ))}
      </div>

      {/* body */}
      <section className={styles['sb-clans-cd-section']}>
        {tab === 'overview' && renderOverview()}
        {tab === 'members' && renderMembers()}
        {tab === 'settings' && renderSettings()}
      </section>
    </main>
  )
}

export default ClanDetail
