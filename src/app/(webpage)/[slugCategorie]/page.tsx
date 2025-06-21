import Banner from "@/components/Banner";
import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import { Product, SubCategorie } from "@/types/Product";

export const revalidate = 60;

interface CategorieData {
  _id?: string;             // 👈 on en a besoin maintenant
  name?: string | null;
  slug?: string | null;
  bannerUrl?: string | null;
}

type PageParams = { slugCategorie: string };

export default async function CategoriePage({ params }: { params: PageParams }) {
  const { slugCategorie } = params;

  /* -------- catégorie -------- */
  const categorie: CategorieData = await fetchData<CategorieData>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => ({} as CategorieData));

  /* -------- sous-catégories approuvées -------- */
  let subcategories: SubCategorie[] = [];
  if (categorie._id) {
    subcategories = await fetchData<SubCategorie[]>(
      `NavMenu/categorieSubCategoriePage/categorie/${categorie._id}`
    ).catch(() => []);
  }

  /* -------- produits -------- */
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
        initialSubcategories={subcategories}
      />
    </div>
  );
}
