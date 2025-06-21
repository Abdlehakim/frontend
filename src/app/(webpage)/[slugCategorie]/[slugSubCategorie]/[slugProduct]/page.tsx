// src/app/[slugCategory]/[slugProduct]/page.tsx
import { notFound } from "next/navigation";
import MainProductSection from "@/components/product/MainProductSection";
import ProductDetails from "@/components/product/ProductDetails";
/* import SimilarProduct from "@/components/product/SimilarProduct"; */
import { fetchData } from "@/lib/fetchData";
import { Product } from "@/types/Product";

export const revalidate = 60;

type PageParams = { slugCategorie: string; slugProduct: string };

export default async function ProductPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slugProduct } = await params;

  let product: Product | null = null;
  try {
    product = await fetchData<Product>(
      `/products/MainProductSection/${slugProduct}`
    );
  } catch (err) {
    console.error("Error fetching product:", err);
  }

  if (!product) return notFound();

  return (
    <div className="flex flex-col w-[90%] gap-4 mx-auto">
      <MainProductSection product={product} />
      <ProductDetails product={product} />
      {/* <SimilarProduct categorie={product.categorie} /> */}
    </div>
  );
}
