/* ------------------------------------------------------------------ */
/*  ProductDetails – affiche description + tableau de caractéristiques */
/* ------------------------------------------------------------------ */
import Image from "next/image";
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
  /* rien à afficher ? */
  if (!description && (!productDetails || productDetails.length === 0))
    return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Détails du produit</h2>

      {/* ---- description ---- */}
      {description && (
        <p className="text-gray-700 leading-relaxed">{description}</p>
      )}

      {/* ---- tableau de caractéristiques ---- */}
      {productDetails && productDetails.length > 0 && (
        <ul className="space-y-2">
          {productDetails.map((row) => (
            <li key={row.name} className="flex items-center gap-2">
              {/* label */}
              <span className="min-w-[140px] font-medium">{row.name} :</span>

              {/* texte */}
              {row.description && (
                <span className="text-gray-700">{row.description}</span>
              )}

              {/* éventuelle image */}
              {row.image && (
                <Image
                  src={row.image}
                  alt={row.name}
                  width={300}
                  height={300}
                  className="rounded border object-cover ml-2"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductDetails;
