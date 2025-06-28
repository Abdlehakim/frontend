"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart, FaHeart, FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addItem, type CartItem } from "@/store/cartSlice";
import { addToWishlist } from "@/store/wishlistSlice";
import ReviewClient from "@/components/product/reviews/ReviewClient";
import { RootState } from "@/store";
import { Product } from "@/types/Product";

interface ProductCardProps {
  products: Product[];
}

const ProductCard: React.FC<ProductCardProps> = ({ products }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = (slug: string) =>
    wishlistItems.some((w) => w.slug === slug);

  const handleWishlistClick = (product: Product) => {
    if (!product.categorie) return;

    dispatch(
      addToWishlist({
        name: product.name,
        mainImageUrl: product.mainImageUrl,
        price: product.price,
        categorie: {
          name: product.categorie.name,
          slug: product.categorie.slug,
        },
        slug: product.slug,
      })
    );
  };

  return (
    <div className="group w-fit max-md:h-fit h-fit min-h-[900px] grid grid-cols-4 gap-[40px] max-2xl:grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 max-md:gap-[12px] align-top">
      {products.map((product) => {
        /** price helpers */
        const discountedPrice = product.discount
          ? product.price - product.price * (product.discount / 100)
          : product.price;

        /** stock helpers */
        const isOutOfStock =
          product.stockStatus === "out of stock" || product.stock === 0;

        /** url helpers  */
        const categorieSlug = product.categorie?.slug ?? "categorie";
        const subcategorieSlug = product.subcategorie?.slug ?? "sous-categorie";
        const productUrl = `/${categorieSlug}/${subcategorieSlug}/${product.slug}`;

        /** ---------- single card ---------- */
        return (
          <div
            key={product._id}
            className="h-fit w-[280px] flex flex-col gap-[10px] transform duration-200 ease-in-out group-hover:scale-[0.9] hover:!scale-[1.1]"
          >
            {/* ---------- product image ---------- */}
            <Link href={productUrl}>
            <div className="relative aspect-[16/14]">
              <Image
                src={product.mainImageUrl ?? "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              /></div>
            </Link>

            {/* ---------- product info ---------- */}
            <div className="flex flex-col w-full h-[80px]">
              <Link href={productUrl}>
                <div className="flex justify-between h-[65px] max-sm:h-16 max-md:h-20">
                  <div className="flex flex-col gap-[4px]">
                    <p className="text-xl font-bold capitalize">
                      {product.name}
                    </p>
                    <ReviewClient productId={product._id} summary />
                  </div>

                  <div className="flex flex-col gap-[4px] text-right truncate">
                    {product.discount ? (
                      <>
                        <p className="text-xl max-md:text-lg font-bold text-primary">
                          {discountedPrice.toFixed(1)} TND
                        </p>
                        <p className="text-lg max-md:text-sm font-bold text-gray-500 line-through">
                          {product.price.toFixed(1)} TND
                        </p>
                      </>
                    ) : (
                      <p className="text-primary text-xl max-md:text-lg font-bold">
                        {product.price.toFixed(1)} TND
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* ---------- actions ---------- */}
            <div className="flex justify-between h-[45px] text-lg max-md:text-sm">
              {/* add-to-cart */}
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;

                  const base: Omit<CartItem, "quantity"> = {
                    _id: product._id,
                    name: product.name,
                    reference: product.reference,
                    price: product.price,
                    mainImageUrl: product.mainImageUrl,
                    discount: product.discount ?? 0,
                    slug: product.slug,
                  };

                  const cartItem: Omit<CartItem, "quantity"> = product.categorie
                    ? {
                        ...base,
                        categorie: {
                          name: product.categorie.name,
                          slug: product.categorie.slug,
                        },
                      }
                    : {
                        ...base,
                        categorie: { name: "inconnue", slug: "categorie" },
                      };

                  dispatch(addItem({ item: cartItem, quantity: 1 }));
                }}
                className={`AddtoCart relative w-[50%] max-lg:w-[60%] max-md:rounded-[3px] group/box
                            ${
                              isOutOfStock
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-[#15335D]"
                            }`}
              >
                <p className="absolute inset-0 flex items-center justify-center transition-transform duration-300 lg:group-hover/box:translate-x-[10%] max-md:text-xs">
                  {isOutOfStock ? "Rupture de stock" : "A. au panier"}
                </p>
                {!isOutOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-300 lg:group-hover/box:translate-x-[-35%]">
                    <FaCartShopping className="w-6 h-6" />
                  </span>
                )}
              </button>

              {/* view */}
              <Link href={productUrl} className="w-[25%] max-lg:w-[30%]">
                <button className="AddtoCart relative h-full w-full bg-white text-primary border border-primary max-md:rounded-[3px] group/box">
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 lg:group-hover/box:-translate-y-full max-md:text-xs">
                    Voir
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center -translate-y-full transition-transform duration-300 lg:group-hover/box:translate-y-0">
                    <FaEye className="w-5 h-5" />
                  </span>
                </button>
              </Link>

              {/* wishlist */}
              <button
                aria-label="wishlist"
                onClick={() => handleWishlistClick(product)}
                className="AddtoCart relative w-[15%] bg-white text-primary border border-primary hover:bg-primary hover:text-white max-lg:hidden max-md:rounded-[3px] group/box"
              >
                {isInWishlist(product.slug) ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
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
