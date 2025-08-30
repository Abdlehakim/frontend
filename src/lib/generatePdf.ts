// src/lib/generatePdf.ts
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

type GeneratePdfInit = {
  method?: "GET" | "POST";
  payload?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export async function generatePdf(
  endpoint: string,
  filename = "document.pdf",
  init: GeneratePdfInit = {}
): Promise<void> {
  const url = `${BACKEND_URL}/api${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const method = init.method ?? (init.payload ? "POST" : "GET");
  const headers: Record<string, string> = {
    Accept: "application/pdf",
    ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
    ...(init.headers ?? {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(init.payload ?? {}) : undefined,
    credentials: init.credentials ?? "include",
    signal: init.signal,
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !/application\/pdf\b/i.test(ct)) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Unexpected response (${res.status}) content-type="${ct}". ${text.slice(0, 300)}`
    );
  }

  const blob = await res.blob();
  const href = URL.createObjectURL(blob);

  // Trigger download
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();

  // IMPORTANT: revoke later (allow the download to start)
  setTimeout(() => {
    URL.revokeObjectURL(href);
    a.remove();
  }, 3000);
}

/** Optional helper if you want to preview in a new tab first */
export async function previewPdf(endpoint: string, init: GeneratePdfInit = {}) {
  const url = `${BACKEND_URL}/api${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
  const res = await fetch(url, {
    method: init.method ?? (init.payload ? "POST" : "GET"),
    headers: {
      Accept: "application/pdf",
      ...(init.payload ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    body: init.payload ? JSON.stringify(init.payload) : undefined,
    credentials: init.credentials ?? "include",
    signal: init.signal,
  });
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  window.open(href, "_blank", "noopener");
  // revoke later (tab has already loaded it)
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}
