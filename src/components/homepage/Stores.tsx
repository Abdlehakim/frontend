import React from "react";
import { cache } from "react";
import StoresCarousel from "@/components/OurStores/StoresCarousel";

// We can revalidate every 60 seconds (ISR)
export const revalidate = 60;

// TypeScript interface matching your store documents:
export interface StoreType {
  _id?: string;
  name: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: {
    [day: string]: {
      open: string;
      close: string;
    }[];
  };
}

// Wrap the fetch call in React's cache function
const fetchStoreData = cache(async function fetchStoreData(): Promise<StoreType[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}/api/store`, {
    // "no-store" ensures we always get fresh data on each request.
    // Adjust if you want different caching behavior.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch store data: ${res.status} ${res.statusText}`);
  }

  return res.json();
});

export default async function Stores() {
  let storesData: StoreType[];

  try {
    storesData = await fetchStoreData();
  } catch (error) {
    console.error("Error fetching store data:", error);
    return (
      <div className="w-[95%] mx-auto py-8">
        <p className="text-red-500">Failed to load store data.</p>
      </div>
    );
  }

  // No data found case
  if (!storesData || storesData.length === 0) {
    return (
      <>
      </>
    );
  }

  // If data was successfully fetched, render the carousel
  return (
    <div className="w-[95%] mx-auto py-8">
      <div className="flex w-full flex-col gap-[8px] items-center">
        <h3 className="font-bold text-4xl text-HomePageTitles">Nos boutiques</h3>
      </div>
      <StoresCarousel storesData={storesData} />
    </div>
  );
}
