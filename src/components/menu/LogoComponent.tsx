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
    <div className="flex  items-center w-[300px] h-[70px] justify-around z-40">
      <Link href="/" aria-label="Home page">
        <Image
          src={logoImageUrl || "/fallback-image.jpg"}
          alt={`${name} logo`}
          width={300}
          height={70}
          placeholder="blur"
          blurDataURL={logoImageUrl || "/fallback-image.jpg"}
          sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 100vw"
          className="object-cover max-md:h-fit h-[70px]"
        />
      </Link>
    </div>
  );
}
