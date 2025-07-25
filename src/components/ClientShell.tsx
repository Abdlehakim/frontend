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
      <>{children}</>
  );
}
