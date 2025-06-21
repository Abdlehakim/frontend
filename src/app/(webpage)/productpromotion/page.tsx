// src/app/productpromotion/page.tsx

import Banner from "@/components/Banner";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

/* ---------- banner type exactly as returned by the API ---------- */
interface BestProductBanner {
  BCbannerTitle?: string | null;
  BCbannerImgUrl?: string | null;
}

export default async function ProductPromotionPage() {
  /* banner */
  const banner: BestProductBanner = await fetchData<BestProductBanner>(
    "NavMenu/BestProductCollection/getBestProductBannerData"
  ).catch(() => ({} as BestProductBanner));

  /* products in the promotion collection */
  const products: Product[] = await fetchData<Product[]>(
    "NavMenu/BestProductCollection/getBestProductCollection"
  ).catch(() => []);

  return (
    <>
      {banner.BCbannerTitle && banner.BCbannerImgUrl && (
        <Banner title={banner.BCbannerTitle} imageBanner={banner.BCbannerImgUrl} />
      )}

      {products.length > 0 && <ProductSectionByCollection products={products} />}
    </>
  );
}
