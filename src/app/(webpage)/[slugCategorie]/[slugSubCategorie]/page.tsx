/* ------------------------------------------------------------------ */
/*  /[slugCategorie]/[slugSubCategorie]                               */
/* ------------------------------------------------------------------ */

import Banner from "@/components/Banner";
import ProductSectionSubCategoriePage from "@/components/product/categorie/ProductSectionSubCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { Product } from "@/types/Product";

/* -------- auxiliary types -------- */
interface SectionData {
  _id?: string;
  name?: string | null;
  slug?: string | null;
  bannerUrl?: string | null;
}

type PageParams = { slugCategorie: string; slugSubCategorie: string };

export const revalidate = 60;

export default async function SubCategoriePage({
  params,
}: {
  params: PageParams;
}) {
  const { slugSubCategorie } = params;

  /* ---------- sub-category meta ---------- */
  const sub: SectionData = await fetchData<SectionData>(
    `NavMenu/categorieSubCategoriePage/${slugSubCategorie}`
  ).catch(() => ({} as SectionData));

  /* ---------- products in the sub-category ---------- */
  const initialProducts: Product[] = await fetchData<Product[]>(
    `NavMenu/categorieSubCategoriePage/products/${slugSubCategorie}`
  ).catch(() => []);

  return (
    <div className="flex flex-col gap-[24px]">
      {sub.name && sub.bannerUrl && (
        <Banner title={sub.name} imageBanner={sub.bannerUrl} />
      )}

      <ProductSectionSubCategoriePage
        slugSubCategorie={slugSubCategorie}
        initialProducts={initialProducts}
      />
    </div>
  );
}
