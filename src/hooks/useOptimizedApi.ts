import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest, invalidateCache, cacheUtils } from '../../Docs/utils/api';

interface UseApiOptions {
  useCache?: boolean;
  cacheTTL?: number;
  skipDeduplication?: boolean;
  cacheKey?: string;
  autoFetch?: boolean;
  dependencies?: any[];
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  refetch: () => Promise<void>;
  clearCache: () => void;
  setData: (data: T) => void;
}

// Hook for optimized API calls with caching
export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    useCache = true,
    cacheTTL,
    skipDeduplication = false,
    cacheKey,
    autoFetch = true,
    dependencies = []
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiRequest<T>(endpoint, {
        useCache,
        cacheTTL,
        skipDeduplication,
        cacheKey,
        signal: abortControllerRef.current.signal,
      });

      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error.message,
        }));
      } else {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [endpoint, useCache, cacheTTL, skipDeduplication, cacheKey]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      // Clear specific cache key
      // This would need to be implemented in the cache manager
      cacheUtils.clearAll();
    }
  }, [cacheKey]);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      lastUpdated: new Date(),
    }));
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    clearCache,
    setData,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, R = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: R | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(async (data?: T, invalidatePatterns?: string[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiRequest<R>(endpoint, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error.message,
        }));
        return { error: response.error };
      } else {
        setState({
          loading: false,
          error: null,
          data: response.data || null,
        });

        // Invalidate cache patterns if provided
        if (invalidatePatterns) {
          invalidatePatterns.forEach(pattern => {
            if (pattern === 'clients') invalidateCache.clients();
            else if (pattern === 'invoices') invalidateCache.invoices();
            else if (pattern === 'estimates') invalidateCache.estimates();
            else if (pattern === 'expenses') invalidateCache.expenses();
            else if (pattern === 'payments') invalidateCache.payments();
            else if (pattern === 'savedItems') invalidateCache.savedItems();
            else if (pattern === 'templates') invalidateCache.templates();
            else if (pattern === 'settings') invalidateCache.settings();
            else if (pattern === 'reports') invalidateCache.reports();
            else if (pattern === 'all') invalidateCache.all();
          });
        }

        return { data: response.data };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { error: { message: errorMessage } };
    }
  }, [endpoint, method]);

  return {
    mutate,
    ...state,
  };
}

// Hook for real-time data that needs frequent updates
export function useRealtimeApi<T>(
  endpoint: string,
  intervalMs: number = 30000, // 30 seconds default
  options: UseApiOptions = {}
) {
  const { data, loading, error, refetch, lastUpdated } = useApi<T>(endpoint, {
    ...options,
    cacheTTL: 2 * 60 * 1000, // 2 minutes for real-time data
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [refetch, intervalMs]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  baseEndpoint: string,
  pageSize: number = 20,
  options: UseApiOptions = {}
) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const endpoint = `${baseEndpoint}?page=${page}&limit=${pageSize}`;
  
  const { data, loading, error, refetch } = useApi<T>(endpoint, {
    ...options,
    dependencies: [page],
  });

  const loadNextPage = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const loadPreviousPage = useCallback(() => {
    if (!loading && page > 1) {
      setPage(prev => prev - 1);
    }
  }, [loading, page]);

  const goToPage = useCallback((newPage: number) => {
    if (!loading && newPage >= 1) {
      setPage(newPage);
    }
  }, [loading]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    page,
    hasMore,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    resetPagination,
  };
}

// Hook for search functionality with debouncing
export function useSearchApi<T>(
  baseEndpoint: string,
  debounceMs: number = 300,
  options: UseApiOptions = {}
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const endpoint = debouncedSearchTerm 
    ? `${baseEndpoint}?search=${encodeURIComponent(debouncedSearchTerm)}`
    : baseEndpoint;

  const { data, loading, error, refetch } = useApi<T>(endpoint, {
    ...options,
    dependencies: [debouncedSearchTerm],
  });

  return {
    data,
    loading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export default {
  useApi,
  useApiMutation,
  useRealtimeApi,
  usePaginatedApi,
  useSearchApi,
};
