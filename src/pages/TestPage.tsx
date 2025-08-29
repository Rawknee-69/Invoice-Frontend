import React from 'react';
import AuthTest from '../components/AuthTest';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        <div className="max-w-2xl">
          <AuthTest />
          
          <div className="mt-8 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
              <p><strong>Clerk Key:</strong> {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
