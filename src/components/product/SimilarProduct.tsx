import React from "react";
import { cache } from "react";
import SimilarProductCard from "@/components/product/SimilarProductCard";

interface Product {
  _id: string;
  name: string;
  ref: string;
  price: number;
  tva: number;
  imageUrl: string;
  images: string[];
  material: string;
  color: string;
  dimensions: string;
  warranty: string;
  weight: string;
  discount?: number;
  status: string;
  statuspage: string;
  vadmin: string;
  slug: string;
  nbreview: number;
  averageRating: number;
  stock: number;
  info: string;
  description: string;
  boutique: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

const fetchSimilarProductsData = cache(async function <T>(endpoint: string): Promise<T> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
});

interface SimilarProductProps {
  category: string;
}

export default async function SimilarProduct({
  category,
}: SimilarProductProps) {

  
  const SimilarProduct = await fetchSimilarProductsData<Product[]>(
    `/api/products/SimilarProduct/Similar?categoryId=${category}&limit=4`
  );

  if (!SimilarProduct) {
    return <div>No similar products found.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full gap-[20px]">
      <h2 className="font-bold text-HomePageTitles text-2xl">
        Similar Product
      </h2>
      <SimilarProductCard products={SimilarProduct} />
    </div>
  );
}
