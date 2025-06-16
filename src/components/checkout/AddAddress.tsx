"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth"; // Update the path if needed

interface AddAddressProps {
  isFormVisible: boolean;
  getAddress(): void; // callback to refresh the address list in the parent
  toggleForminVisibility(): void; // callback to hide this form
}

export default function AddAddress({
  isFormVisible,
  getAddress,
  toggleForminVisibility,
}: AddAddressProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  // Read backend URL from environment variable
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Fields matching your Mongoose schema
  const [addressData, setAddressData] = useState({
    Name: "",
    StreetAddress: "",
    Country: "",
    Province: "",
    City: "",
    PostalCode: "",
  });

  // Update local state when inputs change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form to your /api/client/address/postAddress route
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wait until auth is finished checking
    if (authLoading) {
      toast.info("Checking authentication. Please wait...");
      return;
    }

    // User must be authenticated to add addresses
    if (!isAuthenticated) {
      toast.error("You must be logged in to add an address.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/client/address/postAddress`, {
        method: "POST",
        credentials: "include", // send cookies if using cookie-based auth
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        // Handle server errors
        const result = await response.json();
        switch (response.status) {
          case 400:
            toast.error(result.message || "All fields are required.");
            break;
          case 405:
            toast.error(
              result.message || "You have reached the limit of addresses."
            );
            break;
          case 500:
            toast.error(result.error || "Error creating address.");
            break;
          default:
            toast.error(result.error || "An unexpected error occurred.");
        }
        return;
      }

      // Success!
      toast.success("Address added successfully!");
      // Refresh address list in parent
      getAddress();
      // Hide the form
      toggleForminVisibility();

      // Clear out the fields
      setAddressData({
        Name: "",
        StreetAddress: "",
        Country: "",
        Province: "",
        City: "",
        PostalCode: "",
      });
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  };

  // If form isn't visible, don't render anything
  if (!isFormVisible) return null;

  return (
    <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absoluteopacity-80 inset-0 z-0"></div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Delivery Details
        </h2>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Name*
            </label>
            <input
              name="Name"
              value={addressData.Name}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Home, Work, Jane's House"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Country */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Country*
            </label>
            <input
              name="Country"
              value={addressData.Country}
              onChange={handleChange}
              type="text"
              placeholder="e.g., USA, France, Egypt"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Province */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Province / State*
            </label>
            <input
              name="Province"
              value={addressData.Province}
              onChange={handleChange}
              type="text"
              placeholder="e.g., California, Ontario, Bavaria"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              City*
            </label>
            <input
              name="City"
              value={addressData.City}
              onChange={handleChange}
              type="text"
              placeholder="e.g., New York, Paris, Cairo"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* PostalCode */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Postal Code*
            </label>
            <input
              name="PostalCode"
              value={addressData.PostalCode}
              onChange={handleChange}
              type="text"
              placeholder="e.g., 10001, 75000, 11937"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* StreetAddress */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Street Address*
            </label>
            <input
              name="StreetAddress"
              value={addressData.StreetAddress}
              onChange={handleChange}
              type="text"
              placeholder="e.g., 123 Main Street, Apt 4B"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
                         text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white
                         dark:placeholder:text-gray-400 dark:focus:border-primary-500 
                         dark:focus:ring-primary-500"
              required
            />
          </div>

          <div className="sm:col-span-2 flex justify-start gap-[8px]">
            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-[8px] 
                         rounded-lg border text-white border-primary bg-primary 
                         px-5 py-2.5 text-sm font-medium hover:bg-[#15335E] 
                         hover:border-[#15335E]"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" d="M5 12h14m-7 7V5" />
              </svg>
              Add address
            </button>

            {/* Cancel */}
            <button
              onClick={toggleForminVisibility}
              type="button"
              className="flex w-full items-center justify-center gap-[8px] 
                         rounded-lg border border-gray-200 bg-white px-5 py-2.5 
                         text-sm font-medium text-gray-900 hover:bg-gray-100 
                         hover:text-primary-700 focus:z-10 focus:outline-none 
                         focus:ring-4 focus:ring-gray-100 dark:border-gray-600 
                         dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 
                         dark:hover:text-white dark:focus:ring-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
