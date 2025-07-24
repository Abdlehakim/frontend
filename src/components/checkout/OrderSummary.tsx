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
  paymentMethod: string;      // holds the *id*
  deliveryMethod: string;     // holds the *id*
  deliveryCost: number;
  total: number;
  orderStatus: string;
}

/* helpers fetched from APIs */
interface DeliveryOption {
  id: string;
  name: string;
}
interface PaymentMethodApi {
  key: string;
  label: string;
}

/* ---------- component ---------- */
const OrderSummary: React.FC<{ data: string }> = ({ data }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* id ➜ name maps */
  const [deliveryMap, setDeliveryMap] = useState<Record<string, string>>({});
  const [paymentMap, setPaymentMap] = useState<Record<string, string>>({});

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

  /* fetch method/option labels once */
  useEffect(() => {
    (async () => {
      try {
        const deliveries = await fetchData<DeliveryOption[]>(
          "/checkout/delivery-options?limit=100"
        );
        setDeliveryMap(
          Object.fromEntries(deliveries.map((o) => [o.id, o.name]))
        );

        const payments = await fetchData<PaymentMethodApi[]>(
          "/checkout/payment-methods"
        );
        setPaymentMap(Object.fromEntries(payments.map((m) => [m.key, m.label])));
      } catch (err) {
        console.error("Error fetching option / method names:", err);
      }
    })();
  }, []);

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
  const fmt = (n: number) => n.toFixed(2) + " TND";
  const fullAddress = [
    order.address.Name,
    order.address.StreetAddress,
    [order.address.City, order.address.Province].filter(Boolean).join(", "),
    `${order.address.PostalCode} - ${order.address.Country}`,
  ]
    .filter(Boolean)
    .join(", ");

  /* ---------- JSX ---------- */
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 h-fit w-[50%] max-md:w-[90%]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-3xl max-md:text-lg font-bold text-green-500">
            Merci pour votre commande !
          </h2>
        </div>

        {/* Order summary */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-xl font-semibold mb-2 max-md:text-sm">Résumé de la commande</h3>
          <p className="text-gray-700 max-md:text-xs">
            Votre commande <span className="font-bold">#{order.ref}</span> a été
            réussie.
          </p>
          <div className="mt-4">
            <p className="text-base font-bold">
              Total : <span>{fmt(order.total)}</span>
            </p>
          </div>

          {/* Items */}
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">Article(s) :</p>
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
          <div className="mt-8 space-y-2 max-md:text-xs border-t border-gray-300 pt-4">
            <p className="text-gray-700">
              Mode de paiement :{" "}
              <span className="font-bold">
                {paymentMap[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </p>
            <p className="text-gray-700">
              Méthode de livraison :{" "}
              <span className="font-bold">
                {deliveryMap[order.deliveryMethod] ?? order.deliveryMethod}
              </span>
            </p>
            <p className="text-gray-700">
              Adresse de livraison:{" "}
              <span className="font-bold">{fullAddress}</span>
            </p>
            
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 border-t border-gray-300 mt-4 pt-4">
          <button
            onClick={() => router.push("/")}
            className="mt-2 w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white  hover:bg-primary"
          >
            Accueil
          </button>
          <button
            onClick={() => router.push("/orderhistory")}
            className="mt-2 w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white  hover:bg-primary max-md:text-xs"
          >
            Suivre ma commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
