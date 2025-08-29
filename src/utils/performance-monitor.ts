// Performance monitoring utility for API calls and caching

interface PerformanceMetric {
  endpoint: string;
  method: string;
  responseTime: number;
  timestamp: number;
  success: boolean;
  cacheHit: boolean;
  errorType?: string;
}

interface CacheMetric {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  timestamp: number;
}

interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  slowestEndpoints: Array<{ endpoint: string; avgTime: number; count: number }>;
  recentErrors: Array<{ endpoint: string; error: string; timestamp: number }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private cacheMetrics: CacheMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private maxCacheMetrics = 100; // Keep last 100 cache metrics

  // Track API request performance
  trackRequest(
    endpoint: string,
    method: string,
    responseTime: number,
    success: boolean,
    cacheHit: boolean,
    errorType?: string
  ) {
    const metric: PerformanceMetric = {
      endpoint,
      method,
      responseTime,
      timestamp: Date.now(),
      success,
      cacheHit,
      errorType,
    };

    this.metrics.push(metric);

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // Track cache performance
  trackCache(hits: number, misses: number, evictions: number, size: number) {
    const metric: CacheMetric = {
      hits,
      misses,
      evictions,
      size,
      timestamp: Date.now(),
    };

    this.cacheMetrics.push(metric);

    // Keep only the last maxCacheMetrics
    if (this.cacheMetrics.length > this.maxCacheMetrics) {
      this.cacheMetrics = this.cacheMetrics.slice(-this.maxCacheMetrics);
    }
  }

  // Get performance statistics
  getStats(timeWindowMs: number = 24 * 60 * 60 * 1000): PerformanceStats {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => now - m.timestamp < timeWindowMs
    );

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        slowestEndpoints: [],
        recentErrors: [],
      };
    }

    const totalRequests = recentMetrics.length;
    // const successfulRequests = recentMetrics.filter(m => m.success);
    const failedRequests = recentMetrics.filter(m => !m.success);
    const cacheHits = recentMetrics.filter(m => m.cacheHit);
    const cacheMisses = recentMetrics.filter(m => !m.cacheHit);

    const averageResponseTime =
      recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;

    const cacheHitRate = cacheHits.length / (cacheHits.length + cacheMisses.length);
    const errorRate = failedRequests.length / totalRequests;

    // Calculate slowest endpoints
    const endpointStats = new Map<string, { totalTime: number; count: number }>();
    recentMetrics.forEach(m => {
      const existing = endpointStats.get(m.endpoint) || { totalTime: 0, count: 0 };
      endpointStats.set(m.endpoint, {
        totalTime: existing.totalTime + m.responseTime,
        count: existing.count + 1,
      });
    });

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        avgTime: stats.totalTime / stats.count,
        count: stats.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10);

    // Get recent errors
    const recentErrors = failedRequests
      .map(m => ({
        endpoint: m.endpoint,
        error: m.errorType || 'Unknown',
        timestamp: m.timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    return {
      totalRequests,
      averageResponseTime,
      cacheHitRate,
      errorRate,
      slowestEndpoints,
      recentErrors,
    };
  }

  // Get cache performance statistics
  getCacheStats(timeWindowMs: number = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    const recentCacheMetrics = this.cacheMetrics.filter(
      m => now - m.timestamp < timeWindowMs
    );

    if (recentCacheMetrics.length === 0) {
      return {
        totalHits: 0,
        totalMisses: 0,
        totalEvictions: 0,
        averageSize: 0,
        hitRate: 0,
      };
    }

    const totalHits = recentCacheMetrics.reduce((sum, m) => sum + m.hits, 0);
    const totalMisses = recentCacheMetrics.reduce((sum, m) => sum + m.misses, 0);
    const totalEvictions = recentCacheMetrics.reduce((sum, m) => sum + m.evictions, 0);
    const averageSize =
      recentCacheMetrics.reduce((sum, m) => sum + m.size, 0) / recentCacheMetrics.length;

    const hitRate = totalHits / (totalHits + totalMisses);

    return {
      totalHits,
      totalMisses,
      totalEvictions,
      averageSize,
      hitRate,
    };
  }

  // Get endpoint-specific performance
  getEndpointStats(endpoint: string, timeWindowMs: number = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    const endpointMetrics = this.metrics.filter(
      m => m.endpoint === endpoint && now - m.timestamp < timeWindowMs
    );

    if (endpointMetrics.length === 0) {
      return null;
    }

    const totalRequests = endpointMetrics.length;
    const successfulRequests = endpointMetrics.filter(m => m.success);
    const failedRequests = endpointMetrics.filter(m => !m.success);
    const cacheHits = endpointMetrics.filter(m => m.cacheHit);
    const cacheMisses = endpointMetrics.filter(m => !m.cacheHit);

    const averageResponseTime =
      endpointMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;

    const cacheHitRate = cacheHits.length / (cacheHits.length + cacheMisses.length);
    const errorRate = failedRequests.length / totalRequests;

    const minResponseTime = Math.min(...endpointMetrics.map(m => m.responseTime));
    const maxResponseTime = Math.max(...endpointMetrics.map(m => m.responseTime));

    return {
      endpoint,
      totalRequests,
      averageResponseTime,
      minResponseTime,
      maxResponseTime,
      cacheHitRate,
      errorRate,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThanMs: number = 7 * 24 * 60 * 60 * 1000) {
    const now = Date.now();
    this.metrics = this.metrics.filter(m => now - m.timestamp < olderThanMs);
    this.cacheMetrics = this.cacheMetrics.filter(m => now - m.timestamp < olderThanMs);
  }

  // Get all metrics (for debugging)
  getAllMetrics() {
    return {
      metrics: [...this.metrics],
      cacheMetrics: [...this.cacheMetrics],
    };
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    this.cacheMetrics = [];
  }
}

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance tracking decorator for API functions
export function trackPerformance<T extends (...args: any[]) => any>(
  target: T,
  endpoint: string,
  method: string = 'GET'
): T {
  return ((...args: any[]) => {
    const startTime = performance.now();
    // const startTimestamp = Date.now();

    return target(...args)
      .then((result: any) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        performanceMonitor.trackRequest(
          endpoint,
          method,
          responseTime,
          !result.error,
          false, // cacheHit will be set by the API layer
          result.error?.type
        );

        return result;
      })
      .catch((error: any) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        performanceMonitor.trackRequest(
          endpoint,
          method,
          responseTime,
          false,
          false,
          error.name || 'Unknown'
        );

        throw error;
      });
  }) as T;
}

// Utility functions for performance monitoring
export const performanceUtils = {
  getStats: (timeWindowMs?: number) => performanceMonitor.getStats(timeWindowMs),
  getCacheStats: (timeWindowMs?: number) => performanceMonitor.getCacheStats(timeWindowMs),
  getEndpointStats: (endpoint: string, timeWindowMs?: number) => 
    performanceMonitor.getEndpointStats(endpoint, timeWindowMs),
  clearOldMetrics: (olderThanMs?: number) => performanceMonitor.clearOldMetrics(olderThanMs),
  clear: () => performanceMonitor.clear(),
  getAllMetrics: () => performanceMonitor.getAllMetrics(),
};

export default performanceMonitor;
