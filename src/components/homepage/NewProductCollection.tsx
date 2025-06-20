// src/components/homepage/NewProductCollection.tsx
import React from "react";
import ProductCard from "@/components/product/categorie/ProductCard";
import { fetchData } from "@/lib/fetchData";
import { Product } from "@/types/Product";

interface ProductDataType {
  HPNewProductTitle?: string;
  HPNewProductSubTitle?: string;
}

export const revalidate = 60;

export default async function NewProductCollection() {
  // Explicit typing with fallback to empty strings
  const productData = await fetchData<ProductDataType>(
    "products/ProductCollectionHomePageTitles"
  ).catch(() => ({ HPNewProductTitle: "", HPNewProductSubTitle: "" }));

  const products = await fetchData<Product[]>(
    "products/NewProductsCollectionHomePage"
  ).catch(() => []);

  return (
    <>
      {products.length > 0 && (
        <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-[40px] py-8">
          <div className="col-span-full flex flex-col items-center gap-[8px]">
            <h2 className="font-bold text-HomePageTitles text-2xl">
              {productData.HPNewProductTitle}
            </h2>
            <p className="text-base text-[#525566]">
              {productData.HPNewProductSubTitle}
            </p>
          </div>
          <ProductCard products={products} />
        </div>
      )}
    </>
  );
}
