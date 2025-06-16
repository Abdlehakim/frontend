"use client";

import React, { Key, useEffect, useState } from "react";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  image: string;
  discount: number; // e.g. a percentage
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
  deliveryCost: string | number;
  total: number;
  orderStatus: string;
}

interface OrderSummaryProps {
  data: string;
}

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

async function fetchData(orderRef: string): Promise<Order> {
  const response = await fetch(
    `${backendUrl}/api/client/order/getOrderByRef/${orderRef}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Order not found or user not authorized");
  }
  return response.json();
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const fetchedOrder = await fetchData(data);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 pt-16">
        <FaSpinner className="animate-spin text-gray-500 w-16 h-16" />
      </div>
    );
  }

  if (!order) {
    return <div>Order data not found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 h-fit w-[50%]">
        {/* Success Icon + Thank You Message */}
        <div className="flex items-center justify-center gap-[8px] mb-6">
          <FiCheckCircle className="text-green-500 w-12 h-12" />
          <h2 className="text-3xl font-bold text-green-500">
            Thanks for your order!
          </h2>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p className="text-gray-700">
            Your order <span className="font-bold">#{order.ref}</span> is successful.
          </p>
          <div className="mt-4">
            <p className="text-base font-bold">
              Total: <span className="ml-auto">{order.total.toFixed(2)} TND</span>
            </p>
          </div>

          {/* List of Order Items */}
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">Article(s):</p>
            <div className="flex flex-col divide-y divide-gray-200">
              {order.orderItems.length > 0 ? (
                order.orderItems.map((item) => {
                  const discountedUnitPrice =
                    item.discount > 0
                      ? item.price - (item.price * item.discount) / 100
                      : item.price;
                  const lineTotal = (discountedUnitPrice * item.quantity).toFixed(2);
                  return (
                    <div
                      key={item._id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-[16px]">
                        <Image
                          className="rounded-lg"
                          src={item.image || "/path/to/default-image.jpg"}
                          alt={item.name}
                          width={100}
                          height={100}
                        />
                        <div>
                          <p className="text-lg font-semibold">{item.name}</p>
                          {item.discount > 0 ? (
                            <p className="text-sm text-gray-600">
                              {discountedUnitPrice.toFixed(2)} TND (Discounted)
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              {item.price.toFixed(2)} TND
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold">{lineTotal} TND</p>
                    </div>
                  );
                })
              ) : (
                <p>No items found</p>
              )}
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="mt-8">
            <p className="text-gray-700">
              Payment Method:{" "}
              <span className="font-bold">{order.paymentMethod}</span>
            </p>
          </div>
          <div className="mt-8">
            <p className="text-gray-700">
              Delivery Method:{" "}
              <span className="font-bold uppercase">
                {order.deliveryMethod}
              </span>
            </p>
          </div>

          {/* Updated Address Field */}
          <div className="mt-8">
            <h3 className="text-gray-700 uppercase font-bold mb-2">Delivery Address</h3>
            <p className="text-gray-700">
              {order.address.Name} <br />
              {order.address.StreetAddress} <br />
              {order.address.City}
              {order.address.Province ? `, ${order.address.Province}` : ""} <br />
              {order.address.PostalCode} - {order.address.Country}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push("/")}
            className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2 text-black"
          >
            Go to Home Page
          </button>
          <button
            onClick={() => router.push("/orderhistory")}
            className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2 text-black"
          >
            Check Order Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
