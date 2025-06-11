// logger.js
import log from 'loglevel';
import chalk from 'chalk';

// Tùy chỉnh format log theo cấp độ
const originalFactory = log.methodFactory;

log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return function (...args) {
    let prefix = '';
    switch (methodName) {
      case 'trace':
        prefix = chalk.gray('[TRACE]');
        break;
      case 'debug':
        prefix = chalk.cyan('[DEBUG]');
        break;
      case 'info':
        prefix = chalk.green('[INFO ]');
        break;
      case 'warn':
        prefix = chalk.yellow('[WARN ]');
        break;
      case 'error':
        prefix = chalk.red('[ERROR]');
        break;
      default:
        prefix = '[LOG]';
    }

    rawMethod(`${prefix}`, ...args);
  };
};

// Áp dụng factory mới
log.setLevel(log.levels.DEBUG); // hoặc từ biến môi trường

export default log;
