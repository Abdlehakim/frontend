"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart, FaHeart, FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/cartSlice";
import ReviewClient from "@/components/product/reviews/ReviewClient";
import { addToWishlist } from "@/store/wishlistSlice";
import { RootState } from "@/store";

interface Product {
  _id: string;
  name: string;
  info: string;
  description?: string;

  reference: string;
  slug: string;

  categorie: {
    _id: string;
    name: string;
    slug: string;
  };

  subcategorie?: {
    _id: string;
    name: string;
    slug: string;
  } | null;

  boutique?: {
    _id: string;
    name: string;
  } | null;

  brand?: {
    _id: string;
    name: string;
  } | null;

  stock: number;
  price: number;
  tva: number;
  discount: number;

  stockStatus: "in stock" | "out of stock";
  statuspage: "none" | "New-Products" | "promotion" | "best-collection";
  vadmin: "not-approve" | "approve";

  mainImageUrl: string;
  mainImageId?: string | null;
  extraImagesUrl: string[];
  extraImagesId: string[];

  nbreview: number;
  averageRating: number;

  attributes: Array<{
    attributeSelected: string;
    value:
      | string
      | Array<{ name: string; value: string }>
      | Array<{ name: string; hex: string }>
      | Record<string, string>;
  }>;

  productDetails: Array<{
    name: string;
    description?: string;
  }>;

  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  products: Product[];
}

const ProductCard: React.FC<ProductCardProps> = ({ products }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = (slug: string) =>
    wishlistItems.some((item) => item.slug === slug);

  const handleWishlistClick = (product: Product) => {
    dispatch(
      addToWishlist({
        name: product.name,
        mainImageUrl: product.mainImageUrl,
        price: product.price,
        categorie: {
          name: product.categorie.name ?? "Unknown",
          slug: product.categorie.slug ?? "uncategorized",
        },
        slug: product.slug,
      })
    );
  };

  return (
    <div className="group w-full h-fit grid grid-cols-4 max-md:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3 max-md:gap-[12px] gap-[40px] align-top">
      {products.map((product) => {
        const discountedPrice = product.discount
          ? product.price - product.price * (product.discount / 100)
          : product.price;

        const isOutOfStock =
          product.stockStatus === "out of stock" || product.stock === 0;

        return (
          <div
            key={product._id}
            className="group-hover:scale-[0.9] hover:!scale-100 h-[520px] flex gap-[10px] flex-col duration-500"
          >
            {/* Product Image / Link */}
            <Link
              href={`/${product.categorie.slug ?? "categorie"}/${product.slug}`}
            >
              <Image
                className="w-full h-[380px] mx-auto top-5 object-cover"
                src={product.mainImageUrl ?? "/placeholder.png"}
                alt={product.name}
                height={300}
                width={300}
              />
            </Link>

            {/* Product Info */}
            <div className="flex-col flex px-2 w-full h-[200px]">
              <Link
                href={`/${product.categorie.slug ?? "categorie"}/${
                  product.slug
                }`}
              >
                <div className="flex justify-between h-[65px] max-sm:h-16 max-md:h-20">
                  <div className="flex-col flex gap-[4px]">
                    <p className="text-2xl max-md:text-lg font-bold capitalize">
                      {product.name}
                    </p>
                    <ReviewClient productId={product._id} summary={true} />
                  </div>
                  <div className="flex-col gap-[4px] text-right truncate">
                    {product.discount ? (
                      <div className="flex-col flex gap-[4px]">
                        <p className="text-xl max-md:text-lg font-bold text-primary">
                          {discountedPrice.toFixed(1)} TND
                        </p>
                        <span className="text-primary line-through text-xl max-md:text-sm font-bold">
                          <p className="text-gray-500">
                            {product.price.toFixed(1)} TND
                          </p>
                        </span>
                      </div>
                    ) : (
                      <p className="text-primary text-xl max-md:text-lg font-bold">
                        {product.price.toFixed(1)} TND
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* Actions: Add to cart, View, Wishlist */}
            <div className="flex text-lg max-md:text-sm justify-between h-[45px]">
              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  const cartItem = { ...product, ref: product.reference };
                  dispatch(addItem({ item: cartItem, quantity: 1 }));
                }}
                className={`AddtoCart w-[50%] max-lg:w-[60%] max-md:rounded-[3px] group/box relative ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-[#15335D] text-white"
                }`}
                disabled={isOutOfStock}
              >
                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease max-md:text-xs">
                  {isOutOfStock ? "Rupture de stock" : "A. au panier"}
                </p>
                {!isOutOfStock && (
                  <p className="text-white absolute flex items-center justify-center w-full h-full duration-300 -translate-x-[100%] lg:group-hover/box:translate-x-[-30%] ease">
                    <FaCartShopping className="w-6 h-6" />
                  </p>
                )}
              </button>

              {/* View Button */}
              <Link
                href={`/${product.categorie.slug ?? "categorie"}/${
                  product.slug
                }`}
                className="w-[25%] max-lg:w-[30%] relative"
              >
                <button className="AddtoCart bg-white max-md:rounded-[3px] h-full w-full group/box text-primary border border-primary">
                  <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-y-[-100%] ease max-md:text-xs">
                    Voir
                  </p>
                  <p className="text-primary absolute w-full h-full flex items-center justify-center duration-300 -translate-y-[-100%] lg:group-hover/box:translate-y-0 ease">
                    <FaEye className="w-5 h-5" />
                  </p>
                </button>
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlistClick(product)}
                className="h-full relative bg-white hover:bg-primary max-md:rounded-[3px] AddtoCart w-[15%] group/box text-primary hover:text-white border border-primary max-lg:hidden transition-all duration-300"
                aria-label="wishlist"
              >
                {isInWishlist(product.slug) ? (
                  <FaHeart className="text-red-500 w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
