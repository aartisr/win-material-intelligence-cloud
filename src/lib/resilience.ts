/**
 * Error recovery and resilience strategies
 * Handles common failure scenarios with automatic recovery
 */

import { getLogger } from './logger';

const logger = getLogger('Resilience');

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 100,
  maxDelay: 5000,
  backoffMultiplier: 2,
};

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  operation: string,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      logger.debug(`${operation} - Attempt ${attempt + 1}/${opts.maxRetries + 1}`);
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === opts.maxRetries) {
        logger.error(
          `${operation} - Failed after ${opts.maxRetries + 1} attempts`,
          lastError,
        );
        throw lastError;
      }

      logger.warn(`${operation} - Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError || new Error('Retry exhausted');
}

/**
 * Circuit breaker for handling repeated failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold: number = 5,
    private resetTimeout: number = 60000, // 1 minute
  ) {}

  async execute<T>(
    operation: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        logger.info(`${operation} - Circuit breaker attempting reset`);
        this.state = 'half-open';
      } else {
        throw new Error(
          `Circuit breaker is open for ${operation}. Service unavailable.`,
        );
      }
    }

    try {
      const result = await fn();

      if (this.state === 'half-open') {
        logger.info(`${operation} - Circuit breaker closed, service recovered`);
        this.reset();
      }

      return result;
    } catch (error) {
      this.recordFailure();

      if (this.failureCount >= this.failureThreshold) {
        logger.error(
          `${operation} - Circuit breaker opened after ${this.failureCount} failures`,
          error instanceof Error ? error : new Error(String(error)),
        );
        this.state = 'open';
      }

      throw error;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  private reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'closed';
  }

  getState(): string {
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

/**
 * Fallback strategy - try primary, fall back to secondary
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  operation: string,
): Promise<T> {
  try {
    logger.debug(`${operation} - Attempting primary strategy`);
    return await primary();
  } catch (error) {
    logger.warn(
      `${operation} - Primary strategy failed, attempting fallback`,
      error instanceof Error ? error : undefined,
    );

    try {
      return await fallback();
    } catch (fallbackError) {
      logger.error(
        `${operation} - Both primary and fallback failed`,
        fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)),
      );
      throw fallbackError;
    }
  }
}

/**
 * Timeout wrapper - ensures operations complete within time limit
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        logger.warn(`${operation} - Timeout exceeded (${timeoutMs}ms)`);
        reject(new Error(`${operation} exceeded timeout of ${timeoutMs}ms`));
      }, timeoutMs),
    ),
  ]);
}

/**
 * Bulkhead pattern - isolate resource usage
 */
export class Bulkhead {
  private running = 0;

  constructor(
    private maxConcurrent: number = 10,
    private operation: string = 'operation',
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      throw new Error(
        `${this.operation} - Bulkhead limit reached (${this.maxConcurrent} concurrent)`,
      );
    }

    this.running++;

    try {
      logger.debug(`${this.operation} - Running (${this.running}/${this.maxConcurrent})`);
      return await fn();
    } finally {
      this.running--;
    }
  }

  getStats() {
    return {
      running: this.running,
      maxConcurrent: this.maxConcurrent,
      available: this.maxConcurrent - this.running,
    };
  }
}

/**
 * Combine multiple resilience patterns
 */
export async function withResilience<T>(
  operation: string,
  fn: () => Promise<T>,
  options: {
    retry?: Partial<RetryOptions>;
    timeout?: number;
    fallback?: () => Promise<T>;
    circuitBreaker?: CircuitBreaker;
    bulkhead?: Bulkhead;
  } = {},
): Promise<T> {
  let task = fn;

  // Wrap with bulkhead first (outermost)
  if (options.bulkhead) {
    const bulkhead = options.bulkhead;
    task = () => bulkhead.execute(() => fn());
  }

  // Then circuit breaker
  if (options.circuitBreaker) {
    const cb = options.circuitBreaker;
    task = () => cb.execute(operation, fn);
  }

  // Then retry
  if (options.retry) {
    const retryTask = task;
    task = () => withRetry(retryTask, operation, options.retry);
  }

  // Then timeout
  if (options.timeout) {
    const timeoutTask = task;
    task = () => withTimeout(timeoutTask(), options.timeout!, operation);
  }

  // Finally fallback
  if (options.fallback) {
    const fallbackTask = task;
    task = () => withFallback(fallbackTask, options.fallback!, operation);
  }

  return task();
}

/**
 * Common resilience patterns
 */

export const PATTERNS = {
  /**
   * Pattern for critical operations that must succeed
   */
  critical: (operation: string, fn: () => Promise<any>) =>
    withResilience(operation, fn, {
      retry: { maxRetries: 5 },
      timeout: 30000,
    }),

  /**
   * Pattern for API calls with fallback
   */
  api: (
    operation: string,
    fn: () => Promise<any>,
    fallback?: () => Promise<any>,
  ) =>
    withResilience(operation, fn, {
      retry: { maxRetries: 3, initialDelay: 100 },
      timeout: 10000,
      fallback,
    }),

  /**
   * Pattern for background tasks that can be retried
   */
  background: (operation: string, fn: () => Promise<any>) =>
    withResilience(operation, fn, {
      retry: { maxRetries: 10, maxDelay: 60000 },
      timeout: 120000,
    }),

  /**
   * Pattern for quick operations that should timeout fast
   */
  quick: (operation: string, fn: () => Promise<any>) =>
    withResilience(operation, fn, {
      retry: { maxRetries: 1 },
      timeout: 3000,
    }),
};
