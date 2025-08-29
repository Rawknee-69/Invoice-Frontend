import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { testAuthentication } from '../utils/test-auth';

const DebugPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const handleTestAuth = async () => {
    setTesting(true);
    try {
      const result = await testAuthentication();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'Unknown error occurred',
          code: 'UNKNOWN',
          timestamp: new Date().toISOString(),
        },
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Page</h1>
        
        <div className="max-w-4xl space-y-6">
          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <div>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
            <div className="space-y-2">
              <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
              <p><strong>Clerk Key:</strong> {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
              <p><strong>Current URL:</strong> {window.location.href}</p>
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button
              onClick={handleTestAuth}
              disabled={testing || !isAuthenticated}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test API Authentication'}
            </button>
            
            {testResult && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Test Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-2 text-sm">
              <p>1. Make sure you're logged in to the application</p>
              <p>2. Check that the authentication status shows "Authenticated: Yes"</p>
              <p>3. Click "Test API Authentication" to test the backend connection</p>
              <p>4. If the test fails, check the browser console for errors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
