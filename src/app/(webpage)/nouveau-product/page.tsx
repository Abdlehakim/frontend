/* ------------------------------------------------------------------ */
/*  src/app/nouveau-product/page.tsx                                  */
/*  (Server component — fetches only the banner; product list is      */
/*   loaded lazily by <ProductSectionByCollection />)                 */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import ProductSectionByCollection
  from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

/* DTO returned by /getNewProductsBannerData */
interface NewProductsBanner {
  NPBannerTitle?: string | null;
  NPBannerImgUrl?: string | null;
}

export default async function NewProductsPage() {
  /* -------- banner (server-side) -------- */
  const banner = await fetchData<NewProductsBanner>(
    "NavMenu/NewProducts/getNewProductsBannerData"
  ).catch(() => ({} as NewProductsBanner));

  return (
    <>
      {banner.NPBannerTitle && banner.NPBannerImgUrl && (
        <Banner title={banner.NPBannerTitle} imageBanner={banner.NPBannerImgUrl} />
      )}

      {/* client component will call
          `/NavMenu/NewProducts/products?limit=8&skip=0` and lazy-load more */}
      <ProductSectionByCollection />
    </>
  );
}
