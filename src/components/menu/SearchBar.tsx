"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ---------- types ---------- */
interface Product {
  _id: string;
  category: { slug: string };
  slug: string;
  imageUrl: string;
  name: string;
  price: number;
  discount?: number;
}

const SearchBar: React.FC = () => {
  const { fmt } = useCurrency();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(searchTerm);

  /* debounce user input */
  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      500
    );
    return () => clearTimeout(id);
  }, [searchTerm]);

  /* fetch products when the debounced term changes */
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setProducts([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/searchProduct?searchTerm=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error searching for products:", err);
      }
    })();
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(
        `/api/searchProduct?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Error searching for products:", err);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setProducts([]);
  };

  return (
    <div className="relative w-[450px] max-2xl:w-[300px] max-xl:w-[250px] max-xl:hidden">
      <input
        className="w-full h-12 px-4 py-2 rounded-full border border-gray-300"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for products"
        aria-label="Search for products"
      />
      <button
        className="absolute h-full px-4 group right-0 top-1/2 -translate-y-1/2 rounded-r-full text-[#15335D]"
        aria-label="Search"
        onClick={handleSearch}
      >
        <CiSearch className="w-8 h-8 transition-transform duration-500 group-hover:w-10 group-hover:h-10" />
      </button>

      {/* results */}
      {products.length > 0 && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg max-h-60 overflow-y-auto z-50">
          {products.map((product) => {
            const hasDiscount =
              typeof product.discount === "number" &&
              product.discount > 0;
            const discountedPrice = hasDiscount
              ? (product.price * (100 - product.discount!)) / 100
              : product.price; // always a number

            return (
              <div key={product._id} className="p-4 border-b">
                <Link
                  href={`/${product.category.slug}/${product.slug}`}
                  onClick={clearSearch}
                  className="flex items-center gap-2 text-[22px]"
                >
                  <Image
                    width={50}
                    height={50}
                    src={product.imageUrl}
                    alt={product.name}
                    className="rounded-md"
                  />

                  <span className="ml-4 truncate">{product.name}</span>

                  <span className="ml-auto text-[18px] text-gray-500">
                    {hasDiscount ? (
                      <>
                        <span className="line-through mr-2 text-red-500">
                          {fmt(product.price)}
                        </span>
                        <span className="text-green-500">
                          {fmt(discountedPrice)}
                        </span>
                      </>
                    ) : (
                      <span>{fmt(product.price)}</span>
                    )}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
