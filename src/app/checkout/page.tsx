"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartItem, removeItem, updateItemQuantity } from "@/store/cartSlice";
import { RootState } from "@/store";
import OrderSummary from "@/components/checkout/OrderSummary";
import CheckoutNav from "@/components/checkout/CheckoutNav";
import RecapProduct from "@/components/checkout/RecapProduct";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PaymentMethode from "@/components/checkout/PaymentMethode";
import Addresse from "@/components/checkout/DeliveryAddress";
import DeliveryMethod from "@/components/checkout/DeliveryMethod";

const Checkout: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState<
    "cart" | "checkout" | "order-summary"
  >("cart");
  const [refOrder, setRefOrder] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    "Payment on delivery"
  );
  const [selectedMethod, setSelectedMethod] = useState<string>("fedex");
  const [deliveryCost, setDeliveryCost] = useState<number>(0);

  // Totals
  const totalPrice = items.reduce((sum, item) => {
    const priceAfterDiscount = item.discount
      ? item.price * (100 - item.discount) / 100
      : item.price;
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const full = item.price * item.quantity;
    const discounted = item.discount
      ? (item.price * (100 - item.discount) / 100) * item.quantity
      : full;
    return sum + (full - discounted);
  }, 0);

  // Handlers
  const incrementHandler = (item: CartItem) => {
    dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 }));
  };
  const decrementHandler = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 }));
    }
  };
  const removeCartHandler = (id: string) => {
    dispatch(removeItem({ _id: id }));
  };
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(e.target.value);
  };
  const handleMethodChange = (method: string, cost: number) => {
    setSelectedMethod(method);
    setDeliveryCost(cost);
  };
  const handleCart = () => setCurrentStep("cart");
  const handleOrderSummary = (ref: string) => {
    setRefOrder(ref);
    setCurrentStep("order-summary");
  };

  return (
    <div>
      <CheckoutNav currentStep={currentStep} />

      {currentStep === "cart" && (
        <div className="mx-auto w-[80%] flex gap-4">
          <RecapProduct
            items={items}
            incrementHandler={incrementHandler}
            decrementHandler={decrementHandler}
            removeCartHandler={removeCartHandler}
          />
          <PaymentSummary
            currentStep={currentStep}
            items={items}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            onCheckout={() => setCurrentStep("checkout")}
            selectedPaymentMethod={selectedPaymentMethod}
            backcarte={handleCart}
            handleOrderSummary={handleOrderSummary}
            selectedMethod={selectedMethod}
            deliveryCost={deliveryCost}
          />
        </div>
      )}

      {currentStep === "checkout" && (
        <div className="mx-auto w-[80%] flex gap-4">
          <div className="w-[70%] p-4 bg-gray-100 rounded-md">
            <Addresse />
            <DeliveryMethod
              selectedMethod={selectedMethod}
              onMethodChange={handleMethodChange}
            />
            <PaymentMethode
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
          </div>
          <PaymentSummary
            currentStep={currentStep}
            items={items}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            onCheckout={() => setCurrentStep("checkout")}
            selectedPaymentMethod={selectedPaymentMethod}
            backcarte={handleCart}
            handleOrderSummary={handleOrderSummary}
            selectedMethod={selectedMethod}
            deliveryCost={deliveryCost}
          />
        </div>
      )}

      {currentStep === "order-summary" && <OrderSummary data={refOrder} />}
    </div>
  );
};

export default Checkout;
