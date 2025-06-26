/* ------------------------------------------------------------------ */
/*  src/app/page.tsx                                                  */
/* ------------------------------------------------------------------ */
import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import { fetchData } from "@/lib/fetchData";

/* ---------- types ---------- */
export const revalidate = 60;

interface BannerData {
  HPbannerTitle: string;
  HPbannerImgUrl: string;
}

/* ---------- lazy-loaded sections (stream in parallel) ---------- */
const Categories                = dynamic(() => import("@/components/homepage/Categories"),                { ssr: true });
const NewProductCollection      = dynamic(() => import("@/components/homepage/NewProductCollection"),      { ssr: true });
const ProductInPromotion        = dynamic(() => import("@/components/homepage/ProductInPromotionCollection"), { ssr: true });
const Brands                    = dynamic(() => import("@/components/homepage/Brands"),                    { ssr: true });
const BestProductCollection     = dynamic(() => import("@/components/homepage/BestProductCollection"),     { ssr: true });
const Stores                    = dynamic(() => import("@/components/homepage/Stores"),                    { ssr: true });

/* ---------- page ---------- */
export default async function HomePage() {
  const bannerData = await fetchData<BannerData>("HomePageBanner").catch(
    () => ({} as BannerData)
  );

  const title = bannerData.HPbannerTitle?.trim() ?? "";
  const image = bannerData.HPbannerImgUrl?.trim() ?? "";

  return (
    <main className="homepage flex flex-col justify-start gap-10">
      {/* Banner appears only if both title and image are available */}
      {title && image && <Banner title={title} imageBanner={image} />}

      {/* Streamed sections */}
      <Categories />
      <NewProductCollection />
      <ProductInPromotion />
      <Brands />
      <BestProductCollection />
      <Stores />
    </main>
  );
}
