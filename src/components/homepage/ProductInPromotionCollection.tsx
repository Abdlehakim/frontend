// src/components/homepage/ProductPromotionHomePage.tsx
import React from "react";
import { fetchData } from "@/lib/fetchData";
import ProductCard from "@/components/product/categorie/ProductCard";
import { Product } from "@/types/Product";

interface ProductPromotionHomePageType {
  HPPromotionTitle?: string;
  HPPromotionSubTitle?: string;
}

export const revalidate = 60;

export default async function ProductPromotionHomePage() {
  // Explicitly set fallback default values
  const titleData = await fetchData<ProductPromotionHomePageType>(
    "products/ProductPromotionHomePageTitles"
  ).catch(() => ({ HPPromotionTitle: "", HPPromotionSubTitle: "" }));

  // Fetch products with explicit fallback
  const products = await fetchData<Product[]>(
    "products/productsCollectionPromotion"
  ).catch(() => []);

  return (
    <>
      {products.length > 0 && (
        <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-[30px] py-8">
          {/* Header */}
          <div className="col-span-full flex flex-col items-center gap-[8px]">
            <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
              {titleData.HPPromotionTitle}
            </h2>
            <p className="text-base text-[#525566]">
              {titleData.HPPromotionSubTitle}
            </p>
          </div>

          <ProductCard products={products} />
        </div>
      )}
    </>
  );
}
