"use client";

import React, { Key, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";

/* ---------- types ---------- */
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
  DeliveryAddress: Array<{ DeliverToAddress: string }>;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryMethod: string;
  deliveryCost: number;
  orderStatus: string;
}

const OrderSummary: React.FC<{ data: string }> = ({ data }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* fetch order once */
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LoadingDots />
      </div>
    );
  }

  if (!order) return <div>Order data not found.</div>;

  // Formatter
  const fmt = (n: number) => n.toFixed(2) + " TND";

  // Compute items total
  const itemsTotal = order.orderItems.reduce((sum, item) => {
    const ttc = item.discount
      ? (item.price * (100 - item.discount)) / 100
      : item.price;
    return sum + ttc * item.quantity;
  }, 0);

  // Add deliveryCost
  const computedTotal = itemsTotal + order.deliveryCost;

  // Delivery address string
  const deliverAddress = order.DeliveryAddress[0]?.DeliverToAddress || "";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[50%] max-md:w-[90%]">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <h2 className="text-3xl max-md:text-lg font-bold text-green-500">
            Merci pour votre commande !
          </h2>
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-300 pt-4">
          <p className="text-gray-700 max-md:text-xs">
            Votre commande <span className="font-bold">#{order.ref}</span> a été
            réussie.
          </p>
          <div className="mt-4">
            <p className="text-base font-bold">
              Total : <span>{fmt(computedTotal)}</span>
            </p>
          </div>

          {/* Items */}
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">Article(s) :</p>
            <div className="flex flex-col divide-y divide-gray-200">
              {order.orderItems.length > 0 ? (
                order.orderItems.map((item) => {
                  const unit =
                    item.discount > 0
                      ? item.price - (item.price * item.discount) / 100
                      : item.price;
                  const lineTotal = unit * item.quantity;
                  return (
                    <div
                      key={item._id}
                      className="py-4 flex max-md:flex-col justify-between items-center"
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
                            {fmt(unit)} {item.discount > 0 && "(Remisé)"}
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
          <div className="mt-4 space-y-2 max-md:text-xs border-t border-gray-300 pt-4">
            <p className="font-bold">
              Mode de paiement :{" "}
              <span className="font-normal text-gray-700">
                {order.paymentMethod}
              </span>
            </p>
            <p className="font-bold">
              Méthode de livraison :{" "}
              <span className="font-normal text-gray-700">
                {order.deliveryMethod} ({fmt(order.deliveryCost)})
              </span>
            </p>
            <p className="font-bold">
              Adresse de livraison :{" "}
              <span className="font-normal text-gray-700">
                {deliverAddress}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 border-t border-gray-300 mt-4 pt-4">
          <button
            onClick={() => router.push("/")}
            className="mt-2 w-full rounded-md border border-gray-300 px-2 py-2 text-sm hover:bg-primary hover:text-white"
          >
            Accueil
          </button>
          <button
            onClick={() => router.push("/orderhistory")}
            className="mt-2 w-full rounded-md border border-gray-300 px-2 py-2 text-sm hover:bg-primary hover:text-white max-md:text-xs"
          >
            Suivre ma commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
