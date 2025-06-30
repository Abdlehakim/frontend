/* ------------------------------------------------------------------ */
/*  MainProductSection — Client Component with field-level loaders    */
/* ------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoCheckboxOutline } from "react-icons/io5";
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
  | "slug"
  | "name"
  | "reference"
  | "price"
  | "discount"
  | "stock"
  | "mainImageUrl"
>;

interface Props {
  initialProduct: ProductStub;
}

const MainProductSection: React.FC<Props> = ({ initialProduct }) => {
  /* ---------- state ---------- */
  const [product, setProduct] = useState<Partial<Product>>(initialProduct);
  const [selectedImage, setSelectedImage] = useState(initialProduct.mainImageUrl);
  const dispatch = useDispatch();

  /* ---------- hydrate with full product ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const full = await fetchData<Product>(
        /* removed leading “/” ↓↓↓ */
        `products/MainProductSection/${initialProduct.slug}`
      ).catch(() => null);

      if (!cancelled && full) {
        setProduct(full);
        setSelectedImage((img) =>
          full.extraImagesUrl?.includes(img!) ? img! : full.mainImageUrl
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
  const thumbs  = product.extraImagesUrl ?? [];

  /* ---------- render ---------- */
  return (
    <div className="flex gap-8 justify-center my-8 w-[90%] mx-auto">
      {/* -------- images -------- */}
      <div className="flex flex-col w-[45%] gap-4">
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

        {/* thumbnails */}
        <div className="flex gap-4 flex-wrap justify-center">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skel key={i} className="w-24 h-16" />
              ))
            : thumbs.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleImageClick(img)}
                  className="relative w-24 h-16 overflow-hidden"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
        </div>
      </div>

      {/* -------- details -------- */}
      <div className="w-1/2 flex flex-col gap-4 px-4">
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
          <div className="flex gap-4">
            <Skel className="h-4" />
          </div>
        )}

        {/* rating */}
          <div className="flex items-center gap-2 text-sm">
            <ReviewClient productId={product._id!} summary />        
          </div>


        {/* info */}
        {product.info ? (
          <p className="text-lg text-gray-700 h-8">{product.info}</p>
        ) : (
          <Skel className="h-8" />
        )}

        {/* disponibilité */}
        {loading ? (        
            <Skel className="h-8" />      
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
