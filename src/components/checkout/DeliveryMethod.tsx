/* ------------------------------------------------------------------
   src/app/components/checkout/DeliveryMethod.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { fetchData } from "@/lib/fetchData";

/* ---------- parent-callback props ---------- */
interface DeliveryMethodProps {
  selectedMethod: string;
  onMethodChange: (methodId: string, cost: number) => void;
}

/* ---------- API model ---------- */
interface DeliveryOption {
  id: string;
  name: string;
  description?: string;
  cost: number;
}

/* ------------------------------------------------------------------ */
const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch delivery options on mount ---------- */
  useEffect(() => {
    (async () => {
      try {
        const opts = await fetchData<DeliveryOption[]>(
          "/checkout/delivery-options?limit=100"
        ); // public website endpoint
        setOptions(opts.sort((a, b) => a.cost - b.cost));
      } catch (err) {
        console.error("Fetch delivery options failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- change-handler ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    const opt = options.find((o) => o.id === id);
    if (opt) onMethodChange(id, opt.cost);
  };

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="flex h-[120px] items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (!options.length) {
    return (
      <p className="text-sm text-gray-500 italic">
        No delivery methods are currently available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Delivery Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start">
              <input
                id={opt.id}
                type="radio"
                name="delivery-method"
                value={opt.id}
                checked={selectedMethod === opt.id}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
              <div className="ml-4 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {opt.cost === 0
                    ? `Free shipping – ${opt.name}`
                    : `${opt.cost} TND – ${opt.name}`}
                </p>
                {opt.description && (
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {opt.description}
                  </span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethod;
