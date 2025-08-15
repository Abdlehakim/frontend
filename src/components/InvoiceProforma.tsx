// src/components/InvoiceProforma.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ---------- types ---------- */
interface OrderItem {
  _id: string;
  reference: string;
  name: string;
  tva: number;      // TVA percentage (e.g. 19 for 19 %)
  discount: number; // percentage discount applied on TTC price
  quantity: number;
  mainImageUrl: string;
  price: number;    // **TTC price (already includes TVA)**
}

type PaymentMethodUnion =
  | string
  | Array<{
      PaymentMethodLabel: string;
    }>;

type DeliveryMethodUnion =
  | string
  | Array<{
      deliveryMethodID?: string;
      deliveryMethodName?: string;
      Cost: string | number;
      expectedDeliveryDate?: string | Date;
    }>;

interface InvoiceProformaProps {
  order: {
    ref: string;
    DeliveryAddress: { DeliverToAddress: string }[];
    pickupMagasin?: { MagasinAddress: string; MagasinName?: string }[];
    orderItems: OrderItem[];
    paymentMethod: PaymentMethodUnion;
    deliveryMethod: DeliveryMethodUnion;
    deliveryCost?: number; // legacy
    createdAt: string;
  };
  company: {
    name: string;
    logoImageUrl: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
    zipcode: number;
  };
}

/* ---------- helpers ---------- */
const InlineOrImg: React.FC<{ url: string; className?: string; alt?: string }> = ({
  url,
  className,
  alt,
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  const isSvg = /\.svg($|\?)/i.test(url);

  useEffect(() => {
    if (!isSvg) return;
    let canceled = false;

    fetch(url)
      .then((r) => r.text())
      .then((txt) => {
        if (canceled) return;
        const cleaned = txt
          .replace(/(fill|stroke)="[^"]*"/gi, "")
          .replace(/(width|height)="[^"]*"/gi, "")
          .replace(
            /<svg([^>]*)>/i,
            `<svg$1 class="fill-current stroke-current w-full h-full">`
          );
        setSvg(cleaned);
      })
      .catch(() => {});

    return () => {
      canceled = true;
    };
  }, [url, isSvg]);

  if (isSvg && svg) {
    return (
      <span
        className={className}
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt || ""}
      unoptimized
      width={298}
      height={64}
      className={className}
    />
  );
};

const frDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\s/g, "");

