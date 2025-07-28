"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { fetchData } from "@/lib/fetchData";

/* ---------- skeleton ---------- */
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ---------- types ---------- */
interface OrderItem {
  _id: string;
  reference: string;
  name: string;
  tva: number;
  discount: number;
  quantity: number;
  mainImageUrl: string;
  price: number;
}

interface Order {
  ref: string;
  // DeliveryAddress array contains formatted address strings
  DeliveryAddress: Array<{ DeliverToAddress: string }>;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryMethod: string;
  deliveryCost: number;
  orderStatus: string;
  createdAt: string;
}

/* ---------- format date/currency ---------- */
const frDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmt = (n: number) => n.toFixed(2) + " TND";

/* ---------- component ---------- */
export default function OrderByRef() {
  const router = useRouter();
  const { orderRef } = useParams() as { orderRef: string };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* fetch order once */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchData<Order>(
          `/client/order/getOrderByRef/${orderRef}`,
          { credentials: "include" }
        );
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderRef]);

  /* download PDF */
  const telechargerPDF = useCallback(() => {
    const el = document.getElementById("invoice-card");
    if (!el) return;
    html2canvas(el).then((canvas) => {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const imgW = 210;
      const imgH = (canvas.height * imgW) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgW, imgH);
      pdf.save(`FACTURE-${order?.ref.replace("ORDER-", "")}.pdf`);
    });
  }, [order]);

  if (loading) {
    return (
      <Skel className="bg-gray-100 border border-gray-200 rounded-xl p-6 h-[632px]" />
    );
  }

  if (!order) return <p className="pt-16 text-center">Aucune commande trouvée.</p>;

  /* compute totals */
  const itemsTotal = order.orderItems.reduce((sum, it) => {
    const ttc = it.discount
      ? (it.price * (100 - it.discount)) / 100
      : it.price;
    return sum + ttc * it.quantity;
  }, 0);
  const computedTotal = itemsTotal + order.deliveryCost;

  /* formatted delivery address */
  const deliverAddress = order.DeliveryAddress[0]?.DeliverToAddress || "—";

  return (
    <div className="w-[90%] md:w-[70%] mx-auto pt-16">
      <div
        id="invoice-card"
        className="bg-gray-100 border border-gray-200 rounded-xl p-6 space-y-6 max-md:p-2"
      >
        {/* header */}
        <div className="md:flex md:divide-x divide-gray-200 text-center md:text-left">
          <div className="flex-1 pb-4 md:pb-0 space-y-1">
            <p className="text-xs text-gray-400">N° de commande</p>
            <p className="text-sm font-medium">#{order.ref.replace("ORDER-", "")}</p>
          </div>
          <div className="flex-1 pb-4 md:pb-0 md:pl-6 space-y-1">
            <p className="text-xs text-gray-400">Date de commande</p>
            <p className="text-sm">{frDate(order.createdAt)}</p>
          </div>
          <div className="flex-1 pb-4 md:pb-0 md:pl-6 space-y-1">
            <p className="text-xs text-gray-400">Méthode de livraison</p>
            <p className="text-sm">{order.deliveryMethod}</p>
          </div>
          <div className="flex-1 pb-4 md:pb-0 md:pl-6 space-y-1">
            <p className="text-xs text-gray-400">Moyen de paiement</p>
            <p className="text-sm">{order.paymentMethod}</p>
          </div>
          <div className="flex-1 md:pl-6 space-y-1">
            <p className="text-xs text-gray-400">Adresse de livraison</p>
            <p className="text-sm">{deliverAddress}</p>
          </div>
        </div>

        <hr className="border-2" />

        {/* items */}
        <div className="relative">
          <span
            aria-hidden
            className="hidden sm:block absolute inset-y-0 left-1/2 w-px bg-gray-200"
          />
          <div className="h-[420px] overflow-y-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-x-12">
              {order.orderItems.map((it) => {
                const unit =
                  it.discount > 0
                    ? it.price - (it.price * it.discount) / 100
                    : it.price;
                const lineTotal = unit * it.quantity;
                return (
                  <div
                    key={it._id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-lg">
                      <Image
                        src={it.mainImageUrl || "/placeholder.png"}
                        alt={it.name}
                        className="object-cover"
                        fill
                        priority
                        loading="eager"
                        sizes="(max-width: 768px) 100vw,
                               (max-width: 1280px) 100vw,
                               1280px"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
                      />
                    </div>
                    <div className="flex-1 max-md:text-xs">
                      <h4 className="font-semibold">{it.name}</h4>
                      <p className="text-sm text-gray-500 max-md:text-xs">
                        Réf :&nbsp;{it.reference}
                      </p>
                      <p className="text-sm text-gray-500 max-md:text-xs">
                        Quantité :&nbsp;{it.quantity}
                      </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap max-md:text-xs">
                      {fmt(lineTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="border-2" />

        {/* total including delivery */}
        <div className="flex justify-between flex-wrap items-center max-md:justify-center">
          <p className="text-gray-500 font-medium">
            Montant total :&nbsp;
            <span className="text-black font-semibold">
              {fmt(computedTotal)}
            </span>
          </p>
        </div>
      </div>

      {/* actions */}
      {!loading && order && (
        <div className="flex justify-between mt-4 gap-4">
          <button
            onClick={() => router.back()}
            className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full text-center"
          >
            Retour
          </button>
          <button
            onClick={telechargerPDF}
            className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full text-center flex gap-4 justify-center"
          >
            <FiDownload /> Télécharger la facture
          </button>
        </div>
      )}
    </div>
  );
}
