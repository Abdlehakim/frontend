"use client";

import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { fetchData } from "@/lib/fetchData";
import ProductCard from "@/components/product/categorie/ProductCard";
import type { Product } from "@/types/Product";

interface SimilarProductsProps {
  categorieId: string;
  subcategorieId?: string | null;
  excludeSlug: string;
  SPTitle: string;
  SPSubTitle: string;
}

export default function SimilarProducts({
  categorieId,
  subcategorieId,
  excludeSlug,
  SPTitle,
  SPSubTitle,
}: SimilarProductsProps) {
  const key = subcategorieId ?? categorieId;

  // dynamic fetch limit: 1 on <=767px, otherwise 4
  const [limit, setLimit] = useState(4);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);

    // figure out how many to fetch
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    const fetchLimit = w <= 767 ? 1 : 4;
    setLimit(fetchLimit);

    const url =
      `products/MainProductSection/similarById/${key}` +
      `?limit=${fetchLimit}&exclude=${excludeSlug}&t=${Date.now()}`;

    fetchData<Product[]>(url)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [key, excludeSlug, refresh]);

  if (!loading && products.length === 0) {
    return <p className="w-full text-center py-10">No similar product.</p>;
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-[8px] items-center w-full max-lg:text-center">
        <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
          {SPTitle}
        </h2>
        <p className="text-base text-[#525566]">{SPSubTitle}</p>
      </div>

      <div className="flex w-full max-lg:flex-col max-lg:h-fit h-[450px] justify-center items-center gap-4">
        {/* prev buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setRefresh(Date.now())}
            className="max-lg:hidden p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setRefresh(Date.now())}
            className="hidden p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* grid: always 1 col on sm, 3 on md+, 4 on 2xl+ */}

          {loading ? (
            <div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[40px]">
  {Array.from({ length: limit }).map((_, i) => (
    <div
      key={i}
      className="h-[390px] w-[280px] bg-gray-200 rounded animate-pulse"
    />
  ))}
</div>
         ) : ( <ProductCard products={products} /> )}

        {/* next buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setRefresh(Date.now())}
            className="lg:hidden p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setRefresh(Date.now())}
            className="p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
