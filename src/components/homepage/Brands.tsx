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
    <section className="max-md:w-[95%] flex flex-col gap-[40px] max-md:gap-[16px] py-8">
      <div className="flex flex-col gap-[8px] max-md:gap-[4px] text-center w-full">
        <h3 className="font-bold text-2xl text-HomePageTitles capitalize">
          {titles.HPbrandTitle}
        </h3>
        <p className="text-base text-[#525566]">{titles.HPbrandSubTitle}</p>
      </div>

      <div className="group w-[80%] flex max-md:flex-col justify-center gap-[8px] mx-auto">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="group/article relative w-full h-[500px] rounded-xl overflow-hidden
                       md:group-hover:[&:not(:hover)]:w-[20%]
                       md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%]
                       transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)]
                       focus-within:ring focus-within:ring-indigo-300 cursor-pointer"
          >
            <Image
              src={brand.imageUrl || "/fallback.jpg"}
              alt={brand.name}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width:1024px) 100vw, 80vw"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
              loading="lazy"
            />

            <div className="absolute max-md:hidden top-0 left-0 w-full h-[15%] bg-primary" />

            <div className="absolute max-md:hidden bottom-0 left-0 w-full h-[25%] bg-primary
                            opacity-0 group-hover/article:opacity-100 transition-opacity duration-200
                            flex justify-center items-center gap-4">
              <div className="rounded-full w-40 h-40 border-primary border-4 bg-white flex items-center justify-center z-40">
                <Image
                  src={brand.logoUrl || "/fallback.jpg"}
                  alt={`${brand.name} logo`}
                  width={100}
                  height={100}
                  className="w-[90px] h-auto"
                  sizes="100px"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col w-[70%]">
                <span className="text-white font-bold">{brand.place}</span>
                <span className="text-white">
                  {brand.description
                    ? `${brand.description.slice(0, 200)}${
                        brand.description.length > 200 ? "…" : ""
                      }`
                    : ""}
                </span>
              </div>
            </div>

            <span className="absolute inset-x-0 top-0 text-2xl max-lg:text-xs max-xl:text-sm
                             uppercase tracking-widest font-bold p-4 text-white z-20
                             transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)]">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
