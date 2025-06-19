'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { IoCheckboxOutline } from 'react-icons/io5';
import ProductAction from './ProductAction';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import type { CartItem } from '@/store/cartSlice';
import { Product } from '@/types/Product';

interface ProductPageProps {
  product: Product;
}

const MainProductSection: React.FC<ProductPageProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.mainImageUrl
  );
  const dispatch = useDispatch();

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const addToCartHandler = (product: Product, quantity: number) => {
    const cartItem: Omit<CartItem, 'quantity'> = {
      _id:          product._id,
      name:         product.name,
      reference:    product.reference,
      price:        product.price,
      mainImageUrl: product.mainImageUrl,
      discount:     product.discount ?? 0,
      slug:         product.slug,
      categorie: product.categorie
        ? { name: product.categorie.name, slug: product.categorie.slug }
        : undefined,
    };

    dispatch(addItem({ item: cartItem, quantity }));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-[32px] w-full max-w-7xl mx-auto p-4">
      {/* Image section */}
      <div className="flex flex-col justify-center gap-[16px]">
        <div className="flex justify-center lg:w-[800px] lg:h-[500px] max-lg:w-[550px] max-lg:h-[350px] max-sm:w-[400px] max-sm:h-[300px] overflow-hidden mx-auto">
          <Image
            src={selectedImage}
            alt={product.name}
            loading="eager"
            width={1000}
            height={1000}
            className="object-cover"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="gap-[16px] flex justify-center">
          {product.extraImagesUrl.map((img, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden cursor-pointer max-sm:w-[20%] w-[100px] h-[60px]"
              onClick={() => handleImageClick(img)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={1000}
                height={1000}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Details section */}
      <div className="w-full flex flex-col gap-[16px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase">
          {product.name}
        </h1>

        <div className="flex flex-wrap gap-[16px] text-sm sm:text-base">
          <p className="font-bold">
            REF: <span className="text-gray-600 uppercase">{product.reference}</span>
          </p>
          <p className="font-bold flex items-center gap-[8px] text-gray-600">
            <IoCheckboxOutline size={18} />
            {product.stockStatus}
          </p>
        </div>

        <div className="flex gap-[12px] items-center text-sm">
          <div className="flex gap-[4px] text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => {
              const starVal = i + 1;
              if (starVal <= product.averageRating) return <FaStar key={i} />;
              if (starVal - 0.5 <= product.averageRating)
                return <FaStarHalfAlt key={i} />;
              return <FaRegStar key={i} />;
            })}
          </div>
          <p className="text-gray-700">({product.nbreview} avis clients)</p>
        </div>

        <p className="text-sm text-gray-700">{product.info}</p>
        <hr className="my-4 border-gray-300" />

        <ProductAction
          product={product}
          addToCartHandler={addToCartHandler}
        />
      </div>
    </div>
  );
};

export default MainProductSection;
