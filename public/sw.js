const PROFILE_IMAGE_CACHE = 'profile-images-v1';

// Install event - minimal setup
self.addEventListener('install', (event) => {
  console.log('Service Worker installed - image caching only');
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== PROFILE_IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - only handle profile images
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only cache profile images
  if (isProfileImage(request)) {
    event.respondWith(cacheProfileImage(request));
    return;
  }

  // For all other requests, just pass through
  event.respondWith(fetch(request));
});

// Check if request is for a profile image
function isProfileImage(request) {
  const url = new URL(request.url);
  return (
    url.hostname.includes('googleusercontent.com') ||
    // url.hostname.includes('clerk.accounts.dev') ||
    url.pathname.includes('/api/proxy/google-image')
  );
}

// Cache profile images with base64 storage
async function cacheProfileImage(request) {
  const cache = await caches.open(PROFILE_IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Convert to base64 and cache
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      
      // Create a new response with base64 data
      const base64Response = new Response(base64, {
        headers: {
          'Content-Type': 'text/plain',
          'X-Cache-Type': 'base64'
        }
      });
      
      cache.put(request, base64Response);
      return response; // Return original response for immediate use
    }
    return response;
  } catch (error) {
    console.error('Failed to fetch profile image:', error);
    return new Response('', { status: 404 });
  }
}

// Helper function to convert blob to base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
