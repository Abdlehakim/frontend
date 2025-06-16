// app/components/Headerbottom/Headerbottom.tsx
import React from "react";
import Headerbottomleft from "./Headerbottomleft";
import Headerbottomright from "./Headerbottonright";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 60;

export interface Categories {
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

export default async function Headerbottom() {
  let categories: Categories[] = [];

  try {
    const fetched = await fetchData<Categories[]>("categories");
    if (Array.isArray(fetched)) {
      categories = fetched;
    }
  } catch (err) {
    console.error("Error fetching categories, using empty list:", err);
  }

  return (
    <header>
      <div className="w-full h-[80px] bg-primary flex justify-center items-center border-y border-gray-600">
        <div className="w-[90%] h-full flex justify-between max-lg:justify-center items-center">
          {categories.length > 0 && <Headerbottomleft categories={categories} />}
          <Headerbottomright />
        </div>
      </div>
    </header>
  );
}