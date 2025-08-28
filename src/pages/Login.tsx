import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Invoice from "/src/assets/invoice.png";

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const commonAppearance = {
    elements: {
      formButtonPrimary: 'bg-primary-orange hover:bg-opacity-90 text-white font-bold rounded-[4px] px-5 py-2.5 uppercase text-sm tracking-wide transition-colors',
      card: 'bg-transparent shadow-none border-none p-0',
      headerTitle: 'text-2xl font-bold text-center mb-2',
      headerSubtitle: 'text-gray-600 text-center mb-6',
      socialButtonsBlockButton: 'bg-white border border-gray-300 text-gray-700 font-medium rounded-[4px] px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors',
      formFieldInput: 'w-full px-3 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent',
      formFieldLabel: 'block text-sm font-medium text-gray-700 mb-1',
      footerActionLink: 'text-primary-orange hover:text-opacity-80 font-medium',
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <img
                src={Invoice}
                alt="Invoice Man"
                width={50}
                height={40}
                className="w-10 h-10 lg:w-12 lg:h-12"
              />
              <div className="text-2xl lg:text-3xl font-bold leading-[1.2] text-[#000000]">
                Invoice Man
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isSignUp 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSignUp 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Clerk Component */}
          {isSignUp ? (
            <SignUp 
              appearance={commonAppearance}
              fallbackRedirectUrl="/home"
              signInUrl="/login"
            />
          ) : (
            <SignIn 
              appearance={commonAppearance}
              fallbackRedirectUrl="/home"
              signUpUrl="/login"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
