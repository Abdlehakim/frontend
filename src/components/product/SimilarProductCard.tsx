// src/components/product/SimilarProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaRegHeart, FaHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import ReviewClient from '@/components/product/reviews/ReviewClient';
import { addToWishlist } from '@/store/wishlistSlice';
import { RootState } from '@/store';
import { Product } from '@/types/Product';

interface SimilarProductCardProps {
  product: Product;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = (slug: string) =>
    wishlistItems.some((item) => item.slug === slug);

  const handleWishlistClick = () => {
    dispatch(
      addToWishlist({
        name: product.name,
        price: product.price,
        categorie: {
          name: product.category?.name || 'Unknown',
          slug: product.category?.slug || 'uncategorized',
        },
        slug: product.slug,
      })
    );
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const isOutOfStock = product.stockStatus === 'out of stock' || product.stock === 0;

  return (
    <div className="group flex flex-col gap-4 p-4 border rounded-lg hover:shadow-lg">
      <Link href={`/${product.category?.slug || 'category'}/${product.slug}`}>  
        <div className="block overflow-hidden rounded-md">
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover w-full h-[300px]"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <Link href={`/${product.category?.slug || 'category'}/${product.slug}`}>  
          <div className="mt-2 flex justify-between items-start">
            <h3 className="text-lg font-semibold capitalize line-clamp-2">
              {product.name}
            </h3>
            <ReviewClient productId={product._id} summary />
          </div>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">
              {discountedPrice.toFixed(2)} TND
            </span>
            {product.discount ? (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {product.price.toFixed(2)} TND
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() =>
            !isOutOfStock &&
            dispatch(
              addItem({
                item: {
                  _id: product._id,
                  name: product.name,
                  ref: product.reference, // use 'ref' not 'reference'
                  price: product.price,
                  mainImageUrl: product.mainImageUrl,
                  discount: product.discount ?? 0,
                  slug: product.slug,
                  categorie: {
                    name: product.category?.name || '',
                    slug: product.category?.slug || '',
                  },
                },
                quantity: 1,
              })
            )
          }
          disabled={isOutOfStock}
          className={`flex-1 py-2 text-center font-semibold rounded-md transition ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>

        <Link href={`/${product.category?.slug || 'category'}/${product.slug}`}>  
          <div className="ml-2 p-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition">
            <FaEye />
          </div>
        </Link>

        <button
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          className="ml-2 p-2 text-primary border border-primary rounded-md hover:bg-red-500 hover:text-white transition"
        >
          {isInWishlist(product.slug) ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default SimilarProductCard;
