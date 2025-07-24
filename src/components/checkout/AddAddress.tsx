/* ------------------------------------------------------------------
   src/components/settings/AddAddress.tsx
------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { AiOutlinePlus } from "react-icons/ai";
import { fetchData } from "@/lib/fetchData";

/* ---------- props ---------- */
interface AddAddressProps {
  isFormVisible: boolean;
  getAddress(): void;            // callback pour rafraîchir la liste
  toggleForminVisibility(): void; // callback pour fermer le modal
}

/* ---------- component ---------- */
export default function AddAddress({
  isFormVisible,
  getAddress,
  toggleForminVisibility,
}: AddAddressProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  /* ── Bloquer le scroll quand le modal est ouvert ───────────────── */
  useEffect(() => {
    if (isFormVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isFormVisible]);

  /* ── State local du formulaire ─────────────────────────────────── */
  const [addressData, setAddressData] = useState({
    Name: "",
    StreetAddress: "",
    Country: "",
    Province: "",
    City: "",
    PostalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Soumission du formulaire ──────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authLoading) {
      toast.info("Vérification de l'authentification. Veuillez patienter...");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter une adresse.");
      return;
    }

    try {
      await fetchData("/client/address/postAddress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      toast.success("Adresse ajoutée avec succès !");
      getAddress();
      toggleForminVisibility();

      /* Réinitialisation des champs */
      setAddressData({
        Name: "",
        StreetAddress: "",
        Country: "",
        Province: "",
        City: "",
        PostalCode: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'adresse:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      toast.error(message);
    }
  };

  /* ── Si le modal est masqué, ne rien rendre ────────────────────── */
  if (!isFormVisible) return null;

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="min-w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absolute inset-0 opacity-80 z-0" />

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto my-auto w-full max-w-lg space-y-4 rounded-xl bg-white p-5 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Détails de livraison
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nom */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Nom*
            </label>
            <input
              name="Name"
              value={addressData.Name}
              onChange={handleChange}
              type="text"
              placeholder="ex. Maison, Travail, Chez Jane"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Pays */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Pays*
            </label>
            <input
              name="Country"
              value={addressData.Country}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunisie, France, Canada"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Gouvernorat / État */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Gouvernorat / État*
            </label>
            <input
              name="Province"
              value={addressData.Province}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunis, Ontario, Bavière"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Ville */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Ville*
            </label>
            <input
              name="City"
              value={addressData.City}
              onChange={handleChange}
              type="text"
              placeholder="ex. Tunis, Paris, Montréal"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Code postal */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Code postal*
            </label>
            <input
              name="PostalCode"
              value={addressData.PostalCode}
              onChange={handleChange}
              type="text"
              placeholder="ex. 1001, 75000, H2X 1Y4"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

          {/* Adresse */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Adresse*
            </label>
            <input
              name="StreetAddress"
              value={addressData.StreetAddress}
              onChange={handleChange}
              type="text"
              placeholder="ex. 123 rue Principale, Appt 4B"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>

        
          </div>
            {/* Boutons */}
          <div className="w-full flex gap-4 justify-end">
            {/* Submit */}
            <button
              type="submit"
              className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full text-center flex gap-4"
            >
              <AiOutlinePlus className="h-5 w-5" />
              Ajouter l’adresse
            </button>

            {/* Cancel */}
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
