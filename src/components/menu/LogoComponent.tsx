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

  return (
    
      <Link href="/" aria-label="Home page" className="relative w-full aspect-[16/15] max-h-[64px] max-2xl:max-h-[64px] max-2xl:max-w-[298px] max-w-[298px] max-md:max-h-[32px] max-md:max-w-[149px]">
        <Image
          src={logoImageUrl ?? ""}
          alt={`${name} logo`}
          fill
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
          sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 100vw"
          className="object-cover"
        />
      </Link>
  
  );
}
