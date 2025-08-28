import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

// Custom Clerk provider with minimal configuration
export const OptimizedClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_c3F1YXJlLXB1bWEtNTMuY2xlcmsuYWNjb3VudHMuZGV2JA";
  
  // Debug logging
  console.log('Clerk Config Debug:', {
    hasPublishableKey: !!publishableKey,
    keyLength: publishableKey?.length,
  });
  
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
};
