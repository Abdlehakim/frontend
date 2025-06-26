// src/app/layout.tsx
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Souk el Meuble – Mobilier & Décoration",
    template: "%s | Souk el Meuble",
  },
  description:
    "Achetez vos meubles et articles de décoration en ligne en Tunisie au meilleur prix.",
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" className={`${poppins.className} !scroll-smooth font-sans`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
