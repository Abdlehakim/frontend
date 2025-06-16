"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  username?: string;
  phone?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${backendUrl}/api/auth/me`, {
          credentials: "include",
        });

        // If the response is not OK, handle 401/403 gracefully.
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setUser(null);
            setIsAuthenticated(false);
          } else {
            console.error("Error fetching user data:", res.statusText);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          const data = await res.json();
          // If the backend returns { user: null } for unauthenticated requests.
          if (!data.user) {
            setUser(null);
            setIsAuthenticated(false);
          } else {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching user:", error.message);
        } else {
          console.error("Unknown error fetching user");
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [backendUrl]);

  return { user, isAuthenticated, loading };
}
