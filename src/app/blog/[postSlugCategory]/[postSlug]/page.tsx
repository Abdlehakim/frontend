import PostMainSection from "@/components/Post/PostMainSection";
import SimilarPost from "@/components/Post/SimilarPost";

import { notFound } from "next/navigation";
import { cache } from "react";

// This enables static generation with revalidation every 60 seconds
export const revalidate = 60;

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  user?: {
    username: string;
  };
  postcategory?: {
    name: string;
    vadmin: string;
    slug: string;
  };
  Postfirstsubsections?: {
    fisttitle?: string;
    description?: string;
    imageUrl?: string;
    Postsecondsubsections?: {
      secondtitle?: string;
      description?: string;
      imageUrl?: string;
    }[];
  }[];
}

// 1) Define a reusable data-fetching function
const fetchData = cache(async function <T>(
  endpoint: string
): Promise<T | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
});

export default async function PostPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const post = await fetchData<Post>(`/api/Blog/getPostbyslug/${postSlug}`);

  if (!post) {
    notFound();
  }

  const postcategory = post.postcategory?.slug;

  return (
    <div className="desktop flex justify-center py-4 max-lg:py-20 gap-[40px]">
      <div className="w-[70%] max-lg:w-full flex flex-col gap-16">
        <PostMainSection post={post} />
      </div>
      <div className="flex flex-col gap-[16px] max-xl:hidden">
        {/* Summary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Summarys</h2>
          <ul className="list-disc list-inside">
            {post.Postfirstsubsections?.filter(
              (section) => section.fisttitle
            ).map((section, index) => (
              <li key={index}>
                <a
                  href={`#section-${index}`}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  {section.fisttitle}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <SimilarPost postSlugCategory={postcategory} />
      </div>
    </div>
  );
}
