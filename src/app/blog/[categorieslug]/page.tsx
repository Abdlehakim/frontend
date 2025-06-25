// src/app/blog/[categorieslug]/page.tsx

import React from "react";
import Link from "next/link";
import Banner from "@/components/Banner";
import { notFound } from "next/navigation";
import { fetchData } from "@/lib/fetchData";
import PostCard, { PostCardItem } from "@/components/post/PostCard";

export const revalidate = 60;

interface APIResponse {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  postCategorie: { slug: string };
  postSubCategorie: { slug: string };
}

interface CategoryPageProps {
  params: { categorieslug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorieslug } = params;

  // 1) fetch posts
  const data = await fetchData<APIResponse[]>(
    `/blog/getAllPostCardByCategorie/${categorieslug}`
  ).catch(() => []);

  if (data.length === 0) notFound();

  // 2) map into PostCardItem
  const posts: PostCardItem[] = data.map((item) => ({
    title:            item.title,
    description:      item.description,
    imageUrl:         item.imageUrl,
    slug:             item.slug,
    createdAt:        item.createdAt,
    postCategorie:    { slug: item.postCategorie.slug },
    postSubCategorie: { slug: item.postSubCategorie.slug },
  }));

  // 3) pick the first post for the banner
  const [Post] = posts;

  return (
    <>
      {Post?.title && Post?.imageUrl && (
        <>
          <Banner title={Post.title} imageBanner={Post.imageUrl} />

          {/* Breadcrumb navigation */}
          <nav
            className="px-16 max-md:px-4 py-4 text-sm text-gray-600"
            aria-label="Breadcrumb"
          >
            <ol className="list-none p-0 inline-flex items-center space-x-2">
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-500">{categorieslug}</li>
            </ol>
          </nav>
        </>
      )}

      {/* Posts grid */}
      <div className="max-md:p-4 p-16 w-full grid grid-cols-4 max-md:grid-cols-1 gap-4 relative">
        <PostCard posts={posts} />
      </div>
    </>
  );
}
