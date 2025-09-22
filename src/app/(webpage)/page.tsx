/* ------------------------------------------------------------------ */
/*  src/app/page.tsx                                                  */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
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
    <div className="homepage flex flex-col justify-start gap-10 max-md:gap-4 items-center">
      {title && image && <Banner title={title} imageBanner={image} />}
      {/* Static sections */}
    </div>
  );
}
