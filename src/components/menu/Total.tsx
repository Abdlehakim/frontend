import React from "react";


// Define the props the component expects
interface TotalProps {
  totalPrice: number;
}

const Total: React.FC<TotalProps> = ({ totalPrice }) => {
  return (
    <span className="w-[120px] text-lg max-2xl:text-sm max-md:hidden">
      {totalPrice.toFixed(2).slice(0, 8)} TND
    </span>
  );
};

export default Total;
