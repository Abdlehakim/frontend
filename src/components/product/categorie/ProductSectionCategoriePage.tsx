// src/components/product/categorie/ProductSectionCategoriePage.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Product, SubCategorie } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import FilterProducts from "@/components/product/filter/FilterProducts";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";
import LoadingDots from "@/components/LoadingDots";
import { fetchData } from "@/lib/fetchData";

interface Props {
  slugCategorie: string;
  initialSubcategories: SubCategorie[];
}

export default function ProductSectionCategoriePage({
  slugCategorie,
  initialSubcategories,
}: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [selectedSubCategorie, setSelectedSubCategorie] =
    useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerBatch = 8;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const allProductsRef = useRef<Product[]>([]);

  const applyFiltersAndSort = useCallback(
    (source: Product[]): Product[] => {
      const base = source.filter(
        (p) =>
          (!selectedBrand || p.brand?._id === selectedBrand) &&
          (!selectedBoutique || p.boutique?._id === selectedBoutique) &&
          (!selectedSubCategorie ||
            p.subcategorie?._id === selectedSubCategorie) &&
          (minPrice == null || p.price >= minPrice) &&
          (maxPrice == null || p.price <= maxPrice)
      );
      return sortOrder === "asc"
        ? [...base].sort((a, b) => a.price - b.price)
        : [...base].sort((a, b) => b.price - a.price);
    },
    [selectedBrand, selectedBoutique, selectedSubCategorie, minPrice, maxPrice, sortOrder]
  );

  useEffect(() => {
    (async () => {
      try {
        const firstBatch = await fetchData<Product[]>(
          `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?limit=${itemsPerBatch}&skip=0`
        );
        allProductsRef.current = firstBatch;
        setHasMore(firstBatch.length === itemsPerBatch);
        setFilteredProducts(applyFiltersAndSort(firstBatch));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [slugCategorie, applyFiltersAndSort]);

  useEffect(() => {
    setFilteredProducts(applyFiltersAndSort(allProductsRef.current));
  }, [applyFiltersAndSort]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextBatch = await fetchData<Product[]>(
        `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?limit=${itemsPerBatch}&skip=${allProductsRef.current.length}`
      );
      allProductsRef.current = [...allProductsRef.current, ...nextBatch];

      const filteredNew = nextBatch.filter(
        (p) =>
          (!selectedBrand || p.brand?._id === selectedBrand) &&
          (!selectedBoutique || p.boutique?._id === selectedBoutique) &&
          (!selectedSubCategorie ||
            p.subcategorie?._id === selectedSubCategorie) &&
          (minPrice == null || p.price >= minPrice) &&
          (maxPrice == null || p.price <= maxPrice)
      );
      setFilteredProducts((prev) => [...prev, ...filteredNew]);
      setHasMore(nextBatch.length === itemsPerBatch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasMore,
    slugCategorie,
    itemsPerBatch,
    selectedBrand,
    selectedBoutique,
    selectedSubCategorie,
    minPrice,
    maxPrice,
  ]);

  const sentinelKey = filteredProducts.length;

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

  const brands = Array.from(
    allProductsRef.current.reduce((m, p) => {
      if (p.brand?._id) m.set(p.brand._id, p.brand.name);
      return m;
    }, new Map<string, string>())
  ).map(([id, name]) => ({ _id: id, name }));

  const boutiques = Array.from(
    allProductsRef.current.reduce((m, p) => {
      if (p.boutique?._id) m.set(p.boutique._id, p.boutique.name);
      return m;
    }, new Map<string, string>())
  ).map(([id, name]) => ({ _id: id, name }));

  const subcategories = initialSubcategories.map((s) => ({
    _id: s._id,
    name: s.name,
  }));

  return (
    <div className="flex flex-col w-[90%] mx-auto gap-6">
      <div className="flex justify-end">
        <FilterPriceOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      <div className="flex w-full gap-4">
        <FilterProducts
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedBoutique={selectedBoutique}
          setSelectedBoutique={setSelectedBoutique}
          selectedSubCategorie={selectedSubCategorie}
          setSelectedSubCategorie={setSelectedSubCategorie}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          brands={brands}
          boutiques={boutiques}
          subcategories={subcategories}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

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
          ) : filteredProducts.length > 0 ? (
            <>
              <ProductCard products={filteredProducts} />
              <div ref={loaderRef} key={sentinelKey}>
                {loadingMore && <LoadingDots />}
              </div>
            </>
          ) : (
            <p className="w-full text-center py-10">Aucun produit trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
