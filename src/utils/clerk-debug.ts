// Clerk Debug Utility
export const debugClerk = () => {
  console.log('=== Clerk Debug Information ===');
  
  // Environment variables
  console.log('Environment Variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
    MODE: import.meta.env.MODE,
  });

  // Browser information
  console.log('Browser Info:', {
    userAgent: navigator.userAgent,
    currentUrl: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol,
  });

  // Cookies
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const clerkCookies = cookies.filter(cookie => 
    cookie.startsWith('__session') || 
    cookie.startsWith('__client') ||
    cookie.includes('clerk')
  );

  console.log('Cookies:', {
    total: cookies.length,
    clerkCookies,
    allCookies: cookies,
  });

  // Check if Clerk is loaded
  try {
    // @ts-ignore
    if (window.Clerk) {
      console.log('Clerk is loaded in window object');
    } else {
      console.log('Clerk is NOT loaded in window object');
    }
  } catch (error) {
    console.log('Error checking Clerk window object:', error);
  }

  // Test API URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  console.log('API URL Test:', {
    apiUrl,
    testEndpoint: `${apiUrl}/api/test-auth`,
  });

  return {
    environment: {
      apiUrl: import.meta.env.VITE_API_URL,
      clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
      mode: import.meta.env.MODE,
    },
    browser: {
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      origin: window.location.origin,
    },
    cookies: {
      total: cookies.length,
      clerkCookies,
    },
    clerkLoaded: typeof window !== 'undefined' && 'Clerk' in window,
  };
};

// Test API connectivity
export const testApiConnectivity = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  try {
    console.log('Testing API connectivity...');
    
    const response = await fetch(`${apiUrl}/api/test-auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('API Test Result:', {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('API Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
