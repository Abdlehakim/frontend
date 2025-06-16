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

const Checkout = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<
    "cart" | "checkout" | "order-summary"
  >("cart");
  const [refOrder, setRefOrder] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Payment on delivery"
  );
  const [selectedMethod, setSelectedMethod] = useState<string>("fedex");
  const [deliveryCost, setDeliveryCost] = useState<number>(0);

  // Calculate totals
  const totalPrice = items.reduce((total, item) => {
    const finalPrice = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return total + finalPrice * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((total, item) => {
    const originalPrice = item.price * item.quantity;
    const discountedPrice = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    const discountAmount = originalPrice - discountedPrice * item.quantity;
    return total + discountAmount;
  }, 0);

  // Increment item quantity (stock check removed)
  const incrementHandler = (item: CartItem) => {
    dispatch(
      updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 })
    );
  };

  // Decrement item quantity
  const decrementHandler = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(
        updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 })
      );
    }
  };

  // Remove item from cart
  const removeCartHandler = (_id: string) => {
    dispatch(removeItem({ _id }));
  };

  // Handle change of payment method
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // Handle delivery method change
  const handleMethodChange = (method: string, cost: number) => {
    setSelectedMethod(method);
    setDeliveryCost(cost);
  };

  // Go back to cart step
  const handleCart = () => {
    setCurrentStep("cart");
  };

  // Function to handle order summary
  const handleOrderSummary = async (ref: string) => {
    setRefOrder(ref);
    setCurrentStep("order-summary");
  };

  return (
    <div>
      <CheckoutNav currentStep={currentStep} />
      {currentStep === "cart" && (

          <div className="mx-auto w-[80%] flex gap-[16px]">      
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
        <div className="mx-auto w-[80%] flex gap-[16px]">

            <div className="w-[70%] h-fit p-4 bg-gray-100">
              <Addresse />
              <DeliveryMethod
                selectedMethod={selectedMethod}
                onMethodChange={handleMethodChange}
              />
              <PaymentMethode
                handlePaymentMethodChange={handlePaymentMethodChange}
                selectedPaymentMethod={selectedPaymentMethod}
              />
            </div>
            <PaymentSummary
              handleOrderSummary={handleOrderSummary}
              items={items}
              totalPrice={totalPrice}
              totalDiscount={totalDiscount}
              currentStep={currentStep}
              onCheckout={() => setCurrentStep("checkout")}
              selectedPaymentMethod={selectedPaymentMethod}
              backcarte={handleCart}
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
