import Banner from "@/components/Banner";
import PostCard from "@/components/post/PostCard";
import { fetchData } from "@/lib/fetchData";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface BlogBanner {
  BlogBannerTitle?: string | null;
  BlogBannerImgUrl?: string | null;
}

export type PostCardItem = {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  postCategorie: { slug: string };
  postSubCategorie: { slug: string };
};

export default async function BlogPage() {
  // 1) banner
  const banner: BlogBanner = await fetchData<BlogBanner>(
    "blog/getBlogBannerData"
  ).catch(() => ({} as BlogBanner));

  // 2) post cards
  const posts = await fetchData<PostCardItem[]>("blog/PostCardData").catch(
    () => []
  );
  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      {banner.BlogBannerTitle && banner.BlogBannerImgUrl && (
        <Banner
          title={banner.BlogBannerTitle}
          imageBanner={banner.BlogBannerImgUrl}
        />
      )}
      <PostCard posts={posts} />
    </>
  );
}
