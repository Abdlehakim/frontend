import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaReadme } from "react-icons/fa6";
import { cache } from "react";
import { notFound } from "next/navigation";

export const revalidate = 60;

const fetchData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; // <-- changed from "throw new Error(...)" to "return null"
  }
  return res.json();
});


interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  postcategory: {
    name: string;
    vadmin: string;
    slug: string;
  };
}

export default async function PostCard() {
  // Fetch posts from the API endpoint
  const PostData = await fetchData<Post[]>("/api/Blog/PostCardData");

  if (!PostData) {
    notFound();
  }

  return (
    <div className="py-8 w-[96%] mx-auto items-center flex flex-col gap-[20px] justify-center">
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 w-full group gap-[40px]">
        {PostData.map((item, index) => (
          <div
            key={index}
            className="flex cursor-pointer duration-500 lg:group-hover:scale-[0.95] lg:hover:!scale-100 flex-col items-center relative"
          >
            <div className="w-full">
              <Image
                width={1000}
                height={1000}
                className="w-full h-80"
                src={item.imageUrl}
                alt={item.title}
              />
            </div>
            <div className="flex flex-col border-x-2 border-b-2 gap-[8px] items-center bg-white w-full h-64">
              <div className="w-[90%] pt-2">
                <p className="text-[#525566]">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex flex-col gap-[20px] max-md:gap-[8px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="text-[#525566] text-2xl max-sm:text-xl font-bold line-clamp-2 overflow-hidden">
                      {item.title}
                    </p>
                    <p className="text-[#525566] line-clamp-2 overflow-hidden">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${item.postcategory.slug}/${item.slug}`}
                    aria-label="read more about blog"
                    className="bg-primary hover:bg-[#15335D] rounded-lg w-full h-14 items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white"
                  >
                    <p className="absolute flex items-center justify-center h-full transition-all duration-300 transform ease text-xl">
                      continue reading
                    </p>
                    <p className="text-white absolute flex items-center justify-center w-full h-full duration-500 translate-x-[-40%] translate-y-[3%] opacity-0 lg:group-hover/box:opacity-100 ease">
                      <FaReadme className="w-8 h-8" aria-hidden="true" fill="currentColor" />
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
