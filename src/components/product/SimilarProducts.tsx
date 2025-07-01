"use client";

import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { fetchData } from "@/lib/fetchData";
import ProductCard   from "@/components/product/categorie/ProductCard";
import type { Product } from "@/types/Product";

interface SimilarProductsProps {
  categorieId:      string;
  subcategorieId?:  string | null;
  /** slug of the current PDP — will be excluded from the results */
  excludeSlug:      string;
}

export default function SimilarProducts({
  categorieId,
  subcategorieId,
  excludeSlug,
}: SimilarProductsProps) {
  const key      = subcategorieId ?? categorieId;
  const perPage  = 4;

  const [products, setProducts]   = useState<Product[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [refresh,  setRefresh]    = useState(0);      // increment → refetch

  /* ------------------ fetch on mount / refresh ------------------- */
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

  /* ------------------ skeleton ----------------------------------- */
  if (loading) {
    return (
      <div className="flex w-full h-[500px] justify-between items-center relative py-8">
        {Array.from({ length: perPage }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-[40px]"
          />
        ))}
      </div>
    );
  }

  /* ------------------ nothing found ------------------------------ */
  if (!products.length) {
    return <p className="w-full text-center py-10">No similar product.</p>;
  }

  /* ------------------ render ------------------------------------- */
  return (
    <section className="flex w-full h-[500px] justify-between items-center relative py-8">
      <button
        onClick={() => setRefresh(Date.now())}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>  
        <ProductCard products={products} />
      <button
        onClick={() => setRefresh(Date.now())}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}
