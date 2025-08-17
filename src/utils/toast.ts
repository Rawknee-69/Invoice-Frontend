import toast from "react-hot-toast";

/**
 * Utility functions for consistent toast messaging throughout the app
 */
export const toastMessages = {
  // Authentication messages
  auth: {
    loginSuccess: (provider?: string) =>
      toast.success(
        provider
          ? `Successfully signed in with ${provider}!`
          : "Successfully signed in!"
      ),
    loginError: (provider?: string) =>
      toast.error(
        provider
          ? `Failed to sign in with ${provider}. Please try again.`
          : "Failed to sign in. Please try again."
      ),
    signupSuccess: () =>
      toast.success("Account created successfully! Welcome!"),
    signupError: (message?: string) =>
      toast.error(message || "Failed to create account. Please try again."),
    logoutSuccess: () => toast.success("Successfully signed out!"),
    logoutError: () =>
      toast.error("Error signing out, but you've been logged out locally."),
    emailExists: () =>
      toast.error("Email already exists. Please try signing in instead."),
    invalidCredentials: () =>
      toast.error("Invalid email or password. Please try again."),
    passwordTooShort: () =>
      toast.error("Password must be at least 6 characters long."),
  },

  // Form validation messages
  validation: {
    requiredFields: () => toast.error("Please fill in all required fields."),
    invalidEmail: () => toast.error("Please enter a valid email address."),
    nameRequired: () => toast.error("Please enter your name."),
  },

  // General messages
  general: {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    info: (message: string) => toast(message, { icon: "ℹ️" }),
  },

  // API messages
  api: {
    connectionError: () =>
      toast.error("Connection error. Please check your internet connection."),
    serverError: () => toast.error("Server error. Please try again later."),
    timeoutError: () => toast.error("Request timed out. Please try again."),
  },
};

/**
 * Promise-based toast for async operations
 */
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};
