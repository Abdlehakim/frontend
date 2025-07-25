/* ------------------------------------------------------------------ */
/*  src/app/page.tsx                                                  */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import Categories from "@/components/homepage/Categories";
import NewProductCollection from "@/components/homepage/NewProductCollection";
import ProductInPromotion from "@/components/homepage/ProductInPromotionCollection";
import Brands from "@/components/homepage/Brands";
import BestProductCollection from "@/components/homepage/BestProductCollection";
import Stores from "@/components/homepage/Stores";
import { fetchData } from "@/lib/fetchData";

/* ---------- types ---------- */
export const revalidate = 60;

interface BannerData {
  HPbannerTitle: string;
  HPbannerImgUrl: string;
}

/* ---------- page ---------- */
export default async function HomePage() {
  const bannerData = await fetchData<BannerData>("HomePageBanner").catch(
    () => ({} as BannerData)
  );

  const title = bannerData.HPbannerTitle?.trim() ?? "";
  const image = bannerData.HPbannerImgUrl?.trim() ?? "";

  return (
    <main className="homepage flex flex-col justify-start gap-10 max-md:gap-4 items-center">
      {title && image && <Banner title={title} imageBanner={image} />}

      {/* Static sections */}
      <Categories />
      <NewProductCollection />
      <ProductInPromotion />
      <Brands />
      <BestProductCollection />
      <Stores />
    </main>
  );
}
