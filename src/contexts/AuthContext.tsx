import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { toastMessages } from "../utils/toast";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggingIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  token?: string;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      return {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        image: clerkUser.imageUrl,
        emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      };
    }
    return null;
  }, [isLoaded, isSignedIn, clerkUser?.id, clerkUser?.firstName, clerkUser?.lastName, clerkUser?.imageUrl, clerkUser?.emailAddresses]);

  // Convert Clerk user to our User interface with memoization
  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const login = async () => {
    try {
      setIsLoggingIn(true);
      // Clerk handles the login flow automatically
      // This function is kept for compatibility
      toastMessages.auth.loginSuccess();
    } catch (error) {
      console.error("Login failed:", error);
      toastMessages.auth.loginError("Google");
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await clerkSignOut();
      setUser(null);
      toastMessages.auth.logoutSuccess();
    } catch (error) {
      console.error("Logout failed:", error);
      toastMessages.auth.logoutError();
    }
  };

  const refreshUser = async () => {
    // Clerk handles user refresh automatically
    // This function is kept for compatibility
  };

  const checkAuth = async () => {
    // Clerk handles auth checking automatically
    // This function is kept for compatibility
  };

  const value: AuthContextType = {
    user,
    isLoading: !isLoaded,
    isLoggingIn,
    isAuthenticated: isSignedIn || false,
    login,
    logout,
    refreshUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
