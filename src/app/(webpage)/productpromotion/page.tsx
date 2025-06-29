/* ------------------------------------------------------------------ */
/*  productpromotion page                                             */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import ProductSectionByCollection
  from "@/components/product/collection/ProductSectionByCollection";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface PromotionBanner {
  PromotionBannerTitle?: string | null;
  PromotionBannerImgUrl?: string | null;
}

export default async function ProductPromotionPage() {
  const banner = await fetchData<PromotionBanner>(
    "NavMenu/ProductPromotion/getProductPromotionBannerData"
  ).catch(() => ({} as PromotionBanner));

  return (
    <>
      {banner.PromotionBannerTitle && banner.PromotionBannerImgUrl && (
        <Banner
          title={banner.PromotionBannerTitle}
          imageBanner={banner.PromotionBannerImgUrl}
        />
      )}

      {/* ➊ no props now – the client component will fetch batches itself */}
      <ProductSectionByCollection />
    </>
  );
}
