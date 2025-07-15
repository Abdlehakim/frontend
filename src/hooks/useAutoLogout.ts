// src/hooks/useAutoLogout.ts
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchData } from "@/lib/fetchData";

const TIMER_COOKIE = "token_FrontEnd_exp";
const LOGOUT_PATH  = "/auth/logout";
const MAX_DELAY    = 2_147_483_647;
const EXTRA_DELAY  = 10_000; // 10 seconds

export default function useAutoLogout() {
  const router = useRouter();
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // clear any existing timer
    if (timer.current) clearTimeout(timer.current);

    // read expiry from the JS‑readable cookie
    const raw = Cookies.get(TIMER_COOKIE);
    if (!raw) return;
    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    // time until actual expiry
    const untilExpiry = Math.max(expMs - Date.now(), 0);
    // add our extra 10s
    const logoutDelay = Math.min(untilExpiry + EXTRA_DELAY, MAX_DELAY);

    console.log(
      `Token expires in ${untilExpiry}ms; ` +
      `scheduling redirect in ${logoutDelay}ms`
    );

    const bc = new BroadcastChannel("auth");

    timer.current = setTimeout(() => {
      console.log("useAutoLogout: performing logout redirect");

      // inform other tabs
      bc.postMessage({ type: "logout" });

      // redirect this tab after total delay
      router.replace("/signin");

      // fire‑and‑forget backend logout
      fetchData(LOGOUT_PATH, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }, logoutDelay);

    // handle cross‑tab logout
    bc.onmessage = (e) => {
      if (e.data?.type === "logout") {
        router.replace("/signin");
      }
    };

    // cleanup on unmount
    return () => {
      if (timer.current) clearTimeout(timer.current);
      bc.close();
    };
  }, [router]);
}
