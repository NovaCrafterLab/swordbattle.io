// server/src/prof.js
const bucket = new Map();
let lastFlush = Date.now();

function prof(label, fn) {
  const t0 = process.hrtime.bigint();
  fn();
  const dt = Number(process.hrtime.bigint() - t0) / 1e6;

  let b = bucket.get(label);
  if (!b) { b = {sum:0,count:0,max:0}; bucket.set(label, b); }
  b.sum += dt; b.count++; if (dt > b.max) b.max = dt;

  const now = Date.now();
  if (now - lastFlush >= 2000) {
    for (const [lbl, s] of bucket) {
      if (s.max >= 25) {
        const avg = s.sum / s.count;
        console.warn(`[prof] ${lbl}\t cnt ${s.count}\t avg ${avg.toFixed(1)} ms\t max ${s.max.toFixed(1)} ms`);
      }
    }
    bucket.clear();
    lastFlush = now;
  }
}
module.exports = { prof };