/* ---------- component ---------- */
export default function InvoiceProforma({ order, company }: InvoiceProformaProps) {
  const { fmt } = useCurrency();

  const isPickup = (order.pickupMagasin?.length ?? 0) > 0;
  const billingAndDeliveryAddress = isPickup
    ? order.pickupMagasin?.[0]?.MagasinAddress || "—"
    : order.DeliveryAddress[0]?.DeliverToAddress || "—";

  // Normalize payment method(s)
  const paymentMethodText =
    typeof order.paymentMethod === "string"
      ? order.paymentMethod
      : order.paymentMethod.map((p) => p.PaymentMethodLabel).filter(Boolean).join(", ");

  // Normalize delivery method(s) and cost
  const dmArray = Array.isArray(order.deliveryMethod) ? order.deliveryMethod : [];
  const deliveryMethodText =
    dmArray.length > 0
      ? dmArray.map((d) => d.deliveryMethodName || "—").filter(Boolean).join(", ")
      : typeof order.deliveryMethod === "string"
      ? order.deliveryMethod
      : "—";

  const deliveryCostFromDM = dmArray.reduce((sum, d) => {
    const v = typeof d.Cost === "number" ? d.Cost : parseFloat(String(d.Cost || 0));
    return sum + (Number.isFinite(v) ? v : 0);
  }, 0);

  const shippingCost =
    typeof order.deliveryCost === "number" ? order.deliveryCost : deliveryCostFromDM;

  // Expected dates (skip if pickup)
  const expectedDates: string[] =
    isPickup
      ? []
      : dmArray
          .map((d) => d.expectedDeliveryDate)
          .filter((v): v is string | Date => Boolean(v))
          .map((v) => new Date(v as string).toLocaleDateString("fr-FR"));

  /* ----- per-item + global totals ----- */
  const lines = order.orderItems.map((it) => {
    // 1. TTC after discount
    const unitTTC = it.discount > 0 ? (it.price * (100 - it.discount)) / 100 : it.price;
    // 2. HT
    const unitHT = unitTTC / (1 + it.tva / 100);
    // 3. Lines
    const lineHT = unitHT * it.quantity;
    const lineTTC = unitTTC * it.quantity;
    const lineTVA = lineTTC - lineHT;
    return { ...it, unitHT, lineHT, lineTVA, lineTTC };
  });

  const totalHT = lines.reduce((s, l) => s + l.lineHT, 0);
  const totalTVA = lines.reduce((s, l) => s + l.lineTVA, 0);
  const totalTTC = lines.reduce((s, l) => s + l.lineTTC, 0) + shippingCost;

  return (
    <div
      className="bg-white rounded-xl p-6 space-y-6"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-black">Facture</h1>
        <div className="text-[#15335e] w-[298px] h-[64px]">
          <InlineOrImg
            url={company.logoImageUrl}
            alt={`${company.name} logo`}
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="h-0.5 bg-teal-400" />

      {/* ---------- Company & Invoice Meta ---------- */}
      <div className="grid md:grid-cols-2 gap-10 text-sm">
        {/* Company info + meta */}
        <div className="space-y-4">
          <div className="space-y-1 pb-4">
            <p className="font-semibold uppercase">{company.name}</p>
            <p>{company.address}</p>
            <p>
              {company.city} {company.zipcode}, {company.governorate}
            </p>
            <p className="italic">Téléphone : {company.phone}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span>Date :</span>
              <span className="font-medium">{frDate(order.createdAt)}</span>

              <span>N° de facture :</span>
              <span className="font-medium">{order.ref}</span>

              <span>Mode(s) de livraison :</span>
              <span className="font-medium">{deliveryMethodText}</span>

              <span>Frais de livraison :</span>
              <span className="font-medium">{fmt(shippingCost)}</span>

              <span>Moyen(s) de paiement :</span>
              <span className="font-medium">{paymentMethodText}</span>

              {!isPickup && expectedDates.length > 0 && (
                <>
                  <span>Date(s) de livraison prévue(s) :</span>
                  <span className="font-medium">
                    {expectedDates
                      .map((d, i) => {
                        const name = dmArray[i]?.deliveryMethodName;
                        return name ? `${name}: ${d}` : d;
                      })
                      .join(" • ")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-6 text-sm">
          <div>
            <p className="font-semibold">Adresse de facturation</p>
            <p className="whitespace-pre-line">{billingAndDeliveryAddress}</p>
          </div>
          <div>
            <p className="font-semibold">Adresse de livraison</p>
            <p className="whitespace-pre-line">{billingAndDeliveryAddress}</p>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-teal-400" />

      {/* ---------- Items Table ---------- */}
      <div className="overflow-x-auto text-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-teal-400">
              {["Description", "Quantité", "Prix unitaire HT", "% TVA", "Total TVA", "Total TTC"].map(
                (h) => (
                  <th key={h} className="py-2 text-center">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="py-2 text-center">{l.name}</td>
                <td className="py-2 text-center">{l.quantity}</td>
                <td className="py-2 text-center">{fmt(l.unitHT)}</td>
                <td className="py-2 text-center">{l.tva} %</td>
                <td className="py-2 text-center">{fmt(l.lineTVA)}</td>
                <td className="py-2 text-center">{fmt(l.lineTTC)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Totals ---------- */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Total HT</span>
            <span>{fmt(totalHT)}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Total TVA</span>
            <span>{fmt(totalTVA)}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Frais de livraison</span>
            <span className="text-black">{fmt(shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-1">
            <span>Total TTC</span>
            <span className="text-black">{fmt(totalTTC)}</span>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-teal-400" />
    </div>
  );
}
