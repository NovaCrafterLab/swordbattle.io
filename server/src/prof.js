// server/src/prof.js  —— lightweight, prod-safe profiler

const ENABLED = process.env.NODE_ENV !== 'production';

if (!ENABLED) {
  module.exports.prof = (lbl, fn) => fn();
  return;
}

const bucket = new Map();
let lastFlush = Date.now();

function prof(label, fn) {
  const t0 = process.hrtime.bigint();
  fn();
  const dt = Number(process.hrtime.bigint() - t0) / 1e6;

  let rec = bucket.get(label);
  if (rec) {
    rec.sum += dt;
    rec.count++;
    if (dt > rec.max) rec.max = dt;
  } else {
    bucket.set(label, { sum: dt, count: 1, max: dt });
  }

  const now = Date.now();
  if (now - lastFlush >= 2000) {
    for (const [lbl, s] of bucket) {
      if (s.max >= 25) {
        const avg = (s.sum / s.count).toFixed(1);
        console.warn(`[prof] ${lbl.padEnd(16)} cnt ${s.count.toString().padEnd(4)} avg ${avg} ms  max ${s.max.toFixed(1)} ms`);
      }
    }
    bucket.clear();
    lastFlush = now;
  }
}

module.exports = { prof };
