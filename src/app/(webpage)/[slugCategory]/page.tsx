import React from "react";
import Banner from "@/components/Banner";
import { cache } from "react";
import ProductSectionCategoryPage from "@/components/product/category/ProductSectionCategoryPage";
import { notFound } from "next/navigation";
export const revalidate = 60;

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slugCategory: string }>;
}) {
  // Extract slugCategory from params
  const { slugCategory } = await params;

  // Fetch the category data from the backend
  const category = await fetchData<{
    name: string;
    slug: string;
    bannerUrl: string;
  } | null>(`/api/NavMenu/categorySubCategoryPage/${slugCategory}`);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <Banner title={category.name} imageBanner={category.bannerUrl} />
      <ProductSectionCategoryPage slugCategory={slugCategory} />
    </div>
  );
}
