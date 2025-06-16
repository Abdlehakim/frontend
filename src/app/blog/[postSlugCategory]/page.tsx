import React from "react";
import PostCardByCategory from "@/components/Post/PostCardByCategory";

export default async function PostByCategory ({params}: {params: Promise<{ postSlugCategory : string }>}) {
  
  const resolvedParams = await params;
  return (
    <PostCardByCategory postSlugCategory={resolvedParams.postSlugCategory} />
  );
}