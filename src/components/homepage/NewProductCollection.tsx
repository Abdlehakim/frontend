// src/components/homepage/NewProductCollection.tsx

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/categorie/ProductCard";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";
import { FiArrowRight } from "react-icons/fi";

interface ProductDataType {
  HPNewProductTitle?: string;
  HPNewProductSubTitle?: string;
}

export const revalidate = 60;

export default async function NewProductCollection() {
  // Fetch heading data
  const productData = await fetchData<ProductDataType>(
    "products/ProductCollectionHomePageTitles"
  ).catch(() => ({ HPNewProductTitle: "", HPNewProductSubTitle: "" }));

  // Fetch product list
  const products = await fetchData<Product[]>(
    "products/NewProductsCollectionHomePage"
  ).catch(() => []);


  return (
    <>
      {products.length > 0 && (
    <div className="desktop max-lg:w-[95%] flex flex-col items-center gap-8 py-8">
      {/* Heading */}
      <div className="flex w-full flex-col items-center gap-2 relative">
        <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
          {productData.HPNewProductTitle}
        </h2>
        <p className="text-base text-[#525566]">
          {productData.HPNewProductSubTitle}
        </p>
        <div className="absolute w-full flex justify-end">
          <Link
            href="/nouveau-product"
            className="
        group
        inline-flex
        items-center
        border-2 border-secondary
        text-secondary
        font-semibold
        uppercase
        tracking-wide
        px-6 py-2
        rounded-full
        transition-colors duration-200 ease-in-out
        hover:bg-secondary hover:text-white
      "
          >
            Voir plus ...
            <FiArrowRight
              className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Product grid */}
      <ProductCard products={products} />
    </div>
)}
    </>

  );
}
