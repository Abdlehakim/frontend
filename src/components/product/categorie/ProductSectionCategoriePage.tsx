"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, SubCategorie } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import Pagination from "@/components/PaginationClient";
import FilterProducts from "@/components/product/filter/FilterProducts";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";

export const revalidate = 60;

/* ---------- props ---------- */
interface Props {
  slugCategorie: string;
  initialProducts: Product[];
  initialSubcategories: SubCategorie[];
}

export default function ProductSectionCategoriePage({
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

  /* ---------- pagination ---------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ---------- option lists ---------- */
  const brands = useMemo(
    () =>
      Array.from(
        initialProducts.reduce((m, p) => {
          if (p.brand?._id) m.set(p.brand._id, p.brand.name);
          return m;
        }, new Map<string, string>())
      ).map(([id, name]) => ({ _id: id, name })),
    [initialProducts]
  );

  const boutiques = useMemo(
    () =>
      Array.from(
        initialProducts.reduce((m, p) => {
          if (p.boutique?._id) m.set(p.boutique._id, p.boutique.name);
          return m;
        }, new Map<string, string>())
      ).map(([id, name]) => ({ _id: id, name })),
    [initialProducts]
  );

  // 👉  ALWAYS show every approved sub-category
  const subcategories = useMemo(
    () => initialSubcategories.map((s) => ({ _id: s._id, name: s.name })),
    [initialSubcategories]
  );

  /* ---------- filtered list ---------- */
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    let filtered = [...initialProducts];

    if (selectedBrand)
      filtered = filtered.filter((p) => p.brand?._id === selectedBrand);
    if (selectedBoutique)
      filtered = filtered.filter((p) => p.boutique?._id === selectedBoutique);
    if (selectedSubCategorie)
      filtered = filtered.filter(
        (p) => p.subcategorie?._id === selectedSubCategorie
      );
    if (minPrice !== null)
      filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice !== null)
      filtered = filtered.filter((p) => p.price <= maxPrice);

    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setProducts(filtered);
    setCurrentPage(1); // reset when filters change
  }, [
    initialProducts,
    selectedBrand,
    selectedBoutique,
    selectedSubCategorie,
    minPrice,
    maxPrice,
    sortOrder,
  ]);

  /* ---------- pagination ---------- */
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col w-[90%] mx-auto gap-6">
      {/* sort dropdown */}
      <div className="flex justify-end">
        <FilterPriceOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      <div className="flex flex-col xl:flex-row w-full gap-16">
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

        <div className="flex flex-col items-center w-full gap-16">
          {currentProducts.length ? (
            <>
              <div className="w-full my-8">
                <ProductCard products={currentProducts} />
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="w-full text-center py-10">Aucun produit trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
