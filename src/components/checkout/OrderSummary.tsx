/* ------------------------------------------------------------------
   src/components/checkout/OrderSummary.tsx
   (mainImageUrl everywhere, fetchData helper intact)
------------------------------------------------------------------ */
"use client";

import React, { Key, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";

/* ---------- types ---------- */
interface Address {
  _id: string;
  Name: string;
  StreetAddress: string;
  Country: string;
  Province?: string;
  City: string;
  PostalCode: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderItem {
  _id: Key | null | undefined;
  product: string;
  name: string;
  quantity: number;
  mainImageUrl: string;
  discount: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  ref: string;
  address: Address;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryMethod: string;
  deliveryCost: number;
  total: number;
  orderStatus: string;
}

interface OrderSummaryProps {
  data: string; // order reference
}

/* ---------- component ---------- */
const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* fetch once on mount */
  useEffect(() => {
    (async () => {
      try {
        const fetched = await fetchData<Order>(
          `/client/order/getOrderByRef/${data}`,
          { method: "GET", credentials: "include" }
        );
        setOrder(fetched);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [data]);

  /* loading overlay */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LoadingDots />
      </div>
    );
  }

  if (!order) return <div>Order data not found.</div>;

  /* ---------- helpers ---------- */
  const fmt = (n: number) => n.toFixed(2) + " TND";

  /* ---------- JSX ---------- */
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 h-fit w-[50%]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-3xl font-bold text-green-500">
            Merci pour votre commande !
          </h2>
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-xl font-semibold mb-2">Résumé de la commande</h3>
          <p className="text-gray-700">
            Votre commande <span className="font-bold">#{order.ref}</span> a été réussie.
          </p>
          <div className="mt-4">
            <p className="text-base font-bold">
              Total : <span>{fmt(order.total)}</span>
            </p>
          </div>

          {/* Items */}
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">Article(s) :</p>
            <div className="flex flex-col divide-y divide-gray-200">
              {order.orderItems.length ? (
                order.orderItems.map((item) => {
                  const unit =
                    item.discount > 0
                      ? item.price - (item.price * item.discount) / 100
                      : item.price;
                  const lineTotal = unit * item.quantity;
                  return (
                    <div
                      key={item._id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.mainImageUrl || "/placeholder.png"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg"
                        />
                        <div>
                          <p className="text-lg font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {fmt(unit)}{" "}
                            {item.discount > 0 && "(Remisé)"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantité : {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold">{fmt(lineTotal)}</p>
                    </div>
                  );
                })
              ) : (
                <p>Aucun article trouvé</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-8 space-y-2">
            <p className="text-gray-700">
              Mode de paiement :{" "}
              <span className="font-bold">{order.paymentMethod}</span>
            </p>
            <p className="text-gray-700">
              Méthode de livraison :{" "}
              <span className="font-bold uppercase">
                {order.deliveryMethod}
              </span>
            </p>
            <h3 className="text-gray-700 uppercase font-bold mt-6 mb-2">
              Adresse de livraison
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {order.address.Name}
              {"\n"}
              {order.address.StreetAddress}
              {"\n"}
              {order.address.City}
              {order.address.Province ? `, ${order.address.Province}` : ""}
              {"\n"}
              {order.address.PostalCode} - {order.address.Country}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push("/")}
            className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2 text-black"
          >
            Accueil
          </button>
          <button
            onClick={() => router.push("/orderhistory")}
            className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2 text-black"
          >
            Suivre ma commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
