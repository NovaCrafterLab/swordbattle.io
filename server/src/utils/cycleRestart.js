// server/src/utils/cycleRestart.js
/* eslint-disable no-console */

'use strict';

const { DateTime } = require('luxon');

/* == Env Config == */
const TZ = process.env.CYCLE_TZ || 'UTC';
const PERIOD_MIN = Number(process.env.CYCLE_PERIOD_MIN || 30);
const PERIOD_MS = PERIOD_MIN * 60 * 1000;
const EPOCH_ISO = process.env.CYCLE_EPOCH_ISO || '2025-01-01T00:00:00';

/* Anchor in UTC ms */
const ANCHOR_MS = DateTime.fromISO(EPOCH_ISO, { zone: TZ }).toUTC().toMillis();

/* == Public API == */
function initCycleRestart(restartFn) { scheduleNext(restartFn); }

/* expose immutable info for other modules & /serverinfo */
function getCycleInfo() {
  return {
    epochIso: EPOCH_ISO,          // string
    period: PERIOD_MIN * 60,    // seconds
    tz: TZ,
  };
}

module.exports = { initCycleRestart, getCycleInfo };

/* == Internals == */
function scheduleNext(restartFn) {
  const now = Date.now();
  const diff = now - ANCHOR_MS;
  const delay = diff % PERIOD_MS === 0 ? PERIOD_MS : PERIOD_MS - (diff % PERIOD_MS);

  console.log(`[CycleRestart] next in ${Math.round(delay / 1000)}s`);
  setTimeout(async () => {
    try { await restartFn(); }
    finally { scheduleNext(restartFn); }
  }, delay);
}
