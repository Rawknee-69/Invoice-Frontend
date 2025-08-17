import React, { createContext, useContext, useState } from "react";
import { signIn, signOut, useSession } from "../lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image || undefined,
      }
    : null;

  const login = async () => {
    try {
      setIsLoggingIn(true);
      await signIn.social({
        provider: "google",
        // The backend will handle the redirect to frontend/home after successful auth
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      // Redirect to landing page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);

      // Fallback: Clear local session and redirect
      // This ensures user is logged out even if the server call fails
      try {
        // Clear any local storage or session storage if needed
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn("Could not clear storage:", storageError);
      }

      // Always redirect to landing page
      window.location.href = "/";
    }
  };

  const checkAuth = async () => {
    // This is handled by the useSession hook automatically
    return;
  };

  const value = {
    user,
    isLoading: isPending || isLoggingIn,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
