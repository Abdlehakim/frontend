// src/app/(webpage)/[slugCategorie]/page.tsx

import Banner from "@/components/Banner";
import { fetchData } from "@/lib/fetchData";


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
  // ⚠️ await the lazy params before destructuring
  const { slugCategorie } = await params;

  /* -------- catégorie -------- */
  const categorie: CategorieData = await fetchData<CategorieData>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => ({} as CategorieData));


  return (
    <div className="flex flex-col gap-[24px]">
      {categorie.name && categorie.bannerUrl && (
        <Banner title={categorie.name} imageBanner={categorie.bannerUrl} />
      )}
    </div>
  );
}
