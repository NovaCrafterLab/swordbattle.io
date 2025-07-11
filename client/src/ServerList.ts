// client/src/ServerList.ts

import { Settings } from './game/Settings';
import { config } from './config';
import logger from '@/utils/logger';

/* ──────────────────────────────────────────────────────────── *
 * types & constants                                            *
 * ──────────────────────────────────────────────────────────── */
export interface Server {
  value: string;
  name: string;
  address: string;
  ping: number;
  offline?: boolean;
  playerCnt?: number;
  realPlayersCnt?: number;
}

const servers: Server[] = [
  { value: 'test', name: 'TEST', address: config.serverTest, ping: 0 },
  { value: 'race', name: 'Race', address: config.serverRace, ping: 0 },
  // { value: 'eu', name: 'Europe', address: config.serverEU, ping: 0 },
  // { value: 'us', name: 'USA', address: config.serverUS, ping: 0 },
  // { value: 'usbackup', name: 'USA Unblocked', address: config.serverUSBackup, ping: 0 },
];

let currentServer: Server | null = null;

if (config.isDev) {
  servers.unshift({
    value: 'dev',
    name: 'Development',
    address: config.serverDev,
    ping: 0,
  });
}

if (config.isDev) {
  servers.unshift({
    value: 'rac(test)',
    name: 'Race(test)',
    address: config.serverDev,
    ping: 0,
  });
}

/* cache controls */
let lastPingUpdate = 0;
let isUpdating = false;

/* ──────────────────────────────────────────────────────────── *
 * ping helpers                                                *
 * ──────────────────────────────────────────────────────────── */
export async function updatePing(): Promise<Server[]> {
  const cache: Record<string, Server> = {};

  /* avoid parallel execution */
  while (isUpdating) await new Promise((r) => setTimeout(r, 10));

  /* fresh enough */
  if (Date.now() - lastPingUpdate < 60_000) return servers;

  isUpdating = true;
  lastPingUpdate = Date.now();

  try {
    await Promise.all(
      servers.map(async (s) => {
        const start = Date.now();

        if (!s.address || (!config.isDev && s.address.includes('localhost'))) {
          Object.assign(s, { offline: true, ping: Infinity });
          return;
        }

        if (cache[s.address]) {
          Object.assign(s, cache[s.address]);
          return;
        }

        try {
          const resp = await fetch(
            `${window.location.protocol}//${s.address}/serverinfo?${Date.now()}`,
            { headers: { 'Content-Type': 'text/plain' } },
          );
          const json = await resp.json();
          Object.assign(s, {
            offline: false,
            ping: Date.now() - start,
            playerCnt: json.realPlayersCnt,
          });
        } catch {
          Object.assign(s, { offline: true, ping: Infinity });
        }

        cache[s.address] = { ...s };
      }),
    );
  } finally {
    isUpdating = false;
  }

  return servers;
}

/* ──────────────────────────────────────────────────────────── *
 * public API                                                  *
 * ──────────────────────────────────────────────────────────── */
export async function getServerList(): Promise<Server[]> {
  const t0 = performance.now();
  await updatePing();
  logger.info(
    `updatePingServerList took ${Math.round(performance.now() - t0)} ms`,
  );

  const auto = pickLowestPing();
  return [{ ...auto, value: 'auto', name: `AUTO (${auto.name})` }, ...servers];
}

export async function getServer(): Promise<Server> {
  const t0 = performance.now();
  await updatePing();
  logger.info(`updatePingServer took ${Math.round(performance.now() - t0)} ms`);

  let chosen = pickLowestPing();

  if (Settings.server !== 'auto') {
    const manual = servers.find(
      (s) => s.value === Settings.server && !s.offline,
    );
    if (manual) chosen = manual;
  }

  /* auto-switch when selected server is offline */
  if (Settings.server !== chosen.value) {
    logger.warn(
      `Switched server to ${chosen.value} because ${Settings.server} is offline`,
    );
    Settings.server = chosen.value;
    window.location.reload();
  }

  currentServer = chosen;
  return chosen;
}

/* === get current server without ping === */
export function getCurrentServer(): Server | null {
  /*  If getServer() has not been called yet, value is null.
      Caller may choose to fallback to await getServer() instead. */
  return currentServer;
}

/* ──────────────────────────────────────────────────────────── *
 * helpers                                                     *
 * ──────────────────────────────────────────────────────────── */
function pickLowestPing(): Server {
  const best = servers.reduce((min, cur) => (cur.ping < min.ping ? cur : min));
  if (best.offline) {
    logger.error('All servers are offline or blocked. Please try again later.');
  }
  return best;
}
