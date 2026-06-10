/**
 * Generic data adapter layer for swappable data sources
 * Supports: REST, GraphQL, Mock, Custom adapters
 */

import { DataAdapterConfig } from '../config/types';

export interface DataAdapter {
  id: string;
  init(): Promise<void>;
  destroy(): Promise<void>;
  query<T>(key: string, params?: Record<string, any>): Promise<T>;
  mutate<T>(endpoint: string, data: any): Promise<T>;
  subscribe<T>(key: string, callback: (data: T) => void): () => void;
}

/**
 * Mock adapter for development and testing
 */
export class MockAdapter implements DataAdapter {
  id = 'mock';
  private mockDelay: number;
  private mockData = new Map<string, any>();

  constructor(config: DataAdapterConfig) {
    this.mockDelay = config.mockDelay || 0;
  }

  async init(): Promise<void> {
    console.log('MockAdapter initialized');
  }

  async destroy(): Promise<void> {
    console.log('MockAdapter destroyed');
  }

  async query<T>(key: string, params?: Record<string, any>): Promise<T> {
    if (this.mockDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.mockDelay));
    }

    const data = this.mockData.get(key);
    if (!data) {
      throw new Error(`Mock data not found for key: ${key}`);
    }

    return typeof data === 'function' ? data(params) : data;
  }

  async mutate<T>(endpoint: string, data: any): Promise<T> {
    if (this.mockDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.mockDelay));
    }
    return data as T;
  }

  subscribe<T>(key: string, callback: (data: T) => void): () => void {
    // Mock subscription (no-op)
    return () => {};
  }

  setMockData(key: string, data: any): void {
    this.mockData.set(key, data);
  }
}

/**
 * REST adapter for REST APIs
 */
export class RestAdapter implements DataAdapter {
  id = 'rest';
  private baseUrl: string;
  private headers: Record<string, string>;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(config: DataAdapterConfig) {
    this.baseUrl = config.baseUrl || '';
    this.headers = config.headers || {
      'Content-Type': 'application/json',
    };
  }

  async init(): Promise<void> {
    console.log(`RestAdapter initialized with base URL: ${this.baseUrl}`);
  }

  async destroy(): Promise<void> {
    this.cache.clear();
    console.log('RestAdapter destroyed');
  }

  async query<T>(key: string, params?: Record<string, any>): Promise<T> {
    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }

    const url = new URL(key, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, String(v));
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data as T;
  }

  async mutate<T>(endpoint: string, data: any): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  subscribe<T>(key: string, callback: (data: T) => void): () => void {
    // Polling-based subscription
    const interval = setInterval(async () => {
      try {
        const data = await this.query<T>(key);
        callback(data);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }, this.cacheDuration);

    return () => clearInterval(interval);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * GraphQL adapter for GraphQL APIs
 */
export class GraphQLAdapter implements DataAdapter {
  id = 'graphql';
  private endpoint: string;
  private headers: Record<string, string>;

  constructor(config: DataAdapterConfig) {
    this.endpoint = config.baseUrl || '';
    this.headers = config.headers || {
      'Content-Type': 'application/json',
    };
  }

  async init(): Promise<void> {
    console.log(`GraphQLAdapter initialized with endpoint: ${this.endpoint}`);
  }

  async destroy(): Promise<void> {
    console.log('GraphQLAdapter destroyed');
  }

  async query<T>(query: string, params?: Record<string, any>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        query,
        variables: params,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`);
    }

    return result.data as T;
  }

  async mutate<T>(mutation: string, data: any): Promise<T> {
    return this.query<T>(mutation, data);
  }

  subscribe<T>(subscription: string, callback: (data: T) => void): () => void {
    // WebSocket-based subscription (simplified)
    console.warn('GraphQL subscriptions require WebSocket setup');
    return () => {};
  }
}

/**
 * Adapter factory
 */
export function createAdapter(config: DataAdapterConfig): DataAdapter {
  switch (config.type) {
    case 'mock':
      return new MockAdapter(config);
    case 'rest':
      return new RestAdapter(config);
    case 'graphql':
      return new GraphQLAdapter(config);
    case 'custom':
      // Allow loading custom adapter from path
      throw new Error('Custom adapters must be loaded separately');
    default:
      throw new Error(`Unknown adapter type: ${config.type}`);
  }
}

/**
 * Global adapter instance
 */
let currentAdapter: DataAdapter | null = null;

export function setAdapter(adapter: DataAdapter): void {
  currentAdapter = adapter;
}

export function getAdapter(): DataAdapter {
  if (!currentAdapter) {
    throw new Error('No adapter initialized. Call setAdapter first.');
  }
  return currentAdapter;
}

export async function initAdapter(config: DataAdapterConfig): Promise<DataAdapter> {
  const adapter = createAdapter(config);
  await adapter.init();
  setAdapter(adapter);
  return adapter;
}
