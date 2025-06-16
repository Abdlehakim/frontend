"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';
import PaypalButton from '@/components/checkout/PaypalButton';

interface PaymentSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  selectedMethod: string;
  deliveryCost: number;
  items: CartItem[];
  onCheckout: (price: number, discount: number, items: CartItem[]) => void;
  selectedPaymentMethod: string;
  backcarte: () => void;
  currentStep: 'cart' | 'checkout' | 'order-summary';
  handleOrderSummary(ref: string): void;
}

interface CartItem {
  _id: string;
  name: string;
  ref: string;
  tva?: number;
  price: number;
  imageUrl?: string;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

interface PaymentDetails extends Record<string, unknown> {
  id: string;
  payer: {
    payer_id: string;
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
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
  const [totalWithShipping, setTotalWithShipping] = useState(totalPrice + deliveryCost);

  // If you have a .env file with NEXT_PUBLIC_BACKEND_URL set to http://localhost:3000
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);
  }, [totalPrice, deliveryCost]);

  // Helper function to see if user has actually selected an address & payment method
  const isFormValid = () => {
    const selectedAddress =
      (document.querySelector('select[name="address-method"]') as HTMLSelectElement | null)
        ?.value || '';
    const selectedPayment =
      (document.querySelector('input[name="payment-method"]:checked') as HTMLInputElement | null)
        ?.value || '';

    return (
      selectedAddress !== '' &&
      selectedAddress !== 'Select Address' &&
      selectedPayment !== ''
    );
  };

  const sendMail = async (ref: string) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref }),
      });
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Grab selected address & payment
    const selectedAddress =
      (document.querySelector('select[name="address-method"]') as HTMLSelectElement | null)?.value;
    const selectedPayment =
      (document.querySelector('input[name="payment-method"]:checked') as HTMLInputElement | null)
        ?.value;

    if (!selectedAddress || selectedAddress === 'Select Address' || !selectedPayment) {
      toast.error('Please select an address and payment method');
      return;
    }

    const orderData = {
      address: selectedAddress,
      paymentMethod: selectedPayment,
      selectedMethod,
      deliveryCost,
      totalDiscount,
      totalWithShipping,
      items,
    };

    try {
      // CALL THE BACKEND ON PORT 3000
      const response = await fetch(`${backendUrl}/api/client/order/postOrderClient`, {
        method: 'POST',
        credentials: 'include', // important if using cookie-based auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.status === 200) {
        const data = await response.json();
        const { ref } = data;
        if (!ref) throw new Error("Missing 'ref' in response");

        // Send an email (optional)
        sendMail(ref);

        handleOrderSummary(ref);
        toast.success('Order submitted successfully!');
        dispatch(clearCart());
      } else if (response.status === 400) {
        toast.error('Please check your information.');
      } else if (response.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Unexpected error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in handleOrderSubmit:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // PayPal success callback
  const handleSuccess = (details: Record<string, unknown>) => {
    const paymentDetails = details as PaymentDetails;
    if (paymentDetails.id && paymentDetails.payer) {
      // If PayPal payment is successful, submit the order
      handleOrderSubmit(new Event('submit') as unknown as React.FormEvent);
    } else {
      toast.error('Payment details are missing.');
    }
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 w-[30%]">
      {/* Promo code / discount example */}
      <div className="flex border border-[#15335E] overflow-hidden rounded-md">
        <input
          type="email"
          placeholder="Promo code"
          className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
        />
        <button
          type="button"
          className="flex items-center justify-center font-semibold tracking-wide bg-primary hover:bg-[#15335E] px-4 text-sm text-white"
        >
          Apply
        </button>
      </div>

      <ul className="text-gray-800 mt-8 space-y-4">
        <li className="flex flex-wrap gap-[16px] text-base">
          Discount <span className="ml-auto font-bold">{totalDiscount.toFixed(2)} TND</span>
        </li>
        <li className="flex flex-wrap gap-[16px] text-base">
          Shipping <span className="ml-auto font-bold">{deliveryCost.toFixed(2)} TND</span>
        </li>
        <li className="flex flex-wrap gap-[16px] text-base">
          Tva <span className="ml-auto font-bold">0 TND</span>
        </li>
        <li className="flex flex-wrap gap-[16px] text-base font-bold">
          Total <span className="ml-auto">{totalWithShipping.toFixed(2)} TND</span>
        </li>
      </ul>

      {/* STEP 1: CART VIEW */}
      {currentStep === 'cart' && (
        <div className="mt-8 space-y-2">
          <button
            onClick={() => onCheckout(totalWithShipping, totalDiscount, items)}
            type="button"
            className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-primary hover:bg-[#15335E] ${
              items.length > 0 ? '' : 'opacity-50 cursor-not-allowed'
            } text-white rounded-md`}
            disabled={items.length === 0}
          >
            Checkout
          </button>

          <Link href="/">
            <button
              type="button"
              className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      )}

      {/* STEP 2: CHECKOUT VIEW */}
      {currentStep === 'checkout' && (
        <div className="mt-8 space-y-2">
          {/* If NOT using PayPal, regular button to confirm order */}
          {selectedPaymentMethod !== 'paypal' && (
            <button
              onClick={handleOrderSubmit}
              type="button"
              disabled={!isFormValid()}
              className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-primary ${
                isFormValid() ? 'hover:bg-[#15335E]' : 'opacity-50 cursor-not-allowed'
              } text-white rounded-md`}
            >
              Confirm Order
            </button>
          )}

          {/* If PayPal was selected, show the PayPal button */}
          {selectedPaymentMethod === 'paypal' && (
            <PaypalButton amount={totalWithShipping.toFixed(2)} onSuccess={handleSuccess} />
          )}

          <button
            onClick={backcarte}
            type="button"
            className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide border border-blue-500 bg-blue-500 hover:bg-[#15335E] hover:border-[#15335E] text-white rounded-md"
          >
            Back
          </button>

          <Link href="/">
            <button
              type="button"
              className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md hover:bg-[#15335E] hover:text-white"
            >
              Cancel
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
