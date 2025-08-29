import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { debugClerk, testApiConnectivity } from '../utils/clerk-debug';
import AuthDebugger from '../components/AuthDebugger';

const ClerkTestPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Run debug when component mounts
    const info = debugClerk();
    setDebugInfo(info);
  }, []);

  const handleApiTest = async () => {
    setTesting(true);
    try {
      const result = await testApiConnectivity();
      setApiTestResult(result);
    } catch (error) {
      setApiTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDebugRefresh = () => {
    const info = debugClerk();
    setDebugInfo(info);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Clerk Authentication Test</h1>
        
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

          {/* Debug Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Debug Information</h2>
              <button
                onClick={handleDebugRefresh}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
            
            {debugInfo && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Environment</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo.environment, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Browser</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo.browser, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Cookies</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo.cookies, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Clerk Status</h3>
                  <p>Clerk Loaded: {debugInfo.clerkLoaded ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button
              onClick={handleApiTest}
              disabled={testing}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test API Connectivity'}
            </button>
            
            {apiTestResult && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">API Test Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(apiTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Check Authentication:</strong> Make sure you're logged in</p>
              <p>2. <strong>Check Environment:</strong> Verify API URL and Clerk key are set</p>
              <p>3. <strong>Check Cookies:</strong> Look for Clerk session cookies</p>
              <p>4. <strong>Check API Test:</strong> Run the API connectivity test</p>
              <p>5. <strong>Check Console:</strong> Open browser console for detailed logs</p>
              <p>6. <strong>Clerk Dashboard:</strong> Verify your domain is allowed in Clerk settings</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Debugger */}
      <AuthDebugger />
    </div>
  );
};

export default ClerkTestPage;
