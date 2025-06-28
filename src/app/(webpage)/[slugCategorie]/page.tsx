// src/app/(webpage)/[slugCategorie]/page.tsx


import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { Product, SubCategorie } from "@/types/Product";

export const revalidate = 60;



type PageParams = { slugCategorie: string };

export default async function CategoriePage({
  params,
}: {
  params: Promise<PageParams>;
}) {

  const { slugCategorie } = await params;

  /* -------- catégorie -------- */


  /* -------- sous-catégories approuvées -------- */
  let subcategories: SubCategorie[] = [];

    subcategories = await fetchData<SubCategorie[]>(
      `NavMenu/categorieSubCategoriePage/categorie/${slugCategorie}`
    ).catch(() => []);

  /* -------- produits (initial 8 seulement) -------- */
  const initialProducts: Product[] = await fetchData<Product[]>(
    `NavMenu/categorieSubCategoriePage/products/${slugCategorie}?limit=8&skip=0`
  ).catch(() => []);

  return (
    <div className="flex flex-col gap-[24px]">
      <ProductSectionCategoriePage
        slugCategorie={slugCategorie}
        initialProducts={initialProducts}
        initialSubcategories={subcategories}
      />
    </div>
  );
}
