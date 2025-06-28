// src/components/product/categorie/ProductSectionCategoriePage.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import LoadingDots from "@/components/LoadingDots";
import { fetchData } from "@/lib/fetchData";

interface Props {
  slugCategorie: string;
}

export default function ProductSectionCategoriePage({ slugCategorie }: Props) {
  /* ---------- pagination settings ---------- */
  const itemsPerBatch = 8;

  /* ---------- state ---------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ---------- refs ---------- */
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* ---------- fetch first batch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const firstBatch = await fetchData<Product[]>(
          `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?limit=${itemsPerBatch}&skip=0`
        );
        setProducts(firstBatch);
        setHasMore(firstBatch.length === itemsPerBatch);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [slugCategorie, itemsPerBatch]);

  /* ---------- load more on scroll ---------- */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const nextBatch = await fetchData<Product[]>(
        `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?limit=${itemsPerBatch}&skip=${products.length}`
      );
      setProducts((prev) => [...prev, ...nextBatch]);
      setHasMore(nextBatch.length === itemsPerBatch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, slugCategorie, itemsPerBatch, products.length]);

  /* ---------- intersection observer ---------- */
  const sentinelKey = products.length;

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, sentinelKey]);

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col w-[90%] mx-auto gap-6">
      <div className="flex flex-col items-center w-full gap-6">
        {loadingInitial ? (
          <div className="grid grid-cols-4 gap-[40px] w-fit">
            {Array(itemsPerBatch)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] w-[280px] bg-gray-200 rounded animate-pulse"
                />
              ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductCard products={products} />
            <div ref={loaderRef} key={sentinelKey}>
              {loadingMore && <LoadingDots />}
            </div>
          </>
        ) : (
          <p className="w-full text-center py-10">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}
