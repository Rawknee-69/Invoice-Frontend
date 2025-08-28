// Background cache refresh utility
import { imageCache } from './imageCache';

class CacheRefreshManager {
  private static instance: CacheRefreshManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private cachedUrls = new Set<string>();

  static getInstance(): CacheRefreshManager {
    if (!CacheRefreshManager.instance) {
      CacheRefreshManager.instance = new CacheRefreshManager();
    }
    return CacheRefreshManager.instance;
  }

  // Start background refresh for an image URL
  startRefreshForImage(imageUrl: string): void {
    if (!imageUrl) return;

    this.cachedUrls.add(imageUrl);
    
    // Start refresh interval if not already running
    if (!this.refreshInterval) {
      this.startRefreshInterval();
    }
  }

  // Stop refresh for an image URL
  stopRefreshForImage(imageUrl: string): void {
    if (!imageUrl) return;

    this.cachedUrls.delete(imageUrl);
    
    // Stop refresh interval if no more images to refresh
    if (this.cachedUrls.size === 0 && this.refreshInterval) {
      this.stopRefreshInterval();
    }
  }

  // Start the refresh interval
  private startRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(async () => {
      await this.refreshAllCachedImages();
    }, this.REFRESH_INTERVAL);

    console.log('Cache refresh interval started (5 minutes)');
  }

  // Stop the refresh interval
  private stopRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Cache refresh interval stopped');
    }
  }

  // Refresh all cached images
  private async refreshAllCachedImages(): Promise<void> {
    const urls = Array.from(this.cachedUrls);
    
    if (urls.length === 0) return;

    console.log(`Refreshing ${urls.length} cached images...`);

    const refreshPromises = urls.map(async (url) => {
      try {
        await imageCache.refreshImage(url);
        console.log(`Refreshed cache for: ${url.substring(0, 50)}...`);
      } catch (error) {
        console.error(`Failed to refresh cache for ${url}:`, error);
      }
    });

    await Promise.allSettled(refreshPromises);
    console.log('Cache refresh completed');
  }

  // Get refresh status
  getRefreshStatus(): {
    isRunning: boolean;
    cachedUrlsCount: number;
    nextRefreshIn: number | null;
  } {
    return {
      isRunning: this.refreshInterval !== null,
      cachedUrlsCount: this.cachedUrls.size,
      nextRefreshIn: this.refreshInterval ? this.REFRESH_INTERVAL : null
    };
  }

  // Stop all refresh operations
  stopAll(): void {
    this.cachedUrls.clear();
    this.stopRefreshInterval();
  }
}

export const cacheRefreshManager = CacheRefreshManager.getInstance();

