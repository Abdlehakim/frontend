/* ------------------------------------------------------------------
   src/app/(client)/orderhistory/page.tsx
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Pagination from "@/components/PaginationClient";
import { fetchData } from "@/lib/fetchData";

/* ---------- tiny skeleton helper ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- modèles de données ---------- */
interface Order {
  _id: string;
  ref: string;
  paymentMethod: string;      // clé (ex. « stripe »)
  deliveryMethod: string;     // id  (ex. « 68750d59… »)
  total: number;
  createdAt: string;
}

interface DeliveryOption    { id?: string; _id?: string; name: string }
interface PaymentMethodApi { key?: string; id?: string; label?: string; name?: string }

/* ---------- composant ---------- */
export default function OrderHistory() {
  const router                       = useRouter();
  const { isAuthenticated, loading } = useAuth();

  /* commandes */
  const [orders, setOrders]               = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError]     = useState("");

  /* correspondances noms */
  const [deliveryMap, setDeliveryMap] = useState<Record<string, string>>({});
  const [paymentMap,  setPaymentMap]  = useState<Record<string, string>>({});

  /* pagination */
  const PAR_PAGE                        = 5;
  const [courante, setCourante]         = useState(1);
  const [pages, setPages]               = useState(1);

  /* ────────────────────────────────────────────────────────── */
  /* 1) redirection si non authentifié                         */
  /* ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/signin");
  }, [loading, isAuthenticated, router]);

  /* ────────────────────────────────────────────────────────── */
  /* 2) récupération des commandes                             */
  /* ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchData<Order[]>(
          "/client/order/getOrdersByClient",
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        setOrders(data);
        setPages(Math.ceil(data.length / PAR_PAGE));
      } catch (err: unknown) {
        setOrdersError(
          err instanceof Error ? err.message : "Erreur inattendue."
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    if (!loading && isAuthenticated) fetchOrders();
  }, [loading, isAuthenticated]);

  /* ────────────────────────────────────────────────────────── */
  /* 3) récupération des libellés (mêmes sources qu’OrderSummary) */
  /* ────────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [deliveries, payments] = await Promise.all([
          fetchData<DeliveryOption[]>("/checkout/delivery-options?limit=100"),
          fetchData<PaymentMethodApi[]>("/checkout/payment-methods"),
        ]);

        const dMap: Record<string, string> = {};
        deliveries.forEach((d) => {
          const key = d.id ?? d._id;
          if (key) dMap[key] = d.name;
        });

        const pMap: Record<string, string> = {};
        payments.forEach((p) => {
          const key   = p.key ?? p.id;
          const label = p.label ?? p.name;
          if (key && label) pMap[key] = label;
        });

        setDeliveryMap(dMap);
        setPaymentMap(pMap);
      } catch (err) {
        console.error("Erreur lors du chargement des libellés :", err);
      }
    })();
  }, []);

  /* ────────────────────────────────────────────────────────── */
  /* fonctions utilitaires                                     */
  /* ────────────────────────────────────────────────────────── */
  const dateFr = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const tronque = () => {
    const start = (courante - 1) * PAR_PAGE;
    return orders.slice(start, start + PAR_PAGE);
  };

  /* ────────────────────────────────────────────────────────── */
  /* rendu                                                     */
  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="w-[80%] mx-auto flex flex-col lg:flex-row gap-10 border-b-2 py-10">
      {/* bloc principal */}
      <div className="w-full max-lg:w-[95%] rounded-lg p-4 flex flex-col justify-between gap-6 h-[70vh] max-md:h-fit">
          <div className="flex flex-col gap-4">
        <aside className="space-y-2">
          <h1 className="text-lg font-semibold text-black">Historique des commandes</h1>
          <p className="text-sm text-gray-400">
            Suivez l’état de vos commandes récentes, gérez les retours et téléchargez vos factures.
          </p>
        </aside>

        {ordersLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skel key={i} className="w-full h-20 max-md:h-96" />
            ))}
          </div>
        ) : ordersError ? (
          <p className="text-red-500">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <>
          
            {tronque().map((o) => (
              <div key={o._id} className="flex flex-col gap-4 ">
                <div className="bg-gray-100 rounded-lg p-6 flex justify-between items-center gap-4 max-md:flex-col max-md:items-start h-20 max-md:h-96">
                  {/* colonne date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Date</span>
                    <span>{dateFr(o.createdAt)}</span>
                  </div>

                  {/* colonne référence */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Commande n°</span>
                    <span>{o.ref}</span>
                  </div>

                  {/* colonne livraison */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Méthode de livraison</span>
                    <span>
                      {deliveryMap[o.deliveryMethod] ?? o.deliveryMethod}
                    </span>
                  </div>

                  {/* colonne paiement */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Moyen de paiement</span>
                    <span>{paymentMap[o.paymentMethod] ?? o.paymentMethod}</span>
                  </div>

                  {/* colonne total */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Total</span>
                    <span>{o.total.toFixed(2)} TND</span>
                  </div>

                  {/* action */}
                  <Link
                    href={`/orderhistory/${o.ref}`}
                    className="mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full text-center"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}

            
            
          </>
        )}
</div>
        {pages > 1 && (
              <Pagination
                currentPage={courante}
                totalPages={pages}
                onPageChange={setCourante}
              /> )}
      </div>
    </div>
  );
}