/* ------------------------------------------------------------------ */
/*  src/components/ClientShell.tsx                                    */
/* ------------------------------------------------------------------ */
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useAutoLogout from "@/hooks/useAutoLogout";
import LoadingDots from "@/components/LoadingDots";

interface Props {
  children: ReactNode;
}

export default function ClientShell({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Run auto-logout ONLY when we know auth state and the user is authenticated
  useAutoLogout(isAuthenticated && !loading);

  // If not authenticated once loading finishes, bounce to /signin
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center">
        <LoadingDots />
      </div>
    );
  }

  if (!isAuthenticated) return null; // will redirect

  return <>{children}</>;
}
