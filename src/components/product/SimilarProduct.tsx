// src/app/components/product/SimilarProduct.tsx

import React from 'react';
import { fetchData } from '@/lib/fetchData';
import SimilarProductCard from '@/components/product/SimilarProductCard';
import { Product } from '@/types/Product';

export const revalidate = 60;

interface SimilarProductProps {
  categorie: string;
}

export default async function SimilarProduct({ categorie }: SimilarProductProps) {
  let products: Product[] = [];

  try {
    products = await fetchData<Product[]>(
      `/products/SimilarProduct/Similar?categorieId=${categorie}&limit=4`
    );
  } catch (err) {
    console.error('Error fetching similar products:', err);
  }

  if (!products.length) {
    return <div className="text-center py-8">No similar products found.</div>;
  }

  return (
    <section className="flex flex-col items-center w-full gap-5 py-8">
      <h2 className="font-bold text-HomePageTitles text-2xl">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {products.map((product) => (
          <SimilarProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
