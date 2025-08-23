# API Performance Optimizations

This directory contains optimized API utilities with advanced caching, request deduplication, and performance monitoring for faster data loading.

## 🚀 Key Features

### 1. **Intelligent Caching System**
- **LRU (Least Recently Used) Cache**: Automatically evicts least used items when cache is full
- **TTL (Time To Live)**: Configurable expiration times for different data types
- **Cache Invalidation**: Smart invalidation strategies for related data
- **Multiple Cache Instances**: Specialized caches for different resource types

### 2. **Request Deduplication**
- **Duplicate Prevention**: Prevents multiple identical API calls from running simultaneously
- **Request Timeout**: Automatically cleans up stale pending requests
- **Performance Tracking**: Monitors request patterns and performance

### 3. **Performance Monitoring**
- **Response Time Tracking**: Monitors API response times
- **Cache Hit Rates**: Tracks cache effectiveness
- **Error Monitoring**: Logs and analyzes API errors
- **Endpoint Analytics**: Identifies slow endpoints

### 4. **React Hooks**
- **useApi**: Optimized data fetching with caching
- **useApiMutation**: Optimized mutations with cache invalidation
- **useRealtimeApi**: Real-time data with automatic refresh
- **usePaginatedApi**: Pagination support with caching
- **useSearchApi**: Search with debouncing

## 📁 File Structure

```
utils/
├── api.ts                 # Main API utility with caching and deduplication
├── cache.ts              # LRU cache implementation with TTL
├── request-deduplication.ts # Request deduplication system
├── performance-monitor.ts   # Performance tracking and analytics
└── README.md             # This documentation
```

## 🔧 Usage Examples

### Basic API Call with Caching

```typescript
import { invoiceApi } from '../utils/api';

// This will use cache if available, otherwise make API call
const { data, error } = await invoiceApi.getAll();

// With custom cache TTL (5 minutes)
const { data, error } = await invoiceApi.getStats();
```

### Using React Hooks

```typescript
import { useApi, useApiMutation } from '../hooks/useOptimizedApi';

// In your component
function InvoiceList() {
  const { data, loading, error, refetch } = useApi('/api/invoices', {
    useCache: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate, loading: creating } = useApiMutation('/api/invoices', 'POST');

  const handleCreate = async (invoiceData) => {
    await mutate(invoiceData, ['invoices']); // Invalidate invoices cache
  };

  // ... rest of component
}
```

### Real-time Data

```typescript
import { useRealtimeApi } from '../hooks/useOptimizedApi';

function Dashboard() {
  const { data, loading } = useRealtimeApi('/api/invoices/stats', 30000); // Refresh every 30s
  
  // ... component logic
}
```

### Search with Debouncing

```typescript
import { useSearchApi } from '../hooks/useOptimizedApi';

function SearchInvoices() {
  const { data, loading, searchTerm, setSearchTerm } = useSearchApi(
    '/api/invoices/search',
    300 // 300ms debounce
  );

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search invoices..."
    />
  );
}
```

## 🎯 Performance Optimizations

### Cache Strategies

| Resource Type | Default TTL | Cache Size | Strategy |
|---------------|-------------|------------|----------|
| Auth Session | 10 minutes | 10 items | Long-lived, small cache |
| Settings | 30 minutes | 20 items | Very long-lived |
| Categories | 1 hour | 50 items | Static data |
| Stats | 2-5 minutes | 50 items | Real-time data |
| Lists | 5 minutes | 200 items | General purpose |
| Individual Items | 5 minutes | 200 items | General purpose |

### Request Deduplication

- **Timeout**: 30 seconds for pending requests
- **Key Generation**: Based on method, endpoint, and parameters
- **Automatic Cleanup**: Stale requests are automatically removed

### Performance Monitoring

Track performance metrics:

```typescript
import { performanceUtils } from '../utils/performance-monitor';

// Get overall stats
const stats = performanceUtils.getStats();

// Get cache performance
const cacheStats = performanceUtils.getCacheStats();

// Get endpoint-specific stats
const endpointStats = performanceUtils.getEndpointStats('/api/invoices');
```

