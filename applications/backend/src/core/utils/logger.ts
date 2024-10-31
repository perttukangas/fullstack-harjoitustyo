import { LOG_LEVEL } from '../lib/envalid';

enum LogLevel {
  DEBUG,
  INFO,
  ERROR,
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      const logLevel = LogLevel[LOG_LEVEL] || LogLevel.INFO;
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  public debug(...messages: unknown[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug('[DEBUG]', ...messages);
    }
  }

  public info(...messages: unknown[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info('[INFO]', ...messages);
    }
  }

  public error(...messages: unknown[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error('[ERROR]', ...messages);
    }
  }
}

const logger = Logger.getInstance();

export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const error = logger.error.bind(logger);
