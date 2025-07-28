"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CartItem, removeItem, updateItemQuantity } from "@/store/cartSlice";
import CheckoutNav from "@/components/checkout/CheckoutNav";
import RecapProduct from "@/components/checkout/RecapProduct";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PaymentMethode from "@/components/checkout/PaymentMethode";
import DeliveryAddressSelect from "@/components/checkout/DeliveryAddress";
import DeliveryMethod from "@/components/checkout/DeliveryMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

const Checkout: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ----- step navigation ----- */
  const [currentStep, setCurrentStep] = useState<
    "cart" | "checkout" | "order-summary"
  >("cart");
  const [refOrder, setRefOrder] = useState("");

  /* ----- selections ----- */
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedDeliverToAddress, setSelectedDeliverToAddress] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [deliveryCost, setDeliveryCost] = useState(0);

  /* ‣ NEW: ref to scroll to */
  const addressSectionRef = useRef<HTMLDivElement>(null);

  /* ----- redirect if not logged in ----- */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(`/signin?redirectTo=${redirectTo}`);
    }
  }, [loading, isAuthenticated, router, searchParams]);

  /* ‣ NEW: scroll into view when entering checkout step */
  useEffect(() => {
    if (currentStep === "checkout" && addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({
        behavior: "auto",
      });
    }
  }, [currentStep]);

  /* ----- totals ----- */
  const totalPrice = items.reduce((sum, item) => {
    const ttc = item.discount
      ? (item.price * (100 - item.discount)) / 100
      : item.price;
    return sum + ttc * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const full = item.price * item.quantity;
    const disc = item.discount
      ? ((item.price * (100 - item.discount)) / 100) * item.quantity
      : full;
    return sum + (full - disc);
  }, 0);

  /* ----- cart handlers ----- */
  const incrementHandler = (it: CartItem) =>
    dispatch(updateItemQuantity({ _id: it._id, quantity: it.quantity + 1 }));
  const decrementHandler = (it: CartItem) =>
    it.quantity > 1 &&
    dispatch(updateItemQuantity({ _id: it._id, quantity: it.quantity - 1 }));
  const removeCartHandler = (id: string) => dispatch(removeItem({ _id: id }));

  /* ----- address & delivery handlers ----- */
  const handleAddressChange = (id: string, deliverToAddress: string) => {
    setSelectedAddressId(id);
    setSelectedDeliverToAddress(deliverToAddress);
  };
  const handleMethodChange = (id: string, cost: number) => {
    setSelectedMethod(id);
    setDeliveryCost(cost);
  };

  /* ----- payment change ----- */
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedPaymentMethod(e.target.value);

  const handleOrderSummary = (ref: string) => {
    setRefOrder(ref);
    setCurrentStep("order-summary");
  };

  return (
    <div className="my-8 flex flex-col gap-4">
      <CheckoutNav currentStep={currentStep} />

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
            address={{ AddressId: selectedAddressId, DeliverToAddress: selectedDeliverToAddress }}
            onCheckout={() => setCurrentStep("checkout")}
            backcarte={() => setCurrentStep("cart")}
            handleOrderSummary={handleOrderSummary}
          />
        </div>
      )}

      {currentStep === "checkout" && (
        <div className="mx-auto w-[80%] flex max-lg:flex-col gap-4">
          <div
            ref={addressSectionRef}
            className="w-[70%] p-4 flex flex-col gap-8 bg-gray-100 rounded-md max-lg:w-full max-lg:gap-4"
          >
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
            address={{ AddressId: selectedAddressId, DeliverToAddress: selectedDeliverToAddress }}
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
