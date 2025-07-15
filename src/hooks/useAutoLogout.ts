/* ------------------------------------------------------------------ */
/*  src/hooks/useAutoLogout.ts                                        */
/* ------------------------------------------------------------------ */
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchData } from "@/lib/fetchData";  

const TIMER_COOKIE = "token_FrontEnd_exp";
const LOGOUT_PATH  = "/auth/logout";   
const MAX_DELAY    = 2_147_483_647;           

export default function useAutoLogout() {
  const router = useRouter();
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* clear any previous timer (route changes, re‑mounts, etc.) */
    if (timer.current) clearTimeout(timer.current);

    /* read expiry from the JS‑readable cookie */
    const raw = Cookies.get(TIMER_COOKIE);
    if (!raw) return;

    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    /* delay = time until expiry but never exceed setTimeout’s max */
    const delay = Math.min(Math.max(expMs - Date.now(), 0), MAX_DELAY);
console.log("useAutoLogout mounted, raw cookie =", raw);
    /* cross‑tab logout sync */
    const bc = new BroadcastChannel("auth");
console.log("scheduling logout in", delay, "ms");
    timer.current = setTimeout(async () => {
       console.log("logout timeout fired");
      /* hit backend to clear cookies + session */
      await fetchData(LOGOUT_PATH, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
      /* notify other tabs and redirect */
      bc.postMessage({ type: "logout" });
      router.replace("/");
    }, delay);

    /* listen for logout from another tab */
  bc.onmessage = (e) => {
     console.log("received broadcast:", e.data);
  if (e.data?.type === "logout") router.replace("/");
};

    /* cleanup on unmount */
    return () => {
      if (timer.current) clearTimeout(timer.current);
      bc.close();
    };
  }, [router]);
}
