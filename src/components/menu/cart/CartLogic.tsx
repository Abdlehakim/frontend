"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SlBag } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Total from "@/components/menu/Total";
import CartModal from "@/components/menu/cart/CartModal";
import CartModalOnscroll from "@/components/menu/cart/CartModalOnscroll";

import { usePathname } from "next/navigation";

const CartLogic = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartModalOnscroll, setIsCartModalOnscrollOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const items = useSelector((state: RootState) => state.cart.items);

  const cartModalWrapperRef = useRef<HTMLDivElement>(null);
  const onscrollCartModalWrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Calculate total quantity of items in the cart (Memoized)
  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [items]);

  // Calculate total price (Memoized)
  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const finalPrice =
        item.discount != null && item.discount > 0
          ? item.price - (item.price * item.discount) / 100
          : item.price;
      return total + finalPrice * item.quantity;
    }, 0);
  }, [items]);

  const toggleCartModal = () => setIsCartOpen((prev) => !prev);

  const toggleCartModalOnscroll = () =>
    setIsCartModalOnscrollOpen((prev) => !prev);

  const closeCartModal = () => setIsCartOpen(false);
  const closeCartModalOnscroll = () => setIsCartModalOnscrollOpen(false);

  // Handle clicks outside of the cart modal

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCartOpen &&
        cartModalWrapperRef.current &&
        !cartModalWrapperRef.current.contains(event.target as Node)
      ) {
        closeCartModal();
      }
      if (
        isCartModalOnscroll &&
        onscrollCartModalWrapperRef.current &&
        !onscrollCartModalWrapperRef.current.contains(event.target as Node)
      ) {
        closeCartModalOnscroll();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    if (isCartModalOnscroll) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isCartModalOnscroll]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 120);
      if (isCartOpen) {
        closeCartModal();
      }
      if (isCartModalOnscroll) {
        closeCartModalOnscroll();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCartOpen, isCartModalOnscroll]);

  // Close cart on route change
  useEffect(() => {
    closeCartModal();
    closeCartModalOnscroll();
  }, [pathname]);

  return (
    <>
      <div className="flex items-center justify-center w-[200px] max-lg:w-fit text-white cursor-pointer select-none">
        <div
          className="flex items-center justify-center gap-[8px] w-fit max-lg:w-fit text-white cursor-pointer"
          onClick={toggleCartModal}
          ref={cartModalWrapperRef}
        >
          <div className="relative my-auto mx-2">
            <div>
              <SlBag size={40} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
                {totalQuantity}
              </span>
            </div>
            <div
              className="absolute max-md:fixed shadow-xl z-30 flex gap-[8px] flex-col top-12 left-1/2 -translate-x-1/3 max-md:-translate-x-1/2 max-md:top-16 max-md:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isCartOpen && items.length > 0 && (
                <CartModal items={items} onClose={closeCartModal} />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-text text-sm max-md:hidden">Mon Panier</p>
            <Total totalPrice={totalPrice} />
          </div>
        </div>
      </div>

      {/* Show the floating cart button when scrolling */}
      {isScrolling && (
        <div
          className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-[16px] border-4 border-white shadow-lg cursor-pointer"
          ref={onscrollCartModalWrapperRef}
          onClick={toggleCartModalOnscroll}
        >
          <div className="relative">
            <SlBag size={25} className="text-white" />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
              <p>{totalQuantity}</p>
            </span>

            {/* Scrolling Cart Modal */}
            <div
              className="absolute max-md:fixed shadow-xl z-30 flex gap-[8px] top-12 right-0 flex-col max-md:top-[80px] max-md:right-[50%] max-md:transform max-md:translate-x-1/2 transition-all duration-900 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              {isCartModalOnscroll && items.length > 0 && (
                <CartModalOnscroll
                  items={items}
                  onClose={closeCartModalOnscroll}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartLogic;
