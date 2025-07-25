import React from "react";
import Image from "next/image";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

interface BrandTitles {
  HPbrandTitle?: string | null;
  HPbrandSubTitle?: string | null;
}

interface Brand {
  _id: string;
  name: string;
  place?: string;
  description?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  reference?: string;
  slug?: string;
  vadmin?: "approve" | "not-approve";
  createdBy?: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default async function BrandsPage() {
  const titles = (await fetchData<BrandTitles>("brands/titles")) ?? {};
  const brands = (await fetchData<Brand[]>("brands")) ?? [];

  if (brands.length === 0) return null;

  return (
    <section className="w-[95%] flex flex-col gap-[40px] max-md:gap-[16px] py-8 max-md:py-2">
      <div className="flex w-full flex-col items-center gap-2 justify-center">
        <h3 className="font-bold text-2xl text-HomePageTitles capitalize text-center max-md:text-lg">
          {titles.HPbrandTitle}
        </h3>
        <p className="test-base max-md:text-sm text-[#525566] text-center">
          {titles.HPbrandSubTitle}
        </p>
      </div>

      <div className="group w-[80%] flex max-md:flex-col justify-center gap-[8px] mx-auto">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="group/article relative w-full rounded-xl overflow-hidden
                       md:group-hover:[&:not(:hover)]:w-[20%]
                       md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%]
                       transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)]
                       focus-within:ring focus-within:ring-indigo-300 cursor-pointer"
          >
            <div className="relative w-full h-[400px] max-md:h-[300px]">
              <Image
                src={brand.imageUrl || ""}
                alt={brand.name}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 80vw"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
                loading="lazy"
              />
            </div>

            <div className="absolute max-md:h-[10%] top-0 left-0 w-full h-[15%] bg-primary" />

            <div
              className="absolute bottom-0 left-0 w-full h-[25%] bg-primary
                            opacity-0 max-md:opacity-100 group-hover/article:opacity-100 transition-opacity duration-200
                            flex justify-center items-center gap-4"
            >
              <div className="rounded-full w-40 h-40 max-md:w-20 max-md:h-20 border-primary border-4 bg-white flex items-center justify-center z-40">
                <div className="relative w-24 h-24 max-md:w-14 max-md:h-14">
                  <Image
                    src={brand.logoUrl || ""}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 80vw"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex flex-col w-[60%]">
                <p className="text-white font-bold max-md:text-xs">{brand.place}</p>
                <p className="text-white max-md:text-xs truncate">
  {brand.description}
</p>
              </div>
            </div>

            <span
              className="absolute inset-x-0 top-0 text-2xl max-lg:text-xs max-xl:text-sm
                             uppercase tracking-widest font-bold p-4 max-md:p-2 text-white z-20
                             transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)]"
            >
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
