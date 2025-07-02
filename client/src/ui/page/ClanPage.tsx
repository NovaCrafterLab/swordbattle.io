// client/src/ui/page/ClanPage.tsx
// simple page to test clan api
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/api';
import { setClantag, setAccount } from '@/redux/account/slice';

export default function ClanPage() {
  const dispatch = useDispatch();
  const secret = useSelector((s: any) => s.account.secret);
  const [tag, setTag] = useState('');
  const [log, setLog] = useState<string[]>([]);

  /* helper */
  const logResp = (label: string, data: any) =>
    setLog((l) => [`${label}: ${JSON.stringify(data)}`, ...l]);

  const create = () =>
    api.post(
      `${api.endpoint}/clans`,
      { tag, name: tag },
      (d: any) => logResp('create', d),
      secret,
    );

  const join = () =>
    api.post(
      `${api.endpoint}/clans/join/${tag}`,
      {},
      (d: any) => {
        if (d.success) dispatch(setClantag(tag));
        logResp('join', d);
      },
      secret,
    );

  const leave = () =>
    api.post(
      `${api.endpoint}/clans/leave`,
      {},
      (d: any) => {
        if (d.success) dispatch(setClantag(''));
        logResp('leave', d);
      },
      secret,
    );

  const info = () =>
    api.get(`${api.endpoint}/clans/info/${tag}`, (d: any) =>
      logResp('info', d),
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Clan API Tester</h2>
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value.toUpperCase())}
        placeholder="TAG"
        maxLength={6}
      />
      <div>
        <button onClick={create}>create</button>
        <button onClick={join}>join</button>
        <button onClick={leave}>leave</button>
        <button onClick={info}>info</button>
      </div>
      <pre>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </pre>
    </div>
  );
}
