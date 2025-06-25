// src/components/homepage/Categories.tsx
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
  // Fetch titles and categories with inline fallbacks
  const categorieTitles: CategorieTitles =
    await fetchData<CategorieTitles>("categories/title").catch(
      () => ({} as CategorieTitles)
    );

  const categories: Categories[] =
    await fetchData<Categories[]>("categories").catch(
      () => [] as Categories[]
    );

  return (
    <>
      {categories.length > 0 && (
        <div className="desktop max-md:w-[95%] max-md:gap-[10px] flex flex-col gap-[40px] py-8">
          <div className="flex-col flex gap-[8px] items-center w-full max-lg:text-center">
            <h3 className="font-bold text-2xl text-HomePageTitles capitalize">
              {categorieTitles.HPcategorieTitle ?? ""}
            </h3>
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
                  <p className="absolute top-1/2 left-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 bg-white text-black text-lg rounded-3xl text-center py-1 max-xl:px-3 transition-all">
                    {categorie.name}
                  </p>
                  <p className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg opacity-0 lg:group-hover:opacity-100 transition-opacity pt-2 max-xl:text-xs">
                    {categorie.numberproduct}
                  </p>
                  <Image
                    className="rounded-full w-[400px] h-[400px] object-cover"
                    src={categorie.imageUrl || "/fallback-image.jpg"}
                    alt={categorie.name}
                    width={100}
                    height={100}
                    placeholder="blur"
                    blurDataURL={categorie.imageUrl || "/fallback-image.jpg"}
                    sizes="(max-width: 640px) 15vw, (max-width: 1200px) 15vw"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
