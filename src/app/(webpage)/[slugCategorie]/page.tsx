// src/app/(webpage)/[slugCategorie]/page.tsx
import Banner from "@/components/Banner";
import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { SubCategorie } from "@/types/Product";

export const revalidate = 60;

interface CategorieData {
  _id?: string;
  name?: string | null;
  slug?: string | null;
  bannerUrl?: string | null;
}


type PageParams = { slugCategorie: string };

export default async function CategoriePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slugCategorie } = await params;

  
  /* -------- catégorie -------- */
  const categorie: CategorieData = await fetchData<CategorieData>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => ({} as CategorieData));


  const initialSubcategories: SubCategorie[] = await fetchData<SubCategorie[]>(
    `NavMenu/categorieSubCategoriePage/categorie/${slugCategorie}`
  ).catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      {categorie.name && categorie.bannerUrl && (
        <Banner title={categorie.name} imageBanner={categorie.bannerUrl} />
      )}

      <ProductSectionCategoriePage
        slugCategorie={slugCategorie}
        initialSubcategories={initialSubcategories}
      />
    </div>
  );
}
