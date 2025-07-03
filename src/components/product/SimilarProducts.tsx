"use client";

import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { fetchData } from "@/lib/fetchData";
import ProductCard from "@/components/product/categorie/ProductCard";
import type { Product } from "@/types/Product";

interface SimilarProductsProps {
  categorieId: string;
  subcategorieId?: string | null;
  /** slug of the current PDP — will be excluded from the results */
  excludeSlug: string;

  /** Titles for this section */
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

  // perPage is 4 by default,
  // 3 on screens <= max-2xl (1535px),
  // 1 on screens <= max-md (767px)
  const [perPage, setPerPage] = useState(4);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0); // increment → refetch

  // update perPage based on viewport width
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updatePerPage = () => {
      const width = window.innerWidth;
      if (width <= 767) setPerPage(1);
      else if (width <= 1535) setPerPage(3);
      else setPerPage(4);
    };

    // initial check
    updatePerPage();
    // listen for resize events
    window.addEventListener("resize", updatePerPage);
    return () => {
      window.removeEventListener("resize", updatePerPage);
    };
  }, []);

  /* ---------------- fetch on mount / refresh ------------------- */
  useEffect(() => {
    setLoading(true);

    const url =
      `products/MainProductSection/similarById/${key}` +
      `?limit=${perPage}&exclude=${excludeSlug}&t=${Date.now()}`;

    fetchData<Product[]>(url)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [key, excludeSlug, refresh, perPage]);

  /* ---------------- nothing found ------------------------------ */
  if (!loading && !products.length) {
    return <p className="w-full text-center py-10">No similar product.</p>;
  }

  /* ---------------- render ------------------------------------- */
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex-col flex gap-[8px] items-center w-full max-lg:text-center ">
        <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
          {SPTitle}
        </h2>
        <p className="text-base text-[#525566]">{SPSubTitle}</p>
      </div>
      <div className="flex w-full max-lg:flex-col h-[450px] max-lg:h-fit justify-center items-center gap-4">
        {/* prev */}
        <div className="flex gap-4">
        <button
          onClick={() => setRefresh(Date.now())}
          className="max-lg:p-2 p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200 z-40 "
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setRefresh(Date.now())}
          className="max-lg:p-2 p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200 z-40"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
</div>
        {loading ? (
          <div className={`grid grid-cols-${perPage} gap-[40px]`}>
            {Array.from({ length: perPage }).map((_, i) => (
              <div
                key={i}
                className="h-[390px] w-[280px] bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ProductCard products={products} />
        )}

        {/* next */}
        <button
          onClick={() => setRefresh(Date.now())}
          className="max-lg:hidden p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200 z-40"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
