/* ------------------------------------------------------------------ */
/*  src/components/checkout/PaymentSummary.tsx                        */
/* ------------------------------------------------------------------ */
"use client";

import React,
  {
    useEffect,
    useState,
    FormEvent,
    ReactNode,
    useMemo,
  } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart, CartItem } from "@/store/cartSlice";
import PaypalButton from "@/components/checkout/PaypalButton";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";
import Notification, { NotificationType } from "@/components/ui/Notification";

/* ---------- props ---------- */
interface PaymentSummaryProps {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  deliveryCost: number;
  selectedMethod: string;
  selectedPaymentMethod: string;
  address: { AddressId: string; DeliverToAddress: string };
  currentStep: "cart" | "checkout" | "order-summary";
  onCheckout(): void;
  backcarte(): void;
  handleOrderSummary(ref: string): void;
}

/* ---------- helpers ---------- */
function formattedMissing(list: string[]): ReactNode {
  return list.map((txt, idx) => (
    <React.Fragment key={idx}>
      {idx === 0 ? "" : idx === list.length - 1 ? " et " : ", "}
      <span className="font-semibold text-red-600">{txt}</span>
    </React.Fragment>
  ));
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  items,
  totalPrice,
  totalDiscount,
  deliveryCost,
  selectedMethod,
  selectedPaymentMethod,
  address,
  currentStep,
  onCheckout,
  backcarte,
  handleOrderSummary,
}) => {
  const dispatch = useDispatch();

  /* loading overlay */
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  /* totals */
  const [totalWithShipping, setTotalWithShipping] = useState(
    totalPrice + deliveryCost
  );
  const [totalTva, setTotalTva] = useState(0);

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);
    const tvaSum = items.reduce((sum, it) => {
      const ttc = it.discount
        ? (it.price * (100 - it.discount)) / 100
        : it.price;
      const unitTva = ttc - ttc / (1 + it.tva / 100);
      return sum + unitTva * it.quantity;
    }, 0);
    setTotalTva(tvaSum);
  }, [items, totalPrice, deliveryCost]);

  /* validity */
  const isFormValid = useMemo(
    () => Boolean(address.AddressId && selectedMethod && selectedPaymentMethod),
    [address, selectedMethod, selectedPaymentMethod]
  );

  /* notification */
  const [notification, setNotification] = useState<{
    message: ReactNode;
    type: NotificationType;
  } | null>(null);
  const hideNotification = () => setNotification(null);

  /* send email */
  const sendMail = async (ref: string) => {
    try {
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* post order */
  const postOrder = async () => {
    const lines = items.map(
      ({ _id, reference, name, quantity, tva, mainImageUrl, discount, price }) => ({
        _id,
        reference,
        name,
        quantity,
        tva,
        mainImageUrl,
        discount,
        price,
      })
    );

    const payload = {
      DeliveryAddress: [
        { Address: address.AddressId, DeliverToAddress: address.DeliverToAddress }
      ],
      paymentMethod: selectedPaymentMethod,
      selectedMethod,
      deliveryCost,
      items: lines,
    };

    const { ref } = await fetchData<{ ref: string }>(
      "/client/order/postOrderClient",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    await sendMail(ref);
    toast.success("Commande envoyée avec succès !");
    dispatch(clearCart());
    handleOrderSummary(ref);
  };

  const handleOrderSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      const missing: string[] = [];
      if (!address.AddressId) missing.push("l’adresse de livraison");
      if (!selectedMethod) missing.push("la méthode de livraison");
      if (!selectedPaymentMethod) missing.push("le moyen de paiement");

      setNotification({
        message: <>Veuillez sélectionner {formattedMissing(missing)}.</>,
        type: "error",
      });
      return;
    }

    setIsSubmittingOrder(true);
    try {
      await postOrder();
    } catch (err) {
      setNotification({
        message: "Échec de l’envoi de la commande. Veuillez réessayer.",
        type: "error",
      });
      console.error(err);
      setIsSubmittingOrder(false);
    }
  };

  const handlePayPalSuccess = () => handleOrderSubmit();

  /* JSX */
  const isPayPal = selectedPaymentMethod.toLowerCase() === "paypal";

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {isSubmittingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingDots />
        </div>
      )}

      <div className="bg-gray-100 rounded-md p-4 w-[420px] max-lg:w-full">
        <div className="mt-8 sticky top-4 space-y-8">
          {/* promo code */}
          <div className="flex border border-[#15335E] overflow-hidden rounded-md">
            <input
              type="text"
              placeholder="Code promo"
              className="w-full bg-white px-4 py-2.5 text-sm"
            />
            <button className="bg-primary px-4 text-sm font-semibold text-white">
              Appliquer
            </button>
          </div>

          {/* totals */}
          <ul className="space-y-4 text-gray-800">
            <li className="flex justify-between text-base">
              <span>Remise</span>
              <span className="font-bold">{totalDiscount.toFixed(2)} TND</span>
            </li>
            <li className="flex justify-between text-base">
              <span>Livraison</span>
              <span className="font-bold">{deliveryCost.toFixed(2)} TND</span>
            </li>
            <li className="flex justify-between text-base">
              <span>TVA</span>
              <span className="font-bold">{totalTva.toFixed(2)} TND</span>
            </li>
            <li className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{totalWithShipping.toFixed(2)} TND</span>
            </li>
          </ul>

          {/* Checkout step */}
          {currentStep === "checkout" && (
            <div className="space-y-2">
              {!isPayPal && (
                <button
                  onClick={handleOrderSubmit}
                  className={`mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm ${
                    isFormValid
                      ? "text-black hover:bg-primary hover:text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  Confirmer la commande
                </button>
              )}

              {isPayPal
                ? isFormValid
                  ? <PaypalButton amount={totalWithShipping.toFixed(2)} onSuccess={handlePayPalSuccess} />
                  : <button onClick={handleOrderSubmit} className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm bg-gray-200 text-gray-400">PayPal</button>
                : null
              }

              <button
                onClick={backcarte}
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white"
              >
                Retourner
              </button>

              <Link href="/">
                <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white">
                  Annuler
                </button>
              </Link>
            </div>
          )}

          {/* Cart step */}
          {currentStep === "cart" && (
            <div className="space-y-2">
              <button
                onClick={onCheckout}
                className={`mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm ${
                  items.length
                    ? "text-black hover:bg-primary hover:text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                }`}
              >
                Continuer
              </button>
              <Link href="/">
                <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-primary hover:text-white">
                  Annuler
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSummary;
