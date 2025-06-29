/* ------------------------------------------------------------------ */
/*  Sub-category page (Server Component)                              */
/* ------------------------------------------------------------------ */
import Banner from "@/components/Banner";
import ProductSectionSubCategoriePage
  from "@/components/product/categorie/ProductSectionSubCategoriePage";
import { fetchData } from "@/lib/fetchData";
import type { Metadata } from "next";

/* ---------- ISR ---------- */
export const revalidate = 60;

/* ---------- types ---------- */
interface SectionData {
  _id:       string;
  name:      string | null;
  slug:      string | null;
  bannerUrl: string | null;
}
type PageParams = { slugSubCategorie: string };

/* ------------------------------------------------------------------ */
/*  (optional) Pre-generate paths                                     */
/* ------------------------------------------------------------------ */
export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await fetchData<string[]>(
    "NavMenu/categorieSubCategoriePage/allSlugs"
  ).catch(() => []);
  return slugs.map((slug) => ({ slugSubCategorie: slug }));
}

/* ------------------------------------------------------------------ */
/*  SEO metadata                                                      */
/* ------------------------------------------------------------------ */
export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { slugSubCategorie } = await params;

  const sub = await fetchData<SectionData>(
    `NavMenu/categorieSubCategoriePage/${slugSubCategorie}`
  ).catch(() => null);

  const title = sub?.name ?? "Catalogue";
  return {
    title,
    openGraph: { title, images: sub?.bannerUrl ? [sub.bannerUrl] : [] },
    twitter:   { card: "summary_large_image", title, images: sub?.bannerUrl ? [sub.bannerUrl] : [] },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function SubCategoriePage(
  { params }: { params: Promise<PageParams> }
) {
  const { slugSubCategorie } = await params;

  /* fetch sub-category meta (banner, name) */
  const sub = await fetchData<SectionData>(
    `NavMenu/categorieSubCategoriePage/${slugSubCategorie}`
  ).catch(() => null);

  return (
    <div className="flex flex-col gap-6">
      {sub?.name && sub.bannerUrl && (
        <Banner title={sub.name} imageBanner={sub.bannerUrl} />
      )}

      {/* ─── client component now fetches its own first batch ─── */}
      <ProductSectionSubCategoriePage slugSubCategorie={slugSubCategorie} />
    </div>
  );
}
