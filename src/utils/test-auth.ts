import { apiRequest } from './api';

export const testAuthentication = async () => {
  try {
    console.log('Testing authentication...');
    
    const response = await apiRequest('/api/test-auth');
    
    if (response.error) {
      console.error('Authentication test failed:', response.error);
      return {
        success: false,
        error: response.error,
      };
    }
    
    console.log('Authentication test successful:', response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Authentication test error:', error);
    return {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'Failed to test authentication',
        code: 'TEST_ERROR',
        timestamp: new Date().toISOString(),
      },
    };
  }
};
