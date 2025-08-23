// Request deduplication utility to prevent duplicate API calls

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private readonly requestTimeout = 30000; // 30 seconds

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check if there's already a pending request
    const existing = this.pendingRequests.get(key);
    
    if (existing) {
      // Check if the existing request is still valid (not too old)
      if (Date.now() - existing.timestamp < this.requestTimeout) {
        return existing.promise;
      } else {
        // Remove stale request
        this.pendingRequests.delete(key);
      }
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes
      this.pendingRequests.delete(key);
    });

    // Store the pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  // Clear all pending requests
  clear(): void {
    this.pendingRequests.clear();
  }

  // Get current pending requests count
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  // Check if a specific request is pending
  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  // Cancel a specific pending request
  cancel(key: string): boolean {
    return this.pendingRequests.delete(key);
  }
}

export const requestDeduplicator = new RequestDeduplicator();

// Helper function to generate request keys
export const generateRequestKey = (
  method: string,
  endpoint: string,
  params?: URLSearchParams | string
): string => {
  const paramString = params ? 
    (typeof params === 'string' ? params : params.toString()) : 
    '';
  return `${method}:${endpoint}${paramString ? `?${paramString}` : ''}`;
};

export default requestDeduplicator;
