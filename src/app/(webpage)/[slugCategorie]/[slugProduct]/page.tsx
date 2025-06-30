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

/* ---------- stub delivered to the client ---------- */
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
/*  Static paths                                                      */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */
export default async function ProductPage(
  { params }: { params: Promise<PageParams> }
) {
  const { slugProduct } = await params;

  /* fetch the heavy doc once (we no longer have /lite) */
  const prod = await fetchData<Product>(
    `products/MainProductSection/${slugProduct}`
  ).catch(() => null);

  if (!prod) return notFound();

  /* derive the stub for initial render */
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
    </div>
  );
}
