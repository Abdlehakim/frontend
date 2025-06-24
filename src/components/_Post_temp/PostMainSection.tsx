import React from "react";
import Image from "next/image";

interface PostSecondSubsection {
  secondtitle?: string;
  description?: string;
  imageUrl?: string;
}

interface PostFirstSubsection {
  fisttitle?: string;
  description?: string;
  imageUrl?: string;
  Postsecondsubsections?: PostSecondSubsection[];
}

interface PostCategory {
  name: string;
  vadmin: string;
  slug: string;
}

interface User {
  username: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  user?: User;
  postcategory?: PostCategory;
  Postfirstsubsections?: PostFirstSubsection[];
}

export default function PostMainSection({ post }: { post: Post }) {
  return (
    <div className="flex flex-col w-full gap-[16px]">
      {/* Title + Meta */}
      <div className="flex flex-col gap-[24px]">
        <div className="w-full h-fit flex items-center justify-center">
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              width={1000}
              height={600}
              alt="Post image"
              className="object-cover w-full h-[300px]"
            />
          )}
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-gray-400 text-sm">
            Posted on{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            {post.user?.username && <>by {post.user.username}</>}
          </p>
          {/* Category */}
          {post.postcategory?.name && (
            <div className="flex items-center gap-[8px]">
              <p className="text-xs px-4 py-2 rounded-md bg-gray-600 text-white">
                {post.postcategory.name}
              </p>
            </div>
          )}
        </div>
        <p className="text-4xl font-bold">{post.title}</p>
      </div>

      {/* Main Description + Image */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[20px]">
          {post.description && (
            <div className="flex flex-col gap-[16px]">{post.description}</div>
          )}
        </div>

        {/* First Subsections with Anchors */}
        {post.Postfirstsubsections?.map((section, index) => (
          <div
            key={index}
            id={`section-${index}`}
            className="flex flex-col gap-[24px]"
          >
            {section.fisttitle && (
              <p className="text-2xl font-bold">{section.fisttitle}</p>
            )}

            <div className="flex flex-col gap-[16px]">
              {section.description && <p>{section.description}</p>}
              <div className="w-full h-fit flex items-center justify-center">
              {section.imageUrl && (
              
                <Image
                  src={section.imageUrl}
                  width={1000}
                  height={600}
                  alt={`${section.fisttitle ?? "subsection"} image`}
                    className="object-cover w-full h-[300px]"
                />
              )} </div>
            </div>

            {/* Nested Second Subsections */}
            {section.Postsecondsubsections?.map((sub, subIndex) => (
              <div key={subIndex} className="flex flex-col gap-[24px]">
                {sub.secondtitle && (
                  <p className="text-xl font-bold">{sub.secondtitle}</p>
                )}
                <div className="flex flex-col gap-[16px]">
                  {sub.description && <p>{sub.description}</p>}
                  <div className="w-full h-fit flex items-center justify-center">
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      width={1000}
                      height={600}
                      alt={`${sub.secondtitle ?? "sub-subsection"} image`}
                        className="object-cover w-full h-[300px]"
                    />
                  )}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
