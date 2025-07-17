// ───────────────────────────────────────────────────────────────
// src/components/ProductDetails.tsx
// ───────────────────────────────────────────────────────────────
"use client";

import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FC } from "react";

export interface DetailRow {
  name: string;
  description?: string | null; // markdown
  image?: string | null;
}

interface Props {
  description?: string | null;        // plain intro paragraph
  productDetails?: DetailRow[] | null;
}

const ProductDetails: FC<Props> = ({ description, productDetails }) => {
  /* pick first tab by default (safe-guard for empty array) */
  const firstName = productDetails?.[0]?.name ?? "";
  const [selectedTab, setSelectedTab] = useState(firstName);
  const currentRow = productDetails?.find((r) => r.name === selectedTab);

  if (!description && (!productDetails || productDetails.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white rounded border p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Détails du produit</h2>

      {/* intro description (always visible) */}
      {description && (
        <p className="text-gray-700 leading-relaxed">{description}</p>
      )}

      {/* tabs */}
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

          {/* selected panel */}
          {currentRow && (
            <div className="flex flex-wrap md:flex-nowrap gap-8 pt-6">
              {/* markdown description */}
              <div className="flex-1 prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentRow.description ?? ""}
                </ReactMarkdown>
              </div>

              {/* optional image */}
              {currentRow.image && (
                <div className="relative max-md:max-w-full max-w-[500px] min-h-[400px] aspect-[16/2]">
                  <Image
                    src={currentRow.image}
                    alt={currentRow.name}
                    fill
                    className="object-contain"
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
