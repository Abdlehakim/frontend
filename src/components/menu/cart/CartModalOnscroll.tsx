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

const CartModalOnscroll: React.FC<CartModalOnscrollProps> = ({ items, onClose }) => {
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const finalPrice =
        item.discount > 0
          ? item.price - (item.price * item.discount) / 100
          : item.price;
      return total + finalPrice * item.quantity;
    }, 0);
  }, [items]);

  const incrementHandler = useCallback(
    (item: CartItem, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 }));
    },
    [dispatch]
  );

  const decrementHandler = useCallback(
    (item: CartItem, event: React.MouseEvent) => {
      event.stopPropagation();
      if (item.quantity > 1) {
        dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 }));
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = useMemo(() => Math.ceil(items.length / itemsPerPage), [items.length]);

  const paginatedItems = useMemo(() => {
    return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col px-4 w-[400px] max-md:w-[350px] border-[#15335D] border-4 rounded-lg bg-white z-30"
      onClick={(event) => event.stopPropagation()}
    >
      <h1 className="text-lg font-bold text-black border-b-2 text-center py-2 max-md:text-sm">
        Your shopping cart ({items.length} items)
      </h1>
      <div className="py-2 text-gray-500 border-b-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <div className="flex flex-col">
        {paginatedItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between py-2 max-md:mx-[10%] border-b-2"
          >
            <Image
              className="object-cover"
              src={item.mainImageUrl || "/path/to/default-image.jpg"}
              alt={item.name}
              width={60}
              height={60}
            />
            <div className="text-black flex-col flex gap-[8px]">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-gray-800 text-xs">Quantity: {item.quantity}</p>
              <p className="text-gray-800 text-xs max-md:hidden">
                Price Unit: TND{" "}
                {(
                  item.price -
                  (item.discount ? (item.price * item.discount) / 100 : 0)
                ).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px] max-md:hidden">
                <button
                  className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white hover:bg-[#15335E] hover:text-white"
                  onClick={(event) => decrementHandler(item, event)}
                >
                  -
                </button>
                <span className="text-black h-8 w-6 flex items-center justify-center bg-opacity-40 bg-white">
                  {item.quantity}
                </span>
                <button
                  className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white hover:bg-[#15335E] hover:text-white"
                  onClick={(event) => incrementHandler(item, event)}
                >
                  +
                </button>
              </div>
              <button
                className="flex gap-[8px] items-center justify-center hover:bg-[#15335E] border-2 max-md:border-none border-[#15335E] rounded text-black hover:text-white cursor-pointer"
                onClick={(event) => removeCartHandler(item._id, event)}
              >
                <span className="max-md:hidden">Remove</span>
                <FaRegTrashAlt size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <>
          <p className="text-black text-lg font-bold flex items-center justify-center flex-col gap-[16px] my-2 max-md:text-lg">
            Total: TND {totalPrice.toFixed(2)}
          </p>
          <Link href="/checkout" passHref>
            <button
              aria-label="check"
              className="w-full h-10 rounded-lg bg-orange-400 hover:bg-[#15335D] flex items-center justify-center mb-2"
            >
              <p className="text-xl text-white">Checkout</p>
            </button>
          </Link>
          <button
            className="w-full text-center text-black underline cursor-pointer mb-2"
            onClick={(event) => {
              event.stopPropagation();
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

export default CartModalOnscroll;
