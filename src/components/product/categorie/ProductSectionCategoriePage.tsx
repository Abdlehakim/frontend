/* ------------------------------------------------------------------ */
/*  src/components/product/categorie/ProductSectionCategoriePage.tsx  */
/* ------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import FilterProducts from "@/components/product/filter/FilterProducts";
import LoadingDots from "@/components/LoadingDots";
import { fetchData } from "@/lib/fetchData";

/* ---------- types ---------- */
interface Props {
  slugCategorie: string;
  /** when true we’re on a sub-categorie page, so hide the subcategorie filter */
  hideSubcategorie?: boolean;
}
interface OptionItem {
  _id: string;
  name: string;
}

/* ---------- component ---------- */
export default function ProductSectionCategoriePage({
  slugCategorie,
  hideSubcategorie = false,
}: Props) {
  const itemsPerBatch = 8;

  /* ---------- filter state ---------- */
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [selectedSubCategorie, setSelectedSubCategorie] = useState<
    string | null
  >(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* ---------- product data ---------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ---------- option lists ---------- */
  const [brands, setBrands] = useState<OptionItem[]>([]);
  const [boutiques, setBoutiques] = useState<OptionItem[]>([]);
  const [subcategories, setSubcategories] = useState<OptionItem[]>([]);

  /* ---------- refs ---------- */
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* =================================================================
     BUILD QUERY STRING
  ================================================================== */
  const buildQuery = useCallback(
    (skip: number) => {
      const qs = new URLSearchParams();
      qs.set("limit", itemsPerBatch.toString());
      qs.set("skip", skip.toString());

      if (selectedBrand) qs.set("brand", selectedBrand);
      if (selectedBoutique) qs.set("boutique", selectedBoutique);
      if (selectedSubCategorie) qs.set("subCat", selectedSubCategorie);
      if (minPrice !== null) qs.set("priceMin", minPrice.toString());
      if (maxPrice !== null) qs.set("priceMax", maxPrice.toString());
      qs.set("sort", sortOrder);

      return qs.toString();
    },
    [
      itemsPerBatch,
      selectedBrand,
      selectedBoutique,
      selectedSubCategorie,
      minPrice,
      maxPrice,
      sortOrder,
    ]
  );

  /* =================================================================
     FETCH FIRST PRODUCT PAGE WHENEVER FILTERS CHANGE
  ================================================================== */
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingInitial(true);
      try {
        const firstBatch = await fetchData<Product[]>(
          `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?${buildQuery(
            0
          )}`
        );
        if (!ignore) {
          setProducts(firstBatch);
          setHasMore(firstBatch.length === itemsPerBatch);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoadingInitial(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [slugCategorie, buildQuery]);

  /* =================================================================
     INFINITE SCROLL – LOAD MORE
  ================================================================== */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextBatch = await fetchData<Product[]>(
        `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?${buildQuery(
          products.length
        )}`
      );
      setProducts((prev) => [...prev, ...nextBatch]);
      setHasMore(nextBatch.length === itemsPerBatch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, slugCategorie, buildQuery, products.length]);

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

  /* =================================================================
     FETCH OPTION LISTS (once per slugCategorie)
  ================================================================== */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { brands, boutiques, subcategories } = await fetchData<{
          brands: OptionItem[];
          boutiques: OptionItem[];
          subcategories: OptionItem[];
        }>(
          `NavMenu/categorieSubCategoriePage/products/${slugCategorie}/options`
        );

        if (!ignore) {
          setBrands(brands);
          setBoutiques(boutiques);
          setSubcategories(subcategories);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [slugCategorie]);

  /* =================================================================
     RENDER
  ================================================================== */
  return (
    <div className="flex flex-row justify-center max-xl:flex-col gap-6 w-[95%] mx-auto">
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
        hideSubcategorie={hideSubcategorie}
        hideCategorie={true}
      />

      <div className="flex flex-col items-center gap-6">
        {loadingInitial ? (
          <div className="grid grid-cols-4 gap-10 max-md:grid-cols-1">
            {Array.from({ length: itemsPerBatch }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] w-[280px] bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        ) : products.length ? (
          <>
            <ProductCard products={products} />
            <div ref={loaderRef} key={products.length} />
            {loadingMore && <LoadingDots />}
          </>
        ) : (
          <p className="w-full text-center min-h-screen py-10">
            Aucun produit trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
