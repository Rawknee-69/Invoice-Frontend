import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Your backend URL
  fetchOptions: {
    credentials: "include", // Always include cookies
  },
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
