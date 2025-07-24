/* ------------------------------------------------------------------
   src/components/settings/AddressList.tsx
   Liste des adresses client — tableau (FR) avec colonne “N°”
------------------------------------------------------------------ */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import PaginationClient from "@/components/PaginationClient";
import { FaTrash, FaPenToSquare } from "react-icons/fa6";

import AddAddress       from "@/components/checkout/AddAddress";
import EditAddressModal from "@/components/settings/EditAddressModal";
import DeletePopup      from "@/components/Popup/DeletePopup";

import { fetchData } from "@/lib/fetchData";

/* ---------- types ---------- */
interface Address {
  _id: string;
  Name: string;
  StreetAddress: string;
  Country: string;
  Province?: string;
  City: string;
  PostalCode: string;
}

const addressesPerPage = 6;

export default function AddressList() {
  /* ---------- auth ---------- */
  const { isAuthenticated, loading } = useAuth();

  /* ---------- états de succès / erreur ---------- */
  const [addrUpdateOk,  setAddrUpdateOk]  = useState("");
  const [addrUpdateErr, setAddrUpdateErr] = useState("");
  const [addrAddOk,     setAddrAddOk]     = useState("");
  const [addrAddErr,    setAddrAddErr]    = useState("");

  /* ---------- données ---------- */
  const [addresses,        setAddresses]        = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError,   setAddressesError]   = useState("");

  /* ---------- suppression / édition ---------- */
  const [addrToDelete, setAddrToDelete] = useState<Address | null>(null);
  const [addrEdit,     setAddrEdit]     = useState<Address | null>(null);

  /* ---------- pagination ---------- */
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- modal ajouter adresse ---------- */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* ------------------------------------------------------------------
     1. Récupération des adresses
  ------------------------------------------------------------------ */
  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const data = await fetchData<Address[]>("/client/address/getAddress", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setAddresses(data);
      setCurrentPage(1);
    } catch (err) {
      setAddressesError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue"
      );
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) fetchAddresses().catch(() => {});
  }, [loading, isAuthenticated, fetchAddresses]);

  /* ------------------------------------------------------------------
     2. Callbacks : ajout / édition
  ------------------------------------------------------------------ */
  const onAddrUpdated = useCallback(async () => {
    try {
      await fetchAddresses();
      setAddrUpdateOk("Adresse mise à jour avec succès !");
      setTimeout(() => setAddrUpdateOk(""), 3000);
    } catch (err) {
      setAddrUpdateErr(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue"
      );
      setTimeout(() => setAddrUpdateErr(""), 3000);
    }
  }, [fetchAddresses]);

  const onAddrAdded = useCallback(async () => {
    try {
      await fetchAddresses();
      setAddrAddOk("Adresse ajoutée avec succès !");
      setTimeout(() => setAddrAddOk(""), 3000);
    } catch (err) {
      setAddrAddErr(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue"
      );
      setTimeout(() => setAddrAddErr(""), 3000);
    }
  }, [fetchAddresses]);

  /* ------------------------------------------------------------------
     3. Suppression d’une adresse
  ------------------------------------------------------------------ */
  const handleDeleteAddress = async (id: string) => {
    try {
      await fetchData(`/client/address/deleteAddress/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setAddrUpdateOk("Adresse supprimée avec succès !");
      setTimeout(() => setAddrUpdateOk(""), 3000);
      await fetchAddresses();
    } catch (err) {
      setAddrUpdateErr(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue"
      );
      setTimeout(() => setAddrUpdateErr(""), 3000);
    } finally {
      setAddrToDelete(null);
    }
  };

  /* ------------------------------------------------------------------
     4. Pagination
  ------------------------------------------------------------------ */
  const firstIndex = (currentPage - 1) * addressesPerPage;
  const shown      = addresses.slice(firstIndex, firstIndex + addressesPerPage);
  const totalPages = Math.ceil(addresses.length / addressesPerPage);

  /* ------------------------------------------------------------------
     5. Rendu
  ------------------------------------------------------------------ */
  return (
    <section className="w-[80%] mx-auto flex flex-col lg:flex-row gap-10 py-10">
      {/* Colonne gauche — titre + description */}
      <aside className="lg:w-1/5 space-y-2">
        <h2 className="text-lg font-semibold text-black">Carnet d’adresses</h2>
        <p className="text-sm text-gray-400">
          Gérez vos adresses de livraison et assurez‑vous qu’elles sont
          toujours à jour.
        </p>
      </aside>

      {/* Colonne droite — contenu */}
      <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
        {/* Barre d’actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm text-black hover:text-white  hover:bg-primary"
          >
            Ajouter
          </button>
        </div>

        {/* Messages succès / erreur */}
        <div className="h-6 flex justify-center">
          {addrAddOk      && <p className="text-green-500">{addrAddOk}</p>}
          {addrAddErr     && <p className="text-red-500">{addrAddErr}</p>}
          {addrUpdateOk   && <p className="text-green-500">{addrUpdateOk}</p>}
          {addrUpdateErr  && <p className="text-red-500">{addrUpdateErr}</p>}
        </div>

        {/* Tableau d’adresses */}
        <div className="flex-1 flex flex-col overflow-hidden ">
          {/* En‑tête fixe */}
          <table className="table-fixed w-full ">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-2 text-center w-[6%]">N°</th>
                <th className="py-2 text-center border-x-4  w-[10%]">Nom</th>
                <th className="py-2 text-center border-x-4 w-[25%]">
                  Adresse
                </th>
                <th className="py-2 text-center border-x-4 w-[12%]">Ville</th>
                <th className="py-2 text-center border-x-4 w-[12%]">Pays</th>
                <th className="py-2 text-center border-x-4 w-[14%]">
                  Code postal
                </th>
                <th className="py-2 text-center border-x-4 w-[14%]">
                  Gouvernorat
                </th>
                <th className="py-2 text-center w-[17%]">Action</th>
              </tr>
            </thead>
          </table>

          {/* Corps défilant */}
          <div className="relative flex-1 overflow-auto">
            <table className="table-fixed w-full">
              {addressesLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-6 text-center">
                      Chargement des adresses…
                    </td>
                  </tr>
                </tbody>
              ) : addressesError ? (
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-red-500">
                      {addressesError}
                    </td>
                  </tr>
                </tbody>
              ) : shown.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-600">
                      Aucune adresse trouvée.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200 [&>tr]:h-14">
                  {shown.map((addr, i) => (
                    <tr
                      key={addr._id}
                      className={i % 2 ? "bg-gray-100" : "bg-white"}
                    >
                      {/* N° d’adresse */}
                      <td className="text-center font-semibold w-[6%]">
                        {firstIndex + i + 1}
                      </td>

                      {/* Infos principales */}
                      <td className="text-center w-[10%]">
                        {addr.Name}
                      </td>
                      <td className=" text-center w-[25%]">
                        {addr.StreetAddress}
                      </td>
                      <td className="py-2 text-center w-[12%]">{addr.City}</td>
                      <td className="py-2 text-center w-[14%]">{addr.Country}</td>
                      <td className="py-2 text-center w-[14%]">{addr.PostalCode}</td>
                      <td className="py-2 text-center w-[10%]">
                        {addr.Province || "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-2 w-[17%]">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => setAddrEdit(addr)}
                            className="h-9 w-9 flex items-center justify-center border rounded text-secondary hover:bg-primary hover:text-white"
                            title="Modifier"
                          >
                            <FaPenToSquare size={16} />
                          </button>
                          <button
                            onClick={() => setAddrToDelete(addr)}
                            className="h-9 w-9 flex items-center justify-center border rounded text-secondary hover:bg-primary hover:text-white"
                            title="Supprimer"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* Pagination */}
        <PaginationClient
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal : Ajouter une adresse */}
      <AddAddress
        isFormVisible={isAddModalOpen}
        getAddress={onAddrAdded}
        toggleForminVisibility={() => setIsAddModalOpen(false)}
      />

      {/* Modal : Éditer une adresse */}
      {addrEdit && (
        <EditAddressModal
          isOpen={true}
          onClose={() => setAddrEdit(null)}
          address={addrEdit}
          onAddressUpdated={onAddrUpdated}
        />
      )}

      {/* Popup : Supprimer une adresse */}
      {addrToDelete && (
        <DeletePopup
          handleClosePopup={() => setAddrToDelete(null)}
          Delete={handleDeleteAddress}
          id={addrToDelete._id}
          name={addrToDelete.Name}
        />
      )}
    </section>
  );
}
