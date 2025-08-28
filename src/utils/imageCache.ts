// Browser-based image caching utility with base64 storage and periodic refresh
class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, { data: string; timestamp: number }>();
  private readonly CACHE_PREFIX = 'profile-image-';
  private readonly MAX_CACHE_SIZE = 10; // Maximum number of cached images
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  // Generate cache key from image URL
  private generateCacheKey(imageUrl: string): string {
    return `${this.CACHE_PREFIX}${btoa(imageUrl).slice(0, 20)}`;
  }

  // Convert image to base64
  private async imageToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  // Check if image is cached and not expired
  async isCached(imageUrl: string): Promise<boolean> {
    const cacheKey = this.generateCacheKey(imageUrl);
    const now = Date.now();
    
    // Check memory cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (now - cached.timestamp < this.CACHE_DURATION) {
        return true;
      }
    }

    // Check session storage
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < this.CACHE_DURATION) {
          this.cache.set(cacheKey, parsed);
          return true;
        }
      } catch (error) {
        // Invalid cache data, remove it
        sessionStorage.removeItem(cacheKey);
      }
    }

    return false;
  }

  // Get cached image URL (base64)
  async getCachedImage(imageUrl: string): Promise<string | null> {
    const cacheKey = this.generateCacheKey(imageUrl);
    const now = Date.now();
    
    // Check memory cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (now - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    // Check session storage
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < this.CACHE_DURATION) {
          this.cache.set(cacheKey, parsed);
          return parsed.data;
        }
      } catch (error) {
        // Invalid cache data, remove it
        sessionStorage.removeItem(cacheKey);
      }
    }

    return null;
  }

  // Cache an image as base64
  async cacheImage(imageUrl: string): Promise<string | null> {
    try {
      const cacheKey = this.generateCacheKey(imageUrl);
      const now = Date.now();
      
      // Check if already cached and not expired
      const existing = await this.getCachedImage(imageUrl);
      if (existing) {
        return existing;
      }

      // Convert image to base64
      const base64Data = await this.imageToBase64(imageUrl);
      
      // Create cache entry
      const cacheEntry = {
        data: base64Data,
        timestamp: now
      };

      // Store in memory cache
      this.cache.set(cacheKey, cacheEntry);

      // Store in session storage
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

      // Clean up old cache entries if needed
      this.cleanupCache();

      return base64Data;
    } catch (error) {
      console.error('Error caching image:', error);
      return null;
    }
  }

  // Refresh cache for a specific image
  async refreshImage(imageUrl: string): Promise<string | null> {
    const cacheKey = this.generateCacheKey(imageUrl);
    
    try {
      // Convert image to base64
      const base64Data = await this.imageToBase64(imageUrl);
      
      // Create cache entry
      const cacheEntry = {
        data: base64Data,
        timestamp: Date.now()
      };

      // Update memory cache
      this.cache.set(cacheKey, cacheEntry);

      // Update session storage
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

      return base64Data;
    } catch (error) {
      console.error('Error refreshing image cache:', error);
      return null;
    }
  }

  // Clean up old cache entries
  private cleanupCache(): void {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }

    // Clean session storage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        try {
          const cached = JSON.parse(sessionStorage.getItem(key)!);
          if (now - cached.timestamp >= this.CACHE_DURATION) {
            sessionStorage.removeItem(key);
          }
        } catch (error) {
          // Invalid cache data, remove it
          sessionStorage.removeItem(key);
        }
      }
    });

    // Remove oldest entries if still over limit
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = sortedEntries.slice(0, entries.length - this.MAX_CACHE_SIZE);

      toRemove.forEach(([key]) => {
        this.cache.delete(key);
        sessionStorage.removeItem(key);
      });
    }
  }

  // Clear all cached images
  clearCache(): void {
    // Clear memory cache
    this.cache.clear();

    // Clear session storage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }

  // Get cache info for debugging
  getCacheInfo(): { size: number; entries: Array<{ key: string; age: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Math.floor((now - value.timestamp) / 1000) // age in seconds
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}

export const imageCache = ImageCache.getInstance();
