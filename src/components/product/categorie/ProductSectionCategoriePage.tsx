// src/components/product/category/ProductSectionCategoryPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/Product";
import ProductCard from "@/components/product/categorie/ProductCard";
import Pagination from "@/components/PaginationClient";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";

export const revalidate = 60;

interface Props {
  slugCategorie: string;
  initialProducts: Product[];
}

export default function ProductSectionCategoryPage({
  slugCategorie,
  initialProducts,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 8;

  // resort whenever initialProducts or sortOrder change
  useEffect(() => {
    setProducts(
      [...initialProducts].sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      )
    );
    setCurrentPage(1);
  }, [initialProducts, sortOrder]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto">
      <div className="flex justify-end w-full">
        <FilterPriceOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
      <div className="flex flex-col items-center w-full gap-5">
        <div className="w-full">
          <ProductCard products={currentProducts} />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
