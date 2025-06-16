import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import Banner from "@/components/Banner";
import { cache } from "react";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface ProductPromotionbanner {
  ProductPromotionTitle: string;
  ProductPromotionBanner: string;
}

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

const fetchProductPromotion = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; 
  }
  return res.json();
});

export default async function ProductPromotion() {
  const bannerData = await fetchProductPromotion<ProductPromotionbanner | null>(
    `/api/NavMenu/ProductPromotion/getProductPromotionbanner`
  );
  const products = await fetchProductPromotion<Product[] | null>(
    `/api/NavMenu/ProductPromotion/getProductPromotion`
  );
  
  if (!bannerData || !products) {
    notFound();
  }

  return (
    <>
      <Banner
        title={bannerData.ProductPromotionTitle}
        imageBanner={bannerData.ProductPromotionBanner}
      />
        <ProductSectionByCollection products = {products} />
    </>
  );
}
