import React, { useState } from "react";
import { signIn, signOut, signUp, useSession } from "../lib/auth-client";
import { AuthContext } from "./auth-context";
import { toastMessages } from "../../Docs/utils/toast";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: boolean;
}

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
        emailVerified: session.user.emailVerified || false,
      }
    : null;

  const login = async () => {
    try {
      setIsLoggingIn(true);
      await signIn.social({
        provider: "google",
        // The backend will handle the redirect to frontend/home after successful auth
      });
      toastMessages.auth.loginSuccess("Google");
    } catch (error) {
      console.error("Login failed:", error);
      toastMessages.auth.loginError("Google");
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setIsLoggingIn(true);
      await signIn.social({
        provider: "apple",
        // The backend will handle the redirect to frontend/home after successful auth
      });
      toastMessages.auth.loginSuccess("Apple");
    } catch (error) {
      console.error("Apple login failed:", error);
      toastMessages.auth.loginError("Apple");
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      await signIn.email({
        email,
        password,
      });
      toastMessages.auth.loginSuccess();
    } catch (error) {
      console.error("Email login failed:", error);
      toastMessages.auth.invalidCredentials();
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setIsLoggingIn(true);
      await signUp.email({
        email,
        password,
        name,
      });
      toastMessages.auth.signupSuccess();
      toastMessages.general.info(
        "Please check your email to verify your account before signing in."
      );
    } catch (error) {
      console.error("Email signup failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      if (errorMessage.includes("email")) {
        toastMessages.auth.emailExists();
      } else if (errorMessage.includes("password")) {
        toastMessages.auth.passwordTooShort();
      } else {
        toastMessages.auth.signupError();
      }
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toastMessages.auth.logoutSuccess();
      // Redirect to landing page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      toastMessages.auth.logoutError();

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
    loginWithApple,
    loginWithEmail,
    signUpWithEmail,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
