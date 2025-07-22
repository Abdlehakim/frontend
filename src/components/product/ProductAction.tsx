/* ------------------------------------------------------------------ */
/*  ProductAction — now with button-level loader on "Ajouter au panier" */
/* ------------------------------------------------------------------ */
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import type { Product } from "@/types/Product";
import { FaSpinner } from "react-icons/fa6"; // ✅ loader icon

/* ---------- tiny skeleton helper ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- attribute utils (unchanged) ---------- */
export type AttrValueColour = { name: string; hex: string; image?: string };
export type AttrValueOther = { name: string; value: string; image?: string };
export type AttrValue = AttrValueColour | AttrValueOther | string;

interface RawAttribute {
  attributeSelected:
    | { _id: string; name: string; type: string | string[] }
    | string;
  value: AttrValue | AttrValue[];
}

interface AttrGroup {
  id: string;
  label: string;
  type: string;
  values: { label: string; hex?: string; image?: string }[];
}

const normaliseAttributes = (p: Product): AttrGroup[] =>
  (p.attributes ?? []).map((attr) => {
    const { attributeSelected, value } = attr as RawAttribute;
    const groupLabel =
      typeof attributeSelected === "object"
        ? attributeSelected.name
        : "Attribute";
    const groupType =
      typeof attributeSelected === "object"
        ? Array.isArray(attributeSelected.type)
          ? attributeSelected.type[0]
          : attributeSelected.type
        : "other";

    const rawRows: (AttrValue | string)[] = Array.isArray(value)
      ? value
      : [value];
    const mapped = rawRows.map((v) => {
      if (typeof v === "string") return { label: v };
      if ("hex" in v) return { label: v.name, hex: v.hex, image: v.image };
      const label =
        "value" in v && v.value.trim() ? `${v.name} ${v.value}` : v.name;
      return { label, image: v.image };
    });

    const values = Array.from(
      new Map(
        mapped.map((row) => [
          groupType === "color"
            ? `${row.label}-${row.image ?? row.hex ?? ""}`
            : row.label,
          row,
        ])
      ).values()
    );

    return {
      id:
        typeof attributeSelected === "object"
          ? attributeSelected._id
          : groupLabel,
      label: groupLabel,
      type: groupType,
      values,
    };
  });

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
interface ProductActionProps {
  product: Product;
  addToCartHandler: (
    product: Product,
    quantity: number,
    selected: Record<string, string>
  ) => void;
  onImageSelect?: (img?: string) => void;
}

