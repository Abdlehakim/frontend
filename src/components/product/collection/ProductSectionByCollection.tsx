/* ------------------------------------------------------------------ */
/*  ProductSectionByCollection (client-side, lazy load)               */
/* ------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/product/categorie/ProductCard";
import FilterProducts from "@/components/product/filter/FilterProducts";
import LoadingDots from "@/components/LoadingDots";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

interface OptionItem { _id: string; name: string; }

export default function ProductSectionByCollection() {
  const itemsPerBatch = 8;

  /* -------- live filter state -------- */
  const [selectedCategorie,    setSelectedCategorie]    = useState<string | null>(null);
  const [selectedSubCategorie, setSelectedSubCategorie] = useState<string | null>(null);
  const [selectedBrand,        setSelectedBrand]        = useState<string | null>(null);
  const [selectedBoutique,     setSelectedBoutique]     = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* -------- data -------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);

  /* -------- option lists -------- */
  const [categories,    setCategories]    = useState<OptionItem[]>([]);
  const [subcategories, setSubcategories] = useState<OptionItem[]>([]);
  const [brands,        setBrands]        = useState<OptionItem[]>([]);
  const [boutiques,     setBoutiques]     = useState<OptionItem[]>([]);

  /* -------- sentinel -------- */
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* -------- query builder -------- */
  const buildQuery = useCallback(
    (skip: number) => {
      const qs = new URLSearchParams();
      qs.set("limit", itemsPerBatch.toString());
      qs.set("skip",  skip.toString());

      if (selectedCategorie)    qs.set("categorie", selectedCategorie);
      if (selectedSubCategorie) qs.set("subCat",     selectedSubCategorie);
      if (selectedBrand)        qs.set("brand",      selectedBrand);
      if (selectedBoutique)     qs.set("boutique",   selectedBoutique);
      if (minPrice !== null)    qs.set("priceMin",   minPrice.toString());
      if (maxPrice !== null)    qs.set("priceMax",   maxPrice.toString());
      qs.set("sort", sortOrder);

      return qs.toString();
    },
    [
      itemsPerBatch,
      selectedCategorie,
      selectedSubCategorie,
      selectedBrand,
      selectedBoutique,
      minPrice,
      maxPrice,
      sortOrder,
    ]
  );

  /* -------- fetch first batch & on filter change -------- */
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingInit(true);
      try {
        const batch = await fetchData<Product[]>(
          `NavMenu/ProductPromotion/products?${buildQuery(0)}`
        );
        if (!ignore) {
          setProducts(batch);
          setHasMore(batch.length === itemsPerBatch);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoadingInit(false);
      }
    })();
    return () => { ignore = true; };
  }, [buildQuery]);

  /* -------- infinite scroll -------- */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchData<Product[]>(
        `NavMenu/ProductPromotion/products?${buildQuery(products.length)}`
      );
      setProducts((prev) => [...prev, ...next]);
      setHasMore(next.length === itemsPerBatch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, buildQuery, products.length]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "200px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [loadMore, products.length]);

  /* -------- option lists -------- */
  useEffect(() => {
    (async () => {
      try {
        const { categories, subcategories, brands, boutiques } =
          await fetchData<{
            categories: OptionItem[];
            subcategories: OptionItem[];
            brands: OptionItem[];
            boutiques: OptionItem[];
          }>("NavMenu/ProductPromotion/products/options");

        setCategories(categories);
        setSubcategories(subcategories);
        setBrands(brands);
        setBoutiques(boutiques);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* -------- render -------- */
  return (
    <div className="flex flex-col xl:flex-row gap-16 w-[90%] mx-auto pt-8">
      <FilterProducts
        selectedCategorie={selectedCategorie}    setSelectedCategorie={setSelectedCategorie}
        selectedSubCategorie={selectedSubCategorie} setSelectedSubCategorie={setSelectedSubCategorie}
        selectedBrand={selectedBrand}            setSelectedBrand={setSelectedBrand}
        selectedBoutique={selectedBoutique}      setSelectedBoutique={setSelectedBoutique}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        categories={categories}
        subcategories={subcategories}
        brands={brands}
        boutiques={boutiques}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
      />

      <div className="flex flex-col flex-1 items-center gap-16">
        {loadingInit ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-10">
            {Array.from({ length: itemsPerBatch }).map((_, i) => (
              <div key={i} className="w-[280px] h-[400px] bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : products.length ? (
          <>
            <ProductCard products={products} />
            <div ref={loaderRef} key={products.length} />
            {loadingMore && <LoadingDots />}
          </>
        ) : (
          <p className="w-full text-center py-10">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}
