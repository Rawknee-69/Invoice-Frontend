import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const { getToken } = useClerkAuth();

  const apiCall = useCallback(async (url: string, options: ApiOptions = {}) => {
    try {
      const token = await getToken();

      const urlsa= "http://ugck080wkk4wcs0scw8gkk8c.168.231.79.45.sslip.io "
      
      const response = await fetch(`${urlsa}/${url}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }, [getToken]);

  return { apiCall };
};
