// app/components/LogoComponent.tsx (Server Component)

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchData } from "@/lib/fetchData";

export interface LogoData {
  name: string;
  logoImageUrl: string;
}

export const revalidate = 60;

export default async function LogoComponent() {
  const { name, logoImageUrl }: LogoData = await fetchData<LogoData>(
    "/website/header/getHeaderData"
  ).catch(() => ({ name: "", logoImageUrl: "" } as LogoData));

  const isSvg = Boolean(logoImageUrl && logoImageUrl.toLowerCase().endsWith(".svg"));

  return (
    <Link
      href="/"
      aria-label="Home page"
      className="relative w-full aspect-[16/15] max-h-[64px] max-2xl:max-h-[64px] max-2xl:max-w-[298px] max-w-[298px] max-md:max-h-[32px] max-md:max-w-[149px]"
      title={name || "Home"}
    >
      {/* If SVG: use mask to color it white */}
      {isSvg && logoImageUrl ? (
        <span
          aria-hidden
          className="absolute inset-0 block bg-white" // <- change this to any color you want
          style={{
            WebkitMaskImage: `url(${logoImageUrl})`,
            maskImage: `url(${logoImageUrl})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          } as React.CSSProperties}
        />
      ) : logoImageUrl ? (
        // Non-SVG fallback (PNG/JPG): just render normally
        <Image
          src={logoImageUrl}
          alt={`${name || "Brand"} logo`}
          fill
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
          sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 100vw"
          className="object-contain"
          priority
        />
      ) : null}
    </Link>
  );
}
