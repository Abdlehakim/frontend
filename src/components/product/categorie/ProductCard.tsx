/* ------------------------------------------------------------------
   src/components/product/ProductCard.tsx
------------------------------------------------------------------ */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart, FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem, type CartItem } from "@/store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,        // ⬅️ NEW
} from "@/store/wishlistSlice";
import ReviewClient from "@/components/product/reviews/ReviewClient";
import { RootState } from "@/store";
import { Product } from "@/types/Product";

interface ProductCardProps {
  products: Product[];
}

type BtnState = "loading" | "success";

const ProductCard: React.FC<ProductCardProps> = ({ products }) => {
  const dispatch   = useDispatch();
  const wishlist   = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = (slug: string) => wishlist.some((w) => w.slug === slug);

  /* 🔥 track button states per product */
  const [btnStates, setBtnStates] = useState<Record<string, BtnState | undefined>>({});

  /* -------- wishlist toggle -------- */
  const handleWishlistClick = (product: Product) => {
    if (!product.categorie) return;

    if (isInWishlist(product.slug)) {
      // retire de la wishlist
      dispatch(removeFromWishlist(product.slug));
    } else {
      // ajoute à la wishlist
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
        }),
      );
    }
  };

  /* -------- add to cart -------- */
  const handleAddToCart = (product: Product, isOutOfStock: boolean) => {
    if (isOutOfStock || btnStates[product._id] === "loading") return;

    /* show loader */
    setBtnStates((p) => ({ ...p, [product._id]: "loading" }));

    /* add to cart immediately */
    const base: Omit<CartItem, "quantity"> = {
      _id: product._id,
      name: product.name,
      reference: product.reference,
      price: product.price,
      tva: product.tva,
      mainImageUrl: product.mainImageUrl,
      discount: product.discount ?? 0,
      slug: product.slug,
      categorie: product.categorie
        ? {
            name: product.categorie.name,
            slug: product.categorie.slug,
          }
        : { name: "inconnue", slug: "categorie" },
      ...(product.subcategorie && {
        subcategorie: {
          name: product.subcategorie.name,
          slug: product.subcategorie.slug,
        },
      }),
    };
    dispatch(addItem({ item: base, quantity: 1 }));

    /* 0.5 s spinner → puis 0.5 s texte succès */
    setTimeout(() => {
      setBtnStates((p) => ({ ...p, [product._id]: "success" }));
      setTimeout(() => {
        setBtnStates((p) => {
          const clone = { ...p };
          delete clone[product._id];
          return clone;
        });
      }, 500);
    }, 1000);
  };

  return (
    <div className="group w-fit max-md:h-fit h-fit grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[40px]">
      {products.map((product) => {
        /** price helpers */
        const discountedPrice = product.discount
          ? product.price - product.price * (product.discount / 100)
          : product.price;

        /** stock helpers */
        const isOutOfStock =
          product.stockStatus === "out of stock" || product.stock === 0;

        /** url helper — use sub-category if present, else category */
        const parentSlug =
          product.subcategorie?.slug ?? product.categorie?.slug ?? "categorie";
        const productUrl = `/${parentSlug}/${product.slug}`;

        const state = btnStates[product._id];
        const isLoading = state === "loading";
        const isSuccess = state === "success";

        /* -------- single card -------- */
        return (
          <div
            key={product._id}
            className="h-fit w-[280px] flex flex-col gap-[10px] transform duration-200 ease-in-out group-hover:scale-[0.9] hover:!scale-[1.1]  max-md:group-hover:scale-[1] max-md:hover:!scale-[1]"
          >
            {/* image */}
            <Link href={productUrl}>
              <div className="relative aspect-[16/14] bg-gray-200">
                <Image
                  src={product.mainImageUrl ?? ""}
                  alt={product.name}
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className="object-cover"
                  placeholder="empty"
                  priority
                  quality={75}
                />
              </div>
            </Link>

            {/* info */}
            <div className="flex flex-col w-full h-[80px]">
              <Link href={productUrl}>
                <div className="flex justify-between h-[65px] max-sm:h-16 max-md:h-20">
                  <div className="flex flex-col gap-[4px]">
                    <p className="text-lg font-bold capitalize">
                      {product.name?.length > 8
                        ? product.name.slice(0, 8) + "..."
                        : product.name}
                    </p>
                    <ReviewClient productId={product._id} summary />
                  </div>

                  <div className="flex flex-col gap-[4px] text-right truncate">
                    {product.discount ? (
                      <>
                        <p className="text-xl max-md:text-lg font-bold text-primary">
                          {discountedPrice.toFixed(1)} TND
                        </p>
                        <p className="text-lg max-md:text-sm font-bold text-gray-500 line-through">
                          {product.price.toFixed(1)} TND
                        </p>
                      </>
                    ) : (
                      <p className="text-primary text-xl max-md:text-lg font-bold">
                        {product.price.toFixed(1)} TND
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* actions */}
            <div className="flex justify-between h-[45px] text-lg max-md:text-sm">
              {/* add‑to‑cart */}
              <button
                disabled={isOutOfStock || isLoading}
                onClick={() => handleAddToCart(product, isOutOfStock)}
                className={`AddtoCart relative w-[50%] max-lg:w-[60%] max-md:rounded-[3px] group/box ${
                  isOutOfStock || isLoading || isSuccess
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-[#15335D]"
                }`}
              >
                {/* text / spinner / success */}
                {isOutOfStock ? (
                  <p className="absolute inset-0 flex items-center justify-center transition-transform duration-300 text-sm">
                    Rupture de stock
                  </p>
                ) : isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  </div>
                ) : isSuccess ? (
                  <p className="absolute inset-0 flex items-center justify-center text-sm">
                    Produit ajouté
                  </p>
                ) : (
                  <p className="absolute inset-0 flex items-center justify-center transition-transform duration-300 lg:group-hover/box:translate-x-[10%] text-sm">
                    A. au panier
                  </p>
                )}

                {/* cart icon slide‑in (hide while loading/out‑of‑stock/success) */}
                {!isOutOfStock && !isLoading && !isSuccess && (
                  <span className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-300 lg:group-hover/box:translate-x-[-35%]">
                    <FaCartShopping className="w-6 h-6" />
                  </span>
                )}
              </button>

              {/* view */}
              <Link href={productUrl} className="w-[25%] max-lg:w-[30%]">
                <button className="AddtoCart relative h-full w-full bg-white text-primary border border-primary max-md:rounded-[3px] group/box">
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 lg:group-hover/box:-translate-y-full text-sm">
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
                className={`
                  AddtoCart relative w-[15%] bg-white border max-lg:hidden max-md:rounded-[3px] group/box border-primary
                  ${isInWishlist(product.slug)
                    ? " text-red-500 hover:bg-red-500 hover:text-white"
                    : " text-primary hover:bg-primary hover:text-white"}
                `}
              >
                {isInWishlist(product.slug) ? (
                  <FaHeart className="w-5 h-5" />
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
