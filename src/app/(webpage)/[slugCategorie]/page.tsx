// src/app/(webpage)/[slugCategorie]/page.tsx
import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
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
  const { slugCategorie } = await params;


  return (
    <div className="flex flex-col gap-6">

      <ProductSectionCategoriePage
        slugCategorie={slugCategorie}
      />
    </div>
  );
}
