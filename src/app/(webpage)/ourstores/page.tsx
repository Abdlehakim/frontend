import { cache } from "react";
import Banner from "@/components/Banner";
import AllStore from "@/components/OurStores/AllStore";
import { notFound } from "next/navigation";

interface OpeningHour {
  open: string;
  close: string;
  _id: string;
}

interface OpeningHours {
  Monday?: OpeningHour[];
  Tuesday?: OpeningHour[];
  Wednesday?: OpeningHour[];
  Thursday?: OpeningHour[];
  Friday?: OpeningHour[];
  Saturday?: OpeningHour[];
  Sunday?: OpeningHour[];
}

interface Store {
  _id: string;
  name: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: OpeningHours;
}

interface StoreBanner {
  _id: string;
  title: string;
  banner: string;
}

export const revalidate = 60;

const fetchStoreData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; // <-- changed from "throw new Error(...)" to "return null"
  }
  return res.json();
});

export default async function ourStores() {
  const storeBannerData = await fetchStoreData<StoreBanner | null>(
    `/api/NavMenu/Stores/getStoreBanner`
  );
  const store = await fetchStoreData<Store[] | null>(`/api/NavMenu/Stores`);

  if (!storeBannerData || !store) {
    notFound();
  }

  return (
    <>
      <Banner
        title={storeBannerData.title}
        imageBanner={storeBannerData.banner}
      />
      <AllStore store={store} />
    </>
  );
}
