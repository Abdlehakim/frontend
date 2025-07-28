// src/components/InvoiceProforma.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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

interface InvoiceProformaProps {
  order: {
    ref: string;
    DeliveryAddress: { DeliverToAddress: string }[];
    orderItems: OrderItem[];
    paymentMethod: string;
    deliveryMethod: string;
    deliveryCost: number;
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

// renders inline SVG if .svg, otherwise falls back to <Image>
const InlineOrImg: React.FC<{
  url: string;
  className?: string;
  alt?: string;
}> = ({ url, className, alt }) => {
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

const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " TND";

export default function InvoiceProforma({
  order,
  company,
}: InvoiceProformaProps) {
  const billingAndDeliveryAddress =
    order.DeliveryAddress[0]?.DeliverToAddress || "—";

  const totalHT = order.orderItems.reduce((sum, it) => {
    const unit = it.discount
      ? (it.price * (100 - it.discount)) / 100
      : it.price;
    return sum + unit * it.quantity;
  }, 0);

  const totalTVA = order.orderItems.reduce((sum, it) => {
    const unit = it.discount
      ? (it.price * (100 - it.discount)) / 100
      : it.price;
    return sum + (unit * it.quantity * it.tva) / 100;
  }, 0);

  const totalTTC = totalHT + totalTVA + order.deliveryCost;

  return (
    <div
      className="bg-white rounded-xl p-6 space-y-6"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      {/* Header */}
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

      {/* Company & Invoice Meta */}
      <div className="grid md:grid-cols-2 gap-10 text-sm">
        {/* Company info */}
        <div className="space-y-4">
          <div className="space-y-1 pb-4">
            <p className="font-semibold">{company.name}</p>
            <p>{company.address}</p>
            <p>
              {company.city} {company.zipcode}, {company.governorate}
            </p>
            <p className="italic">Téléphone : {company.phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-2">
              <span>Date :</span>
              <span className="font-medium">
                {frDate(order.createdAt)}
              </span>
              <span>N° de facture :</span>
              <span className="font-medium">{order.ref}</span>
              <span>Mode de livraison :</span>
              <span className="font-medium">
                {order.deliveryMethod}
              </span>
              <span>Moyen de paiement :</span>
              <span className="font-medium">
                {order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-6 text-sm">
          <div>
            <p className="font-semibold">Adresse de facturation</p>
            <p className="whitespace-pre-line">
              {billingAndDeliveryAddress}
            </p>
          </div>
          <div>
            <p className="font-semibold">Adresse de livraison</p>
            <p className="whitespace-pre-line">
              {billingAndDeliveryAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-teal-400" />

      {/* Items Table */}
      <div className="overflow-x-auto text-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-teal-400">
              {[
                "Description",
                "Quantité",
                "Prix unitaire HT",
                "% TVA",
                "Total TVA",
                "Total TTC",
              ].map((h) => (
                <th key={h} className="py-2 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((it) => {
              const unit =
                it.discount > 0
                  ? (it.price * (100 - it.discount)) / 100
                  : it.price;
              const lineHT = unit * it.quantity;
              const lineTVA = (lineHT * it.tva) / 100;
              const lineTTC = lineHT + lineTVA;
              return (
                <tr key={it._id} className="border-b">
                  <td className="py-2 text-center">{it.name}</td>
                  <td className="py-2 text-center">{it.quantity}</td>
                  <td className="py-2 text-center">{fmt(unit)}</td>
                  <td className="py-2 text-center">{it.tva} %</td>
                  <td className="py-2 text-center">{fmt(lineTVA)}</td>
                  <td className="py-2 text-center">{fmt(lineTTC)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
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
