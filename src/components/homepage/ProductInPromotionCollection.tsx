// src/app/(client)/ProductPromotionHomePage.tsx
import React from "react";
import { fetchData } from "@/lib/fetchData";
import ProductCard from "@/components/product/category/ProductCard";

interface Product {
  _id: string;
  name: string;
  info: string;
  description?: string;

  reference: string;
  slug: string;

  categorie: {
    _id: string;
    name: string;
    slug: string;
  };

  subcategorie?: {
    _id: string;
    name: string;
    slug: string;
  } | null;

  boutique?: {
    _id: string;
    name: string;
  } | null;

  brand?: {
    _id: string;
    name: string;
  } | null;

  stock: number;
  price: number;
  tva: number;
  discount: number;

  stockStatus: "in stock" | "out of stock";
  statuspage: "none" | "New-Products" | "promotion" | "best-collection";
  vadmin: "not-approve" | "approve";

  mainImageUrl: string;
  mainImageId?: string | null;
  extraImagesUrl: string[];
  extraImagesId: string[];

  nbreview: number;
  averageRating: number;

  attributes: Array<{
    attributeSelected: string;
    value:
      | string
      | Array<{ name: string; value: string }>
      | Array<{ name: string; hex: string }>
      | Record<string, string>;
  }>;

  productDetails: Array<{
    name: string;
    description?: string;
  }>;

  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductPromotionHomePageType {
  HPPromotionTitle?: string;
  HPPromotionSubTitle?: string;
}

export const revalidate = 60;

export default async function ProductPromotionHomePage() {
  // load titles with fallback
  const titleData: ProductPromotionHomePageType =
    await fetchData<ProductPromotionHomePageType>(
      "products/ProductPromotionHomePageTitles"
    ).catch(() => ({} as ProductPromotionHomePageType));

  // load products with fallback
  const products: Product[] = await fetchData<Product[]>(
    "products/productsCollectionPromotion"
  ).catch(() => [] as Product[]);

  return (
    <>
      {products.length > 0 && (
        <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-[40px] py-8">
          {/* Header */}
          <div className="col-span-full flex flex-col items-center gap-[8px]">
            <h2 className="font-bold text-2xl text-HomePageTitles uppercase">
              {titleData.HPPromotionTitle ?? ""}
            </h2>
            <p className="text-base text-[#525566]">
              {titleData.HPPromotionSubTitle ?? ""}
            </p>
          </div>

          {/* Only render ProductCard if products exist */}
          <ProductCard products={products} />
        </div>
      )}
    </>
  );
}