## 🔄 Cache Invalidation

### Automatic Invalidation

The system automatically invalidates related caches when data changes:

```typescript
// Creating an invoice invalidates invoice caches
await invoiceApi.create(invoiceData);

// Updating a client invalidates client caches
await clientApi.update(id, clientData);

// Profile updates invalidate all caches
await profileApi.update(profileData);
```

### Manual Invalidation

```typescript
import { invalidateCache } from '../utils/api';

// Invalidate specific resource types
invalidateCache.invoices();
invalidateCache.clients();
invalidateCache.all(); // Clear all caches
```

## 📊 Performance Metrics

### Cache Performance

- **Hit Rate**: Percentage of requests served from cache
- **Miss Rate**: Percentage of requests requiring API calls
- **Eviction Rate**: How often items are removed from cache
- **Average Size**: Current cache size

### API Performance

- **Response Times**: Average, min, max response times
- **Error Rates**: Percentage of failed requests
- **Slowest Endpoints**: Top 10 slowest API endpoints
- **Recent Errors**: Last 20 errors with details

## 🛠️ Configuration

### Cache Configuration

```typescript
// Custom cache instance
const customCache = new CacheManager({
  maxSize: 500,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
});
```

### API Configuration

```typescript
// Custom API request with specific options
const response = await apiRequest('/api/data', {
  useCache: true,
  cacheTTL: 5 * 60 * 1000,
  skipDeduplication: false,
  cacheKey: 'custom-key',
});
```

## 🚨 Error Handling

The system provides comprehensive error handling:

- **Network Errors**: Connection issues, timeouts
- **API Errors**: Server errors, validation errors
- **Cache Errors**: Cache corruption, memory issues
- **Timeout Errors**: Request timeouts (30s default)

## 🔍 Debugging

### Enable Debug Mode

```typescript
// Get cache statistics
const cacheStats = cacheManager.getStats();
console.log('Cache Stats:', cacheStats);

// Get performance metrics
const perfStats = performanceUtils.getStats();
console.log('Performance Stats:', perfStats);

// Get pending requests
const pendingCount = requestDeduplicator.getPendingCount();
console.log('Pending Requests:', pendingCount);
```

### Performance Monitoring

```typescript
// Track specific endpoint performance
const endpointStats = performanceUtils.getEndpointStats('/api/invoices');
console.log('Invoice API Performance:', endpointStats);

// Get recent errors
const stats = performanceUtils.getStats();
console.log('Recent Errors:', stats.recentErrors);
```

## 📈 Best Practices

1. **Use Appropriate TTL**: Set shorter TTL for frequently changing data
2. **Leverage Cache Keys**: Use meaningful cache keys for better organization
3. **Monitor Performance**: Regularly check performance metrics
4. **Invalidate Strategically**: Only invalidate related caches
5. **Use Hooks**: Prefer React hooks for component data fetching
6. **Handle Errors**: Always handle API errors gracefully
7. **Optimize Queries**: Use pagination and filtering to reduce data transfer

## 🔧 Maintenance

### Regular Cleanup

```typescript
// Clear old performance metrics (older than 7 days)
performanceUtils.clearOldMetrics(7 * 24 * 60 * 60 * 1000);

// Clear all caches (use sparingly)
cacheUtils.clearAll();
```

### Monitoring Alerts

Set up monitoring for:
- High error rates (>5%)
- Low cache hit rates (<70%)
- Slow response times (>2s average)
- High memory usage

## 🎉 Benefits

- **Faster Loading**: Up to 90% faster for cached data
- **Reduced Server Load**: Fewer duplicate requests
- **Better UX**: Instant responses for cached data
- **Real-time Monitoring**: Track performance issues
- **Automatic Optimization**: Self-tuning cache behavior
- **Scalable**: Handles large datasets efficiently

This optimization system provides a robust foundation for fast, reliable API interactions with comprehensive monitoring and debugging capabilities.
