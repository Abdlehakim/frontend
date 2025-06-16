'use client';
import React, { useState } from "react";
import Image from "next/image";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoCheckboxOutline } from "react-icons/io5";
import ProductAction from "./ProductAction";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";

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

interface ProductPageProps {
  product: Product;
}

const MainProductSection = ({ product }: ProductPageProps) => {
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl ?? "");
  const dispatch = useDispatch();

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const addToCartHandler = (product: Product, quantity: number) => {
    dispatch(addItem({ item: product, quantity }));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-[32px] w-full max-w-7xl mx-auto p-4">
      {/* Image section */}
      <div className="flex flex-col justify-center gap-[16px]">
          <div className="flex justify-center lg:w-[800px] lg:h-[500px] max-lg:w-[550px] max-lg:h-[350px] max-sm:w-[400px] max-sm:h-[300px] overflow-hidden mx-auto">
            <Image
              src={selectedImage}
              alt={product.name || "Product image"}
              loading="eager"
              width={1000}
              height={1000}
              className="object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="gap-[16px] flex justify-center">
            {product.images &&
              product.images.length > 0 &&
              product.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative overflow-hidden cursor-pointer max-sm:w-[20%] w-[100px] h-[60px]"
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    onClick={() => handleImageClick(image)}
                    width={1000}
                    height={1000}
                  />
                </div>
              ))}
          </div>
        </div>

      {/* Details section */}
      <div className="w-full  flex flex-col gap-[16px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase">
          {product.name}
        </h1>

        <div className="flex flex-wrap gap-[16px] text-sm sm:text-base">
          <p className="font-bold">
            SKU: <span className="text-gray-600">{product.ref}</span>
          </p>
          <p className="font-bold flex items-center gap-[8px] text-gray-600">
            <IoCheckboxOutline size={18} />
            {product.status}
          </p>
        </div>

        <div className="flex gap-[12px] items-center text-sm">
          <div className="flex gap-[4px] text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => {
              const starVal = i + 1;
              if (starVal <= product.averageRating) return <FaStar key={i} />;
              if (starVal - 0.5 <= product.averageRating) return <FaStarHalfAlt key={i} />;
              return <FaRegStar key={i} />;
            })}
          </div>
          <p className="text-gray-700">({product.nbreview} avis clients)</p>
        </div>

        <p className="text-sm text-gray-700">{product.info}</p>
        <hr className="my-4 border-gray-300" />

        <ProductAction product={product} addToCartHandler={addToCartHandler} />
      </div>
    </div>
  );
};

export default MainProductSection;
