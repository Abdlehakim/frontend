// src/app/(webpage)/[slugCategorie]/page.tsx

import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { SubCategorie } from "@/types/Product";

export const revalidate = 60;

type PageParams = { slugCategorie: string };

export default async function CategoriePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slugCategorie } = await params;

  const initialSubcategories: SubCategorie[] = await fetchData<SubCategorie[]>(
    `NavMenu/categorieSubCategoriePage/categorie/${slugCategorie}`
  ).catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <ProductSectionCategoriePage
        slugCategorie={slugCategorie}
        initialSubcategories={initialSubcategories}
      />
    </div>
  );
}
