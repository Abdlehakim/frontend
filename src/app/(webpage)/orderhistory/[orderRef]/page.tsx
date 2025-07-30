// src/app/order/[orderRef]/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";
import { fetchData } from "@/lib/fetchData";
import InvoiceProforma from "@/components/InvoiceProforma";
import { useCurrency } from "@/contexts/CurrencyContext";   // ← added

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
  DeliveryAddress: Array<{ DeliverToAddress: string }>;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryMethod: string;
  deliveryCost: number;
  orderStatus: string;
  createdAt: string;
}

interface LogoData {
  name: string;
  logoImageUrl: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  zipcode: number;
}

/* ---------- helpers ---------- */
const frDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ---------- component ---------- */
export default function OrderByRef() {
  const router = useRouter();
  const { orderRef } = useParams() as { orderRef: string };
  const { fmt } = useCurrency();                      // ← added

  const [order, setOrder] = useState<Order | null>(null);
  const [company, setCompany] = useState<LogoData | null>(null);
  const [loading, setLoading] = useState(true);

  /* fetch order + header data */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [orderData, headerData] = await Promise.all([
          fetchData<Order>(`/client/order/getOrderByRef/${orderRef}`, {
            credentials: "include",
          }),
          fetchData<LogoData>("/website/header/getHeaderData"),
        ]);
        setOrder(orderData);
        setCompany(headerData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderRef]);

  /* download PDF */
  const telechargerPDF = useCallback(async () => {
    const el = document.getElementById("invoice-to-download");
    if (!el) return;
    await new Promise((r) => setTimeout(r, 500));
    const canvas = await html2canvas(el, { useCORS: true });
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const imgW = 210;
    const imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgW, imgH);
    pdf.save(`FACTURE-${order?.ref.replace("ORDER-", "")}.pdf`);
  }, [order]);

  /* ---------- loading / error states ---------- */
  if (loading) {
    return (
      <div className="w-[90%] md:w-[70%] mx-auto pt-16">
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 h-[632px] animate-pulse" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="w-[90%] md:w-[70%] mx-auto pt-16">
        <p className="text-center">Aucune commande trouvée.</p>
      </div>
    );
  }

  /* ---------- totals & helpers ---------- */
  const itemsTotal = order.orderItems.reduce((sum, it) => {
    const unit =
      it.discount > 0
        ? (it.price * (100 - it.discount)) / 100
        : it.price;
    return sum + unit * it.quantity;
  }, 0);
  const computedTotal = itemsTotal + order.deliveryCost;
  const deliverAddress =
    order.DeliveryAddress[0]?.DeliverToAddress || "—";

  /* ---------- render ---------- */
  return (
    <div className="w-[90%] md:w-[70%] mx-auto pt-16">
      {/* on‑screen invoice */}
      <div
        id="invoice-card"
        className="bg-gray-100 border border-gray-200 rounded-xl p-6 space-y-6 max-md:p-2"
      >
        {/* meta */}
        <div className="md:flex md:divide-x divide-gray-200 text-center md:text-left">
          {([
            ["N° de commande", `#${order.ref.replace("ORDER-", "")}`],
            ["Date de commande", frDate(order.createdAt)],
            ["Méthode de livraison", order.deliveryMethod],
            ["Moyen de paiement", order.paymentMethod],
            ["Adresse de livraison", deliverAddress],
          ] as const).map(([label, value]) => (
            <div
              key={label}
              className="flex-1 pb-4 md:pb-0 md:pl-6 space-y-1"
            >
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
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
                    ? (it.price * (100 - it.discount)) / 100
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
                        fill
                        className="object-cover rounded"
                        priority
                        sizes="(max-width: 768px) 100vw, 1280px"
                        quality={75}
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

        {/* total */}
        <div className="flex justify-between flex-wrap items-center max-md:justify-center">
          <p className="text-gray-500 font-medium">
            Montant total :&nbsp;
            <span className="text-black font-semibold">
              {fmt(computedTotal)}
            </span>
          </p>
        </div>
      </div>

      {/* hidden invoice for PDF generation */}
      {company && (
        <div
          id="invoice-to-download"
          style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        >
          <InvoiceProforma order={order} company={company} />
        </div>
      )}

      {/* actions */}
      <div className="flex justify-between mt-4 gap-4">
        <button
          onClick={() => router.back()}
          className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full"
        >
          Retour
        </button>
        <button
          onClick={telechargerPDF}
          className="mt-2 rounded-md border border-gray-300 px-2 py-2 text-sm text-black hover:text-white hover:bg-primary max-md:text-xs max-md:w-full flex items-center justify-center gap-2"
        >
          <FiDownload /> Télécharger la facture
        </button>
      </div>
    </div>
  );
}
