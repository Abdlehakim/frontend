"use client";
import Link from "next/link";
import React, { useState } from "react";

interface Product {
  _id: string;
  name: string;
  ref: string;
  price: number;
  tva: number;
  imageUrl: string;
  images: string[];
  material: string;
  color: string;
  dimensions: string;
  warranty: string;
  weight: string;
  discount?: number;
  status: string;
  statuspage: string;
  vadmin: string;
  slug: string;
  nbreview: number;
  averageRating: number;
  stock: number;
  info: string;
  description: string;
  boutique: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface ProductActionProps {
  product: Product;
  addToCartHandler: (product: Product, quantity: number) => void;
}

const ProductAction: React.FC<ProductActionProps> = ({
  product,
  addToCartHandler,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  if (!product) {
    return null; // Ensure the component returns null if product is not available
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(
      1,
      Math.min(product.stock, parseInt(event.target.value, 10) || 1)
    );
    setQuantity(value);
  };

  return (
    <>
      {product.discount && product.discount !== 0 ? (
        <div className="items-center justify-center flex gap-[16px]">
          <p className="text-primary text-2xl font-bold max-xl:justify-center flex">
            {product.price - product.price * (product.discount / 100)} TND
          </p>
          <span className="text-xl font-bold">
            <p className="text-gray-500 line-through">{product.price} TND</p>
          </span>
        </div>
      ) : (
        <p className="text-primary text-2xl font-bold justify-center flex">
          {product.price} TND
        </p>
      )}

      <hr className="" />
      <div className="flex flex-col justify-center items-center gap-[12px]">
        {product.status !== "out-of-stock" ? (
          product.stock > 0 ? (
            <>
              <div className="flex w-full max-md:flex-col xl:flex-col justify-between gap-[20px]">
                <div className="justify-center flex">
                  <div className="flex items-center justify-center gap-[8px]">
                    <p>Quantité:&nbsp;</p>
                    <label htmlFor="quantityInput" className="text-lg">
                      <button
                        onClick={decreaseQuantity}
                        className="p-2 border text-xl text-gray-700"
                        disabled={quantity === 1}
                      >
                        -
                      </button>
                    </label>
                    <input
                      id="quantityInput"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock}
                      className="p-2 border text-xl text-center w-[20%]"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="p-2 border text-xl text-gray-700"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex gap-[16px] w-full">
                  <button
                    onClick={() => addToCartHandler(product, quantity)}
                    className="text-white bg-primary hover:bg-[#15335D] h-10 w-[60%] font-bold rounded-md"
                  >
                    <p>Ajouter au panier</p>
                  </button>
                  <Link
                    href={"/checkout"}
                    className="text-white bg-black h-10 w-[60%] font-bold text-center rounded-md"
                  >
                    <button
                      onClick={() => addToCartHandler(product, quantity)}
                      className="text-white bg-black h-10 w-[60%] font-bold rounded-md"
                    >
                      <p>Acheter</p>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex pt-5 gap-[16px]">
                <p className="font-bold">Disponibilité :</p>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold uppercase">
                    {product.boutique?.name ||
                      "Disponible Dans notre magasin" ||
                      "Disponible Dans notre magasin"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <button
              className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
              disabled
            >
              <p>Rupture de stock</p>
            </button>
          )
        ) : (
          <button
            className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
            disabled
          >
            <p>Rupture de stock</p>
          </button>
        )}
      </div>
    </>
  );
};

export default ProductAction;
