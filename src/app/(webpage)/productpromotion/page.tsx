// src/app/bestproductcollection/page.tsx

import Banner from "@/components/Banner";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface BestProductBanner {
  BCbannerTitle?: string | null;
  BCbannerImgUrl?: string | null;
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

  boutique: { _id: string; name: string };
  brand: { _id: string; name: string };
  category: { _id: string; name: string; slug: string };
}

export default async function BestProductCollectionPage() {
  const bannerData: BestProductBanner = await fetchData<BestProductBanner>(
    "NavMenu/BestProductCollection/getBestProductBannerData"
  ).catch(() => ({} as BestProductBanner));

  const products: Product[] = await fetchData<Product[]>(
    "NavMenu/BestProductCollection/getBestProductCollection"
  ).catch(() => [] as Product[]);

  return (
    <>
      {bannerData.BCbannerTitle && bannerData.BCbannerImgUrl && (
        <Banner
          title={bannerData.BCbannerTitle}
          imageBanner={bannerData.BCbannerImgUrl}
        />
      )}

      {products.length > 0 && (
        <ProductSectionByCollection products={products} />
      )}
    </>
  );
}
