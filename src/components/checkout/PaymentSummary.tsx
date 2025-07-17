/* ------------------------------------------------------------------
   src/components/checkout/PaymentSummary.tsx
   (uses fetchData helper for the POST, no more BACKEND_URL constant)
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart, CartItem } from "@/store/cartSlice";
import PaypalButton from "@/components/checkout/PaypalButton";
import { PaymentMethodId } from "@/components/checkout/PaymentMethode";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";

/* ---------- props ---------- */
interface PaymentSummaryProps {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  deliveryCost: number;
  selectedMethod: string;
  selectedPaymentMethod: PaymentMethodId | "";
  addressId: string;
  currentStep: "cart" | "checkout" | "order-summary";
  onCheckout(): void;
  backcarte(): void;
  handleOrderSummary(ref: string): void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  items,
  totalPrice,
  totalDiscount,
  deliveryCost,
  selectedMethod,
  selectedPaymentMethod,
  addressId,
  currentStep,
  onCheckout,
  backcarte,
  handleOrderSummary,
}) => {
  const dispatch = useDispatch();

  /* ---------- loading overlay ---------- */
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  /* ---------- totals ---------- */
  const [totalWithShipping, setTotalWithShipping] = useState(
    totalPrice + deliveryCost
  );
  const [totalTva, setTotalTva] = useState(0);

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);

    const tvaSum = items.reduce((sum, item) => {
      const ttcUnit =
        item.discount && item.discount > 0
          ? (item.price * (100 - item.discount)) / 100
          : item.price;
      const unitTva = ttcUnit - ttcUnit / (1 + item.tva / 100);
      return sum + unitTva * item.quantity;
    }, 0);

    setTotalTva(tvaSum);
  }, [items, totalPrice, deliveryCost]);

  /* ---------- validity ---------- */
  const isFormValid = Boolean(
    addressId && selectedMethod && selectedPaymentMethod
  );

  /* ---------- helpers ---------- */
  const sendMail = async (ref: string) => {
    try {
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const postOrder = async () => {
    const orderLines = items.map(
      ({
        _id,
        reference,
        name,
        quantity,
        tva,
        mainImageUrl,
        discount,
        price,
      }) => ({
        _id,
        reference,
        name,
        quantity,
        tva,
        mainImageUrl,
        discount,
        price,
      })
    );

    const payload = {
      address: addressId,
      paymentMethod: selectedPaymentMethod,
      selectedMethod,
      deliveryCost,
      totalDiscount,
      totalWithShipping,
      items: orderLines,
    };

    const { ref } = await fetchData<{ ref: string }>(
      "/client/order/postOrderClient",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    await sendMail(ref);
    toast.success("Order submitted successfully!");
    dispatch(clearCart());
    handleOrderSummary(ref);
  };

  const handleOrderSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) {
      toast.error("Select address, delivery and payment method.");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      await postOrder();
    } catch (err) {
      toast.error("Failed to submit order. Please try again.");
      console.error(err);
      setIsSubmittingOrder(false);
    }
  };

  const handlePayPalSuccess = () => handleOrderSubmit();

  /* ---------- JSX ---------- */
  return (
    <>
      {isSubmittingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingDots />
        </div>
      )}

      <div className="bg-gray-100 rounded-md p-4 w-[30%] max-lg:w-full">
        {/* Promo code */}
        <div className="flex border border-[#15335E] overflow-hidden rounded-md">
          <input
            type="text"
            placeholder="Promo code"
            className="w-full bg-white px-4 py-2.5 text-sm"
          />
          <button className="bg-primary px-4 text-sm font-semibold text-white">
            Apply
          </button>
        </div>

        {/* Totals */}
        <ul className="mt-8 space-y-4 text-gray-800">
          <li className="flex justify-between text-base">
            <span>Discount</span>
            <span className="font-bold">{totalDiscount.toFixed(2)} TND</span>
          </li>
          <li className="flex justify-between text-base">
            <span>Shipping</span>
            <span className="font-bold">{deliveryCost.toFixed(2)} TND</span>
          </li>
          <li className="flex justify-between text-base">
            <span>TVA</span>
            <span className="font-bold">{totalTva.toFixed(2)} TND</span>
          </li>
          <li className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{totalWithShipping.toFixed(2)} TND</span>
          </li>
        </ul>

        {/* Step 1: cart */}
        {currentStep === "cart" && (
          <div className="mt-8 space-y-2">
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className={`mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-black hover:text-white ${
                items.length ? " hover:bg-primary" : "cursor-not-allowed"
              }`}
            >
              Continue
            </button>
            <Link href="/">
              <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white">
                Annuler
              </button>
            </Link>
          </div>
        )}

        {/* Step 2: checkout */}
        {currentStep === "checkout" && (
          <div className="mt-8 space-y-2">
            {selectedPaymentMethod !== "paypal" ? (
              <button
                onClick={handleOrderSubmit}
                disabled={!isFormValid}
                className={`mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-black  ${
                  isFormValid
                    ? " hover:bg-primary hover:text-white"
                    : "cursor-not-allowed"
                }`}
              >
                Confirm Order
              </button>
            ) : (
              <PaypalButton
                amount={totalWithShipping.toFixed(2)}
                onSuccess={handlePayPalSuccess}
              />
            )}

            <button
              onClick={backcarte}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white"
            >
              Retournez
            </button>

            <Link href="/">
              <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white">
                Annuler
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentSummary;
