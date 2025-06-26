// src/lib/fetchData.ts
import { cache } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

/**
 * Generic fetch helper that:
 * - Caches via React’s cache
 * - Always targets `${BACKEND_URL}/api/...`
 * - Throws on non-2xx
 */
export const fetchData = cache(async <T>(
  endpoint: string,
  options: RequestInit & { next?: { revalidate: number } } = {}
): Promise<T> => {
  // ensure leading slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_URL}/api${path}`;

  // spread whatever cache/next settings you want
  const res = await fetch(url, {
    ...options
  });

  if (!res.ok) {
    throw new Error(`fetchData failed (${res.status}): ${res.statusText}`);
  }
  return res.json();
});
