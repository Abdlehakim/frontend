/* ------------------------------------------------------------------ */
/*  src/app/(webpage)/[slugCategorie]/page.tsx                         */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import ProductSectionCategoriePage from "@/components/product/categorie/ProductSectionCategoriePage";
import { fetchData } from "@/lib/fetchData";
import type { Metadata } from "next";

export const revalidate = 60; // ISR interval (seconds)

/* ---------- types ---------- */
interface CategorieMeta {
  _id: string;
  name: string;
  slug: string;
  bannerUrl: string | null;
}

type PageParams = { slugCategorie: string };

/* ------------------------------------------------------------------ */
/*  1)  Pre-generate one static path per slug                          */
/* ------------------------------------------------------------------ */
export async function generateStaticParams(): Promise<PageParams[]> {
  // Endpoint must return e.g. ["electronics", "gaming-laptops", ...]
  const slugs = await fetchData<string[]>(
    "NavMenu/categorieSubCategoriePage/allSlugs"
  ).catch(() => []);

  return slugs.map((slug) => ({ slugCategorie: slug }));
}

/* ------------------------------------------------------------------ */
/*  2)  Build-time SEO metadata                                       */
/* ------------------------------------------------------------------ */
export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { slugCategorie } = await params;

  const cat = await fetchData<CategorieMeta>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => null);

  const title = cat?.name ?? "Catalogue";

  return {
    title,
    openGraph: {
      title,
      images: cat?.bannerUrl ? [cat.bannerUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: cat?.bannerUrl ? [cat.bannerUrl] : [],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  3)  Page component (Server)                                       */
/* ------------------------------------------------------------------ */
export default async function CategoriePage(
  { params }: { params: Promise<PageParams> }
) {
  const { slugCategorie } = await params;

  /* fetch banner data */
  const categorie = await fetchData<CategorieMeta>(
    `NavMenu/categorieSubCategoriePage/${slugCategorie}`
  ).catch(() => null);

  return (
    <div className="flex flex-col gap-6">
      {categorie?.name && categorie.bannerUrl && (
        <Banner title={categorie.name} imageBanner={categorie.bannerUrl} />
      )}

      <ProductSectionCategoriePage slugCategorie={slugCategorie} />
    </div>
  );
}
