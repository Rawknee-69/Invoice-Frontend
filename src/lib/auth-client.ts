import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

// Re-export Clerk hooks for compatibility
export const useSession = useClerkAuth;
export const useUserData = useUser;

// Helper function to get auth token
export const getAuthToken = async () => {
  // This will be handled by Clerk's built-in token management
  return null;
};

// Helper function to sign out
export const signOut = async () => {
  // This will be handled by Clerk's built-in sign out
  return null;
};
