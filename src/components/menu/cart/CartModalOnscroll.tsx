// src/components/checkout/CartModalOnscroll.tsx
"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeItem, updateItemQuantity, CartItem } from "@/store/cartSlice";
import Pagination from "@/components/PaginationClient";

interface CartModalOnscrollProps {
  items: CartItem[];
  onClose: () => void;
}

/* ---------- helper to merge by _id ---------- */
const useMergedItems = (items: CartItem[]) =>
  useMemo(() => {
    const map = new Map<string, CartItem>();
    for (const it of items) {
      const key = String(it._id);
      const found = map.get(key);
      if (found) {
        found.quantity += it.quantity;
      } else {
        map.set(key, { ...it });
      }
    }
    return Array.from(map.values());
  }, [items]);

const CartModalOnscroll: React.FC<CartModalOnscrollProps> = ({
  items,
  onClose,
}) => {
  const dispatch = useDispatch();

  /* merge duplicates so UI shows one line */
  const mergedItems = useMergedItems(items);

  const totalPrice = useMemo(() => {
    return mergedItems.reduce((total, item) => {
      const discount = item.discount ?? 0;
      const finalPrice =
        discount > 0 ? item.price - (item.price * discount) / 100 : item.price;
      return total + finalPrice * item.quantity;
    }, 0);
  }, [mergedItems]);

  const incrementHandler = useCallback(
    (item: CartItem, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(
        updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 })
      );
    },
    [dispatch]
  );

  const decrementHandler = useCallback(
    (item: CartItem, e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.quantity > 1) {
        dispatch(
          updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 })
        );
      }
    },
    [dispatch]
  );

  const removeCartHandler = useCallback(
    (_id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(removeItem({ _id }));
    },
    [dispatch]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = useMemo(
    () => Math.ceil(mergedItems.length / itemsPerPage),
    [mergedItems.length]
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return mergedItems.slice(start, start + itemsPerPage);
  }, [mergedItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (mergedItems.length === 0) return null;

  return (
    <div
      className="flex flex-col px-4 w-[400px] max-md:w-[350px] border-[#15335D] border-4 rounded-lg bg-white z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="text-lg font-bold text-black border-b-2 text-center py-2 max-md:text-sm">
        Your shopping cart ({mergedItems.length} items)
      </h1>

      <div className="text-gray-500 border-b-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="flex flex-col">
        {paginatedItems.map((item) => {
          const discount = item.discount ?? 0;
          const unitPrice =
            discount > 0
              ? item.price - (item.price * discount) / 100
              : item.price;

          return (
            <div
              key={item._id}
              className="flex items-center justify-between py-2 max-md:mx-[10%] border-b-2"
            > 
                <div className="relative h-16 aspect-[16/16]  bg-gray-200">
                              <Image
                                className="object-cover"
                                src={item.mainImageUrl  ?? ""}
                                alt={item.name}
                                quality={75}
                                placeholder="empty"
                                priority
                                sizes="(max-width: 600px) 100vw, 600px"
                                fill
                              />  </div>
              

              <div className="text-black flex flex-col gap-[8px]">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-gray-800 text-xs">Quantity: {item.quantity}</p>
                <p className="text-gray-800 text-xs max-md:hidden">
                  Price Unit: TND {unitPrice.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[8px] max-md:hidden">
                  <button
                    className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white hover:bg-[#15335E] hover:text-white"
                    onClick={(e) => decrementHandler(item, e)}
                  >
                    –
                  </button>
                  <span className="text-black h-8 w-6 flex items-center justify-center bg-opacity-40 bg-white">
                    {item.quantity}
                  </span>
                  <button
                    className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white hover:bg-[#15335E] hover:text-white"
                    onClick={(e) => incrementHandler(item, e)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex gap-[8px] items-center justify-center hover:bg-[#15335E] border-2 max-md:border-none border-[#15335E] rounded text-black hover:text-white cursor-pointer"
                  onClick={(e) => removeCartHandler(item._id, e)}
                >
                  <span className="max-md:hidden">Remove</span>
                  <FaRegTrashAlt size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-black text-lg font-bold flex items-center justify-center flex-col gap-[16px] my-2 max-md:text-lg">
        Total: TND {totalPrice.toFixed(2)}
      </p>

      <Link href="/checkout">
        <button
          aria-label="check"
          className="w-fit mx-auto px-6 h-10 rounded-full border-2 border-secondary hover:bg-secondary flex items-center justify-center my-2 hover:text-white text-secondary"
        >
          <span className="text-xl font-semibold tracking-wide max-md:text-base">
            Poursuivre au paiement
          </span>
        </button>
      </Link>

      <button
        className="w-full text-center text-black hover:underline cursor-pointer mb-2 hover:text-primary max-md:text-base"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Continue shopping
      </button>
    </div>
  );
};

export default CartModalOnscroll;
