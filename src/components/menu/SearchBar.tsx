"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

interface Product {
  _id: string;
  category: {
    slug: string;
  };
  slug: string;
  imageUrl: string;
  name: string;
  price: number;
  discount?: number;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Call the API whenever the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const res = await fetch(
          `/api/searchProduct?searchTerm=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error searching for products:", error);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `/api/searchProduct?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setProducts(data.products); // Update products state with the search results
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };
  const handleLinkClick = () => {
    setSearchTerm(""); // Clear search term
    setProducts([]); // Clear products to close search results
  };
  return (
    <div className="relative w-[450px] max-2xl:w-[500px] max-xl:w-[250px] max-xl:hidden ml-4">
      <input
            className="w-full h-12 px-4 py-2 rounded-full max-lg:hidden border border-gray-300"
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
            <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
          </button>

 {/* Display search results */}
 {products.length > 0 && (
          <div className="absolute top-14 left-0 w-full bg-white shadow-lg max-h-60 overflow-y-auto z-50">
          {products.map((product) => (
       <div
       key={product._id}
       className="p-4 border-b"
     >
              <Link href={`/${product.category.slug}/${product.slug}`} 
               onClick={handleLinkClick} // Clear search on link click
              className="gap-[8px] flex items-center justify-start font-bold text-[25px]">
                       <Image
                    width={50}
                    height={50}
                    src={product.imageUrl}
                    alt={product.name}
                    className="rounded-md"
                  /> {/* Product Name */}
                  <span className="ml-4">{product.name}</span>

                  {/* Product Price & Discount */}
                  <span className="ml-auto text-[20px] text-gray-500">
                    {product.discount ? (
                      <>
                        {/* Show discounted price */}
                        <span className="line-through mr-2 text-red-500">
                          {product.price.toFixed(2)} TND
                        </span>
                        <span className="text-green-500">
                          {(
                            (product.price * (100 - product.discount)) /
                            100
                          ).toFixed(2)} TND
                        </span>
                      </>
                    ) : (
                      // Show regular price if no discount
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </span>
             </Link>
             </div>
            
          ))}
        </div>
      )}
     
    </div>
  );
};

export default SearchBar;
