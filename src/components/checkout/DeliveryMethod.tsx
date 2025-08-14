/* ------------------------------------------------------------------
   src/components/checkout/DeliveryMethod.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { fetchData } from "@/lib/fetchData";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ---------- tiny skeleton helper ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- parent-callback props ---------- */
interface DeliveryMethodProps {
  selectedMethod: string; // holds the method name
  onMethodChange: (methodName: string, cost: number) => void;

  /** NEW: control which options are shown */
  filter?: "all" | "pickupOnly" | "deliveryOnly";
}

/* ---------- API model ---------- */
interface DeliveryOption {
  id: string;
  name: string;
  description?: string;
  cost: number;
  /** NEW: true if this option is pickup/in-store */
  isPickup?: boolean;
}

const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  selectedMethod,
  onMethodChange,
  filter = "all",
}) => {
  const { fmt } = useCurrency(); // formats a number -> currency string

  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);

  // dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // fetch delivery options on mount
  useEffect(() => {
    (async () => {
      try {
        const opts = await fetchData<DeliveryOption[]>(
          "/checkout/delivery-options?limit=100"
        );
        setOptions([...opts].sort((a, b) => a.cost - b.cost));
      } catch (err) {
        console.error("Fetch delivery options failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // close on outside click / escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    if (filter === "all") return options;
    if (filter === "pickupOnly") return options.filter((o) => !!o.isPickup);
    // deliveryOnly
    return options.filter((o) => !o.isPickup);
  }, [options, filter]);

  const selectedOpt =
    filteredOptions.find((o) => o.name === selectedMethod) || null;

  const labelFor = (opt: DeliveryOption) =>
    opt.cost === 0 ? `Gratuit – ${opt.name}` : `${fmt(opt.cost)} – ${opt.name}`;

  const buttonText = selectedOpt
    ? labelFor(selectedOpt)
    : loading
    ? "Chargement des modes de livraison…"
    : filteredOptions.length
    ? "-- Choisir un mode de livraison --"
    : "Aucune méthode de livraison disponible";

  const handlePick = (opt: DeliveryOption) => {
    onMethodChange(opt.name, opt.cost); // ← send name + cost
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Choisissez la méthode de livraison qui vous convient :</h2>

      {/* Select-like dropdown */}
      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !loading && filteredOptions.length && setOpen((p) => !p)}
          className="flex h-12 w-full items-center justify-between rounded-md border
                     border-gray-300 bg-white px-4 text-sm shadow-sm focus:outline-none
                     focus:ring-2 focus:ring-primary/50 max-lg:text-xs disabled:opacity-50"
          disabled={loading || !filteredOptions.length}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={
              selectedOpt ? "block w-full truncate" : "text-gray-400 block w-full truncate"
            }
          >
            {buttonText}
          </span>
          {open ? (
            <AiOutlineUp className="h-4 w-4 shrink-0 text-gray-500" />
          ) : (
            <AiOutlineDown className="h-4 w-4 shrink-0 text-gray-500" />
          )}
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-md
                       bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
          >
            {loading ? (
              <>
                <li className="px-4 py-2">
                  <Skel className="h-4 w-2/3" />
                  <Skel className="mt-1 h-3 w-1/3" />
                </li>
                <li className="px-4 py-2">
                  <Skel className="h-4 w-1/2" />
                  <Skel className="mt-1 h-3 w-1/4" />
                </li>
                <li className="px-4 py-2">
                  <Skel className="h-4 w-3/4" />
                  <Skel className="mt-1 h-3 w-1/2" />
                </li>
              </>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.name === selectedMethod;
                return (
                  <li
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handlePick(opt)}
                    className={`cursor-pointer select-none px-4 py-2 transition-colors ${
                      isSelected
                        ? "bg-secondary text-white"
                        : "hover:bg-secondary hover:text-white"
                    }`}
                  >
                    <div className="truncate">{labelFor(opt)}</div>
                    {!!opt.description && (
                      <p className="text-xs text-gray-500">{opt.description}</p>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeliveryMethod;
