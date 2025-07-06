// server/src/utilities/Loop.js

const { performance } = require('node:perf_hooks');  // high-resolution monotonic timer

class Loop {
  constructor(interval = 50, game) {
    this.interval = interval;          // target frame in ms
    this.game = game;                  // world reference

    this.entityCnt = 0;
    this.isRunning = false;

    this.ticksThisSecond = 0;          // kept for compatibility
    this.lastSecond = Math.floor(performance.now() / 1000);
    this.tickTimeElapsed = 0;          // last frame cost (ms)

    this.totalTicks = 0;

    this.eventHandler  = () => {};
    this.onTpsUpdate   = () => {};

    /* timing helpers */
    this._prevFrameMs  = performance.now();   // previous frame start time
    this._runLoop      = this.runLoop.bind(this);
  }

  /* external hooks */
  setEventHandler(fn)  { this.eventHandler  = fn; }
  setOnTpsUpdate(fn)   { this.onTpsUpdate   = fn; }
  setEntityCnt(n)      { this.entityCnt    = n; }

  /* lifecycle */
  start() {
    if (this.isRunning) return console.trace('Loop already running.');
    this.isRunning = true;
    setImmediate(this._runLoop);       // first frame asap, but after current stack
  }

  stop() {
    this.isRunning = false;
    this.ticksThisSecond = 0;
  }

  /* main loop */
  runLoop() {
    if (!this.isRunning) return;

    /* ——— 计算真实 delta ——— */
    const nowMs   = performance.now();
    const deltaMs = nowMs - this._prevFrameMs || this.interval; // fallback when very first frame
    this._prevFrameMs = nowMs;

    /* advance logical time by real delta */
    this.game.logicalTime += deltaMs;

    /* 更新 TPS 统计 */
    this.updateTPS(nowMs);

    /* ——— 帧逻辑 & 耗时测量 ——— */
    const logicStart = performance.now();
    this.eventHandler();
    const logicCost  = performance.now() - logicStart;

    /* 存储耗时（兼容旧字段） */
    this.tickTimeElapsed = logicCost;

    /* 帧计数 */
    this.ticksThisSecond++;
    this.totalTicks++;

    /* 计算下一帧延迟，尽量稳帧 */
    const delay = Math.max(0, this.interval - logicCost);
    setTimeout(this._runLoop, delay);
  }

  /* TPS & diagnostics */
  updateTPS(nowMs) {
    const currentSecond = Math.floor(nowMs / 1000);
    if (currentSecond !== this.lastSecond) {
      this.onTpsUpdate(this.ticksThisSecond);
      this.ticksThisSecond = 0;
      this.lastSecond = currentSecond;
    }
  }
}

module.exports = Loop;
