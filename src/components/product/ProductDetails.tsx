"use client";

import Image from "next/image";
import { useState } from "react";
import type { FC } from "react";

export interface DetailRow {
  name: string;
  description?: string | null;
  image?: string | null;
}

interface Props {
  description?: string | null;
  productDetails?: DetailRow[] | null;
}

const ProductDetails: FC<Props> = ({ description, productDetails }) => {
  const [selectedTab, setSelectedTab] = useState(productDetails?.[0]?.name || "");
  const currentRow = productDetails?.find((row) => row.name === selectedTab);

  if (!description && (!productDetails || productDetails.length === 0)) return null;

  return (
    <section className="bg-white rounded border p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Détails du produit</h2>

      {/* ---- description always visible ---- */}
      {description && (
        <p className="text-gray-700 leading-relaxed">{description}</p>
      )}

      {/* ---- tab header (modern underline style) ---- */}
      {productDetails && productDetails.length > 0 && (
        <>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {productDetails.map((row) => (
                <button
                  key={row.name}
                  onClick={() => setSelectedTab(row.name)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    selectedTab === row.name
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {row.name}
                </button>
              ))}
            </nav>
          </div>

          {/* ---- selected tab content ---- */}
          {currentRow && (
            <div className="flex flex-wrap md:flex-nowrap gap-8 pt-6">
              {/* left: description */}
              <div className="flex-1 text-gray-800 whitespace-pre-line w-fit">
                {currentRow.description}
              </div>

              {/* right: image if available */}
              {currentRow.image && (
                <div className="relative max-w-[500px] min-h-[400px] aspect-[16/2]">
                  <Image
                    src={currentRow.image}
                    alt={currentRow.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductDetails;
