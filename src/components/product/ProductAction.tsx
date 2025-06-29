// src/components/product/ProductAction.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { Product } from '@/types/Product';

/* ------------------------------------------------------------------ */
/* Types & helpers                                                    */
/* ------------------------------------------------------------------ */
export type AttrValueColour = { name: string; hex: string; image?: string };
export type AttrValueOther  = { name: string; value: string; image?: string };
export type AttrValue       = AttrValueColour | AttrValueOther | string;

/** Shape sent by backend for each attribute entry */
interface RawAttribute {
  attributeSelected:
    | {
        _id: string;
        name: string;
        type: string | string[];
      }
    | string;                 // in unlikely edge-cases
  value: AttrValue | AttrValue[];
}

interface AttrGroup {
  id: string;   // ProductAttribute _id
  label: string;
  type: string; // 'color' | 'dimension' | 'other type'
  values: { label: string; hex?: string; image?: string }[];
}

/** Normalise backend attributes → UI-friendly structure. */
const normaliseAttributes = (p: Product): AttrGroup[] =>
  (p.attributes ?? []).map((attr) => {
    const { attributeSelected, value } = attr as RawAttribute;

    /* ----- group meta ----- */
    const groupLabel =
      typeof attributeSelected === 'object' ? attributeSelected.name : 'Attribute';

    const groupType =
      typeof attributeSelected === 'object'
        ? Array.isArray(attributeSelected.type)
          ? attributeSelected.type[0]
          : attributeSelected.type
        : 'other type';

    /* ----- rows (colour / dimension / plain) ---------------------- */
    const rawRows: (AttrValue | string)[] = Array.isArray(value) ? value : [value];

    const mapped = rawRows.map((v) => {
      /* plain string row */
      if (typeof v === 'string') return { label: v };

      /* colour swatch */
      if ('hex' in v)
        return { label: v.name, hex: v.hex, image: v.image };

      /* dimension / other */
      const label =
        'value' in v && v.value.trim() ? `${v.name} ${v.value}` : v.name;
      return { label, image: v.image };
    });

    /* ----- dedupe (stable) ---------------------------------------- */
    const values = Array.from(
      new Map(
        mapped.map((row) => [
          groupType === 'color'
            ? `${row.label}-${row.image ?? (row.hex ?? '')}`
            : row.label,
          row,
        ])
      ).values()
    );

    return {
      id: typeof attributeSelected === 'object'
        ? attributeSelected._id
        : groupLabel,
      label: groupLabel,
      type: groupType,
      values,
    };
  });

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
interface ProductActionProps {
  product: Product;
  addToCartHandler: (
    product: Product,
    quantity: number,
    selected: Record<string, string>
  ) => void;
}

const ProductAction: React.FC<ProductActionProps> = ({
  product,
  addToCartHandler,
}) => {
  /* ---------- quantity ---------- */
  const [quantity, setQuantity] = useState(1);
  const dec = () => quantity > 1 && setQuantity(quantity - 1);
  const inc = () => quantity < (product.stock || 0) && setQuantity(quantity + 1);
  const manual = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(
      Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value, 10) || 1))
    );

  /* ---------- attributes ---------- */
  const groups = useMemo(() => normaliseAttributes(product), [product]);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    groups.forEach((g) => { obj[g.id] = g.values[0]?.label ?? ''; });
    return obj;
  });
  const choose = (groupId: string, value: string) =>
    setSelected((prev) => ({ ...prev, [groupId]: value }));

  /* ---------- price & stock ---------- */
  const finalPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;
  const inStock =
    product.stockStatus === 'in stock' && (product.stock || 0) > 0;

  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ---------- ATTRIBUTE PICKERS ---------- */}
      {groups.map((g) => {
        const isColor = g.type === 'color';

        return (
          <div key={g.id} className="mb-4 w-full">
            <p className="font-semibold">{g.label}</p>

            {isColor && (
              <p className="text-gray-700 mb-2">{selected[g.id]}</p>
            )}

            <div className="flex flex-wrap gap-3">
              {g.values.map((v, idx) => {
                /* ----- COLOUR SWATCH ----- */
                if (isColor) {
                  const active = selected[g.id] === v.label;
                  return (
                    <button
                      key={`${g.id}-${idx}`}
                      onClick={() => choose(g.id, v.label)}
                      className={`w-14 h-14 rounded-md border-2 overflow-hidden transition focus:outline-none
                        ${active ? 'border-primary scale-105' : 'border-gray-300'}`}
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

                /* ----- DIMENSION / OTHER CHIP ----- */
                const active = selected[g.id] === v.label;
                return (
                  <button
                    key={`${g.id}-${idx}`}
                    onClick={() => choose(g.id, v.label)}
                    className={`px-3 border rounded-md transition text-sm flex items-center gap-1
                      ${active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}
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
      })}

      {/* ---------- PRICE ---------- */}
      <div className="flex items-center justify-center gap-4">
        <p className="text-primary text-2xl font-bold">
          {finalPrice.toFixed(2)} TND
        </p>
        {product.discount && (
          <p className="text-gray-500 line-through">
            {product.price.toFixed(2)} TND
          </p>
        )}
      </div>

      <hr className="my-4" />

      {/* ---------- ACTIONS ---------- */}
      <div className="flex flex-col items-center gap-4">
        {inStock ? (
          <>
            {/* qty picker + add / buy */}
            <div className="flex justify-between w-full gap-4 max-md:flex-col">
              <div className="flex items-center gap-2">
                <button onClick={dec} disabled={quantity === 1} className="p-2 border">–</button>
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
                <button
                  onClick={() => addToCartHandler(product, quantity, selected)}
                  className="flex-1 bg-primary text-white h-10 font-bold rounded-md"
                >
                  Ajouter au panier
                </button>
                <Link href="/checkout" className="flex-1">
                  <button
                    onClick={() => addToCartHandler(product, quantity, selected)}
                    className="w-full bg-black text-white h-10 font-bold rounded-md"
                  >
                    Acheter
                  </button>
                </Link>
              </div>
            </div>

            {/* availability */}
            <div className="flex items-center gap-2 pt-4">
              <p className="font-bold">Disponibilité :</p>
              <span className="font-semibold uppercase">
                {product.boutique?.name || 'Disponible en magasin'}
              </span>
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
    </>
  );
};

export default ProductAction;
