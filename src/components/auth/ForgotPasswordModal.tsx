import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastMessages } from "../../utils/toast";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toastMessages.validation.requiredFields();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastMessages.validation.invalidEmail();
      return;
    }

    setIsLoading(true);
    try {
      // Call the Better Auth password reset endpoint
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSent(true);
        toastMessages.general.success(
          "Password reset email sent! Please check your inbox."
        );
      } else {
        toastMessages.general.error(
          "Failed to send password reset email. Please try again."
        );
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toastMessages.api.connectionError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {isSent ? "Email Sent!" : "Reset Password"}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground text-xl"
          >
            ×
          </button>
        </div>

        {isSent ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <p className="text-foreground mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-primary">{email}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Next steps:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset link in the email</li>
                <li>• Create a new password</li>
                <li>• Sign in with your new password</li>
              </ul>
            </div>
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
