import React from "react";

interface Product {
  _id: string;
  name: string;
  ref: string;
  price: number;
  tva?: number;
  imageUrl: string;
  images?: string[];
  material?: string;
  color?: string;
  dimensions?: string;
  warranty?: string;
  weight?: string;
  discount?: number;
  status?: string;
  statuspage?: string;
  vadmin?: string;
  slug: string;
  nbreview?: number;
  averageRating?: number;
  stock?: number;
  info?: string; // The multiline string that has additional details
  description?: string;
  boutique?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id?: string;
    name?: string;
  } | null;
  category?: {
    _id: string;
    name?: string;
    slug?: string;
  } | null;
}

function parseInfoString(info: string = ""): Record<string, string> {
  const lines = info.split(/\r?\n/);
  const entries: Record<string, string> = {};

  lines.forEach((line) => {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) return;
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    entries[key] = value;
  });

  return entries;
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const infoMap = parseInfoString(product.info || "");

  const brandName =
    product.brand?.name || infoMap["brande"] || infoMap["brand"] || "N/A";

  // For color
  const colorName = product.color || infoMap["couleur"] || infoMap["color"];

  // For material
  const materialName =
    product.material || infoMap["matière"] || infoMap["material"];

  // For dimensions
  const dimensionValue =
    product.dimensions || infoMap["dimension"] || infoMap["dimensions"];

  // For weight
  const weightValue =
    product.weight || infoMap["poid"] || infoMap["poids"] || infoMap["weight"];

  // For warranty
  const warrantyValue =
    product.warranty || infoMap["warranty"] || infoMap["garantie"];

  // (You can add as many fields as you want here using the same pattern.)

  return (
    <div className="flex max-lg:flex-col justify-around items-center gap-[16px]">
      {/* Left section: Product specification details */}
      <div className="lg:w-[45%] w-full flex flex-col justify-around gap-[16px] ">

          <p className="text-xl font-bold">Product details</p>
    
          {/* Brand */}
          {brandName && brandName !== "N/A" && (
            <div className="flex items-center justify-between border-b-2">
              <p>Brand</p>
              <p className="text-[#525566]">{brandName}</p>
            </div>
          )}

          {/* Example field that is "hard-coded": */}
          <div className="flex items-center justify-between border-b-2">
            <p>Collection</p>
            <p className="text-[#525566]">Soft Edge Collection</p>
          </div>

          {/* Color */}
          {colorName && (
            <div className="flex items-center justify-between border-b-2">
              <p>Color</p>
              <p className="text-[#525566]">{colorName}</p>
            </div>
          )}

          {/* Material */}
          {materialName && (
            <div className="flex items-center justify-between border-b-2">
              <p>Materials</p>
              <p className="text-[#525566]">{materialName}</p>
            </div>
          )}

          {/* Dimensions */}
          {dimensionValue && (
            <div className="flex items-center justify-between border-b-2">
              <p>General dimensions</p>
              <p className="text-[#525566]">{dimensionValue}</p>
            </div>
          )}

          {/* Weight */}
          {weightValue && (
            <div className="flex items-center justify-between border-b-2">
              <p>Product weight</p>
              <p className="text-[#525566]">{weightValue}</p>
            </div>
          )}

          {/* Warranty */}
          {warrantyValue && (
            <div className="flex items-center justify-between">
              <p>Warranty</p>
              <p className="text-[#525566]">{warrantyValue}</p>
            </div>
          )}

      </div>


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
