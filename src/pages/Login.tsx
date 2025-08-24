import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router";
import Invoice from "/src/assets/invoice.png";
import { toastMessages } from "../utils/toast";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";
import { GenericSkeleton } from "@/skletons";

const Login: React.FC = () => {
  const {
    login,
    loginWithApple,
    loginWithEmail,
    signUpWithEmail,
    isAuthenticated,
    isLoading,
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleGoogleSignIn = async () => {
    try {
      await login();
    } catch (err) {
      // Error is already handled in AuthContext with toast
      console.error("Sign in error:", err);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await loginWithApple();
    } catch (err) {
      // Error is already handled in AuthContext with toast
      console.error("Apple sign in error:", err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toastMessages.validation.requiredFields();
      return;
    }

    if (isSignUp && !formData.name) {
      toastMessages.validation.nameRequired();
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastMessages.validation.invalidEmail();
      return;
    }

    // Basic password validation
    if (formData.password.length < 6) {
      toastMessages.auth.passwordTooShort();
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(formData.email, formData.password, formData.name);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
    } catch (err) {
      // Error is already handled in AuthContext with toast
      console.error("Email auth error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-15 w-15 bg-muted animate-pulse rounded-full mx-auto mb-4" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mb-2" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
              </div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img
              src={Invoice}
              alt="Invoice Man"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Invoice Man
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? "Create your account"
              : "Sign in to manage your invoices, estimates, and expenses"}
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </div>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password Link - only show for sign in */}
            {!isSignUp && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: "", password: "", name: "" });
              }}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="outline"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Apple Sign In Button */}
            <Button
              onClick={handleAppleSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.9 8.4c-.1-1.4.4-2.7 1.2-3.6-.7-1-1.8-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7C3.5 3.4 2 4.5 2 7.1c0 1.6.6 3.3 1.4 4.9.7 1.3 1.3 2.4 2.3 2.4.9 0 1.2-.6 2.6-.6 1.4 0 1.6.6 2.6.6 1.1 0 1.5-1 2.2-2.3.5-.9.7-1.3.7-1.4-.1 0-1.4-.5-1.4-2-.1-1.2.6-1.8.5-1.9-.5-.1-1.2.1-1.5.2zm-1-7.4c.5-.6.9-1.4.8-2.2-.8.1-1.7.5-2.3 1.1-.5.5-.9 1.3-.8 2.1.9.1 1.7-.4 2.3-1z" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          {/* Features */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              What you'll get access to:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Create and manage professional invoices
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Generate estimates and convert to invoices
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Track expenses with receipt scanning
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Manage clients and payment schedules
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Generate detailed reports and analytics
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;
