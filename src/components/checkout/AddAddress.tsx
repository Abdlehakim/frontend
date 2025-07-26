/* ------------------------------------------------------------------
   src/components/checkout/AddAddress.tsx
   Composant unique pour ajout et édition d’adresse
------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { AiOutlinePlus } from "react-icons/ai";
import { fetchData } from "@/lib/fetchData";

interface AddAddressProps {
  isFormVisible: boolean;
  getAddress(): void;
  toggleForminVisibility(): void;
  editAddress?: {
    _id: string;
    Name: string;
    StreetAddress: string;
    Country: string;
    Province?: string;
    City: string;
    PostalCode: string;
  };
}

export default function AddAddress({
  isFormVisible,
  getAddress,
  toggleForminVisibility,
  editAddress,
}: AddAddressProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Bloquer le scroll de <body> et <html> quand le modal est ouvert
  useEffect(() => {
    if (isFormVisible) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isFormVisible]);

  const [addressData, setAddressData] = useState({
    Name: "",
    StreetAddress: "",
    Country: "",
    Province: "",
    City: "",
    PostalCode: "",
  });

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editAddress) {
      setAddressData({
        Name: editAddress.Name,
        StreetAddress: editAddress.StreetAddress,
        Country: editAddress.Country,
        Province: editAddress.Province || "",
        City: editAddress.City,
        PostalCode: editAddress.PostalCode,
      });
    } else {
      setAddressData({
        Name: "",
        StreetAddress: "",
        Country: "",
        Province: "",
        City: "",
        PostalCode: "",
      });
    }
  }, [editAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authLoading) {
      toast.info("Vérification de l'authentification…");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour continuer.");
      return;
    }

    try {
      if (editAddress) {
        await fetchData(`/client/address/updateAddress/${editAddress._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        });
        toast.success("Adresse mise à jour avec succès !");
      } else {
        await fetchData("/client/address/postAddress", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        });
        toast.success("Adresse ajoutée avec succès !");
      }
      getAddress();
      toggleForminVisibility();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erreur inattendue");
    }
  };

  if (!isFormVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absolute inset-0 opacity-80 z-0" />
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto my-auto max-md:w-[90%] rounded-xl bg-white p-5 shadow-lg"
      >
        <h2 className="text-xl max-md:text-lg text-center font-semibold text-gray-900">
          {editAddress ? "Modifier l’adresse" : "Nouvelle adresse"}
        </h2>

        <div className="grid grid-cols-1 gap-4 max-md:gap-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Nom*
            </label>
            <input
              name="Name"
              value={addressData.Name}
              onChange={handleChange}
              type="text"
              placeholder="ex. Maison, Travail, Chez Jane"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Pays*
            </label>
            <input
              name="Country"
              value={addressData.Country}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunisie, France, Canada"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Gouvernorat / État*
            </label>
            <input
              name="Province"
              value={addressData.Province}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunis, Ontario, Bavière"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Ville*
            </label>
            <input
              name="City"
              value={addressData.City}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunis, Paris, Montréal"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Code postal*
            </label>
            <input
              name="PostalCode"
              value={addressData.PostalCode}
              onChange={handleChange}
              type="text"
              placeholder="ex. 1001, 75000, H2X 1Y4"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Adresse*
            </label>
            <input
              name="StreetAddress"
              value={addressData.StreetAddress}
              onChange={handleChange}
              type="text"
              placeholder="ex. 123 rue Principale, Appt 4B"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div className="w-full flex gap-4 justify-end mt-4">
          <button
            type="submit"
            className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full flex items-center gap-2 justify-center"
          >
            <AiOutlinePlus className="h-5 w-5" />
            {editAddress ? "Enregistrer" : "Ajouter l’adresse"}
          </button>
          <button
            type="button"
            onClick={toggleForminVisibility}
            className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full text-center"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
