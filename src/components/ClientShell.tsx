/* ------------------------------------------------------------------ */
/*  src/components/ClientShell.tsx                                    */
/* ------------------------------------------------------------------ */
"use client";

import type { ReactNode } from "react";
import useAutoLogout from "@/hooks/useAutoLogout";

/** Keep the shape loose so you can pass either the full DashboardUser
 *  or just the public bits you need in the sidebar.  Make it optional
 *  because the sidebar can fall back to the auth context if you don’t
 *  have the user on first render. */
export type InitialUser = {
  _id: string;
  username?: string;
  email?: string;
  role?: { name: string };
} | null;

interface Props {
  initialUser?: InitialUser;
  children: ReactNode;
}

export default function ClientShell({ children }: Props) {
  useAutoLogout(); // <— sets the “4 h” expiry timer + cross‑tab sync

  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
