// src/app/bestproductcollection/page.tsx

import Banner from "@/components/Banner";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

interface BestProductBanner {
  BCbannerTitle?: string | null;
  BCbannerImgUrl?: string | null;
}

export default async function BestProductCollectionPage() {
  // fetch banner
  const bannerData = await fetchData<BestProductBanner>(
    "NavMenu/BestProductCollection/getBestProductBannerData"
  ).catch(() => ({} as BestProductBanner));

  // fetch products (using imported Product type)
  const products = await fetchData<Product[]>(
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
