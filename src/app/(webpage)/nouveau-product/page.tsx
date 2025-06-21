// src/app/nouveau-product/page.tsx

import Banner from "@/components/Banner";
import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

/* -------- banner DTO as returned by the API -------- */
interface NewProductsBanner {
  NPBannerTitle?: string | null;
  NPBannerImgUrl?: string | null;
}

export default async function NewProductsPage() {
  /* banner */
  const banner: NewProductsBanner = await fetchData<NewProductsBanner>(
    "NavMenu/NewProducts/getNewProductsBannerData"
  ).catch(() => ({} as NewProductsBanner));

  /* latest products */
  const products: Product[] = await fetchData<Product[]>(
    "NavMenu/NewProducts/getNewProducts"
  ).catch(() => []);

  return (
    <>
      {banner.NPBannerTitle && banner.NPBannerImgUrl && (
        <Banner title={banner.NPBannerTitle} imageBanner={banner.NPBannerImgUrl} />
      )}

      {products.length > 0 && <ProductSectionByCollection products={products} />}
    </>
  );
}
