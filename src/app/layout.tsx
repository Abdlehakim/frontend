/* ------------------------------------------------------------------
   src/app/layout.tsx      (root layout – server component)
------------------------------------------------------------------ */
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";

import Providers from "@/components/Providers";
import GoogleIdentityLoader from "@/components/GoogleIdentityLoader";
import ClientShell from "@/components/ClientShell";

import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { fetchData } from "@/lib/fetchData";

/* ---------- font ---------- */
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: [
    "100", "200", "300", "400",
    "500", "600", "700", "800", "900",
  ],
  style: ["normal", "italic"],
  display: "swap",
});

/* ---------- metadata ---------- */
export const metadata: Metadata = {
  title: {
    default: "Souk el Meuble – Mobilier & Décoration",
    template: "%s | Souk el Meuble",
  },
  description:
    "Achetez vos meubles et articles de décoration en ligne en Tunisie au meilleur prix.",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

/* ---------- ISR / caching ---------- */
/** hit the backend at most once per hour for the currency */
export const revalidate = 10; // 1 h

/* ---------- root layout ---------- */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  /* fetch the primary currency once on the server */
  let primary = "TND";
  try {
    const { primaryCurrency } = await fetchData<{ primaryCurrency: string }>(
      "/website/currency/primary",
      {
        next: { revalidate },
      },
    );
    primary = primaryCurrency;
  } catch {
    /* fallback stays "TND" – silent fail */
  }

  return (
    <html lang="fr" className={poppins.className}>
      <body>
        {/* expose the currency to the whole tree */}
        <CurrencyProvider initial={primary}>
          <Providers>
            {/* Auto‑logout + layout shell around all pages */}
            <ClientShell>{children}</ClientShell>
          </Providers>
        </CurrencyProvider>

        {/* Google One‑tap & friends (outside React tree) */}
        <GoogleIdentityLoader />
      </body>
    </html>
  );
}
