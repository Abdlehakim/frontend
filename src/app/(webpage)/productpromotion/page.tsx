// src/app/productpromotion/page.tsx

import Banner from "@/components/Banner";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

/* ---------- banner type exactly as returned by the API ---------- */
interface PromotionBanner {
  PromotionBannerTitle?: string | null;
  PromotionBannerImgUrl?: string | null;
}

export default async function ProductPromotionPage() {
  /* banner */
  const banner: PromotionBanner = await fetchData<PromotionBanner>(
    "NavMenu/ProductPromotion/getProductPromotionBannerData"
  ).catch(() => ({} as PromotionBanner));

  /* products in the promotion collection */
  const products: Product[] = await fetchData<Product[]>(
    "NavMenu/BestProductCollection/getBestProductCollection"
  ).catch(() => []);

  return (
    <>
      {banner.PromotionBannerTitle && banner.PromotionBannerImgUrl && (
        <Banner title={banner.PromotionBannerTitle} imageBanner={banner.PromotionBannerImgUrl} />
      )}

      {products.length > 0 && <ProductSectionByCollection products={products} />}
    </>
  );
}
