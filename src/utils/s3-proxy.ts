const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Cache for pre-signed URLs to prevent duplicate requests
const urlCache = new Map<string, { url: string; expires: number }>();
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Generate pre-signed URL for S3 images to fix 403 errors
 */
export const generatePresignedUrl = async (imageUrl: string): Promise<string> => {
  try {
    // Check cache first (URLs expire after 50 minutes to be safe)
    const cached = urlCache.get(imageUrl);
    if (cached && Date.now() < cached.expires) {
      console.log('Using cached pre-signed URL for:', imageUrl);
      return cached.url;
    }

    // Check if there's already a pending request for this URL
    const pending = pendingRequests.get(imageUrl);
    if (pending) {
      console.log('Waiting for pending request for:', imageUrl);
      return await pending;
    }

    // Create new request
    const requestPromise = (async () => {
      try {
        console.log('Generating new pre-signed URL for:', imageUrl);
        const response = await fetch(`${API_URL}/api/proxy/s3-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          console.error('Failed to generate pre-signed URL:', response.status, response.statusText);
          return imageUrl;
        }

        const data = await response.json();
        const presignedUrl = data.presignedUrl || imageUrl;
        
        // Cache the result (expire in 50 minutes)
        urlCache.set(imageUrl, {
          url: presignedUrl,
          expires: Date.now() + (50 * 60 * 1000)
        });
        
        console.log('Successfully generated pre-signed URL');
        return presignedUrl;
      } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return imageUrl;
      } finally {
        // Remove from pending requests
        pendingRequests.delete(imageUrl);
      }
    })();

    // Store the pending request
    pendingRequests.set(imageUrl, requestPromise);
    
    return await requestPromise;
  } catch (error) {
    console.error('Error in generatePresignedUrl:', error);
    return imageUrl;
  }
};

/**
 * Check if URL needs pre-signing (is an S3 URL)
 */
export const needsPresigning = (url: string): boolean => {
  return url.includes('.s3.') && url.includes('amazonaws.com');
};

/**
 * Get displayable URL (pre-signed if needed)
 */
export const getDisplayableImageUrl = async (imageUrl: string): Promise<string> => {
  if (!imageUrl || !needsPresigning(imageUrl)) {
    return imageUrl;
  }
  
  return await generatePresignedUrl(imageUrl);
};
