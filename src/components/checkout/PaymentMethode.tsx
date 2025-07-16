/* ------------------------------------------------------------------
   src/app/components/checkout/PaymentMethode.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";

/* ---------- tiny skeleton helper (like in MainProductSection) ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ───── types ───── */
export type PaymentMethodId = "paypal" | "stripe" | "cashOnDelivery";

interface PaymentMethod {
  key: PaymentMethodId;
  label: string;
  help: string;
}

interface PaymentMethodeProps {
  selectedPaymentMethod: PaymentMethodId | "";
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

  return (
    <div className="space-y-4">
      {/* heading always visible */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Choisissez le moyen de paiement qui vous convient :
      </h3>

      {loading ? (
        /* skeleton grid for loading */
        <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center">
                <Skel className="h-8 w-8 rounded-full" />
                <div className="ml-4 space-y-2">
                  <Skel className="h-4 w-3/4" />
                  <Skel className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : methods.length === 0 ? (
        /* no methods available */
        <p className="italic text-sm text-gray-500">
          No payment methods are currently available.
        </p>
      ) : (
        /* real methods grid */
        <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
          {methods.map(({ key, label, help }) => (
            <label
              key={key}
              htmlFor={key}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center">
                <input
                  id={key}
                  type="radio"
                  name="payment-method"
                  value={key}
                  checked={selectedPaymentMethod === key}
                  onChange={handlePaymentMethodChange}
                  className="h-8 w-8 border-gray-300 bg-white text-primary-600  dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
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
      )}
    </div>
  );
};

export default PaymentMethode;
