import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from 'lucide-react';
import { getImageUrl } from '../../utils/image';
import { imageCache } from '../../utils/imageCache';
import { cacheRefreshManager } from '../../utils/cacheRefresh';

interface CachedProfileImageProps {
  imageUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CachedProfileImage: React.FC<CachedProfileImageProps> = ({
  imageUrl,
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cachedImageSrc, setCachedImageSrc] = useState<string | null>(null);

  // Memoize the processed image URL to prevent unnecessary recalculations
  const processedImageUrl = useMemo(() => {
    if (!imageUrl || imageError) return null;
    return getImageUrl(imageUrl);
  }, [imageUrl, imageError]);

  // Memoize size classes to prevent unnecessary re-renders
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  }, [size]);

  // Memoize the fallback component to prevent unnecessary re-renders
  const FallbackComponent = useMemo(() => (
    <div className={`${sizeClasses} bg-gray-300 rounded-full flex items-center justify-center ${className}`}>
      <User className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-gray-600`} />
    </div>
  ), [sizeClasses, className, size]);

  // Browser-based image caching with base64 and auto-refresh
  useEffect(() => {
    if (!processedImageUrl) {
      setCachedImageSrc(null);
      return;
    }

    // Use the image cache utility
    const loadCachedImage = async () => {
      try {
        // Check if image is already cached
        const cached = await imageCache.getCachedImage(processedImageUrl);
        if (cached) {
          setCachedImageSrc(cached);
          setImageLoaded(true);
          setImageError(false);
          
          // Start background refresh for this image
          cacheRefreshManager.startRefreshForImage(processedImageUrl);
          return;
        }

        // If not cached, fetch and cache it
        const cachedUrl = await imageCache.cacheImage(processedImageUrl);
        if (cachedUrl) {
          setCachedImageSrc(cachedUrl);
          setImageLoaded(true);
          setImageError(false);
          
          // Start background refresh for this image
          cacheRefreshManager.startRefreshForImage(processedImageUrl);
        } else {
          throw new Error('Failed to cache image');
        }
      } catch (error) {
        console.error('Error loading cached profile image:', error);
        setImageError(true);
        setImageLoaded(false);
      }
    };

    loadCachedImage();

    // Cleanup: stop refresh when component unmounts or URL changes
    return () => {
      if (processedImageUrl) {
        cacheRefreshManager.stopRefreshForImage(processedImageUrl);
      }
    };
  }, [processedImageUrl]);

  // No need for cleanup since the image cache utility handles it
  // The cache utility manages object URL lifecycle

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  // If no image URL or error occurred, show fallback
  if (!processedImageUrl || !cachedImageSrc) {
    return FallbackComponent;
  }

  return (
    <>
      <img
        src={cachedImageSrc}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Load immediately since it's cached
      />
      {!imageLoaded && !imageError && FallbackComponent}
    </>
  );
};

export default CachedProfileImage;
