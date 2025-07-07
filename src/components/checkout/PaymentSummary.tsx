// src/components/checkout/PaymentSummary.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearCart, CartItem } from '@/store/cartSlice';
import PaypalButton from '@/components/checkout/PaypalButton';

interface PaymentSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  selectedMethod: string;
  deliveryCost: number;
  items: CartItem[];
  onCheckout: () => void;
  selectedPaymentMethod: string;
  backcarte: () => void;
  currentStep: 'cart' | 'checkout' | 'order-summary';
  handleOrderSummary(ref: string): void;
}

interface PaymentDetails {
  id: string;
  payer: {
    payer_id: string;
    email_address: string;
    name: { given_name: string; surname: string };
  };
  status: string;
  update_time: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  handleOrderSummary,
  totalPrice,
  totalDiscount,
  currentStep,
  items,
  onCheckout,
  selectedPaymentMethod,
  backcarte,
  selectedMethod,
  deliveryCost,
}) => {
  const dispatch = useDispatch();
  const [totalWithShipping, setTotalWithShipping] = useState(
    totalPrice + deliveryCost
  );

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);
  }, [totalPrice, deliveryCost]);

  const isFormValid = () => {
    const selectedAddress =
      (document.querySelector(
        'select[name="address-method"]'
      ) as HTMLSelectElement | null)?.value || '';
    const selectedPayment =
      (document.querySelector(
        'input[name="payment-method"]:checked'
      ) as HTMLInputElement | null)?.value || '';
    return (
      selectedAddress &&
      selectedAddress !== 'Select Address' &&
      selectedPayment
    );
  };

  const sendMail = async (ref: string) => {
    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref }),
      });
      if (!res.ok) throw new Error('Failed to send email');
    } catch (err: unknown) {
      console.error('Email error:', err);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address =
      (document.querySelector(
        'select[name="address-method"]'
      ) as HTMLSelectElement | null)?.value;
    const payment =
      (document.querySelector(
        'input[name="payment-method"]:checked'
      ) as HTMLInputElement | null)?.value;

    if (!address || address === 'Select Address' || !payment) {
      toast.error('Please select an address and payment method');
      return;
    }

    const orderData = {
      address,
      paymentMethod: payment,
      selectedMethod,
      deliveryCost,
      totalDiscount,
      totalWithShipping,
      items,
    };

    try {
      const res = await fetch(
        `${backendUrl}/api/client/order/postOrderClient`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        }
      );

      if (res.ok) {
        const { ref } = await res.json();
        sendMail(ref);
        handleOrderSummary(ref);
        toast.success('Order submitted successfully!');
        dispatch(clearCart());
      } else if (res.status === 400) {
        toast.error('Please check your information.');
      } else if (res.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Unexpected error: ${res.status}`);
      }
    } catch (err: unknown) {
      console.error('Order error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    }
  };

  // PayPal success callback
  const handleSuccess = (details: Record<string, unknown>) => {
    const payment = (details as unknown) as PaymentDetails;
    if (payment.id && payment.payer) {
      handleOrderSubmit(new Event('submit') as unknown as React.FormEvent);
    } else {
      toast.error('Payment details are missing.');
    }
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 w-[30%]">
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
          <span className="font-bold">0 TND</span>
        </li>
        <li className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{totalWithShipping.toFixed(2)} TND</span>
        </li>
      </ul>

      {/* STEP 1: Cart */}
      {currentStep === 'cart' && (
        <div className="mt-8 space-y-2">
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white ${
              items.length
                ? 'bg-primary hover:bg-[#15335E]'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
          <Link href="/">
            <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm">
              Annuler
            </button>
          </Link>
        </div>
      )}

      {/* STEP 2: Checkout */}
      {currentStep === 'checkout' && (
        <div className="mt-8 space-y-2">
          {selectedPaymentMethod !== 'paypal' ? (
            <button
              onClick={handleOrderSubmit}
              disabled={!isFormValid()}
              className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white ${
                isFormValid()
                  ? 'bg-primary hover:bg-[#15335E]'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Confirm Order
            </button>
          ) : (
            <PaypalButton
              amount={totalWithShipping.toFixed(2)}
              onSuccess={handleSuccess}
            />
          )}

          <button
            onClick={backcarte}
            className="mt-2 w-full rounded-md border border-blue-500 px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-[#15335E]"
          >
            retournez
          </button>

          <Link href="/">
            <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm">
              Annuler
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
