// src/components/homepage/productsBestCollection.tsx
import React from "react";
import ProductCard from "@/components/product/categorie/ProductCard";
import { fetchData } from "@/lib/fetchData";
import { Product } from "@/types/Product";

interface ProductsBestCollectionDataType {
  HPBestCollectionTitle?: string;
  HPBestCollectionSubTitle?: string;
}

export const revalidate = 60;

export default async function ProductsBestCollection() {
  // Fetch titles with explicit default fallbacks
  const header = await fetchData<ProductsBestCollectionDataType>(
    "products/BestProductHomePageTitles"
  ).catch(() => ({ HPBestCollectionTitle: "", HPBestCollectionSubTitle: "" }));

  // Fetch products with explicit fallback
  const products = await fetchData<Product[]>(
    "products/productsBestCollection"
  ).catch(() => []);

  return (
    <>
      {products.length > 0 && (
        <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-[30px] py-8">
          {/* Title & Subtitle */}
          <div className="col-span-full flex flex-col items-center gap-[8px]">
            <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
              {header.HPBestCollectionTitle}
            </h2>
            <p className="text-base text-[#525566]">
              {header.HPBestCollectionSubTitle}
            </p>
          </div>

          <ProductCard products={products} />
        </div>
      )}
    </>
  );
}