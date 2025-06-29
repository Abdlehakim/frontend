/* ------------------------------------------------------------------ */
/*  src/app/(webpage)/[slugCategorie]/[slugProduct]/page.tsx          */
/* ------------------------------------------------------------------ */
import { notFound } from "next/navigation";
import MainProductSection from "@/components/product/MainProductSection";
import { fetchData } from "@/lib/fetchData";
import type { Product } from "@/types/Product";

export const revalidate = 60;

/* ---------- params ---------- */
type PageParams = {
  slugCategorie: string;
  slugProduct: string;
};

/* ---------- stub shape passed to MainProductSection ---------- */
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
/*  Pre-generate paths                                                */
/* ------------------------------------------------------------------ */
export async function generateStaticParams(): Promise<PageParams[]> {
  /* 1️⃣  fetch the flat slug list (strings) */
  const slugs = await fetchData<string[]>(
    "products/MainProductSection/allProductSlugs"
  ).catch(() => []);

  /* 2️⃣  for each slug, look up its category once (build-time cost) */
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

  /* fetch just THIS product */
  const prod = await fetchData<Product>(
    `products/MainProductSection/${slugProduct}`
  ).catch(() => null);

  if (!prod) return notFound();

  /* build the lightweight stub expected by the client component */
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
