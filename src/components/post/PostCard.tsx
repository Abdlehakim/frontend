/// src/components/post/PostCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaReadme } from "react-icons/fa6";

export type PostCardItem = {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  postCategorie: { slug: string };
  postSubCategorie: { slug: string };
};

interface Props {
  posts: PostCardItem[];
}

export default function PostCard({ posts }: Props) {
  return (
    <section className="py-8 w-[96%] mx-auto flex flex-col items-center gap-5">
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 w-full gap-10">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.postCategorie?.slug ?? ''}/${post.postSubCategorie?.slug ?? ''}/${post.slug}`}
            aria-label={`Read more: ${post.title}`}
            className="group block transform transition duration-300 hover:scale-95"
          >
            <div className="relative w-full h-80">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw, 25vw"
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />
            </div>

            <article className="p-4 border-x-2 border-b-2 bg-white rounded-b-lg flex flex-col justify-between h-64">
              <time
                dateTime={post.createdAt}
                className="block text-gray-600 text-sm mb-2"
              >
                {new Date(post.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              <h2 className="text-gray-800 text-2xl font-bold line-clamp-2 mb-2">
                {post.title}
              </h2>

              <div
                className="text-gray-600 line-clamp-2 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />

              <span className="mt-auto inline-flex items-center bg-primary hover:bg-[#15335D] text-white rounded-lg px-4 py-2 transition">
                continue reading
                <FaReadme className="ml-2 w-5 h-5" aria-hidden="true" />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
