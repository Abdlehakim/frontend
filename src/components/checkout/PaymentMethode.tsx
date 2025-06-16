import React from 'react'
interface PaymentMethodeProps {
    handlePaymentMethodChange(e: React.ChangeEvent<HTMLInputElement>):void
    selectedPaymentMethod: string;
   
}

const PaymentMethode : React.FC<PaymentMethodeProps> = ({ handlePaymentMethodChange , selectedPaymentMethod}) => {
  return (
    <div className="space-y-4 ">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      Payment
    </h3>

    <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
    <label
          htmlFor="pay-on-delivery"
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
        >
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="pay-on-delivery"
              aria-describedby="pay-on-delivery-text"
              type="radio"
              name="payment-method"
              value="Payment on delivery"
              onChange={handlePaymentMethodChange}
              checked={selectedPaymentMethod === "Payment on delivery"} 
              className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600 "
            />
          </div>

          <div className="ms-4 text-sm ">
            <label className="font-medium leading-none text-gray-900 dark:text-white">
              {" "}
              Payment on delivery{" "}
            </label>
            <p
              id="pay-on-delivery-text"
              className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
            >
              payment processing
            </p>
          </div>
       
        
        </div>
      </label>

      <label 
      htmlFor="paypal-2"
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="paypal-2"
              aria-describedby="paypal-text"
              type="radio"
              name="payment-method"
              value="paypal"
              onChange={handlePaymentMethodChange}
              checked={selectedPaymentMethod === "paypal"}
              className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
            />
          </div>

          <div className="ms-4 text-sm grid justify-items gap-[8px] ">
            <label className="font-medium leading-none text-gray-900 dark:text-white">
              {" "}
              Paypal account{" "}
            </label>
            <p
              id="paypal-text"
              className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
            >
              Connect to your account
            </p>
           
            </div>
            
          </div>
        
        </label>
      </div>
     
    </div>
  )
}

export default PaymentMethode