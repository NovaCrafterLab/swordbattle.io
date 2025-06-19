// server/src/utilities/Loop.js

const { prof } = require('../prof');

const logSevereLag = (() => {
  let last = 0; // last log timestamp
  const PERIOD = 180_000; // 3 min in ms

  return (ctx /* this */) => {
    const now = Date.now();
    if (now - last < PERIOD) return; // skip if inside throttle window
    last = now;

    const realPlayersCnt = [...ctx.game.players.values()].filter(
      (p) => !p.isBot,
    ).length;

    console.log(
      `Server lagging severely... tick took ${ctx.tickTimeElapsed} ms. ` +
      `Expecting <${ctx.interval} ms.\n` +
      `Real player count: ${realPlayersCnt}; ` +
      `Entities: ${ctx.entityCnt}; ` +
      `Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    );
  };
})();

class Loop {
  constructor(interval = 50, game) {
    this.entityCnt = 0;
    this.interval = interval;
    this.isRunning = false;
    this.ticksThisSecond = 0;
    this.lastTickTime = process.hrtime();
    this.lastSecond = this.lastTickTime[0];
    this.tickTimeElapsed = 0;
    this.game = game;
    this.eventHandler = () => { };
    this.onTpsUpdate = () => { };
  }

  setEventHandler(eventHandler) {
    this.eventHandler = eventHandler;
  }

  setOnTpsUpdate(onTpsUpdate) {
    this.onTpsUpdate = onTpsUpdate;
  }

  setEntityCnt(entityCnt) {
    this.entityCnt = entityCnt;
  }

  start() {
    if (this.isRunning) {
      console.trace('Loop is already running.');
      return;
    }
    this.isRunning = true;
    this.runLoop();
  }

  stop() {
    this.isRunning = false;
    this.ticksThisSecond = 0;
  }

  runLoop() {
    if (!this.isRunning) return;
    prof('wholeTick', () => {
      const currentTime = process.hrtime();
      this.lastTickTime = currentTime;
      const now = Date.now();

      this.updateTPS(currentTime);
      this.eventHandler();
      this.tickTimeElapsed = Date.now() - now;

      if (this.tickTimeElapsed > this.interval * 2) {
        logSevereLag(this);
      }
      this.ticksThisSecond++;
      const delay = Math.max(0, this.interval - this.tickTimeElapsed);
      setTimeout(() => this.runLoop(), delay);
    });
  }

  updateTPS(currentTime) {
    const currentSecond = currentTime[0];
    if (currentSecond !== this.lastSecond) {
      const memoryUsage = process.memoryUsage();
      const memoryUsageReadable = `${Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100}MB`;
      // console.log(`tps: ${this.ticksThisSecond} | expected tps: ${1000 / this.interval} | tick time: ${this.tickTimeElapsed}ms | entities: ${this.entityCnt} | time per 100 entities: ${(Math.round(this.tickTimeElapsed * 10000 / this.entityCnt) / 100)}ms | memory usage: ${memoryUsageReadable}`);
      this.onTpsUpdate(this.ticksThisSecond);
      this.ticksThisSecond = 0;
      this.lastSecond = currentSecond;
    }
  }
}

module.exports = Loop;
