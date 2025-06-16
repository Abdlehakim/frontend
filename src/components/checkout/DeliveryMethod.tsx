"use client";
import React from "react";

interface MethodeDeLivraisonProps {
  selectedMethod: string;
  onMethodChange: (method: string, cost: number) => void;
}

// Array of delivery methods and their corresponding costs
const deliveryMethods = [
  { id: "fedex", label: "Free shipping - FedEx", description: "Receive it in 7 days", cost: 0 },
  { id: "dhl", label: "15TND - Fast delivery DHL", description: "Get it tomorrow", cost: 15 },
  { id: "express", label: "49TND - Express delivery", description: "Get it today", cost: 49 },
];

const DeliveryMethod: React.FC<MethodeDeLivraisonProps> = ({ selectedMethod, onMethodChange }) => {
  // Handle the selection and send both method and cost to the parent
  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = event.target.value;
    const selectedMethodObject = deliveryMethods.find((method) => method.id === selectedMethod);
    if (selectedMethodObject) {
      onMethodChange(selectedMethodObject.id, selectedMethodObject.cost); 
    }
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <h1 className="text-xl font-semibold mb-2">Delivery Method</h1>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        {/* Map over the deliveryMethods array */}
        {deliveryMethods.map((method) => (
          <label
            key={method.id}
            htmlFor={method.id}
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={method.id}
                  type="radio"
                  name="delivery-method"
                  value={method.id}
                  className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                  checked={selectedMethod === method.id}
                  onChange={handleMethodChange} // Handle change here
                />
              </div>
              <div className="ms-4 text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{method.label}</span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{method.description}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethod;