"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ---------- types ---------- */
export interface User {
  _id: string;
  email: string;
  username?: string;
  phone?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/* ---------- context ---------- */
const AuthContext = createContext<AuthContextValue | null>(null);

/* ---------- provider ---------- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  /* --- hit /api/auth/me and sync state --- */
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("unauthenticated");

      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, [backendUrl]);

  /* --- POST /api/signin --- */
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${backendUrl}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Invalid credentials");
      }

      const data = await res.json().catch(() => ({}));
      if (data.user) {
        setUser(data.user);
      } else {
        await refresh();
      }
    },
    [backendUrl, refresh],
  );

  /* --- GET /api/logout --- */
  const logout = useCallback(async () => {
    await fetch(`${backendUrl}/api/logout`, { credentials: "include" });
    setUser(null);
  }, [backendUrl]);

  /* --- initial cookie check --- */
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------- consumer hook ---------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
