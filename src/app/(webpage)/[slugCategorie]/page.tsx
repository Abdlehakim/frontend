// src/app/(webpage)/[slugCategorie]/page.tsx

import Banner from "@/components/Banner";
import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { Product } from "@/types/Product";

export const revalidate = 60;

interface CategorieData {
  name?: string | null;
  slug?: string | null;
  bannerUrl?: string | null;
}

type PageParams = { slugCategorie: string; slugProduct: string };

export default async function categoriePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slugCategorie } = await params;


  // fetch categorie metadata
  const categorie: CategorieData = await fetchData<CategorieData>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => ({} as CategorieData));

  // fetch products server-side and pass them down
  const initialProducts: Product[] = await fetchData<Product[]>(
    `NavMenu/categorieSubCategoriePage/products/${slugCategorie}`
  ).catch(() => []);

  return (
    <div className="flex flex-col gap-[24px]">
      {categorie.name && categorie.bannerUrl && (
        <Banner title={categorie.name} imageBanner={categorie.bannerUrl} />
      )}
      <ProductSectionCategoriePage
        slugCategorie={slugCategorie}
        initialProducts={initialProducts}
      />
    </div>
  );
}
