// src/components/checkout/CartModal.tsx
"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeItem, updateItemQuantity, CartItem } from "@/store/cartSlice";
import Pagination from "@/components/PaginationClient";

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ items, onClose }) => {
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const discount = item.discount ?? 0;
      const finalPrice =
        discount > 0
          ? item.price - (item.price * discount) / 100
          : item.price;
      return total + finalPrice * item.quantity;
    }, 0);
  }, [items]);

  const incrementHandler = useCallback(
    (item: CartItem, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(
        updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 })
      );
    },
    [dispatch]
  );

  const decrementHandler = useCallback(
    (item: CartItem, event: React.MouseEvent) => {
      event.stopPropagation();
      if (item.quantity > 1) {
        dispatch(
          updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 })
        );
      }
    },
    [dispatch]
  );

  const removeCartHandler = useCallback(
    (_id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(removeItem({ _id }));
    },
    [dispatch]
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length]
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div
      className="flex flex-col px-4 w-[400px] max-md:mx-auto max-md:w-[90%] border-[#15335D] border-4 rounded-lg bg-white z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="text-lg font-bold text-black border-b-2 text-center py-2 max-md:text-sm">
        Votre panier ({items.length} articles)
      </h1>

      <div className="text-gray-500 border-b-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="flex flex-col">
        {items.length === 0 ? (
          <p className="text-center text-black">Your cart is empty.</p>
        ) : (
          paginatedItems.map((item) => {
            const discount = item.discount ?? 0;
            const unitPrice =
              discount > 0
                ? item.price - (item.price * discount) / 100
                : item.price;

            return (
              <div
                key={item._id}
                className="flex items-center gap-2 justify-between py-2 border-b-2"
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

                <div className="text-black flex flex-col gap-2">
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-gray-800 text-xs">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-800 text-xs">
                  <span className='max-md:hidden'>Price Unit:</span> TND {unitPrice.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-black w-8 h-8 flex items-center justify-center bg-white border-2 border-[#15335E] rounded-lg hover:bg-[#15335E] hover:text-white"
                      onClick={(e) => decrementHandler(item, e)}
                    >
                      –
                    </button>
                    <span className="text-black h-8 w-6 flex items-center justify-center bg-white">
                      {item.quantity}
                    </span>
                    <button
                      className="text-black w-8 h-8 flex items-center justify-center bg-white border-2 border-[#15335E] rounded-lg hover:bg-[#15335E] hover:text-white"
                      onClick={(e) => incrementHandler(item, e)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-2 justify-center border-2 border-[#15335E] rounded text-black hover:bg-[#15335E] hover:text-white"
                    onClick={(e) => removeCartHandler(item._id, e)}
                  >
                    <FaRegTrashAlt size={15} /> Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {items.length > 0 && (
        <>
          <p className="text-black text-lg font-bold text-center my-2">
            Total: TND {totalPrice.toFixed(2)}
          </p>

          <Link href="/checkout">
            <button
              aria-label="checkout"
              className="w-fit mx-auto px-6 h-10 rounded-full border-2 border-secondary hover:bg-secondary flex items-center justify-center my-2 hover:text-white text-secondary"
            >
              <span className="text-xl font-semibold tracking-wide"> Poursuivre au paiement</span>
            </button>
          </Link>

          <button
            className="w-full text-center text-black hover:underline cursor-pointer mb-2 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Continue shopping
          </button>
        </>
      )}
    </div>
  );
};

export default CartModal;
