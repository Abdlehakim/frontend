/* ------------------------------------------------------------------ */
/*  src/app/bestproductcollection/page.tsx                            */
/*  (Server component – banner only; product list lazy-loads in the   */
/*   client via <ProductSectionByCollection />)                       */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import ProductSectionByCollection
  from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

/* shape returned by /getBestProductBannerData */
interface BestProductBanner {
  BCbannerTitle?: string | null;
  BCbannerImgUrl?: string | null;
}

export default async function BestProductCollectionPage() {
  /* -------- banner (server-side) -------- */
  const banner = await fetchData<BestProductBanner>(
    "NavMenu/BestProductCollection/getBestProductBannerData"
  ).catch(() => ({} as BestProductBanner));

  return (
    <>
      {banner.BCbannerTitle && banner.BCbannerImgUrl && (
        <Banner
          title={banner.BCbannerTitle}
          imageBanner={banner.BCbannerImgUrl}
        />
      )}

      {/* client component will fetch
          /NavMenu/BestProductCollection/products?limit=8&skip=0
          and stream in further batches */}
      <ProductSectionByCollection />
    </>
  );
}
