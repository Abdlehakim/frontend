"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PaginationClient from "@/components/PaginationClient";
import { FaTrash, FaPenToSquare } from "react-icons/fa6";

import AddAddressModal from "@/components/settings/AddAddressModal";
import EditAddressModal from "@/components/settings/EditAddressModal";
import DeletePopup from "@/components/Popup/DeletePopup";

import { fetchData } from "@/lib/fetchData";

interface Address {
  _id: string;
  Name: string;
  StreetAddress: string;
  Country: string;
  Province?: string;
  City: string;
  PostalCode: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addressUpdateSuccess, setAddressUpdateSuccess] = useState("");
  const [addressUpdateError, setAddressUpdateError] = useState("");

  const [addressAddSuccess, setaddressAddSuccess] = useState("");
  const [addressAddError, setaddressAddError] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState("");

  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const addressesPerPage = 4;

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(`/signin?redirectTo=${redirectTo}`);
    }
  }, [loading, isAuthenticated, router, searchParams]);

  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const addressesData = await fetchData<Address[]>(
        "/client/address/getAddress",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      setAddresses(addressesData);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddressesError(err.message);
      } else {
        setAddressesError("An unexpected error occurred");
      }
      throw err;
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchAddresses().catch(() => {});
    }
  }, [loading, isAuthenticated, fetchAddresses]);

  const onAddressUpdated = useCallback(async () => {
    try {
      await fetchAddresses();
      setAddressUpdateSuccess("Address updated successfully!");
      setTimeout(() => setAddressUpdateSuccess(""), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddressUpdateError(err.message);
      } else {
        setAddressUpdateError("An unexpected error occurred");
      }
      setTimeout(() => setAddressUpdateError(""), 3000);
    }
  }, [fetchAddresses]);

  const onAddressAdd = useCallback(async () => {
    try {
      await fetchAddresses();
      setaddressAddSuccess("Address added successfully!");
      setTimeout(() => setaddressAddSuccess(""), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setaddressAddError(err.message);
      } else {
        setaddressAddError("An unexpected error occurred");
      }
      setTimeout(() => setaddressAddError(""), 3000);
    }
  }, [fetchAddresses]);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const updatedUser = await fetchData<{
        username: string;
        email: string;
        phone?: string;
      }>("/clientSetting/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone }),
      });

      setSuccess("Profile updated successfully!");
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setPhone(updatedUser.phone || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetchData<unknown>(`/client/address/deleteAddress/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      setAddressUpdateSuccess("Address deleted successfully!");
      setTimeout(() => setAddressUpdateSuccess(""), 3000);
      await fetchAddresses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddressUpdateError(err.message);
      } else {
        setAddressUpdateError("An unexpected error occurred");
      }
      setTimeout(() => setAddressUpdateError(""), 3000);
    } finally {
      setAddressToDelete(null);
      setDeleteIndex(null);
    }
  };

  const handleUpdateClick = (addr: Address) => {
    setSelectedAddress(addr);
  };

  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = currentPage * addressesPerPage - addressesPerPage;
  const displayedAddresses = addresses.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );
  const totalPages = Math.ceil(addresses.length / addressesPerPage);

  return (
    <div className="py-4 flex flex-col w-[90%] gap-[20px] mx-auto h-[900px]">
      {/* Profile Update Section */}
      <div className="w-full flex flex-col gap-[8px] justify-center mx-auto">
        <div className="w-full flex justify-center h-10">
          {success && <p className="text-green-500 my-2">{success}</p>}
          {error && <p className="text-red-500 my-2">{error}</p>}
        </div>
        <h2 className="text-xl font-bold uppercase">Profile details :</h2>
        <form
          onSubmit={handleProfileSubmit}
          noValidate
          className="flex gap-[16px] justify-center items-end"
        >
          <div className="flex flex-col gap-[8px] w-[20%]">
            <label htmlFor="username" className="block font-medium">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-2 h-10"
              required
            />
          </div>
          <div className="flex flex-col gap-[8px] w-[20%]">
            <label htmlFor="email" className="block font-medium">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-2 h-10"
              required
            />
          </div>
          <div className="flex flex-col gap-[8px] w-[20%]">
            <label htmlFor="phone" className="block font-medium">
              Phone:
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-2 h-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-semibold px-4 h-10 rounded"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Display / Update Addresses Section */}
      <div className="w-full flex flex-col gap-[20px] justify-start mx-auto h-full">
        <div className="w-full flex gap-[8px] justify-between mx-auto">
          <h2 className="text-xl font-bold uppercase">Your Addresses :</h2>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="bg-primary text-white font-semibold px-4 py-2 rounded w-[150px]"
          >
            Add Address
          </button>
        </div>

        <div className="w-full flex justify-center h-14">
          {addressAddSuccess && (
            <p className="text-green-500 my-2">{addressAddSuccess}</p>
          )}
          {addressAddError && (
            <p className="text-red-500 my-2">{addressAddError}</p>
          )}
          {addressUpdateSuccess && (
            <p className="text-green-500 my-2">{addressUpdateSuccess}</p>
          )}
          {addressUpdateError && (
            <p className="text-red-500 my-2">{addressUpdateError}</p>
          )}
        </div>

        {addressesLoading ? (
          <p>Loading addresses...</p>
        ) : addressesError ? (
          <p className="text-red-500">{addressesError}</p>
        ) : addresses.length > 0 ? (
          <div className="flex  justify-center gap-[20px] h-full w-full">
            {displayedAddresses.map((addr, index) => (
              <div
                key={addr._id}
                className="flex flex-col gap-[20px] w-[20%] border-2 p-4"
              >
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-center content-center">
                    Address {indexOfFirstAddress + index + 1} :
                  </p>
                  <div className="flex gap-[8px] w-20 h-10">
                    <FaPenToSquare
                      className="cursor-pointer text-secondary h-full w-full hover:text-white border p-2 hover:bg-primary rounded"
                      onClick={() => handleUpdateClick(addr)}
                      title="Edit Address"
                    />
                    <FaTrash
                      className="cursor-pointer text-secondary h-full w-full hover:text-white border p-2 hover:bg-primary rounded"
                      onClick={() => {
                        setAddressToDelete(addr);
                        setDeleteIndex(index);
                      }}
                      title="Delete Address"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[16px] justify-center">
                  <div className="flex items-center gap-[8px]">
                    <label className="font-medium">Name:</label>
                    <p className="border p-2 w-full">{addr.Name}</p>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <label className="font-medium whitespace-nowrap">
                      Street Address:
                    </label>
                    <p className="border p-2 w-full">{addr.StreetAddress}</p>
                  </div>
                  <div className="flex items-center gap-[8px] ">
                    <label className="font-medium">Country:</label>
                    <p className="border p-2 w-full">{addr.Country}</p>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <label className="font-medium">Province:</label>
                    <p className="border p-2 w-full">
                      {addr.Province ? addr.Province : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-[8px] w-full">
                    <label className="font-medium">City:</label>
                    <p className="border p-2 w-full">{addr.City}</p>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <label className="font-medium whitespace-nowrap">
                      Postal Code:
                    </label>
                    <p className="border p-2 w-full">{addr.PostalCode}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No addresses found.</p>
        )}
        <PaginationClient
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressAdd={onAddressAdd}
      />

      {selectedAddress && (
        <EditAddressModal
          isOpen={true}
          onClose={() => setSelectedAddress(null)}
          address={selectedAddress}
          onAddressUpdated={onAddressUpdated}
        />
      )}

      {addressToDelete && (
        <DeletePopup
          handleClosePopup={() => {
            setAddressToDelete(null);
            setDeleteIndex(null);
          }}
          Delete={handleDeleteAddress}
          id={addressToDelete._id}
          name={
            deleteIndex !== null
              ? `Address ${deleteIndex + 1}`
              : addressToDelete.Name
          }
        />
      )}
    </div>
  );
}
