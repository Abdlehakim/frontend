// src/components/product/ProductDetails.tsx
'use client';

import React from 'react';
import { Product } from '@/types/Product';

// parseInfoString safely handles undefined or null
function parseInfoString(info?: string | null): Record<string, string> {
  const text = info ?? '';
  const lines = text.split(/\r?\n/);
  const entries: Record<string, string> = {};

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    if (!rawKey || rest.length === 0) continue;
    const key = rawKey.trim().toLowerCase();
    entries[key] = rest.join(':').trim();
  }

  return entries;
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const infoMap = parseInfoString(product.info);

  const brandName =
    product.brand?.name || infoMap['brande'] || infoMap['brand'] || 'N/A';
  const colorName =
    infoMap['couleur'] || infoMap['color'] || undefined;
  const materialName =
    infoMap['matière'] || infoMap['material'] || undefined;
  const dimensionValue =
    infoMap['dimension'] || infoMap['dimensions'] || undefined;
  const weightValue =
    infoMap['poid'] || infoMap['poids'] || infoMap['weight'] || undefined;
  const warrantyValue =
    infoMap['warranty'] || infoMap['garantie'] || undefined;

  return (
    <div className="flex max-lg:flex-col justify-around items-center gap-[16px]">
      {/* Left: Specifications */}
      <div className="lg:w-[45%] w-full flex flex-col justify-around gap-[16px]">
        <p className="text-xl font-bold">Product details</p>

        {brandName !== 'N/A' && (
          <div className="flex items-center justify-between border-b-2">
            <p>Brand</p>
            <p className="text-[#525566]">{brandName}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-b-2">
          <p>Collection</p>
          <p className="text-[#525566]">Soft Edge Collection</p>
        </div>

        {colorName && (
          <div className="flex items-center justify-between border-b-2">
            <p>Color</p>
            <p className="text-[#525566]">{colorName}</p>
          </div>
        )}

        {materialName && (
          <div className="flex items-center justify-between border-b-2">
            <p>Materials</p>
            <p className="text-[#525566]">{materialName}</p>
          </div>
        )}

        {dimensionValue && (
          <div className="flex items-center justify-between border-b-2">
            <p>General dimensions</p>
            <p className="text-[#525566]">{dimensionValue}</p>
          </div>
        )}

        {weightValue && (
          <div className="flex items-center justify-between border-b-2">
            <p>Product weight</p>
            <p className="text-[#525566]">{weightValue}</p>
          </div>
        )}

        {warrantyValue && (
          <div className="flex items-center justify-between">
            <p>Warranty</p>
            <p className="text-[#525566]">{warrantyValue}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="lg:w-[45%] flex flex-col gap-[16px]">
          <p className="text-xl font-bold">Description</p>
          <p className="text-[#525566]">{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
