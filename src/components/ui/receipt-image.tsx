import React, { useState, useEffect } from 'react';
import { getDisplayableImageUrl } from '@/utils/s3-proxy';

interface ReceiptImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Receipt image component that automatically handles S3 pre-signed URLs
 */
export const ReceiptImage: React.FC<ReceiptImageProps> = ({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder-receipt.png"
}) => {
  const [displayUrl, setDisplayUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const url = await getDisplayableImageUrl(src);
        setDisplayUrl(url);
      } catch (error) {
        console.error('Error loading receipt image:', error);
        setHasError(true);
        setDisplayUrl(fallbackSrc);
      } finally {
        setIsLoading(false);
      }
    };

    if (src) {
      loadImage();
    } else {
      setDisplayUrl(fallbackSrc);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setDisplayUrl(fallbackSrc);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-muted animate-pulse flex items-center justify-center ${className}`}>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <img
      src={displayUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={() => setIsLoading(false)}
    />
  );
};
