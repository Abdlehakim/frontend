"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import AddAddress from "./AddAddress"; // <-- import your AddAddress component
import { AiOutlinePlus } from "react-icons/ai"; // ← NEW

interface Address {
  _id: string;
  Name: string;
  StreetAddress: string;
  Country: string;
  Province?: string;
  City: string;
  PostalCode: string;
}

export default function DeliveryAddressSelect() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressesError, setAddressesError] = useState("");

  const [isFormVisible, setIsFormVisible] = useState(false);

  // Toggles the add-address form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const { isAuthenticated, loading: authLoading } = useAuth();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  /**
   * Fetch all addresses for the authenticated user
   */
  const fetchAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      setAddressesError("");

      const res = await fetch(`${backendUrl}/api/client/address/getAddress`, {
        method: "GET",
        credentials: "include", // if you're using cookie-based auth
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch addresses.");
      }

      const data = (await res.json()) as Address[];
      setAddresses(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAddressesError(error.message);
      } else {
        setAddressesError(
          "An unexpected error occurred while fetching addresses."
        );
      }
    } finally {
      setLoadingAddresses(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    // Fetch addresses once the user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchAddresses();
    }
  }, [authLoading, isAuthenticated, fetchAddresses]);

  if (authLoading || loadingAddresses) {
    return <p>Loading addresses...</p>;
  }

  if (addressesError) {
    return <p className="text-red-500">{addressesError}</p>;
  }

  return (
    <>
      <div className="sm:col-span-2">
        <h3 className="text-xl font-semibold pb-3 text-gray-900 dark:text-white">
          Delivery Address
        </h3>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-1 mb-4">
          {/* -- SELECT BOX FOR EXISTING ADDRESSES -- */}
          <select
            name="address-method"
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 
                       dark:border-gray-700 dark:bg-gray-800 w-full"
          >
            <option>Select Address</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.Name}, {addr.StreetAddress}, {addr.Country}/
                {addr.Province}/{addr.City}/{addr.PostalCode}
              </option>
            ))}
          </select>

          {/* -- BUTTON TO TOGGLE THE "ADD NEW ADDRESS" FORM -- */}
          <button
            onClick={toggleFormVisibility}
            type="button"
            className="flex w-full items-center justify-center gap-[8px] rounded-lg border
                       border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 
                       hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none 
                       focus:ring-4 focus:ring-gray-100 dark:border-gray-600 
                       dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 
                       dark:hover:text-white dark:focus:ring-gray-700"
          >
            <AiOutlinePlus className="h-5 w-5" />
            Add new address
          </button>
        </div>
      </div>

      {/* -- Renders the add-address form if 'isFormVisible' is true -- */}
      <AddAddress
        isFormVisible={isFormVisible}
        toggleForminVisibility={toggleFormVisibility}
        getAddress={fetchAddresses}
      />
    </>
  );
}
