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
    <div className="flex w-fit max-lg:w-[50%] gap-[16px] items-center justify-around">
      <Link href="/" aria-label="Home page">
        <Image
          src={logoImageUrl || "/fallback-image.jpg"}
          alt={`${name} logo`}
          width={400}
          height={60}
          placeholder="blur"
          blurDataURL={logoImageUrl || "/fallback-image.jpg"}
          sizes="(max-width: 640px) 15vw, (max-width: 1200px) 15vw"
          className="w-[400px] h-[60px] object-cover"
        />
      </Link>
    </div>
  );
}
