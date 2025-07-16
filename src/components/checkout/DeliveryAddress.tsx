/* ------------------------------------------------------------------ */
/*  src/components/checkout/DeliveryAddress.tsx                       */
/* ------------------------------------------------------------------ */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";
import AddAddress from "./AddAddress";

/* ---------- tiny skeleton helper (like in MainProductSection) ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- model ---------- */
export interface Address {
  _id: string;
  Name: string;
  StreetAddress: string;
  Country: string;
  Province?: string;
  City: string;
  PostalCode: string;
}

/* ---------- props ---------- */
interface Props {
  selectedAddressId: string;
  onAddressChange(id: string): void;
}

/** Build a clean, comma‑separated address string */
function formatAddress(addr: Address): string {
  return [
    addr.Name,
    addr.StreetAddress,
    addr.City,
    addr.Province,
    addr.PostalCode,
    addr.Country
  ]
    .filter(Boolean)
    .join(", ");
}

export default function DeliveryAddress({
  selectedAddressId,
  onAddressChange,
}: Props) {
  /* data state */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* UI state */
  const [showForm, setShowForm] = useState(false);

  /* auth hook */
  const { isAuthenticated, loading: authLoading } = useAuth();

  /* fetch addresses */
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchData<Address[]>(
        "/client/address/getAddress",
        { credentials: "include" }
      );
      setAddresses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error fetching addresses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchAddresses();
    }
  }, [authLoading, isAuthenticated, fetchAddresses]);

  return (
    <>
      {/* error message */}
      {error && <p className="text-red-500 py-2">{error}</p>}

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">
          Sélectionnez votre adresse ou ajoutez une nouvelle adresse :
        </h3>

        <div className="grid gap-4 mb-4">
          {(authLoading || loading) ? (
            /* skeleton placeholder for select */
            <Skel className="h-10 w-full" />
          ) : (
            /* real select once loaded */
            <select
              name="address-method"
              value={selectedAddressId}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white p-2"
              title={
                addresses.find((a) => a._id === selectedAddressId)
                  ? formatAddress(
                      addresses.find((a) => a._id === selectedAddressId)!
                    )
                  : undefined
              }
            >
              <option value="">Select Address</option>
              {addresses.map((a) => (
                <option key={a._id} value={a._id}>
                  {formatAddress(a)}
                </option>
              ))}
            </select>
          )}

          {/* button always visible */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={!isAuthenticated}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <AiOutlinePlus className="h-5 w-5" />
            Ajoutez une nouvelle adresse
          </button>
        </div>
      </div>

      {/* address-creation modal (re-fetch list on close) */}
      <AddAddress
        isFormVisible={showForm}
        toggleForminVisibility={() => {
          setShowForm(false);
          fetchAddresses();
        }}
        getAddress={fetchAddresses}
      />
    </>
  );
}
