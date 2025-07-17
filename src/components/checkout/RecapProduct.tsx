/* ------------------------------------------------------------------
   src/components/RecapProduct.tsx
   (price already INCLUDES TVA)
------------------------------------------------------------------ */
"use client";

import Image from "next/image";
import React from "react";
import { RxCross1 } from "react-icons/rx";   /* keep ❌ icon */
import { CartItem } from "@/store/cartSlice";

interface RecapProductProps {
  items: CartItem[];
  incrementHandler(item: CartItem): void;
  decrementHandler(item: CartItem): void;
  removeCartHandler(id: string): void;
}

const RecapProduct: React.FC<RecapProductProps> = ({
  items,
  incrementHandler,
  decrementHandler,
  removeCartHandler,
}) => (
  <div className="w-[70%] max-lg:w-full h-fit">
    {items.length > 0 ? (
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          /* -------------------------------- helpers ------------------------------- */
          const priceTtc =
            item.discount && item.discount > 0
              ? (item.price * (100 - item.discount)) / 100
              : item.price;

          const factor   = 1 + item.tva / 100;
          const unitHt   = priceTtc / factor;
          const unitTva  = priceTtc - unitHt;
          const lineHt   = unitHt  * item.quantity;
          const lineTva  = unitTva * item.quantity;
          const lineTtc  = lineHt  + lineTva;

          return (
            <div
              key={item._id}
              className="relative flex justify-around gap-4 bg-gray-100 p-4 rounded-md max-lg:flex-col"
            >
              {/* ---------------- product image ---------------- */}
              <div className="relative aspect-[16/14] h-40 bg-gray-200">
                <Image
                  src={item.mainImageUrl ?? ""}
                  alt={item.name}
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className="object-cover"
                  placeholder="empty"
                  priority
                  quality={75}
                />
              </div>

              {/* ---------------- info ---------------- */}
              <div className="flex flex-col justify-center w-2/5 max-lg:w-full gap-2">
                <div className="flex flex-col">
                  <p className="text-xl font-bold break-words">{item.name}</p>
                  <p className="text-gray-600 uppercase text-xs">
                    REF&nbsp;: {item.reference}
                  </p>
                </div>

                {item.categorie && (
                  <p className="text-gray-500 uppercase">
                    {item.categorie.name}
                    {item.subcategorie && ` ▸ ${item.subcategorie.name}`}
                  </p>
                )}

                <p className="font-semibold">
                  {priceTtc.toFixed(2)} DT TTC
                  {item.discount && item.discount > 0 && (
                    <span className="line-through text-gray-500 ml-2">
                      {item.price.toFixed(2)} DT
                    </span>
                  )}
                </p>

                <p className="text-sm text-gray-600">
                  HT&nbsp;: {unitHt.toFixed(2)} DT • TVA&nbsp;({item.tva}%)
                  &nbsp;: {unitTva.toFixed(2)} DT
                </p>
              </div>

              {/* ---------------- quantity controls ---------------- */}
              <div className="flex items-center justify-center w-1/5 max-lg:w-full">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrementHandler(item)}
                    className="py-1 px-3 hover:bg-primary hover:text-white"
                  >
                    –
                  </button>
                  <div className="py-2 px-4 border-l border-r border-gray-300 min-w-[40px] text-center">
                    {item.quantity}
                  </div>
                  <button
                    onClick={() => incrementHandler(item)}
                    className="py-1 px-3 hover:bg-primary hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ---------------- totals ---------------- */}
              <div className="flex flex-col items-end justify-center w-1/5 max-lg:w-full max-lg:items-center">
                <p className="font-semibold">TTC&nbsp;{lineTtc.toFixed(2)} DT</p>
                <p className="text-xs text-gray-500">
                  TVA&nbsp;{lineTva.toFixed(2)} DT
                </p>
                <p className="text-xs font-medium">
                  {lineHt.toFixed(2)} DT HT
                </p>
              </div>

              {/* ---------------- remove ---------------- */}
               <div className="flex justify-end w-1/12 max-lg:w-full max-lg:order-first max-lg:mb-2 max-lg:items-end">
                <RxCross1
                  className="cursor-pointer"
                  onClick={() => removeCartHandler(item._id)}
                  size={24}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex items-center justify-center py-10 text-gray-500">
        Your cart is empty.
      </div>
    )}
  </div>
);

export default RecapProduct;
