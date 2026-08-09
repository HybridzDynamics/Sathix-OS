const levels = ['debug', 'info', 'warn', 'error'];
const configuredLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'info';
const currentLevelIndex = Math.max(0, levels.indexOf(configuredLevel));

function shouldLog(level) {
  return levels.indexOf(level) >= currentLevelIndex;
}

function formatMessage(level, message, meta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  return JSON.stringify(entry);
}

function debug(message, meta = {}) {
  if (shouldLog('debug')) {
    console.debug(formatMessage('debug', message, meta));
  }
}

function info(message, meta = {}) {
  if (shouldLog('info')) {
    console.info(formatMessage('info', message, meta));
  }
}

function warn(message, meta = {}) {
  if (shouldLog('warn')) {
    console.warn(formatMessage('warn', message, meta));
  }
}

function error(message, meta = {}) {
  if (shouldLog('error')) {
    console.error(formatMessage('error', message, meta));
  }
}

module.exports = { debug, info, warn, error };
