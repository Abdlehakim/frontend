/* ------------------------------------------------------------------ */
/*  ProductDetails – affiche description + tableau de caractéristiques*/
/* ------------------------------------------------------------------ */
import type { FC } from "react";

interface DetailRow {
  name: string;
  description?: string | null;
}

interface Props {
  description?: string | null;
  productDetails?: DetailRow[] | null;
}

const ProductDetails: FC<Props> = ({ description, productDetails }) => {
  /* rien à afficher ? */
  if (!description && (!productDetails || productDetails.length === 0)) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Détails du produit</h2>

      {description && (
        <p className="text-gray-700 leading-relaxed">{description}</p>
      )}

      {productDetails && productDetails.length > 0 && (
        <ul className="space-y-2">
          {productDetails.map((row) => (
            <li key={row.name} className="flex gap-2">
              <span className="min-w-[140px] font-medium">{row.name} :</span>
              {row.description && (
                <span className="text-gray-700">{row.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductDetails;
