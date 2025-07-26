/* ------------------------------------------------------------------
   src/hooks/useAutoLogout.ts
------------------------------------------------------------------ */
"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { fetchData } from "@/lib/fetchData";

const TIMER_COOKIE = "token_FrontEnd_exp"; // JS-readable ms timestamp
const LOGOUT_PATH  = "/auth/logout";       // fetchData prepends /api
const MAX_DELAY    = 2_147_483_647;        // setTimeout max (~24.8 days)

export default function useAutoLogout() {
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<number | null>(null);
  const bcRef       = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      bcRef.current?.close();
    };

    cleanup(); // clear leftovers on remounts (dev/strict mode, etc.)

    const raw = Cookies.get(TIMER_COOKIE);
    if (!raw) return;

    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    const delay = Math.min(Math.max(expMs - Date.now(), 0), MAX_DELAY);

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
        bcRef.current?.postMessage({ type: "logout" }); // notify other tabs
        // HARD refresh to ensure fresh state everywhere
        window.location.replace("/signin");
      }
    };

    // Main timeout
    timerRef.current = setTimeout(() => {
      doClientLogout(true);
    }, delay);

    // Safety interval for throttled/background tabs
    intervalRef.current = window.setInterval(() => {
      const r = Cookies.get(TIMER_COOKIE);
      if (!r) return;
      if (Date.now() >= Number(r)) {
        doClientLogout(true);
      }
    }, 15_000);

    // Cross-tab sync
    bcRef.current =
      typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null;

    if (bcRef.current) {
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "logout") {
          doClientLogout(false);
        }
        if (e.data?.type === "refresh-exp" && typeof e.data.exp === "number") {
          // another tab refreshed token; rewrite cookie & re-arm by reloading
          Cookies.set(TIMER_COOKIE, String(e.data.exp), {
            path: "/",
            sameSite: "Lax",
          });
          window.location.reload();
        }
      };
    }

    // Fallback for browsers without BroadcastChannel
    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === TIMER_COOKIE && ev.newValue) {
        window.location.reload();
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
      cleanup();
    };
  }, []);
}
