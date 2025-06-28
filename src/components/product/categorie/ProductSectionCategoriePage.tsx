"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Product, SubCategorie } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import FilterProducts from "@/components/product/filter/FilterProducts";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";
import LoadingDots from "@/components/LoadingDots";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface Props {
  slugCategorie: string;
  initialProducts: Product[];
  initialSubcategories: SubCategorie[];
}

export default function ProductSectionCategoriePage({
  slugCategorie,
  initialProducts,
  initialSubcategories,
}: Props) {
  /* ---------- filter state ---------- */
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [selectedSubCategorie, setSelectedSubCategorie] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* ---------- infinite scroll state ---------- */
  const itemsPerBatch = 8;
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(() => {
    // initial sort
    const temp = [...initialProducts];
    temp.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
    return temp;
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === itemsPerBatch);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* ---------- option lists ---------- */
  const brands = useMemo(
    () =>
      Array.from(
        allProducts.reduce((map, p) => {
          if (p.brand?._id) map.set(p.brand._id, p.brand.name);
          return map;
        }, new Map<string, string>())
      ).map(([id, name]) => ({ _id: id, name })),
    [allProducts]
  );

  const boutiques = useMemo(
    () =>
      Array.from(
        allProducts.reduce((map, p) => {
          if (p.boutique?._id) map.set(p.boutique._id, p.boutique.name);
          return map;
        }, new Map<string, string>())
      ).map(([id, name]) => ({ _id: id, name })),
    [allProducts]
  );

  const subcategories = useMemo(
    () => initialSubcategories.map((s) => ({ _id: s._id, name: s.name })),
    [initialSubcategories]
  );

  /* ---------- apply filters & sorting (only on filter change) ---------- */
  useEffect(() => {
    let temp = [...allProducts];

    if (selectedBrand) temp = temp.filter((p) => p.brand?._id === selectedBrand);
    if (selectedBoutique) temp = temp.filter((p) => p.boutique?._id === selectedBoutique);
    if (selectedSubCategorie) temp = temp.filter((p) => p.subcategorie?._id === selectedSubCategorie);
    if (minPrice != null) temp = temp.filter((p) => p.price >= minPrice);
    if (maxPrice != null) temp = temp.filter((p) => p.price <= maxPrice);

    temp.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selectedBoutique, selectedSubCategorie, minPrice, maxPrice, sortOrder]);

  /* ---------- load more handler (memoized) ---------- */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newBatch = await fetchData<Product[]>(
        `NavMenu/categorieSubCategoriePage/products/${slugCategorie}` +
          `?limit=${itemsPerBatch}&skip=${allProducts.length}`
      );

      setAllProducts((prev) => [...prev, ...newBatch]);

      const toAppend = newBatch
        .filter((p) =>
          (!selectedBrand || p.brand?._id === selectedBrand) &&
          (!selectedBoutique || p.boutique?._id === selectedBoutique) &&
          (!selectedSubCategorie || p.subcategorie?._id === selectedSubCategorie) &&
          (minPrice == null || p.price >= minPrice) &&
          (maxPrice == null || p.price <= maxPrice)
        )
        .sort((a, b) =>
          sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );

      setFilteredProducts((prev) => [...prev, ...toAppend]);
      setHasMore(newBatch.length === itemsPerBatch);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    allProducts.length,
    hasMore,
    loading,
    slugCategorie,
    itemsPerBatch,
    selectedBrand,
    selectedBoutique,
    selectedSubCategorie,
    minPrice,
    maxPrice,
    sortOrder,
  ]);

  /* ---------- infinite scroll observer ---------- */
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col w-[90%] mx-auto gap-6">
      {/* sort dropdown */}
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
          {filteredProducts.length > 0 ? (
            <>
              <ProductCard products={filteredProducts} />

              {/* loader sentinel */}
              <div ref={loaderRef} className="h-6">
                {loading && <LoadingDots />}
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
