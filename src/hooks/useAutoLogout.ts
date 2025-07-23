/* ------------------------------------------------------------------
   src/hooks/useAutoLogout.ts
------------------------------------------------------------------ */
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchData } from "@/lib/fetchData";

const TIMER_COOKIE = "token_FrontEnd_exp";   // JS-readable expiry (ms timestamp)
const LOGOUT_PATH  = "/auth/logout";         // fetchData adds /api prefix
const MAX_DELAY    = 2_147_483_647;          // ~24.8 days: setTimeout max on browsers

export default function useAutoLogout() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bcRef    = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Close old channel
    bcRef.current?.close();
    bcRef.current = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null;

    // Read expiry from cookie
    const raw = Cookies.get(TIMER_COOKIE);
    if (!raw) return; // no expiry cookie => nothing to schedule

    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    const delay = Math.min(Math.max(expMs - Date.now(), 0), MAX_DELAY);
    // console.log("useAutoLogout: scheduling logout in", delay, "ms");

    const doClientLogout = async (callBackend = true) => {
      try {
        if (callBackend) {
          await fetchData<void>(LOGOUT_PATH, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        }
      } finally {
        Cookies.remove(TIMER_COOKIE);
        bcRef.current?.postMessage({ type: "logout" });
        router.replace("/signin");
        router.refresh();
      }
    };

    // Schedule auto-logout
    timerRef.current = setTimeout(() => {
      // console.log("useAutoLogout: timeout fired");
      doClientLogout(true);
    }, delay);

    // Listen for cross-tab logout
    if (bcRef.current) {
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "logout") {
          // console.log("useAutoLogout: received broadcast logout");
          doClientLogout(false);
        }
      };
    }

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      bcRef.current?.close();
    };
  }, [router]);
}