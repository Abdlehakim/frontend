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
  const pathname = usePathname();

  const cartModalWrapperRef = useRef<HTMLDivElement>(null);
  const onscrollCartModalWrapperRef = useRef<HTMLDivElement>(null);

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + (item.quantity || 0), 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((total, item) => {
        const finalPrice =
          item.discount != null && item.discount > 0
            ? item.price - (item.price * item.discount) / 100
            : item.price;
        return total + finalPrice * item.quantity;
      }, 0),
    [items]
  );

  const toggleCartModal = () => setIsCartOpen((prev) => !prev);
  const toggleCartModalOnscroll = () =>
    setIsCartModalOnscrollOpen((prev) => !prev);
  const closeCartModal = () => setIsCartOpen(false);
  const closeCartModalOnscroll = () => setIsCartModalOnscrollOpen(false);

  // 1️⃣ Close on outside clicks
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

    if (isCartOpen || isCartModalOnscroll) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isCartModalOnscroll]);

  // 2️⃣ Detect threshold scroll for floating button
  useEffect(() => {
    const container: HTMLElement | Window =
      document.querySelector("main") || window;

    const handleScroll = () => {
      const scrollPos =
        container instanceof Window ? window.pageYOffset : container.scrollTop;
      setIsScrolling(scrollPos > 120);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 3️⃣ Close both modals immediately on any user scroll
  useEffect(() => {
    const container: HTMLElement | Window =
      document.querySelector("main") || window;

    const onUserScroll = () => {
      if (isCartOpen) {
        closeCartModal();
      }
      if (isCartModalOnscroll) {
        closeCartModalOnscroll();
      }
    };

    container.addEventListener("scroll", onUserScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onUserScroll);
    };
  }, [isCartOpen, isCartModalOnscroll]);

  // 4️⃣ Close cart on route change
  useEffect(() => {
    closeCartModal();
    closeCartModalOnscroll();
  }, [pathname]);

  return (
    <>
      <div className="flex items-center justify-center w-[200px] max-2xl:w-[150px] max-lg:w-fit text-white cursor-pointer select-none">
        <div
          className="flex items-center justify-center gap-[8px] w-fit max-lg:w-fit text-white cursor-pointer"
          onClick={toggleCartModal}
          ref={cartModalWrapperRef}
        >
          <div className="relative my-auto mx-2">
            <SlBag size={40} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs rounded-full bg-secondary text-white">
              {totalQuantity}
            </span>
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
            <p className="text-text text-sm max-2xl:text-xs max-md:hidden">
              Mon Panier
            </p>
            <Total totalPrice={totalPrice} />
          </div>
        </div>
      </div>

      {/* Floating cart on scroll */}
      {isScrolling && (
        <div
          className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-[16px] border-4 border-white shadow-lg cursor-pointer"
          ref={onscrollCartModalWrapperRef}
          onClick={toggleCartModalOnscroll}
        >
          <div className="relative">
            <SlBag size={25} className="text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs rounded-full bg-secondary text-white">
              {totalQuantity}
            </span>
            <div
              className="absolute max-md:fixed shadow-lg z-30 flex gap-[8px] top-12 right-0 flex-col max-md:top-[90px] max-md:right-[50%] max-md:transform max-md:translate-x-1/2 transition-all duration-900 ease-in-out"
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
