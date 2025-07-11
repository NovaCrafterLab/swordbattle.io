// scripts/pingServers.js
/**
 * Minimal CLI ping tool for SwordBattle servers.
 * Run with: node scripts/pingServers.js [addr1 addr2 ...]
 */

import { config } from 'dotenv';
config(); // Load .env variables

// -------- Settings --------
const TIMEOUT_MS = 5000; // request timeout
const ENV_ENDPOINTS = [
  { name: 'TEST', addr: process.env.REACT_APP_ENDPOINT_TEST },
  { name: 'RACE', addr: process.env.REACT_APP_ENDPOINT_RACE },
  { name: 'EU', addr: process.env.REACT_APP_ENDPOINT_EU },
  { name: 'US', addr: process.env.REACT_APP_ENDPOINT_US },
  { name: 'USBK', addr: process.env.REACT_APP_ENDPOINT_US_BACKUP },
  { name: 'DEV', addr: process.env.REACT_APP_ENDPOINT_DEV },
];
// --------------------------

/**
 * Build list: .env endpoints + CLI overrides
 */
function buildServerList() {
  const cliArgs = process.argv.slice(2); // custom addresses from CLI
  const cliServers = cliArgs.map((addr, i) => ({
    name: `CLI${i + 1}`,
    addr,
  }));
  return [...ENV_ENDPOINTS, ...cliServers]
    .filter((s) => !!s.addr) // drop empty
    .reduce((acc, cur) => {
      // deduplicate by address
      if (!acc.find((s) => s.addr === cur.addr)) acc.push(cur);
      return acc;
    }, []);
}

/**
 * Ping single server via /serverinfo
 */
async function pingServer({ name, addr }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const url = `${(process.env.USE_SSL ?? '').toLowerCase() === 'true' ? 'https' : 'http'}://${addr}/serverinfo?${Date.now()}`;
  const start = Date.now();

  try {
    const res = await fetch(url, { signal: controller.signal });
    const ms = Date.now() - start;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    clearTimeout(timeout);
    return {
      name,
      addr,
      online: true,
      ping: ms,
      players: json.realPlayersCnt ?? 'N/A',
    };
  } catch (err) {
    clearTimeout(timeout);
    return { name, addr, online: false, ping: '∞', players: '-' };
  }
}

(async () => {
  const servers = buildServerList();
  if (servers.length === 0) {
    console.error('❌  No server addresses found (.env or CLI).');
    process.exit(1);
  }

  console.log(`⏳  Pinging ${servers.length} server(s)...\n`);
  const results = await Promise.all(servers.map(pingServer));
  console.table(results);
})();
