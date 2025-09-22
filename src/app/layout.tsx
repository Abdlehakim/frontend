// src/app/layout.tsx
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import AsyncStyles from "./AsyncStyles"; // ⬅️ add this

const poppins = Poppins({ subsets: ["latin","latin-ext"], weight: ["400","600","700"], display: "swap" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={poppins.className}>
      <body>
        {children}
        <AsyncStyles /> {/* injects non-blocking CSS after first paint */}
      </body>
    </html>
  );
}
