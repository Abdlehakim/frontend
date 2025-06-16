import React from "react";
import { cache } from "react";
import MainProductSection from "@/components/product/MainProductSection";
import SimilarProduct from "@/components/product/SimilarProduct";
import ProductDetails from "@/components/product/ProductDetails";

export const revalidate = 60;

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

// Cache the fetch helper
const fetchproductData = cache(async function <T>(endpoint: string): Promise<T> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
});

export default async function ProductPage  ({params}: {params: Promise<{ slugProduct: string }>}) {
  const { slugProduct } = await params;

  const product = await fetchproductData<Product>(`/api/Products/MainProductSection/${slugProduct}`);

  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <div className="flex flex-col w-[90%] gap-[16px] mx-auto" >
      <MainProductSection product={product} />
      <ProductDetails product={product} />
      <SimilarProduct category={product.category._id} />
      
    </div>
  );
};

