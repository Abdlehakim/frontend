import PostCard from "@/components/Post/PostCard";
import Banner from "@/components/Banner";
import { cache } from "react";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface blogBanner {
  title: string;
  banner: string;
}

const fetchData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
});

export default async function Blog() {
  const blogBannerData = await fetchData<blogBanner | null>(
    `/api/Blog/BlogBanner`
  );
  if (!blogBannerData) {
    notFound();
  }
  
  return (
    <>
      <Banner
        title={blogBannerData.title}
        imageBanner={blogBannerData.banner}
      />
      <PostCard />
    </>
  );
}
