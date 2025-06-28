"use client";

import React, {
  ReactElement,
  HTMLAttributes,
  cloneElement,
  useState,
} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/* ---------- slider handle ---------- */
interface RenderProps {
  index: number;
  value: number;
  dragging: boolean;
}
function handleRender(
  origin: ReactElement<HTMLAttributes<HTMLDivElement>>,
  { index, value }: RenderProps
): ReactElement<HTMLAttributes<HTMLDivElement>> {
  const ariaLabel =
    index === 0 ? "Minimum price slider handle" : "Maximum price slider handle";

  return cloneElement(origin, {
    role: "slider",
    "aria-label": ariaLabel,
    "aria-valuemin": 1,
    "aria-valuemax": 200000,
    "aria-valuenow": value,
    style: {
      ...origin.props.style,
      borderColor: "#007bff",
      backgroundColor: "#fff",
    },
  });
}

/* ---------- prop types ---------- */
interface OptionItem {
  _id: string;
  name: string;
}
interface FilterProductsProps {
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
  selectedBoutique: string | null;
  setSelectedBoutique: (id: string | null) => void;
  selectedSubCategorie: string | null;
  setSelectedSubCategorie: (id: string | null) => void;

  minPrice: number | null;
  setMinPrice: (v: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (v: number | null) => void;

  brands: OptionItem[];
  boutiques: OptionItem[];
  subcategories: OptionItem[];

  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
}

const FilterProducts: React.FC<FilterProductsProps> = ({
  selectedBrand,
  setSelectedBrand,
  selectedBoutique,
  setSelectedBoutique,
  selectedSubCategorie,
  setSelectedSubCategorie,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brands,
  boutiques,
  subcategories,
  sortOrder,
  setSortOrder,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      {/* ===== mobile toggle ===== */}
      <div className="hidden">
        <button
          className="py-2 rounded w-60 border"
          onClick={() => setShowMobileFilters(true)}
        >
          Filtres
        </button>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end xl:hidden z-40">
          <div className="bg-white mx-auto w-[90%] p-8 rounded-2xl mb-60">
            <button
              className="text-right w-full text-blue-600 font-bold mb-4"
              onClick={() => setShowMobileFilters(false)}
            >
              Fermer ✕
            </button>
            <div className="flex flex-col gap-4">{renderFilters()}</div>
          </div>
        </div>
      )}

      {/* ===== desktop sidebar ===== */}
      <div
        className="hidden xl:flex flex-col
    2xl:w-[20%] xl:w-[20%]
    h-fit overflow-y-auto
    px-4 my-8 border-2 border-primary rounded-md py-4 mx-4
sticky top-8"
      >
        {renderFilters()}
      </div>
    </>
  );

  /* ---------- helpers ---------- */
  function renderFilters() {
    return (
      <div className="flex flex-col gap-4">
        <SelectFilter
          id="brand-filter"
          label="Marque"
          value={selectedBrand}
          onChange={setSelectedBrand}
          options={brands}
          placeholder="Toutes les marques"
        />

        <SelectFilter
          id="boutique-filter"
          label="Boutique"
          value={selectedBoutique}
          onChange={setSelectedBoutique}
          options={boutiques}
          placeholder="Toutes les boutiques"
        />

        <SelectFilter
          id="subcategory-filter"
          label="Sous-catégorie"
          value={selectedSubCategorie}
          onChange={setSelectedSubCategorie}
          options={subcategories}
          placeholder="Toutes les sous-catégories"
        />

        {/* ----- price range ----- */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Prix :</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 p-2 border rounded"
              value={minPrice ?? ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : null)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 p-2 border rounded"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
          <Slider
            range
            min={1}
            max={10000}
            value={[minPrice ?? 1, maxPrice ?? 10000]}
            onChange={(vals) => {
              const [min, max] = vals as number[];
              setMinPrice(min);
              setMaxPrice(max);
            }}
            allowCross={false}
            handleRender={handleRender}
          />
        </div>

        {/* ----- sort ----- */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sort-order" className="font-bold">
            Trier par prix :
          </label>
          <select
            id="sort-order"
            className="w-full p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Du moins cher</option>
            <option value="desc">Du plus cher</option>
          </select>
        </div>
      </div>
    );
  }
};

/* ---------- small reusable select component ---------- */
interface SelectFilterProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  options: OptionItem[];
  placeholder: string;
}
const SelectFilter: React.FC<SelectFilterProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-bold">
      {label} :
    </label>
    <select
      id={id}
      className="w-full p-2 border rounded"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o._id} value={o._id}>
          {o.name}
        </option>
      ))}
    </select>
  </div>
);

export default FilterProducts;
