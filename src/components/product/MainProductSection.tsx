/* ------------------------------------------------------------------ */
/*  MainProductSection — Client Component with field-level loaders    */
/*  + fixed arrows & sliding thumbnail track                          */
/* ------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  IoCheckboxOutline,
  IoChevronBackSharp,
  IoChevronForwardSharp,
} from "react-icons/io5";
import ReviewClient from "@/components/product/reviews/ReviewClient";
import ProductAction from "./ProductAction";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";
import type { CartItem } from "@/store/cartSlice";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

/* ---------- tiny skeleton helper ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- props ---------- */
type ProductStub = Pick<
  Product,
  "slug" | "name" | "reference" | "price" | "discount" | "stock" | "mainImageUrl"
>;
interface Props {
  initialProduct: ProductStub;
}

/* ------------------------------------------------------------------ */
const MainProductSection: React.FC<Props> = ({ initialProduct }) => {
  /* ---------- state ---------- */
  const [product, setProduct] = useState<Partial<Product>>(initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(
    initialProduct.mainImageUrl ?? ""
  );
  const dispatch = useDispatch();

  /* ---------- hydrate with full product ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const full = await fetchData<Product>(
        `products/MainProductSection/${initialProduct.slug}`
      ).catch(() => null);
      if (!cancelled && full) {
        setProduct(full);
        setSelectedImage((curr) =>
          full.extraImagesUrl?.includes(curr) ? curr : full.mainImageUrl
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProduct.slug]);

  /* ---------- helpers ---------- */
  const handleImageClick = (img: string) => setSelectedImage(img);

  const addToCartHandler = (p: Product, qty: number) => {
    const cartItem: Omit<CartItem, "quantity"> = {
      _id: p._id,
      name: p.name,
      reference: p.reference,
      price: p.price,
      mainImageUrl: p.mainImageUrl,
      discount: p.discount ?? 0,
      slug: p.slug,
      categorie: p.categorie
        ? { name: p.categorie.name, slug: p.categorie.slug }
        : undefined,
    };
    dispatch(addItem({ item: cartItem, quantity: qty }));
  };

  /* ---------- derived ---------- */
  const loading = !("_id" in product);

  /* memo-ise thumb list so eslint is happy */
  const thumbs = useMemo(
    () => product.extraImagesUrl ?? [],
    [product.extraImagesUrl]
  );

  /* ---------- thumbnail track refs & scroll helpers ---------- */
  const trackRef = useRef<HTMLDivElement>(null);
  const pageSize = 5; // 5 thumbs visible

  const scroll = (dir: "left" | "right") => {
    const node = trackRef.current;
    if (!node) return;
    const thumbWidth = 6.5 * 16; // w-24 (6rem) + 0.5rem gap = 6.5rem ≈ px
    const step = pageSize * thumbWidth;
    node.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  /* ---------- render ---------- */
  return (
    <div className="flex gap-8 justify-center my-8 w-[90%] mx-auto max-md:flex-col max-md:w-full">
      {/* -------- images -------- */}
      <div className="flex flex-col w-[45%] max-md:w-full gap-4">
        {/* hero */}
        <div className="relative aspect-[16/12]">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name ?? "product"}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <Skel className="w-full h-full" />
          )}
        </div>

        {/* thumbnails with fixed arrows */}
        <div className="relative">
          {/* ◀ arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={loading}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-16 flex items-center justify-center disabled:opacity-30"
          >
            <IoChevronBackSharp size={22} />
          </button>

          {/* track */}
          <div
            ref={trackRef}
            className="mx-8 flex gap-4 overflow-x-hidden scroll-smooth"
          >
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <Skel key={i} className="min-w-[6rem] h-16" />
                ))
              : thumbs.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleImageClick(img)}
                    className="relative min-w-[6rem] h-16 overflow-hidden"
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
          </div>

          {/* ▶ arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={loading}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-16 flex items-center justify-center disabled:opacity-30"
          >
            <IoChevronForwardSharp size={22} />
          </button>
        </div>
      </div>

      {/* -------- details -------- */}
      <div className="w-1/2 max-md:w-full flex flex-col gap-4 px-4 ">
        {/* name */}
        {product.name ? (
          <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
        ) : (
          <Skel className="h-10 w-2/3" />
        )}

        {/* reference + stock */}
        {product.reference ? (
          <div className="flex flex-wrap gap-4 text-sm">
            <p className="font-bold">
              REF:&nbsp;
              <span className="text-gray-600 uppercase">
                {product.reference}
              </span>
            </p>
            <p className="font-bold flex items-center gap-2 text-gray-600">
              <IoCheckboxOutline size={18} />
              {product.stock! > 0 ? "En stock" : "Rupture"}
            </p>
          </div>
        ) : (
          <Skel className="h-4 w-48" />
        )}

        {/* rating */}
        <div className="flex items-center gap-2 text-sm">
          {product._id ? (
            <ReviewClient productId={product._id} summary />
          ) : (
            <Skel className="h-4 w-24" />
          )}
        </div>

        {/* info */}
        {product.info ? (
          <p className="text-lg text-gray-700 h-8">{product.info}</p>
        ) : (
          <Skel className="h-8 w-3/4" />
        )}

        {/* disponibilité */}
        {loading ? (
          <Skel className="h-6 w-48" />
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-bold">Disponibilité&nbsp;:</p>
            <span className="font-semibold">
              {product.boutique?.name ?? "Disponible en magasin"}
            </span>
          </div>
        )}

        {/* actions */}
        <ProductAction
          product={product as Product}
          addToCartHandler={addToCartHandler}
          onImageSelect={(img) => img && setSelectedImage(img)}
        />
      </div>
    </div>
  );
};

export default MainProductSection;
