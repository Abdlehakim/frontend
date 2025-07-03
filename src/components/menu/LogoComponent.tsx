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
  const { name, logoImageUrl }: LogoData =
    await fetchData<LogoData>("/website/header/getHeaderData")
      .catch(() => ({ name: "", logoImageUrl: "" } as LogoData));

  return (
    <div className="relative w-full aspect-[16/15] max-h-[80px] max-w-[350px] max-md:max-h-[40px] max-md:max-w-[160px] z-40">
      <Link href="/" aria-label="Home page">
        <Image
          src={logoImageUrl || "/fallback-image.jpg"}
          alt={`${name} logo`}
        fill
          placeholder="blur"
          blurDataURL={logoImageUrl || "/fallback-image.jpg"}
          sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 100vw"
          className="object-cover"
        />
      </Link>
    </div>
  );
}
