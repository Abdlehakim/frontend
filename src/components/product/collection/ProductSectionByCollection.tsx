"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/categorie/ProductCard";
import CollectionProductsFilter from "@/components/product/filter/CollectionProductsFilter";
import Pagination from "@/components/PaginationClient";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";
import type { Product } from "@/types/Product";

interface Props {
  products: Product[];
}

export default function ProductSectionByCollection({ products }: Props) {
  /* ---------- filter state ---------- */
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
  const [selectedSubCategorie, setSelectedSubCategorie] = useState<string | null>(
    null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  /* ---------- sort & pagination ---------- */
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ---------- option lists ---------- */
  const categories = Array.from(
    new Set(products.map((p) => p.categorie?.name || p.categorie?.name).filter(Boolean))
  ).map((name) => ({ _id: name!, name: name! }));

  const subcategories = Array.from(
    new Set(products.map((p) => p.subcategorie?.name).filter(Boolean))
  ).map((name) => ({ _id: name!, name: name! }));

  const brands = Array.from(
    new Set(products.map((p) => p.brand?.name).filter(Boolean))
  ).map((name) => ({ _id: name!, name: name! }));

  const boutiques = Array.from(
    new Set(products.map((p) => p.boutique?.name).filter(Boolean))
  ).map((name) => ({ _id: name!, name: name! }));

  /* ---------- filtered list ---------- */
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    let list = [...products];

    if (selectedCategorie)
      list = list.filter(
        (p) =>
          p.categorie?.name === selectedCategorie ||
          p.categorie?.name === selectedCategorie
      );

    if (selectedSubCategorie)
      list = list.filter((p) => p.subcategorie?.name === selectedSubCategorie);

    if (selectedBrand) list = list.filter((p) => p.brand?.name === selectedBrand);

    if (selectedBoutique)
      list = list.filter((p) => p.boutique?.name === selectedBoutique);

    if (minPrice !== null) list = list.filter((p) => p.price >= minPrice);
    if (maxPrice !== null) list = list.filter((p) => p.price <= maxPrice);

    list.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(list);
    setCurrentPage(1);
  }, [
    products,
    selectedCategorie,
    selectedSubCategorie,
    selectedBrand,
    selectedBoutique,
    minPrice,
    maxPrice,
    sortOrder,
  ]);

  /* ---------- pagination ---------- */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto pt-6">
      {/* sort dropdown */}
      <div className="flex justify-end">
        <FilterPriceOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      <div className="xl:flex xl:gap-10 flex-col xl:flex-row">
        {/* sidebar filters */}
        <CollectionProductsFilter
          selectedCategorie={selectedCategorie}
          setSelectedCategorie={setSelectedCategorie}
          selectedSubCategorie={selectedSubCategorie}
          setSelectedSubCategorie={setSelectedSubCategorie}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedBoutique={selectedBoutique}
          setSelectedBoutique={setSelectedBoutique}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          boutiques={boutiques}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* products + pagination */}
        <div className="flex flex-col items-center w-full gap-5">
          <ProductCard products={currentProducts} />

          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
