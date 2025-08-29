import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [cookies, setCookies] = useState<string[]>([]);

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
    setCookies(allCookies);

    // Try to get session info
    const getSessionInfo = async () => {
      try {
        // Check if we can access Clerk session
        const clerkCookies = allCookies.filter(cookie => 
          cookie.startsWith('__session') || 
          cookie.startsWith('__client') ||
          cookie.includes('clerk')
        );
        
        setSessionInfo({
          totalCookies: allCookies.length,
          clerkCookies,
          hasSessionCookie: allCookies.some(cookie => cookie.startsWith('__session')),
          hasClientCookie: allCookies.some(cookie => cookie.startsWith('__client')),
          userAgent: navigator.userAgent,
          currentUrl: window.location.href,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error getting session info:', error);
      }
    };

    getSessionInfo();
  }, [isAuthenticated]);

  const testApiCall = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/test-auth`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Test API Response:', data);
      alert(`API Test Result: ${response.status} - ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`API Test Error: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">Auth Debugger</h4>
      
      <div className="space-y-1">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <p><strong>User:</strong> {user.email}</p>
        )}
        <p><strong>Cookies:</strong> {cookies.length}</p>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
      </div>

      {sessionInfo && (
        <details className="mt-2">
          <summary className="cursor-pointer">Session Details</summary>
          <pre className="mt-1 text-xs overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </details>
      )}

      <button
        onClick={testApiCall}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        Test API
      </button>
    </div>
  );
};

export default AuthDebugger;
