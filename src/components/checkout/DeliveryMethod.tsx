/* ------------------------------------------------------------------
   src/app/components/checkout/DeliveryMethod.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";


/* ---------- tiny skeleton helper (like in MainProductSection) ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

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

const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);

  /* fetch delivery options on mount */
  useEffect(() => {
    (async () => {
      try {
        const opts = await fetchData<DeliveryOption[]>(
          "/checkout/delivery-options?limit=100"
        );
        setOptions(opts.sort((a, b) => a.cost - b.cost));
      } catch (err) {
        console.error("Fetch delivery options failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* change-handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    const opt = options.find((o) => o.id === id);
    if (opt) onMethodChange(id, opt.cost);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold "> Choisissez la méthode de livraison qui vous convient :</h2>

      {loading ? (
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
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
      ) : !options.length ? (
        <p className="text-sm text-gray-500 italic">
          No delivery methods are currently available.
        </p>
      ) : (
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              htmlFor={opt.id}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  id={opt.id}
                  type="radio"
                  name="delivery-method"
                  value={opt.id}
                  checked={selectedMethod === opt.id}
                  onChange={handleChange}
                  className="h-8 w-8 border-gray-300 bg-white text-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
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
      )}
    </div>
  );
};

export default DeliveryMethod;
