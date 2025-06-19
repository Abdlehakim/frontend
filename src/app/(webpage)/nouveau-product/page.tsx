// src/app/nouveau-product/page.tsx

import ProductSectionByCollection from "@/components/product/collection/ProductSectionByCollection";
import Banner from "@/components/Banner";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface NewProductsBanner {
  NPBannerTitle?: string | null;
  NPBannerImgUrl?: string | null;
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

  boutique: { _id: string; name: string };
  brand: { _id: string; name: string };
  category: { _id: string; name: string; slug: string };
}

export default async function NewProductsPage() {
  const bannerData: NewProductsBanner = await fetchData<NewProductsBanner>(
    "NavMenu/NewProducts/getNewProductsBannerData"
  ).catch(() => ({} as NewProductsBanner));

  const products: Product[] = await fetchData<Product[]>(
    "NavMenu/NewProducts/getNewProducts"
  ).catch(() => [] as Product[]);

  return (
    <>
      {bannerData.NPBannerTitle && bannerData.NPBannerImgUrl && (
        <Banner
          title={bannerData.NPBannerTitle}
          imageBanner={bannerData.NPBannerImgUrl}
        />
      )}

      {products.length > 0 && (
        <ProductSectionByCollection products={products} />
      )}
    </>
  );
}
