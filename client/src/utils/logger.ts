// src/utils/logger.ts
/* Minimal, practical logger: isolate dev/prod output, keep errors visible */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

/* Detect initial level
   1. globalThis.__DEBUG__ === true → 'debug'
   2. URL 含 ?debug 或 ?debug=true → 'debug'
   3. NODE_ENV=production          → 'warn'
   4. 默认                          → 'info'                               */
let currentLevel: LogLevel = (() => {
  if ((globalThis as any).__DEBUG__ === true) return 'debug';

  // use window.location to avoid "no-restricted-globals" rule
  if (
    typeof window !== 'undefined' &&
    window.location &&
    /[?&]debug(?:=(?:true|1))?(?=&|$)/i.test(window.location.search)
  )
    return 'debug';

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production')
    return 'warn';

  return 'info';
})();

/* priority mapping */
const order: Record<LogLevel, number> = {
  debug: 3,
  info: 2,
  warn: 1,
  error: 0,
  silent: -1,
};

function canLog(level: LogLevel) {
  return order[level] <= order[currentLevel] && level !== 'silent';
}

export const logger = {
  setLevel(level: LogLevel) {
    currentLevel = level;
  },

  debug(...args: unknown[]) {
    canLog('debug') && console.debug(...args);
  },

  info(...args: unknown[]) {
    canLog('info') && console.info(...args);
  },

  warn(...args: unknown[]) {
    canLog('warn') && console.warn(...args);
  },

  /* errors are always printed */
  error(...args: unknown[]) {
    console.error(...args);
  },
};

export default logger;
