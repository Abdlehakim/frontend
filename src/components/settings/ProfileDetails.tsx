/* ------------------------------------------------------------------
   ProfileDetails — formulaire de mise à jour du profil (FR, simplifié)
------------------------------------------------------------------ */
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";

export default function ProfileDetails() {
  /* ---------- auth ---------- */
  const { user, loading } = useAuth();

  /* ---------- état ---------- */
  const [username, setUsername] = useState(user?.username ?? "");
  const [email,    setEmail]    = useState(user?.email    ?? "");
  const [phone,    setPhone]    = useState("");               
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");

  /* ---------- handlers ---------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const fd = new FormData();
      fd.append("username", username);
      fd.append("email",    email);
      fd.append("phone",    phone);
      await fetchData("/clientSetting/update", {
        method: "PUT",
        credentials: "include",
        body: fd,
      });

      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue"
      );
    }
  };

  /* ---------- rendu ---------- */
  return (
    <section className="w-[90%] mx-auto flex flex-col lg:flex-row gap-10 border-b-2 py-10">
      {/* Colonne gauche — titre + description */}
      <aside className="lg:w-1/5 space-y-2">
        <h2 className="text-lg font-semibold text-black">
          Informations personnelles
        </h2>
        <p className="text-sm text-gray-400">
          Utilisez une adresse permanente où vous pouvez recevoir du courrier.
        </p>
      </aside>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 space-y-8"
        encType="multipart/form-data"
      >
        

        {/* Grille des champs */}
        <div className="grid grid-cols-1  gap-6">
          {/* Nom d’utilisateur */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="username" className="text-sm font-medium text-black">
              Nom d’utilisateur
            </label>
            <input
              id="username"
              type="text"
              placeholder="exemple.com/ jeandupont"
              className="w-full h-12 border  border-gray-300 px-4  rounded-md focus:outline-none text-md max-lg:text-xs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Adresse e‑mail
            </label>
            <input
              id="email"
              type="email"
              className="w-full h-12 border  border-gray-300 px-4  rounded-md focus:outline-none text-md max-lg:text-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="phone" className="text-sm font-medium text-black">
              Téléphone
            </label>
            <input
              id="phone"
              type="text"
              className="w-full h-12 border  border-gray-300 px-4  rounded-md focus:outline-none text-md max-lg:text-xs"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>  
        </div>

        {/* Bouton & messages */}
        <div className="flex justify-end items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm text-black hover:text-white  hover:bg-primary"
          >
            {loading ? "En cours…" : "Enregistrer"}
          </button>

          {success && <p className="text-green-400 text-sm">{success}</p>}
          {error   && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </form>
    </section>
  );
}
