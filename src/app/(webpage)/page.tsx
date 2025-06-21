// src/app/page.tsx
import Banner from "@/components/Banner";
import Brands from "@/components/homepage/Brands";
import BestProductCollection from "@/components/homepage/BestProductCollection";
import Categories from "@/components/homepage/Categories";
import NewProductCollection from "@/components/homepage/NewProductCollection";
import ProductInPromotionCollection from "@/components/homepage/ProductInPromotionCollection";
import Stores from "@/components/homepage/Stores";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface BannerData {
  HPbannerTitle: string;
  HPbannerImgUrl: string;
}

export default async function HomePage() {
  // Load banner data with safe fallback
  const bannerData: Partial<BannerData> = await fetchData<BannerData>(
    "HomePageBanner"
  ).catch(() => ({} as BannerData));

  const title = bannerData.HPbannerTitle?.trim() ?? "";
  const image = bannerData.HPbannerImgUrl?.trim() ?? "";

  return (
    <div className="flex flex-col jsutify-start gap-10">
      {/* Only show banner when both title and image exist */}
      {title && image && <Banner title={title} imageBanner={image} />}

      <Categories />
      <NewProductCollection />
      <ProductInPromotionCollection />
      <Brands />
      <BestProductCollection />
      <Stores />
    </div>
  );
}
