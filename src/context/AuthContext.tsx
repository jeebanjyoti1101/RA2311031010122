"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearAuthToken, setAuthToken } from "../../logging_middleware/tokenStore";

interface AuthContextValue {
  token: string | null;
  isAuthenticating: boolean;
  authError: string | null;
  authenticate: (credentials: AuthCredentials) => Promise<boolean>;
  logout: () => void;
}

interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start without a token and restore only from sessionStorage on mount.
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth_token");
    if (stored) {
      setToken(stored);
      setAuthToken(stored);
    }
  }, []);

  const authenticate = useCallback(async (credentials: AuthCredentials): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch(`/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const txt = await res.text();
        setAuthError(`Authentication failed (${res.status}).`);
        return false;
      }
      const data = await res.json();
      const t: string = data.access_token;
      setToken(t);
      setAuthToken(t);
      sessionStorage.setItem("auth_token", t);
      return true;
    } catch {
      setAuthError("Network error.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    clearAuthToken();
    sessionStorage.removeItem("auth_token");
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticating, authError, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
