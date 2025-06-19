// src/app/(your-route)/NewProductCollection.tsx
import React from "react";
import ProductCard from "@/components/product/categorie/ProductCard";
import { fetchData } from "@/lib/fetchData";

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

interface ProductDataType {
  HPNewProductTitle?: string;
  HPNewProductSubTitle?: string;
}

export const revalidate = 60;

export default async function NewProductCollection() {
  // load titles with fallback to empty object
  const productData: ProductDataType = await fetchData<ProductDataType>(
    "products/ProductCollectionHomePageTitles"
  ).catch(() => ({} as ProductDataType));

  // load products with fallback to empty array
  const products: Product[] = await fetchData<Product[]>(
    "products/NewProductsCollectionHomePage"
  ).catch(() => [] as Product[]);

  return (
    <>
      {products.length > 0 && (
        <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-[40px] py-8">
          <div className="col-span-full flex flex-col items-center gap-[8px]">
            <h2 className="font-bold text-HomePageTitles text-2xl">
              {productData.HPNewProductTitle ?? ""}
            </h2>
            <p className="text-base text-[#525566]">
              {productData.HPNewProductSubTitle ?? ""}
            </p>
          </div>
          {/* only render the card list if there are products */}
          <ProductCard products={products} />
        </div>
      )}
    </>
  );
}
