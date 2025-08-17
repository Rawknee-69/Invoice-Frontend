import React from "react";
import { useAuth } from "../hooks/useAuth";

export const DebugUser: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug: User Data</h4>
      <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default DebugUser;
