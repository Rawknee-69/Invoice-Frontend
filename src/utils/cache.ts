// Cache utility for client-side data caching
import { performanceMonitor } from './performance-monitor';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  maxSize?: number;
  defaultTTL?: number; // in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;
  private accessOrder: string[] = [];
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100;
    this.defaultTTL = config.defaultTTL || 5 * 60 * 1000; // 5 minutes default
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    // Remove old entry if exists
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key);
    }

    // Evict if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.addToAccessOrder(key);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T>;
    
    if (!entry) {
      this.misses++;
      this.updatePerformanceMetrics();
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.misses++;
      this.updatePerformanceMetrics();
      return null;
    }

    // Update access order
    this.removeFromAccessOrder(key);
    this.addToAccessOrder(key);

    this.hits++;
    this.updatePerformanceMetrics();
    return entry.data;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Invalidate cache entries that match a pattern
  invalidatePattern(pattern: string | RegExp): void {
    const keys = this.keys();
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    keys.forEach(key => {
      if (regex.test(key)) {
        this.delete(key);
      }
    });
  }

  // Invalidate all cache entries for a specific resource type
  invalidateResource(resourceType: string): void {
    this.invalidatePattern(`^${resourceType}:`);
  }

  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder[0];
      this.delete(oldestKey);
      this.evictions++;
      this.updatePerformanceMetrics();
    }
  }

  private addToAccessOrder(key: string): void {
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private updatePerformanceMetrics(): void {
    performanceMonitor.trackCache(
      this.hits,
      this.misses,
      this.evictions,
      this.cache.size
    );
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
      keys: this.keys(),
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate: this.hits / (this.hits + this.misses) || 0,
    };
  }
}

// Create cache instances for different resource types
export const cacheManager = new CacheManager({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
});

// Specialized cache instances
export const authCache = new CacheManager({ maxSize: 10, defaultTTL: 10 * 60 * 1000 }); // 10 minutes
export const statsCache = new CacheManager({ maxSize: 50, defaultTTL: 2 * 60 * 1000 }); // 2 minutes
export const settingsCache = new CacheManager({ maxSize: 20, defaultTTL: 30 * 60 * 1000 }); // 30 minutes

// Cache key generators
export const cacheKeys = {
  auth: {
    session: () => 'auth:session',
  },
  clients: {
    all: (params?: string) => `clients:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `clients:${id}`,
  },
  invoices: {
    all: (params?: string) => `invoices:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `invoices:${id}`,
    byStatus: (status: string, params?: string) => `invoices:status:${status}${params ? `:${params}` : ''}`,
    search: (params?: string) => `invoices:search${params ? `:${params}` : ''}`,
    outstanding: () => 'invoices:outstanding',
    overdue: () => 'invoices:overdue',
    stats: () => 'invoices:stats',
  },
  estimates: {
    all: (params?: string) => `estimates:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `estimates:${id}`,
    stats: () => 'estimates:stats',
  },
  expenses: {
    all: (params?: string) => `expenses:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `expenses:${id}`,
    categories: () => 'expenses:categories',
    stats: (params?: string) => `expenses:stats${params ? `:${params}` : ''}`,
  },
  payments: {
    all: (params?: string) => `payments:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `payments:${id}`,
    history: (invoiceId: string) => `payments:history:${invoiceId}`,
    upcoming: () => 'payments:upcoming',
  },
  savedItems: {
    all: (params?: string) => `savedItems:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `savedItems:${id}`,
    frequentlyUsed: () => 'savedItems:frequentlyUsed',
  },
  templates: {
    all: (params?: string) => `templates:all${params ? `:${params}` : ''}`,
    byId: (id: string) => `templates:${id}`,
  },
  settings: {
    all: () => 'settings:all',
    colors: () => 'settings:colors',
    templates: () => 'settings:templates',
    support: () => 'settings:support',
    supportContact: () => 'settings:supportContact',
  },
  reports: {
    all: (params?: string) => `reports:all${params ? `:${params}` : ''}`,
  },
};

export default cacheManager;
