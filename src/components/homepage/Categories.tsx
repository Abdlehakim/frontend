import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchData } from "@/lib/fetchData";

interface CategorieTitles {
  HPcategorieTitle?: string | null;
  HPcategorieSubTitle?: string | null;
}

interface Categories {
  _id: string;
  reference: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  iconId?: string | null;
  imageUrl?: string | null;
  imageId?: string | null;
  bannerUrl?: string | null;
  bannerId?: string | null;
  vadmin: string;
  subCategorieCount?: number;
  numberproduct: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export const revalidate = 60;

export default async function CategoriesPage() {
  const categorieTitles = await fetchData<CategorieTitles>(
    "categories/title"
  ).catch(() => ({} as CategorieTitles));

  const categories = await fetchData<Categories[]>("categories").catch(
    () => [] as Categories[]
  );

  if (categories.length === 0) return null;

  return (
    <section className="desktop max-md:w-[95%] max-md:gap-[10px] flex flex-col gap-[40px] py-8">
      <div className="flex-col flex gap-[8px] items-center w-full max-lg:text-center">
        <h2 className="font-bold text-2xl text-HomePageTitles capitalize">
          {categorieTitles.HPcategorieTitle ?? ""}
        </h2>
        <p className="text-base text-[#525566]">
          {categorieTitles.HPcategorieSubTitle ?? ""}
        </p>
      </div>

      <div className="grid grid-cols-6 gap-[16px] w-full max-xl:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-3">
        {categories.map((categorie) => (
          <Link
            key={categorie._id}
            href={`/${categorie.slug}`}
            className="rounded-full"
          >
            <div className="relative rounded-full group overflow-hidden justify-center items-center aspect-square">
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 lg:group-hover:opacity-80 transition-opacity" />
              <p className="absolute top-1/2 left-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 bg-white text-black text-lg max-lg:text-sm rounded-3xl text-center py-1 max-xl:px-3 transition-all">
                {categorie.name.length > 8
                  ? `${categorie.name.slice(0, 8)}…`
                  : categorie.name}
              </p>
              <p className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg opacity-0 lg:group-hover:opacity-100 transition-opacity pt-2 max-xl:text-xs">
                {categorie.numberproduct}
              </p>
              <div className="relative w-full aspect-[16/16] -z-[10]">
                <Image
                  src={categorie.imageUrl ?? ""}
                  alt={categorie.name}
                  fill
                  priority
                  className="rounded-full object-cover"
                  sizes="(max-width:640px) 33vw,
                       (max-width:1024px) 25vw,
                       16vw"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
                  loading="lazy"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
