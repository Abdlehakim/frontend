/* ------------------------------------------------------------------ */
/*  Product page (Server Component)                                   */
/* ------------------------------------------------------------------ */
import { notFound } from "next/navigation";
import MainProductSection from "@/components/product/MainProductSection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

/* ---------- route params ---------- */
type PageParams = {
  slugCategorie: string;
  slugProduct: string;
};

/* ---------- stub shape for the client ---------- */
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

/* ------------------------------------------------------------------ */
/*  Static paths (build-time)                                         */
/* ------------------------------------------------------------------ */
export async function generateStaticParams(): Promise<PageParams[]> {
  /* 1️⃣  list of product slugs (strings) */
  const slugs = await fetchData<string[]>(
    "products/MainProductSection/allProductSlugs"
  ).catch(() => []);

  /* 2️⃣  look up each product once to get its category slug */
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

  /* 3️⃣  drop nulls */
  return paths.filter((p): p is PageParams => p !== null);
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */
export default async function ProductPage(
  { params }: { params: Promise<PageParams> }
) {
  const { slugProduct } = await params;

  /* fetch ONLY this product’s stub (fast) */
  const lite = await fetchData<ProductStub>(
    `products/MainProductSection/lite/${slugProduct}`
  ).catch(() => null);

  if (!lite) return notFound();

  return (
    <div className="flex flex-col w-[90%] gap-4 mx-auto">
      <MainProductSection initialProduct={lite} />
    </div>
  );
}
