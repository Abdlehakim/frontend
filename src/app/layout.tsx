/* ------------------------------------------------------------------
   src/app/layout.tsx
------------------------------------------------------------------ */
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";

// Keep globals.css for truly critical styles only
import "@/app/globals.css"; 

import AsyncStyles from "./AsyncStyles";

/* ---------- font ---------- */
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={poppins.className}>
      <body>
        {children}
        {/* Inject non-critical CSS after first paint (non-blocking) */}
        <AsyncStyles />
      </body>
    </html>
  );
}
