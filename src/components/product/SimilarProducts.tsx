"use client";

import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";

interface SimilarProductsProps {
  categorieId: string;
  subcategorieId?: string | null;
}


export default function SimilarProducts({
  categorieId,
  subcategorieId,
}: SimilarProductsProps) {
  const key = subcategorieId ?? categorieId;
  const perPage = 4;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData<Product[]>(
      `products/MainProductSection/similarById/${key}?limit=${perPage}&skip=${page * perPage}`
    )
      .then((data) => {
        setProducts(data);
        setHasMore(data.length === perPage);
      })
      .catch(() => {
        setProducts([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [key, page]);

  // updated loading UI: grid of skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-">  
          {Array.from({ length: perPage }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] w-[280px] bg-gray-200 rounded animate-pulse"
            />
          ))}
      </div>
    );
  }

  if (!products.length) {
    return <p className="w-full text-center py-10">Aucun produit trouvé.</p>;
  }

  return (
    <section className="flex justify-center items-center relative py-8">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 0))}
        disabled={page === 0}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md disabled:cursor-not-allowed hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      <div className="w-full flex justify-center">
        <ProductCard products={products} />
      </div>

      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasMore}
        className="p-4 bg-white border border-gray-300 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary hover:text-white transition duration-200"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}