const ProductAction: React.FC<ProductActionProps> = ({
  product,
  addToCartHandler,
  onImageSelect,
}) => {
  /* ---------- loading flag ---------- */
  const loading = !product.attributes; // stub has no attributes

  /* ---------- quantity ---------- */
  const [quantity, setQuantity] = useState(1);
  const dec = () => quantity > 1 && setQuantity(quantity - 1);
  const inc = () =>
    quantity < (product.stock || 0) && setQuantity(quantity + 1);
  const manual = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(
      Math.max(
        1,
        Math.min(product.stock || 1, parseInt(e.target.value, 10) || 1)
      )
    );

  /* ---------- attributes ---------- */
  const groups = useMemo(() => normaliseAttributes(product), [product]);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    groups.forEach((g) => (obj[g.id] = g.values[0]?.label ?? ""));
    return obj;
  });
  const choose = (id: string, val: string, image?: string) => {
    setSelected((prev) => ({ ...prev, [id]: val }));
    if (image && onImageSelect) {
      onImageSelect(image);
    }
  };

  /* ---------- price & stock ---------- */
  const discountPct = product.discount ?? 0;
  const hasDiscount = discountPct > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - discountPct / 100)
    : product.price;

  const inStock =
    product.stockStatus === "in stock" && (product.stock || 0) > 0;

  /* ---------- NEW: loader for add-to-cart button ---------- */
  const [adding, setAdding] = useState(false);

  const onAddToCart = () => {
    if (adding) return;
    setAdding(true);
    addToCartHandler(product, quantity, selected);
    setTimeout(() => setAdding(false), 500); 
  };

  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ---------- ATTRIBUTE PICKERS ---------- */}
      {loading ? (
        <Skel className="h-28 w-full" />
      ) : (
        groups.map((g) => {
          const isColor = g.type === "color";
          return (
            <div key={g.id} className="flex flex-col gap-4 h-28">
              <p className="flex gap-4">
                <span className="font-bold">{g.label} :</span>
                {isColor && (
                  <span className="text-gray-700">{selected[g.id]}</span>
                )}
              </p>
              <div className="flex gap-3 h-20 items-center">
                {g.values.map((v, idx) => {
                  if (isColor) {
                    const active = selected[g.id] === v.label;
                    return (
                      <button
                        key={`${g.id}-${idx}`}
                        onClick={() => choose(g.id, v.label, v.image)}
                        className={`w-14 h-14 rounded-md border-2 overflow-hidden transition focus:outline-none ${
                          active
                            ? "border-primary scale-105"
                            : "border-gray-300"
                        }`}
                        aria-label={v.label}
                        title={v.label}
                      >
                        {v.image ? (
                          <Image
                            src={v.image}
                            alt={v.label}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: v.hex }}
                          />
                        )}
                      </button>
                    );
                  }
                  const active = selected[g.id] === v.label;
                  return (
                    <button
                      key={`${g.id}-${idx}`}
                      onClick={() => choose(g.id, v.label)}
                      className={`px-3 border rounded-md transition text-sm flex items-center gap-1 ${
                        active
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {v.image && (
                        <Image
                          src={v.image}
                          alt={v.label}
                          width={20}
                          height={20}
                          className="object-cover rounded-sm"
                        />
                      )}
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* ---------- PRICE ---------- */}
      <hr className="my-4" />
      {loading ? (
        <Skel className="h-8 w-32 mx-auto" />
      ) : (
        <div className="flex items-center justify-center gap-4 max-lg:flex-col">
          <p className="text-primary text-2xl font-bold">
            {finalPrice.toFixed(2)} TND
          </p>
          {hasDiscount && (
            <p className="text-gray-500 line-through">
              {product.price.toFixed(2)} TND
            </p>
          )}
        </div>
      )}

      <hr className="my-4" />

      {/* ---------- ACTIONS ---------- */}
      {loading ? (
        <Skel className="h-12 w-full" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          {inStock ? (
            <>
              {/* qty picker + add / buy */}
              <div className="flex justify-between w-full gap-4 max-md:flex-col">
                <div className="flex items-center max-lg:justify-center gap-2">
                  <button
                    onClick={dec}
                    disabled={quantity === 1}
                    className="p-2 border"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={manual}
                    min={1}
                    max={product.stock}
                    className="w-16 text-center border p-2"
                  />
                  <button
                    onClick={inc}
                    disabled={quantity >= (product.stock || 0)}
                    className="p-2 border"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-4 w-full">
                  {/* ---------- ADD TO CART with loader ---------- */}
                  <button
                    onClick={onAddToCart}
                    disabled={adding}
                    className={`flex-1 h-10 font-semibold rounded-md max-lg:text-sm relative ${
                      adding
                        ? "bg-gray-400 cursor-not-allowed text-white border-2"
                        : "bg-white border-primary border-2 text-black hover:bg-primary hover:text-white"
                    }`}
                  >
                    {/* spinner OR text (no translate animation on spinner) */}
                    {adding ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center">
                        Ajouter au panier
                      </span>
                    )}
                  </button>

                  <Link href="/checkout" className="flex-1">
                    <button
                      onClick={() =>
                        addToCartHandler(product, quantity, selected)
                      }
                      className="w-full bg-primary text-white h-10 font-semibold rounded-md max-lg:text-sm hover:bg-secondary"
                    >
                      Acheter
                    </button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <button
              disabled
              className="bg-gray-500 text-white h-10 w-full font-bold rounded-md"
            >
              Rupture de stock
            </button>
          )}
        </div>
      )}
      <hr className="my-4" />
    </>
  );
};

export default ProductAction;
