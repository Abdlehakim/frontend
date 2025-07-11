/* eslint-disable @next/next/no-css-tags */
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import GoogleIdentityLoader from "@/components/GoogleIdentityLoader";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: [
    "100", "200", "300", "400",
    "500", "600", "700", "800", "900",
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
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${poppins.className} !scroll-smooth font-sans`}
    >
      <head>
        {/* critical stylesheet, loaded with high priority */}
        <link
          rel="stylesheet"
          href="/_next/static/css/5fd3db404cee2557.css"
          precedence="default"
          fetchPriority="high"
        />
      </head>

      <body>
        <Providers>{children}</Providers>
        <GoogleIdentityLoader />
      </body>
    </html>
  );
}
