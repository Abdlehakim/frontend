/* ------------------------------------------------------------------
   src/app/order/[orderRef]/page.tsx   (client component)
------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Breadcrumb from "@/components/order/Breadcrumb";
import { fetchData } from "@/lib/fetchData";

/* ---------- interfaces ---------- */
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
  _id: string;
  reference: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  mainImageUrl: string;
  discount: number;
  price: number;
}

interface User {
  username: string;
  phone: number;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryCost: number;
  total: number;
  orderStatus: string;
  statustimbre: boolean;
  createdAt: string;
}

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
          { method: "GET", credentials: "include" }
        );
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderRef]);

  /* ---------- pdf helpers ---------- */
  const generatePDF = (openInNewTab = false) => {
    const el = document.getElementById("invoice-content");
    if (!el) return;

    html2canvas(el).then((canvas) => {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgW = 210;
      const imgH = (canvas.height * imgW) / canvas.width;
      const pages = Math.ceil(imgH / 297);

      for (let i = 0; i < pages; i++) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, -i * 297, imgW, imgH);
        if (i < pages - 1) pdf.addPage();
      }

      if (openInNewTab) {
        window.open(URL.createObjectURL(pdf.output("blob")));
      } else {
        pdf.save(`INVOICE-${order?.ref.replace("ORDER-", "")}.pdf`);
      }
    });
  };

  const handleDownloadPDF = () => generatePDF(false);
  const handlePrint = () => generatePDF(true);

  /* ---------- loading & error ---------- */
  if (loading) return <div>Loading…</div>;
  if (!order) return <div>No order found.</div>;

  /* ---------- jsx ---------- */
  return (
    <div className="w-[90%] md:w-[70%] mx-auto pt-16">
      <Breadcrumb
        homeElement="Home"
        separator={<MdOutlineArrowForwardIos size={13} className="mt-1.5" />}
        containerClasses="flex gap-1 text-gray-500"
        activeClasses="uppercase underline font-semibold text-black"
        capitalizeLinks
      />

      {/* invoice wrapper */}
      <div id="invoice-content" className="flex flex-col gap-12 pt-10">
        {/* order ref */}
        <h2 className="text-5xl font-semibold text-center">{order.ref}</h2>

        {/* headers */}
        <div className="lg:flex w-full gap-2">
          {/* recipient */}
          <div className="border border-gray-200 p-2 rounded-md w-full">
            <h3 className="text-lg font-semibold mb-1">DESTINATAIRE:</h3>
            <dl className="flex gap-4">
              <div className="font-semibold space-y-1">
                <dt>Nom:</dt>
                <dt>Rue:</dt>
                <dt>Pays:</dt>
                <dt>Province:</dt>
                <dt>Ville:</dt>
                <dt>Code Postal:</dt>
              </div>
              <div className="text-gray-500 space-y-1">
                <dd>{order.address.Name}</dd>
                <dd>{order.address.StreetAddress}</dd>
                <dd>{order.address.Country}</dd>
                <dd>{order.address.Province ?? "-"}</dd>
                <dd>{order.address.City}</dd>
                <dd>{order.address.PostalCode}</dd>
              </div>
            </dl>
          </div>

          {/* order meta */}
          <div className="border border-gray-200 p-2 rounded-md w-full space-y-1">
            <h3 className="text-lg font-semibold mb-1">ORDER DETAILS:</h3>
            <dl className="flex gap-4">
              <div className="font-semibold space-y-1">
                <dt>Date:</dt>
                <dt>Payment:</dt>
                <dt>Delivery Cost:</dt>
                <dt>Status:</dt>
              </div>
              <div className="text-gray-500 space-y-1">
                <dd>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </dd>
                <dd>{order.paymentMethod}</dd>
                <dd>{order.deliveryCost.toFixed(3)} TND</dd>
                <dd>{order.orderStatus}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* items table */}
        <section className="space-y-4">
          <h3 className="text-4xl font-bold">Products</h3>
          <div className="text-center space-y-4">
            <hr />
            <div className="flex justify-between lg:px-32 font-bold uppercase">
              <span>Image</span>
              <span>Ref</span>
              <span>Name</span>
              <span>Qty</span>
              <span>Prix Tot</span>
            </div>
            <hr />

            {order.orderItems.map((item) => (
              <div key={item._id} className="flex justify-between lg:px-32">
                <Image
                  src={item.mainImageUrl || "/placeholder.png"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <span>{item.reference}</span>
                <span>{item.name}</span>
                <span>{item.quantity}</span>
                <span>
                  {(item.price / (1 + item.tva / 100)).toFixed(3)} TND
                </span>
              </div>
            ))}

            <hr />
            <div className="flex justify-end gap-4 text-xl font-bold">
              <span>Total Price:</span>
              <span>{order.total.toFixed(3)} TND</span>
            </div>
            <hr />
          </div>
        </section>
      </div>

      {/* footer actions */}
      <div className="flex justify-between mt-6 gap-2">
        <button
          onClick={() => router.back()}
          className="py-2 px-3 text-sm font-medium rounded-lg border bg-white text-gray-800 shadow-sm hover:bg-gray-50"
        >
          Close
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="py-2 px-3 text-sm font-bold rounded-lg border bg-white text-[#15335E] shadow-sm hover:bg-gray-50"
          >
            Télécharger PDF
          </button>
          <button
            onClick={handlePrint}
            className="py-2 px-3 w-32 flex justify-center text-sm font-medium rounded-lg bg-primary text-white hover:bg-[#15335E]"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}
