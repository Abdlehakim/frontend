// src/app/(webpage)/[slugCategorie]/[slugProduct]/page.tsx
import { notFound } from "next/navigation";
import MainProductSection from "@/components/product/MainProductSection";
import SimilarProducts from "@/components/product/SimilarProducts";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

type PageParams = {
  slugCategorie: string;
  slugProduct: string;
};

type ProductStub = Pick<
  Product,
  | "slug"
  | "name"
  | "reference"
  | "price"
  | "discount"
  | "stock"
  | "mainImageUrl"
>;

export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await fetchData<string[]>(
    "products/MainProductSection/allProductSlugs"
  ).catch(() => []);
  const paths = await Promise.all(
    slugs.map(async (slugProduct) => {
      const prod = await fetchData<Product>(
        `products/MainProductSection/${slugProduct}`
      ).catch(() => null);
      if (!prod?.categorie?.slug) return null;
      return {
        slugCategorie: prod.categorie.slug,
        slugProduct,
      };
    })
  );
  return paths.filter((p): p is PageParams => p !== null);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slugProduct } = await params;
  const prod = await fetchData<Product>(
    `products/MainProductSection/${slugProduct}`
  ).catch(() => null);
  if (!prod) return notFound();

  // ⚠️ Ensure categorie is defined before using _id
  if (!prod.categorie) return notFound();

  const initialProduct: ProductStub = {
    slug:         prod.slug,
    name:         prod.name,
    reference:    prod.reference,
    price:        prod.price,
    discount:     prod.discount,
    stock:        prod.stock,
    mainImageUrl: prod.mainImageUrl,
  };

  return (
    <div className="flex flex-col w-[90%] gap-4 mx-auto">
      <MainProductSection initialProduct={initialProduct} />

      {/* Similar products section */}
      <SimilarProducts
        categorieId={prod.categorie._id}
        subcategorieId={prod.subcategorie?._id}
      />
    </div>
  );
}
