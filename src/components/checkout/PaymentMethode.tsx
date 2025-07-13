/* ------------------------------------------------------------------
   src/app/components/checkout/PaymentMethode.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { fetchData } from "@/lib/fetchData";

/* ───── types ───── */
export type PaymentMethodId = "paypal" | "stripe" | "cashOnDelivery";

interface PaymentMethod {
  key: PaymentMethodId;
  label: string;
  help: string;
}

interface PaymentMethodeProps {
  selectedPaymentMethod: PaymentMethodId | ""; // "" when none yet selected
  handlePaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethode: React.FC<PaymentMethodeProps> = ({
  selectedPaymentMethod,
  handlePaymentMethodChange,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  /* fetch enabled methods once */
  useEffect(() => {
    (async () => {
      try {
        const active = await fetchData<PaymentMethod[]>(
          "/checkout/payment-methods"
        );
        setMethods(active);
      } catch (err) {
        console.error("Fetch payment methods failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80px] items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (!methods.length) {
    return (
      <p className="italic text-sm text-gray-500">
        No payment methods are currently available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Payment
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {methods.map(({ key, label, help }) => (
          <label
            key={key}
            htmlFor={key}
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start">
              <input
                id={key}
                type="radio"
                name="payment-method"
                value={key}
                checked={selectedPaymentMethod === key}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <div className="ml-4 text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {label}
                </span>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {help}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethode;
