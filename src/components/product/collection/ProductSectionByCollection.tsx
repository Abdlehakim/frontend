"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/category/ProductCard";
import FilterProducts from "@/components/product/filter/FilterProducts";
import Pagination from "@/components/PaginationClient";
import FilterPriceOrder from "@/components/product/filter/FilterPriceOrder";

interface Product {
  _id: string;
  name: string;
  ref: string;
  price: number;
  tva: number;
  imageUrl: string;
  images: string[];
  material: string;
  color: string;
  dimensions: string;
  warranty: string;
  weight: string;
  discount?: number;
  status: string;
  statuspage: string;
  vadmin: string;
  slug: string;
  nbreview: number;
  averageRating: number;
  stock: number;
  info: string;
  description: string;
  boutique: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface ProductsPageProps {
  products: Product[];
}

export default function ProductSectionByCollection({ products }: ProductsPageProps) {
  // Local state for filtering
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // This will be the list after filters are applied
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

    // New sort order state
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter lists for dropdowns
  const brands = Array.from(
    new Set(products.map((p) => p.brand?.name))
  ).filter(Boolean) as string[];

  const boutiques = Array.from(
    new Set(products.map((p) => p.boutique?.name))
  ).filter(Boolean) as string[];

  const uniqueColors = Array.from(new Set(products.map((p) => p.color))).filter(
    Boolean
  ) as string[];

  const uniqueMaterials = Array.from(
    new Set(products.map((p) => p.material))
  ).filter(Boolean) as string[];

  // Apply filters whenever dependencies change
  useEffect(() => {
    let newFiltered = [...products];

    if (selectedBrand) {
      newFiltered = newFiltered.filter((p) => p.brand?.name === selectedBrand);
    }
    if (selectedBoutique) {
      newFiltered = newFiltered.filter(
        (p) => p.boutique?.name === selectedBoutique
      );
    }
    if (selectedColor) {
      newFiltered = newFiltered.filter((p) => p.color === selectedColor);
    }
    if (selectedMaterial) {
      newFiltered = newFiltered.filter((p) => p.material === selectedMaterial);
    }
    if (minPrice !== null) {
      newFiltered = newFiltered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null) {
      newFiltered = newFiltered.filter((p) => p.price <= maxPrice);
    }
    // Sort products based on sortOrder
    newFiltered.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(newFiltered);
    // Reset to first page on filter or sort change
    setCurrentPage(1);
  }, [
    selectedBrand,
    selectedBoutique,
    selectedColor,
    selectedMaterial,
    minPrice,
    maxPrice,
    products,
    sortOrder,
  ]);

  // Calculate pagination details
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get products for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-[16px] w-[90%] justify-center mx-auto pt-[24px]">
      <div className="w-full flex justify-end">
        <FilterPriceOrder setSortOrder={setSortOrder} sortOrder={sortOrder} />
      </div>
      <div className="xl:flex gap-[40px] max-xl:flex max-xl:flex-col">
        {/* Filters */}
        <FilterProducts
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedBoutique={selectedBoutique}
          setSelectedBoutique={setSelectedBoutique}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          brands={brands.map((name) => ({ _id: name, name }))}
          boutique={boutiques.map((name) => ({ _id: name, name }))}
          uniqueColors={uniqueColors}
          uniqueMaterials={uniqueMaterials}
        />

        {/* Products for the current page */}
        <div className="flex flex-col items-center w-full gap-[20px]">
          <ProductCard products={currentProducts} />
          {/* Pagination Component */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
