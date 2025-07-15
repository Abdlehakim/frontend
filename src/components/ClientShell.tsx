/* ------------------------------------------------------------------ */
/*  src/components/ClientShell.tsx                                    */
/* ------------------------------------------------------------------ */
"use client";

import type { ReactNode } from "react";
import useAutoLogout from "@/hooks/useAutoLogout";


interface Props {
  children: ReactNode;
}

export default function ClientShell({ children }: Props) {
  useAutoLogout(); 
  
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
