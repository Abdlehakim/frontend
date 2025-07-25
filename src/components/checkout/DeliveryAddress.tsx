/* ------------------------------------------------------------------ */
/*  src/components/checkout/DeliveryAddress.tsx                       */
/* ------------------------------------------------------------------ */
"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AiOutlinePlus, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";
import AddAddress from "./AddAddress";

/* ---------- tiny skeleton helper ---------- */
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
const formatAddress = (a: Address) =>
  [a.Name, a.StreetAddress, a.City, a.Province, a.PostalCode, a.Country]
    .filter(Boolean)
    .join(", ");

export default function DeliveryAddress({
  selectedAddressId,
  onAddressChange,
}: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [open, setOpen]   = useState(false);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ---------- fetch addresses ---------- */
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData<Address[]>(
        "/client/address/getAddress",
        { credentials: "include" }
      );
      setAddresses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des adresses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchAddresses();
  }, [authLoading, isAuthenticated, fetchAddresses]);

  /* ---------- fermer le menu au clic extérieur ---------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ---------- helpers ---------- */
  const selected = addresses.find((a) => a._id === selectedAddressId) ?? null;

  /* ---------- render ---------- */
  return (
    <>
      {error && <p className="text-red-500 py-2">{error}</p>}

      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold max-lg:text-sm max-lg:text-center">
          Sélectionnez votre adresse ou ajoutez‑en une nouvelle&nbsp;:
        </h3>

        {authLoading || loading ? (
          <Skel className="h-12 w-full" />
        ) : (
          /* --- D R O P D O W N   C U S T O M --- */
          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="w-full h-12 flex items-center justify-between rounded-md border border-gray-300 bg-white
                         px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-lg:text-xs"
            >
              <span className={selected ? "truncate" : "text-gray-400 truncate"}>
                {selected ? formatAddress(selected) : "-- Choisir une adresse --"}
              </span>
              {open ? (
                <AiOutlineUp  className="h-4 w-4 text-gray-500 shrink-0" />
              ) : (
                <AiOutlineDown className="h-4 w-4 text-gray-500 shrink-0" />
              )}
            </button>

            {open && (
              <ul
                className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm
                           shadow-lg ring-1 ring-black/5 divide-y-2"
              >
                {addresses.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">
                    Aucune adresse enregistrée.
                  </li>
                )}

                {addresses.map((addr) => (
                  <>
                  <li
                    key={addr._id}
                    onClick={() => {
                      onAddressChange(addr._id);
                      setOpen(false);
                    }}
                    className={`cursor-pointer select-none px-4 py-2 hover:bg-primary/10 hover:bg-primary hover:text-white  ${
                      addr._id === selectedAddressId ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    {formatAddress(addr)}
                    
                  </li>
                  </>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* bouton d’ajout d’adresse */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={!isAuthenticated}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium
                     hover:bg-primary hover:text-white disabled:opacity-50 max-lg:text-xs"
        >
          <AiOutlinePlus className="h-5 w-5" />
          Ajouter une nouvelle adresse
        </button>
      </div>

      {/* modal d’ajout */}
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
