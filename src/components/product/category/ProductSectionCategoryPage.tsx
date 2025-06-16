"use client";

import React, { useState, useEffect } from "react";
import { cache } from "react";
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
  mainImageUrl: string;
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

// Reusable fetch function
const fetchProductData = cache(async <T,>(endpoint: string): Promise<T> => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
});

interface CategoryPageProps {
  slugCategory: string;
}

// Convert to a Client Component for state management
export default function ProductSectionCategoryPage({
  slugCategory,
}: CategoryPageProps) {
  // Local state for filtering
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // New sort order state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Set how many products per page

  // Fetch products on mount or when slugCategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchProductData<Product[]>(
          `/api/NavMenu/categorySubCategoryPage/products/${slugCategory}`
        );

        const processedProducts = data.map((product) => ({
          ...product,
          categoryName: product.category?.name ?? "Unknown",
        }));

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [slugCategory]);

  // Filter lists for dropdowns
  const brands = Array.from(new Set(products.map((p) => p.brand?.name))).filter(
    Boolean
  );
  const boutiques = Array.from(
    new Set(products.map((p) => p.boutique?.name))
  ).filter(Boolean);
  const uniqueColors = Array.from(new Set(products.map((p) => p.color))).filter(
    Boolean
  );
  const uniqueMaterials = Array.from(
    new Set(products.map((p) => p.material))
  ).filter(Boolean);

  // Apply filters dynamically
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
    <div className="flex flex-col gap-[16px] w-[90%] justify-center mx-auto">
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
        <div className="flex flex-col items-center w-full gap-[20px] h-[1200px] max-2xl:h-fit">
          <div className="h-[1100px] max-2xl:h-fit">
          <ProductCard products={currentProducts} />
          </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
      </div>
    </div>
  );
}
