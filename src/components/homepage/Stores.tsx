import React from "react";
import StoresCarousel from "@/components/OurStores/StoresCarousel";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

export interface StoreType {
  _id?: string;
  name: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: {
    [day: string]: { open: string; close: string }[];
  };
}

interface BoutiqueHomePageTitles {
  HPboutiqueTitle?: string;
  HPboutiqueSubTitle?: string;
}

export default async function Stores() {
  let titles: BoutiqueHomePageTitles = {};
  try {
    titles = await fetchData<BoutiqueHomePageTitles>("store/storeHomePageTitles");
  } catch (err) {
    console.error("Error fetching boutique titles:", err);
  }

  let storesData: StoreType[] = [];
  try {
    storesData = await fetchData<StoreType[]>("store");
  } catch (err) {
    console.error("Error fetching store data:", err);
    return (
      <section className="w-[95%] mx-auto py-8">
        <p className="text-red-500">Échec du chargement des boutiques.</p>
      </section>
    );
  }

  if (!storesData.length) return null;

  return (
    <section className="w-[95%] mx-auto py-8">
      <div className="flex w-full flex-col gap-[8px] items-center mb-4">
        <h3 className="font-bold text-2xl text-HomePageTitles capitalize">
          {titles.HPboutiqueTitle || "Nos boutiques"}
        </h3>
        {titles.HPboutiqueSubTitle && (
          <p className="test-base max-md:text-sm text-[#525566] text-center">{titles.HPboutiqueSubTitle}</p>
        )}
      </div>

      <StoresCarousel storesData={storesData} />
    </section>
  );
}
