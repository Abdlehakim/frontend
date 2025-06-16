import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import Banner from "@/components/Banner";
import { cache } from "react";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface ProductCollectionBanner {
  ProductCollectionTitle: string;
  ProductCollectionBanner: string;
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

const fetchData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; 
  }
  return res.json();
});

export default async function ProductCollection() {
  const bannerData = await fetchData<ProductCollectionBanner | null>(
    `/api/NavMenu/ProductCollection/getProductCollectionbanner`
  );
  const products = await fetchData<Product[] | null>(
    `/api/NavMenu/ProductCollection/getProductCollection`
  );

  if (!bannerData || !products) {
    notFound();
  }

  return (
    <>
      <Banner
        title={bannerData.ProductCollectionTitle}
        imageBanner={bannerData.ProductCollectionBanner}
      />
      <ProductSectionByCollection products={products} />
    </>
  );
}
