// src/app/blog/page.tsx

import Banner from "@/components/Banner";
import PostCard from "@/components/Post/PostCard";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

/* ---------- banner type exactly as returned by the API ---------- */
interface BlogBanner {
  BlogBannerTitle?: string | null;
  BlogBannerImgUrl?: string | null;
}

export default async function BlogPage() {
  /* banner */
  const banner: BlogBanner = await fetchData<BlogBanner>(
    "blog/getBlogBannerData"
  ).catch(() => ({} as BlogBanner));


  return (
    <>
      {banner.BlogBannerTitle && banner.BlogBannerImgUrl && (
        <Banner
          title={banner.BlogBannerTitle}
          imageBanner={banner.BlogBannerImgUrl}
        />
      )}
    </>
  );
}
