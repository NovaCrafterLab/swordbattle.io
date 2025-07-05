// client/src/ui/page/ClanPage.tsx
// clan-api playground ‒ add / kick / promote / transfer / patch

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/api';
import { setClanTag } from '@/redux/account/slice';

export default function ClanPage() {
  const dispatch = useDispatch();
  const secret = useSelector((s: any) => s.account.secret); // unused but kept

  /* ui state */
  const [tag, setTag] = useState('');
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState('');
  const [log, setLog] = useState<string[]>([]);

  /* helper */
  const logResp = (label: string, data: any) =>
    setLog((old) => [`${label}: ${JSON.stringify(data)}`, ...old]);

  /* -------- 基础 -------- */
  const create = () => api.post(`${api.endpoint}/clans`, { tag, name: tag }, logResp.bind(null, 'create'));
  const join = () => api.post(`${api.endpoint}/clans/join/${tag}`, {}, d => { if (d.success) dispatch(setClanTag(tag)); logResp('join', d); });
  const leave = () => api.post(`${api.endpoint}/clans/leave`, {}, d => { if (d.success) dispatch(setClanTag('')); logResp('leave', d); });
  const info = () => api.get(`${api.endpoint}/clans/info/${tag}`, logResp.bind(null, 'info'));
  const list = () => api.get(`${api.endpoint}/clans?page=1&size=10&q=${encodeURIComponent(query)}`, logResp.bind(null, 'list'));
  const members = () => api.get(`${api.endpoint}/clans/${tag}/members`, logResp.bind(null, 'members'));

  /* -------- 管理 -------- */
  const patch = () => api.patch(`${api.endpoint}/clans/${tag}`, { description: 'edited via tester', is_public: false }, logResp.bind(null, 'patch'));
  const transfer = () => api.post(`${api.endpoint}/clans/${tag}/transfer/${target}`, {}, logResp.bind(null, 'transfer'));
  const kick = () => api.post(`${api.endpoint}/clans/${tag}/kick/${target}`, {}, logResp.bind(null, 'kick'));
  const promote = () => api.post(`${api.endpoint}/clans/${tag}/promote/${target}`, {}, logResp.bind(null, 'promote'));
  const add = () => api.post(`${api.endpoint}/clans/${tag}/add/${target}`, {}, logResp.bind(null, 'add'));

  return (
    <div style={{ padding: 20 }}>
      <h3>Clan API Tester</h3>

      {/* core */}
      <div>
        <input value={tag} onChange={e => setTag(e.target.value.toUpperCase())} placeholder="TAG" maxLength={6} />
        <button onClick={create}>create</button>
        <button onClick={join}>join</button>
        <button onClick={leave}>leave</button>
        <button onClick={info}>info</button>
        <button onClick={members}>members</button>
      </div>

      {/* list */}
      <div style={{ marginTop: 10 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="search" />
        <button onClick={list}>list</button>
      </div>

      {/* management */}
      <div style={{ marginTop: 10 }}>
        <button onClick={patch}>patch-desc</button>&nbsp;
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="target id" style={{ width: 80 }} />
        <button onClick={transfer}>transfer</button>
        <button onClick={kick}>kick</button>
        <button onClick={promote}>promote</button>
        <button onClick={add}>add</button>
      </div>

      <pre style={{ marginTop: 20 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </pre>
    </div>
  );
}
