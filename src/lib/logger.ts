/**
 * Structured logging system for resilience and debugging
 * Provides unified logging with levels, context, and structured data
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, any>;
  error?: Error;
  duration?: number;
}

export interface LogHandler {
  handle(entry: LogEntry): void;
}

/**
 * Console log handler for development
 */
class ConsoleLogHandler implements LogHandler {
  handle(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.module}`;
    const message = entry.message;

    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m', // green
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
      fatal: '\x1b[35m', // magenta
    };

    const color = colors[entry.level];
    const reset = '\x1b[0m';

    if (entry.error) {
      console.error(
        `${color}${prefix}${reset} ${message}`,
        entry.error,
        entry.data,
      );
    } else if (entry.data && Object.keys(entry.data).length > 0) {
      console.log(`${color}${prefix}${reset} ${message}`, entry.data);
    } else {
      console.log(`${color}${prefix}${reset} ${message}`);
    }

    if (entry.duration) {
      console.log(`${color}  └─ Duration: ${entry.duration}ms${reset}`);
    }
  }
}

/**
 * Memory log handler for error tracking
 */
class MemoryLogHandler implements LogHandler {
  private maxEntries = 1000;
  private entries: LogEntry[] = [];

  handle(entry: LogEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  getEntries(level?: LogLevel): LogEntry[] {
    return level
      ? this.entries.filter((e) => e.level === level)
      : this.entries;
  }

  getErrors(): LogEntry[] {
    return this.entries.filter((e) => e.level === 'error' || e.level === 'fatal');
  }

  clear(): void {
    this.entries = [];
  }

  export(): LogEntry[] {
    return [...this.entries];
  }
}

/**
 * Structured logger
 */
class Logger {
  private handlers: LogHandler[] = [];
  private module: string;
  private minLevel: LogLevel = 'info';

  constructor(module: string) {
    this.module = module;
  }

  addHandler(handler: LogHandler): void {
    this.handlers.push(handler);
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    error?: Error,
  ): void {
    const levelOrder = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };
    if (levelOrder[level] < levelOrder[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.module,
      message,
      data: data && Object.keys(data).length > 0 ? data : undefined,
      error,
    };

    for (const handler of this.handlers) {
      try {
        handler.handle(entry);
      } catch (err) {
        // Prevent logger from crashing app
        console.error('Log handler error:', err);
      }
    }
  }

  debug(message: string, data?: Record<string, any>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, any>): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error, data?: Record<string, any>): void {
    this.log('error', message, { ...data, errorName: error?.name }, error);
  }

  fatal(message: string, error?: Error, data?: Record<string, any>): void {
    this.log('fatal', message, { ...data, errorName: error?.name }, error);
  }

  /**
   * Time an operation
   */
  async time<T>(
    operation: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const start = performance.now();
    try {
      this.debug(`Starting: ${operation}`);
      const result = await fn();
      const duration = performance.now() - start;
      this.info(`Completed: ${operation}`, { duration });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(
        `Failed: ${operation}`,
        error instanceof Error ? error : new Error(String(error)),
        { duration },
      );
      throw error;
    }
  }
}

// Global logger instances
const loggers = new Map<string, Logger>();
const memoryHandler = new MemoryLogHandler();

/**
 * Get logger for a module
 */
export function getLogger(module: string): Logger {
  if (!loggers.has(module)) {
    const logger = new Logger(module);
    logger.addHandler(new ConsoleLogHandler());
    logger.addHandler(memoryHandler);
    loggers.set(module, logger);
  }
  return loggers.get(module)!;
}

/**
 * Get in-memory logs (for error reporting)
 */
export function getMemoryLogs(): LogEntry[] {
  return memoryHandler.export();
}

/**
 * Get recent errors
 */
export function getRecentErrors(count: number = 10): LogEntry[] {
  return memoryHandler.getErrors().slice(-count);
}

/**
 * Clear logs
 */
export function clearLogs(): void {
  memoryHandler.clear();
}

/**
 * Set global log level
 */
export function setGlobalLogLevel(level: LogLevel): void {
  for (const logger of loggers.values()) {
    logger.setMinLevel(level);
  }
}
