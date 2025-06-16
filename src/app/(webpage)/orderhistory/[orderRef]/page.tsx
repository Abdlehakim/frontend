"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Breadcrumb from "@/components/order/Breadcrumb";


/** Interfaces **/
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
  refproduct: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
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

export default function OrderByRef() {
  const router = useRouter();
  const { orderRef } = useParams() as { orderRef: string };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    // Define the fetch function here so it's in scope of the effect
    const getOrder = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/client/order/getOrderByRef/${orderRef}`,
          { method: "GET", credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Order not found or user not authorized");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [orderRef, backendUrl]);

  /** PDF Generation Helpers **/
  const handleDownloadPDF = () => {
    generatePDF(false);
  };

  const handlePrint = () => {
    generatePDF(true);
  };

  function generatePDF(openInNewTab = false) {
    const content = document.getElementById("invoice-content");
    if (!content) return;

    html2canvas(content).then((canvas) => {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdfHeight = 297;
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      for (let i = 0; i < totalPages; i++) {
        const offsetY = -i * pdfHeight;
        pdf.addImage(imgData, "PNG", 0, offsetY, imgWidth, imgHeight);
        if (i < totalPages - 1) {
          pdf.addPage();
        }
      }

      if (openInNewTab) {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url);
      } else {
        pdf.save(`INVOICE-${order?.ref.replace("ORDER-", "")}.pdf`);
      }
    });
  }

  /** Calculate invoice totals **/
  //let itemsPrice = 0;
  //let totalHT = 0;
  // totalTTC = 0;

  //order?.orderItems.forEach((item) => {
  // const discountedPrice = item.price * (1 - item.discount / 100);
  //const itemTotalTTC = discountedPrice * item.quantity;
  // totalTTC += itemTotalTTC;

  //const itemHT = (discountedPrice / (1 + item.tva / 100)) * item.quantity;
  /// totalHT += itemHT;

  // itemsPrice += item.price * item.quantity;
  // });

  //const totalBrut = itemsPrice;
  //const totalRemise = totalBrut - totalHT;
  //const totalTVA = totalTTC - totalHT;

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div className="w-[90%] md:w-[70%] mx-auto pt-16">
      <Breadcrumb
        homeElement="Home"
        separator={<MdOutlineArrowForwardIos size={13} className="mt-1.5" />}
        containerClasses=" flex gap-1 text-gray-500"
        listClasses=""
        activeClasses="uppercase underline underline-offset-1 hover:underline font-semibold text-black"
        capitalizeLinks
      />
      <div id="invoice-content" className="flex flex-col gap-[50px] pt-10">
        {/* Header */}

        <div className="flex justify-center">
          <h2 className="text-5xl font-semibold">
            {order.ref}
          </h2>
        </div>

        {/* Client Info */}
        <div className="lg:flex w-full gap-2">
          <div className="border border-gray-200 p-2 my-2 rounded-md w-full">
            <h3 className="text-lg font-semibold">DESTINATAIRE:</h3>
            <div className="flex gap-4">
              <div className="font-semibold ">
                <dt className=" ">namee:</dt>
                <dt className=" "> StreetAddress:</dt>
                <dt className=" "> Country:</dt>
                <dt className=" "> Province:</dt>{" "}
                <dt className=" "> City:</dt>
                <dt className=" "> Postal Code:</dt>
              </div>
              <div className=" text-gray-500">
                <div> {order.address.Name}</div>
                <div>  {order.address.StreetAddress}</div>
                <div>  {order.address.Country}</div>
                <div>  {order.address.Province}</div>
                <div>  {order.address.City}</div>
                <div>  {order.address.PostalCode}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 border border-gray-200 p-2 my-2 rounded-md w-full">

            <h3 className="text-lg font-semibold">ORDER DETAILS:</h3>
            <div className="flex gap-4">
              <div>
                <dt className="font-semibold">Date:</dt>
                <dt className="font-semibold">PaymentMethod:</dt>
                <dt className="font-semibold">Delivery Method:</dt>
                <dt className="font-semibold">Delivery cost:</dt>
                <dt className="font-semibold">OrderStatus:</dt>
              </div>
              <div>
                <dd className=" text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </dd>
                <dt className=" text-gray-500">
                  {order.paymentMethod}
                </dt>
                <dt className=" text-gray-500">
                  {order.paymentMethod}
                </dt>
                <dt className=" text-gray-500">
                  {order.deliveryCost}
                </dt>
                <dt className=" text-gray-500">
                  {order.orderStatus}
                </dt>
              </div>
            </div>

          </div>
        </div>

        {/* Items Table */}
        <div className="w-full space-y-4">
          <h3 className="text-4xl font-bold">Products</h3>
          <div className="space-y-4 text-center">
            <hr className="" />
            <div className="flex justify-between items-center lg:px-32 ">
              <div className="sm:col-span-2  font-bold uppercase">
                Image
              </div>
              <div className="sm:col-span-2 font-bold uppercase">
                Ref
              </div>
              <div className="sm:col-span-2 font-bold uppercase">
                Name
              </div>
              <div className="text-start font-bold uppercase">
                Qty
              </div>

              <div className="text-end font-bold uppercase">
                Prix Tot
              </div>

            </div><hr />

            {order.orderItems.map((item) => {
              return (
                <div key={item._id}>
                  <div className="flex justify-between lg:px-32 space-y-4">
                    <div className="">
                      <Image
                        src={item.image}
                        alt="signin image"
                        width={50}
                        height={50}
                        priority
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <div className="">
                      <span className="font-medium ">{item.refproduct}</span>
                    </div>
                    <div className="">
                      <span className="font-medium ">{item.name}</span>
                    </div>
                    <div className="">
                      <span>{item.quantity}</span>
                    </div>
                    <div className=" ">
                      <span>
                        {(item.price / (1 + item.tva / 100)).toFixed(3)} TND
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <hr />
            <div className="flex justify-end gap-[16px] text-xl">
              <div className=" font-bold">
                Total Price:
              </div>
              <div className="col-span-2">
                {order.total.toFixed(3)} TND
              </div>
            </div>
            <hr />
          </div>

        </div>

        {/* Totals Section */}

      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-between mt-6">
        <button
          onClick={() => router.back()}
          className="py-2 px-3 inline-flex items-center gap-x-2 
                       text-sm font-medium rounded-lg border border-gray-200 bg-white 
                       text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          Close
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="py-2 px-3 inline-flex items-center gap-x-2 
                         text-sm font-bold rounded-lg border border-gray-200 bg-white 
                         text-[#15335E] shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Télécharger PDF
          </button>
          <button
            onClick={handlePrint}
            className="py-2 px-3 items-center gap-x-2 w-32 flex justify-center 
                         text-sm font-medium rounded-lg bg-primary text-white 
                         hover:bg-[#15335E] focus:outline-none"
          >
            Imprimer
          </button>
        </div>
      </div>

    </div>
  );
}
