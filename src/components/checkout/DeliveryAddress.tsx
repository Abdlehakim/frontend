/* ------------------------------------------------------------------
   src/components/checkout/DeliveryAddress.tsx
------------------------------------------------------------------ */
"use client";

import { useState, useCallback, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";
import AddAddress from "./AddAddress";

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

export default function DeliveryAddress({
  selectedAddressId,
  onAddressChange,
}: Props) {
  /* data state */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  /* UI state */
  const [showForm,  setShowForm]  = useState(false);

  /* auth hook */
  const { isAuthenticated, loading: authLoading } = useAuth();

  /* fetch addresses (no more auto-select) */
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
    if (!authLoading && isAuthenticated) fetchAddresses();
  }, [authLoading, isAuthenticated, fetchAddresses]);

  /* ---------- render ---------- */
  return (
    <>
      {(authLoading || loading) && (
        <p className="text-gray-500 py-2">Loading addresses…</p>
      )}
      {error && <p className="text-red-500 py-2">{error}</p>}

      <div className="sm:col-span-2">
        <h3 className="text-xl font-semibold pb-3">Delivery Address</h3>

        <div className="grid gap-4 mb-4">
          <select
            name="address-method"
            value={selectedAddressId}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <option value="">Select Address</option>
            {addresses.map((a) => (
              <option key={a._id} value={a._id}>
                {`${a.Name}, ${a.StreetAddress}, ${a.Country}/${
                  a.Province ?? ""
                }/${a.City}/${a.PostalCode}`}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={!isAuthenticated}
            className="flex items-center justify-center gap-2 rounded-lg border
                       border-gray-200 bg-white px-5 py-2.5 text-sm font-medium
                       hover:bg-gray-100 disabled:opacity-50"
          >
            <AiOutlinePlus className="h-5 w-5" />
            Add new address
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
