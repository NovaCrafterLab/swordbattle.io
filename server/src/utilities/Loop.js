// server/src/utilities/Loop.js

const { prof } = require('../prof');

const NS_PER_MS = 1_000_000n;
const NS_PER_SEC = 1_000_000_000n;

/* throttle severe-lag logs to once every 3 min */
const logSevereLag = (() => {
  let last = 0; // ms timestamp
  const PERIOD = 180_000; // 3 min

  return (ctx) => {
    const now = Date.now();
    if (now - last < PERIOD) return;
    last = now;

    const realPlayersCnt = ctx.game.realPlayersCnt ??
      [...ctx.game.players.values()].filter((p) => !p.isBot).length;

    console.warn(
      `Server lagging... tick ${ctx.tickTimeElapsed} ms (> ${ctx.interval} ms)\n` +
      `Players: ${realPlayersCnt}, Entities: ${ctx.entityCnt}, ` +
      `Heap: ${Math.round(process.memoryUsage().heapUsed / 1048576)} MB`,
    );
  };
})();

class Loop {
  constructor(interval = 50, game) {
    this.interval = interval;          // target frame in ms
    this.game = game;                  // world reference

    this.entityCnt = 0;
    this.isRunning = false;

    this.ticksThisSecond = 0;
    this.lastSecond = Number(process.hrtime.bigint() / NS_PER_SEC);
    this.tickTimeElapsed = 0;

    this.eventHandler = () => {};
    this.onTpsUpdate = () => {};

    /* pre-bind to avoid per-frame closure allocation */
    this._runLoop = this.runLoop.bind(this);
  }

  /* external hooks */
  setEventHandler(fn) { this.eventHandler = fn; }
  setOnTpsUpdate(fn) { this.onTpsUpdate = fn; }
  setEntityCnt(n) { this.entityCnt = n; }

  /* lifecycle */
  start() {
    if (this.isRunning) return console.trace('Loop already running.');
    this.isRunning = true;
    setImmediate(this._runLoop); // first frame asap, but after current stack
  }

  stop() {
    this.isRunning = false;
    this.ticksThisSecond = 0;
  }

  /* main loop */
  runLoop() {
    if (!this.isRunning) return;
    prof('wholeTick', () => {
      const start = process.hrtime.bigint();

      this.updateTPS(start);
      this.eventHandler();

      const elapsedNs = process.hrtime.bigint() - start;
      this.tickTimeElapsed = Number(elapsedNs / NS_PER_MS);

      if (this.tickTimeElapsed > this.interval * 2) logSevereLag(this);
      this.ticksThisSecond++;

      const delay = Math.max(0, this.interval - this.tickTimeElapsed);
      setTimeout(this._runLoop, delay);
    });
  }

  /* TPS & diagnostics */
  updateTPS(nowNs) {
    const currentSecond = Number(nowNs / NS_PER_SEC);
    if (currentSecond !== this.lastSecond) {
      this.onTpsUpdate(this.ticksThisSecond);
      this.ticksThisSecond = 0;
      this.lastSecond = currentSecond;
    }
  }
}

module.exports = Loop;
