// src/components/RecapProduct.tsx
import Image from "next/image";
import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { CartItem } from "@/store/cartSlice"; // adjust path as needed

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
  <div className="w-[70%] h-fit">
    {items.length > 0 ? (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-around gap-4 bg-gray-100 p-4 rounded-md"
          >
            {/* Product Image */}
            <div className="w-1/5">
              <Image
                className="rounded-lg"
                src={item.mainImageUrl || "/images/default-product.png"}
                alt={item.name}
                width={150}
                height={150}
              />
            </div>

            {/* Name, Ref, Category & Price */}
            <div className="flex flex-col justify-center w-2/5 gap-2">
              <div className="flex gap-2">
                <p className="text-xl">{item.name}</p>
                <p className="text-gray-600">{item.reference}</p>
              </div>
              {item.categorie && (
                <p className="text-gray-500 uppercase">
                  {item.categorie.name}
                </p>
              )}
              <p className="font-semibold">
                {item.discount && item.discount > 0
                  ? `${((item.price * (100 - item.discount)) / 100).toFixed(
                      2
                    )} TND`
                  : `${item.price.toFixed(2)} TND`}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-center w-1/5">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => decrementHandler(item)}
                  className="py-1 px-3"
                >
                  <IoIosArrowDown />
                </button>
                <div className="py-2 px-4 border-l border-r border-gray-300">
                  {item.quantity}
                </div>
                <button
                  onClick={() => incrementHandler(item)}
                  className="py-1 px-3"
                >
                  <IoIosArrowUp />
                </button>
              </div>
            </div>

            {/* Line Total */}
            <div className="flex items-center justify-center w-1/5">
              <p className="font-semibold">
                {item.discount && item.discount > 0
                  ? `${(
                      ((item.price * (100 - item.discount)) / 100) *
                      item.quantity
                    ).toFixed(2)} TND`
                  : `${(item.price * item.quantity).toFixed(2)} TND`}
              </p>
            </div>

            {/* Remove */}
            <div className="flex justify-end w-1/10">
              <RxCross1
                className="cursor-pointer"
                onClick={() => removeCartHandler(item._id)}
                size={28}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center justify-center py-10 text-gray-500">
        Your cart is empty.
      </div>
    )}
  </div>
);

export default RecapProduct;
