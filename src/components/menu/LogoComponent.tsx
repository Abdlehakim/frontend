// app/components/Logo/Logo.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface WebsiteInfo {
  _id?: string;
  name: string;
  address?: string;
  city?: string;
  zipcode?: number;
  governorate?: string;
  logoUrl?: string;
  imageUrl?: string;
  bannerContacts?: string;
  email?: string;
  phone?: string | number;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export default async function Logo() {
  // 1. Fetch the website info from your Express route
  let websiteInfo: WebsiteInfo | null = null;
  try {
    // If your Express server is on the same domain as Next.js:
    // const res = await fetch("/api/websiteinfo", { cache: "no-store" });
    //
    // Otherwise, if it's on a different domain, use an environment variable or direct URL:
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/api/websiteinfo`, {
      cache: "no-store", // always fetch fresh data on each request
    });

    if (!res.ok) {
      console.error("Failed to fetch website info:", res.status, res.statusText);
      return null; // or render a fallback
    }
    websiteInfo = await res.json();
  } catch (error) {
    console.error("Error fetching website info:", error);
    return null; // or render a fallback
  }

  // 2. If no data, render nothing or a fallback
  if (!websiteInfo) {
    return null;
  }

  // 3. Return your Logo JSX
  return (
    <div className="flex w-fit max-lg:w-[50%] gap-[16px] items-center justify-around relative aspect-w-16 aspect-h-9">
      <Link href="/" aria-label="Home page">
        {websiteInfo.logoUrl && (
          <Image
            width={300}
            height={16}
            className="w-[300px]"
            src={websiteInfo.logoUrl}
            alt="Luxe Home logo"
          />
        )}
      </Link>
    </div>
  );
}
