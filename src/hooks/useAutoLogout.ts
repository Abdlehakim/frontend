/* ------------------------------------------------------------------
   src/hooks/useAutoLogout.ts
------------------------------------------------------------------ */
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

  const routerRef   = useRef(router);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<number | null>(null);
  const bcRef       = useRef<BroadcastChannel | null>(null);

  /* keep router in a ref so we don't need it in deps */
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // run once
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    bcRef.current?.close();

    const raw = Cookies.get(TIMER_COOKIE);
    console.log("[autoLogout] exp cookie:", raw);
    if (!raw) return;

    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    const delay = Math.min(Math.max(expMs - Date.now(), 0), MAX_DELAY);
    console.log("[autoLogout] delay:", delay);

    const doClientLogout = async (callBackend: boolean) => {
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
        routerRef.current.replace("/signin");
        routerRef.current.refresh();
      }
    };

    // main timeout
    timerRef.current = setTimeout(() => {
      console.log("[autoLogout] timeout fired");
      doClientLogout(true);
    }, delay);

    // safety interval (tab throttle)
    intervalRef.current = window.setInterval(() => {
      const r = Cookies.get(TIMER_COOKIE);
      if (!r) return;
      if (Date.now() >= Number(r)) {
        console.log("[autoLogout] interval detected expiry");
        doClientLogout(true);
      }
    }, 15000);

    // cross-tab sync
    bcRef.current = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null;
    if (bcRef.current) {
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "logout") {
          console.log("[autoLogout] broadcast logout received");
          doClientLogout(false);
        }
      };
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      bcRef.current?.close();
    };
  
  }, []); 
}
