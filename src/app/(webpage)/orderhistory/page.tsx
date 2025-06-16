"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Pagination from "@/components/PaginationClient";
import Breadcrumb from "@/components/order/Breadcrumb";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  quantity: number;
  image: string;
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
  deliveryCost: number;
  deliveryMethod: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

export default function OrderHistory() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

  /**
   * 1) Redirect if user is not authenticated
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Replace this path with wherever you want to redirect if unauthenticated
      router.push("/signin");
    }
  }, [loading, isAuthenticated, router]);

  /**
   * 2) Fetch orders from your backend once the user is authenticated
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/client/order/getOrdersByClient`, {
          method: "GET",
          credentials: "include", // important for cookie-based auth
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch orders.");
        }
        const data = (await res.json()) as Order[];
        setOrders(data);
        setTotalPages(Math.ceil(data.length / ordersPerPage));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setOrdersError(err.message);
        } else {
          setOrdersError("An unexpected error occurred");
        }
      } finally {
        setOrdersLoading(false);
      }
    };

    if (!loading && isAuthenticated) {
      fetchOrders();
    }
  }, [loading, isAuthenticated, backendUrl]);

  /**
   * 3) Helper to format date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * 4) Get the slice of orders for the current page
   */
  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  };

  /**
   * 5) If still checking authentication or fetching data, show a loader
   */
  if (loading) {
    return <p>Loading user data...</p>;
  }

  /**
   * 6) Render main component
   */
  return (
    <div className="w-full pt-16 flex flex-col gap-4 items-center">
      <div className='w-[70%] '>
        <Breadcrumb
          homeElement="Home"
          separator={<MdOutlineArrowForwardIos size={13} className="mt-1.5" />}
          containerClasses=" flex gap-1 text-gray-500 "
          listClasses=""
          activeClasses="uppercase underline underline-offset-1 hover:underline font-semibold text-black"
          capitalizeLinks
        /></div>
      <div className="w-[70%] max-lg:w-[95%] rounded-lg p-8 border-2 flex flex-col gap-2 mt-4">
        <div className="max-md:flex-col max-md:flex max-md:items-center">

          <p className="text-2xl font-bold">Order HISTORY</p>
          <p className="text-gray-400 text-sm max-md:text-center">
            Check the status of recent orders, manage returns, and download invoices
          </p>
        </div>

        {/* 7) Display loading/errors first */}
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : ordersError ? (
          <p className="text-red-500">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <>
            {/* 8) Render orders for the current page */}
            {getCurrentPageOrders().map((order) => (
              <div key={order._id} className="flex flex-col gap-4">
                <div className="bg-[#EFEFEF] rounded-lg p-6 justify-between flex max-md:flex-col max-md:items-center max-md:gap-4">
                  <div className="max-md:flex max-md:justify-between max-md:w-full">
                    <p>Date Order</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="max-md:flex max-md:justify-between max-md:w-full">
                    <p>Order number</p>
                    <p>{order.ref}</p>
                  </div>
                  <div className="max-md:flex max-md:justify-between max-md:w-full">
                    <p>Method Delivery</p>
                    <p className="uppercase">{order.deliveryMethod}</p>
                  </div>
                  <div className="max-md:flex max-md:justify-between max-md:w-full">
                    <p>Total amount</p>
                    <p>{order.total} TND</p>
                  </div>
                  <Link
                    href={`/orderhistory/${order.ref}`}
                    className="bg-[#F7F7F7] border-2 h-10 w-[15%] max-md:w-full rounded-lg flex items-center justify-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}

            {/* 9) Render Pagination if more than one page exists */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
