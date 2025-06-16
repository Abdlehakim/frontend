import Banner from "@/components/Banner";
import { cache } from "react";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { notFound } from "next/navigation";


export const revalidate = 60;

interface BestProductCollectionBanner {
  BestProductTitle: string;
  BestProductBanner: string;
}

interface Product {
  _id: string;
  name: string;
  ref: string;
  price: number;
  tva: number;
  imageUrl: string;
  images: string[];
  material: string;
  color: string;
  dimensions: string;
  warranty: string;
  weight: string;
  discount?: number;
  status: string;
  statuspage: string;
  vadmin: string;
  slug: string;
  nbreview: number;
  averageRating: number;
  stock: number;
  info: string;
  description: string;

  boutique: {
    _id: string;
    name: string;
  };

  brand: {
    _id: string;
    name: string;
  };

  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

const fetchBannerData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; // <-- changed from "throw new Error(...)" to "return null"
  }
  return res.json();
});

export default async function bestProductCollection() {
  const bannerData = await fetchBannerData<BestProductCollectionBanner | null>(
    `/api/NavMenu/BestProductCollection/getBestProductCollectionbanner`
  );
  const products = await fetchBannerData<Product[] | null>(
    `/api/NavMenu/BestProductCollection/getBestProductCollection`
  );

  if (!bannerData || !products) {
    notFound();
  }

  return (
    <>
        <Banner
        title={bannerData.BestProductTitle}
        imageBanner={bannerData.BestProductBanner}
      />
      <ProductSectionByCollection products = {products} />
    </>
  );
}
