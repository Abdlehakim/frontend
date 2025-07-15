/* ------------------------------------------------------------------ */
/*  src/hooks/useAutoLogout.ts                                        */
/* ------------------------------------------------------------------ */
"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";  // ← import usePathname
import Cookies from "js-cookie";
import { fetchData } from "@/lib/fetchData";

const TIMER_COOKIE = "token_FrontEnd_exp";
const LOGOUT_PATH  = "/auth/logout";
const MAX_DELAY    = 2_147_483_647;

export default function useAutoLogout() {
  const router   = useRouter();
  const pathname = usePathname();  // ← read current path
  const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    const raw = Cookies.get(TIMER_COOKIE);
    if (!raw) return;
    const expMs = Number(raw);
    if (!Number.isFinite(expMs)) return;

    const delay = Math.min(Math.max(expMs - Date.now(), 0), MAX_DELAY);
    console.log("scheduling logout in", delay, "ms");

    const bc = new BroadcastChannel("auth");

    timer.current = setTimeout(async () => {
      console.log("logout timeout fired");
      await fetchData(LOGOUT_PATH, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
      bc.postMessage({ type: "logout" });
      // only navigate if not already on /signin
      if (pathname !== "/signin") {
        router.replace("/signin");
      }
    }, delay);

    bc.onmessage = (e) => {
      if (e.data?.type === "logout") {
        // only navigate if not already on /signin
        if (pathname !== "/signin") {
          router.replace("/signin");
        }
      }
    };

    return () => {
      if (timer.current) clearTimeout(timer.current);
      bc.close();
    };
  }, [router, pathname]);  // ← add pathname to deps
}
