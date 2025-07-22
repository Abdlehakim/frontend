/* ------------------------------------------------------------------
   src/app/checkout/page.tsx
------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CartItem, removeItem, updateItemQuantity } from "@/store/cartSlice";
import CheckoutNav from "@/components/checkout/CheckoutNav";
import RecapProduct from "@/components/checkout/RecapProduct";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PaymentMethode, { PaymentMethodId } from "@/components/checkout/PaymentMethode";
import DeliveryAddressSelect from "@/components/checkout/DeliveryAddress";
import DeliveryMethod from "@/components/checkout/DeliveryMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

/* ▼ added */
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
/* ▲ added */

const Checkout: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();

  /* ▼ added */
  const {isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  /* ▲ added */

  /* ----- step navigation ----- */
  const [currentStep, setCurrentStep] = useState<"cart" | "checkout" | "order-summary">("cart");
  const [refOrder,  setRefOrder]  = useState("");

  /* ----- selections ----- */
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("selectedAddress") ?? "" : ""
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | "">("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [deliveryCost, setDeliveryCost] = useState(0);

  /* persist address in localStorage */
  useEffect(() => {
    if (selectedAddressId) localStorage.setItem("selectedAddress", selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(`/signin?redirectTo=${redirectTo}`);
    }
  }, [loading, isAuthenticated, router, searchParams]);
  /* ▲ */

  /* ----- totals (unchanged) ----- */
  const totalPrice = items.reduce((sum, item) => {
    const ttc = item.discount ? (item.price * (100 - item.discount)) / 100 : item.price;
    return sum + ttc * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const full = item.price * item.quantity;
    const disc = item.discount ? ((item.price * (100 - item.discount)) / 100) * item.quantity : full;
    return sum + (full - disc);
  }, 0);

  /* ----- cart handlers (unchanged) ----- */
  const incrementHandler = (it: CartItem) =>
    dispatch(updateItemQuantity({ _id: it._id, quantity: it.quantity + 1 }));
  const decrementHandler = (it: CartItem) =>
    it.quantity > 1 && dispatch(updateItemQuantity({ _id: it._id, quantity: it.quantity - 1 }));
  const removeCartHandler = (id: string) => dispatch(removeItem({ _id: id }));

  /* ----- changes for address & delivery ----- */
  const handleAddressChange = (id: string) => setSelectedAddressId(id);
  const handleMethodChange  = (id: string, cost: number) => { setSelectedMethod(id); setDeliveryCost(cost); };

  /* ----- payment change ----- */
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedPaymentMethod(e.target.value as PaymentMethodId);

  const handleOrderSummary = (ref: string) => { setRefOrder(ref); setCurrentStep("order-summary"); };

  /* ---------- render ---------- */
  return (
    <div className="my-8 flex flex-col gap-4">
      <CheckoutNav currentStep={currentStep} />

      {/* STEP 1: cart */}
      {currentStep === "cart" && (
        <div className="mx-auto w-[80%] flex max-lg:flex-col gap-4">
          <RecapProduct
            items={items}
            incrementHandler={incrementHandler}
            decrementHandler={decrementHandler}
            removeCartHandler={removeCartHandler}
          />
          <PaymentSummary
            currentStep="cart"
            items={items}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            deliveryCost={deliveryCost}
            selectedMethod={selectedMethod}
            selectedPaymentMethod={selectedPaymentMethod}
            /* new props */
            addressId={selectedAddressId}
            onCheckout={() => setCurrentStep("checkout")}
            backcarte={() => setCurrentStep("cart")}
            handleOrderSummary={handleOrderSummary}
          />
        </div>
      )}

      {/* STEP 2: checkout */}
      {currentStep === "checkout" && (
        <div className="mx-auto w-[80%] flex max-lg:flex-col gap-4">
          <div className="w-[70%] p-4 flex flex-col gap-8 bg-gray-100 rounded-md max-lg:w-full max-lg:gap-4">
            <DeliveryAddressSelect
              selectedAddressId={selectedAddressId}
              onAddressChange={handleAddressChange}
            />
            <DeliveryMethod
              selectedMethod={selectedMethod}
              onMethodChange={handleMethodChange}
            />
            <PaymentMethode
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={handlePaymentChange}
            />
          </div>
          <PaymentSummary
            currentStep="checkout"
            items={items}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            deliveryCost={deliveryCost}
            selectedMethod={selectedMethod}
            selectedPaymentMethod={selectedPaymentMethod}
            /* new prop */
            addressId={selectedAddressId}
            onCheckout={() => setCurrentStep("checkout")}
            backcarte={() => setCurrentStep("cart")}
            handleOrderSummary={handleOrderSummary}
          />
        </div>
      )}

      {currentStep === "order-summary" && <OrderSummary data={refOrder} />}
    </div>
  );
};

export default Checkout;
