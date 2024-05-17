const isProduction = process.env.NODE_ENV === 'production';

export const LoggerUtil = {
  getTimestamp: () => new Date().toISOString(),

  formatLog: (level, args) => {
    const timestamp = LoggerUtil.getTimestamp();
    return `[${timestamp}] [${level.toUpperCase()}] - ${args.join(' ')}`;
  },

  info: (...args) => console.info(LoggerUtil.formatLog('info', args)),
  error: (...args) => console.error(LoggerUtil.formatLog('error', args)),
  warn: (...args) => console.warn(LoggerUtil.formatLog('warn', args)),
  debug: (...args) => console.debug(LoggerUtil.formatLog('debug', args)),
  log: (...args) => console.log(LoggerUtil.formatLog('log', args)),
  trace: (...args) => console.trace(LoggerUtil.formatLog('trace', args))
};
