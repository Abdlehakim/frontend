/* ------------------------------------------------------------------
   src/hooks/useAuth.tsx
   ------------------------------------------------------------------ */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchData } from "@/lib/fetchData";

/* ───────── types ───────── */
export interface User {
  _id: string;
  email: string;
  username?: string;
  phone?: string;
  isGoogleAccount: boolean;
}
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/* ───────── context ───────── */
const AuthContext = createContext<AuthContextValue | null>(null);

/* ───────── provider ───────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----- GET /auth/me ----- */
  const refresh = useCallback(async () => {
    try {
      const data = await fetchData<{ user: User | null }>("/auth/me", {
        credentials: "include",
      });
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  /* ----- POST /signin ----- */
  const login = useCallback(
    async (email: string, password: string) => {
      await fetchData("/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      await refresh();
    },
    [refresh],
  );

  /* ----- POST /logout ----- */
  const logout = useCallback(async () => {
    await fetchData("/auth/logout", { method: "POST", credentials: "include" });
    
    setUser(null);
  }, []);

  /* ----- initial cookie check ----- */
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const ctx: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

/* ───────── consumer hook ───────── */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
