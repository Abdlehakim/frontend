// src/components/homepage/Stores.tsx
import React from "react";
import StoresCarousel from "@/components/OurStores/StoresCarousel";
import { fetchData } from "@/lib/fetchData";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// TypeScript interfaces
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

interface BoutiqueHomePageTitles {
  HPboutiqueTitle?: string;
  HPboutiqueSubTitle?: string;
}

export default async function Stores() {
  // 1) Fetch the homepage titles for "Nos boutiques"
  let titles: BoutiqueHomePageTitles = {};
  try {
    titles = await fetchData<BoutiqueHomePageTitles>(
      "store/storeHomePageTitles"
    );
  } catch (err) {
    console.error("Error fetching boutique titles:", err);
  }

  // 2) Fetch the actual list of stores
  let storesData: StoreType[] = [];
  try {
    storesData = await fetchData<StoreType[]>("store");
  } catch (err) {
    console.error("Error fetching store data:", err);
    return (
      <div className="w-[95%] mx-auto py-8">
        <p className="text-red-500">Échec du chargement des boutiques.</p>
      </div>
    );
  }

  // 3) If there are no stores, render nothing (or a placeholder as you prefer)
  if (!storesData.length) {
    return null;
  }

  return (
    <div className="w-[95%] mx-auto py-8">
      {/* Dynamic title & subtitle */}
      <div className="flex w-full flex-col gap-[8px] items-center mb-4">
        <h3 className="font-bold text-2xl text-HomePageTitles capitalize">
          {titles.HPboutiqueTitle || "Nos boutiques"}
        </h3>
        {titles.HPboutiqueSubTitle && (
          <p className="text-base text-[#525566]">
            {titles.HPboutiqueSubTitle}
          </p>
        )}
      </div>

      {/* Carousel */}
      <StoresCarousel storesData={storesData} />
    </div>
  );
}
