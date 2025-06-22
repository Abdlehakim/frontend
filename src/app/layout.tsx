import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";

/* ---------- Google font ---------- */
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

interface RootLayoutProps {
  children: ReactNode;
}

/* ---------- root layout ---------- */
export default function RootLayout({ children }: RootLayoutProps) {


  return (
    
    <html lang="en" className={`${poppins.className} !scroll-smooth font-sans`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
