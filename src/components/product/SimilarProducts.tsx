"use client";

import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { fetchData } from "@/lib/fetchData";
import ProductCard   from "@/components/product/categorie/ProductCard";
import type { Product } from "@/types/Product";

interface SimilarProductsProps {
  categorieId:     string;
  subcategorieId?: string | null;
  /** slug of the current PDP — will be excluded from the results */
  excludeSlug:     string;
}

export default function SimilarProducts({
  categorieId,
  subcategorieId,
  excludeSlug,
}: SimilarProductsProps) {
  const key     = subcategorieId ?? categorieId;
  const perPage = 4;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [refresh,  setRefresh]  = useState(0);     // increment → refetch

  /* ---------------- fetch on mount / refresh ------------------- */
  useEffect(() => {
    setLoading(true);

    const url =
      `products/MainProductSection/similarById/${key}` +
      `?limit=${perPage}&exclude=${excludeSlug}&t=${Date.now()}`;

    fetchData<Product[]>(url)
      .then((data) => setProducts(data))
      .catch(()   => setProducts([]))
      .finally(() => setLoading(false));
  }, [key, excludeSlug, refresh]);

  /* ---------------- nothing found ------------------------------ */
  if (!loading && !products.length) {
    return <p className="w-full text-center py-10">No similar product.</p>;
  }

  /* ---------------- render ------------------------------------- */
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex-col flex gap-[8px] items-center w-full max-lg:text-center">
        <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
          Similar Products
        </h2>
        <p className="text-base text-[#525566]">
            Similar Products
        </p>
      </div>
    <div className="flex w-full h-[450px] justify-between items-center gap-4">
      {/* refresh / prev */}
      <button
        onClick={() => setRefresh(Date.now())}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md
                   hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

          {loading ? (
            <div className="grid grid-cols-4 gap-[40px]">
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

      {/* refresh / next */}
      <button
        onClick={() => setRefresh(Date.now())}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md
                   hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    </div>
    </section>
  );
}
