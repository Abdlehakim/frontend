"use client";
import React from "react";

const CurrencyContext = React.createContext<{
  code: string;        // e.g. "TND", "EUR"
  fmt(n: number): string;
}>({
  code: "TND",
  fmt: (n) => n.toFixed(1) + " TND",
});

export const CurrencyProvider = ({
  initial,
  children,
}: {
  initial: string;
  children: React.ReactNode;
}) => {
  // small formatter that respects the user’s locale but always uses the
  // currency code provided by the backend
  const value = React.useMemo(() => {
    const fmt = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: initial,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format;
    return { code: initial, fmt };
  }, [initial]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => React.useContext(CurrencyContext);
