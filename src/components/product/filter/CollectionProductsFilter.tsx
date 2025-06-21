"use client";

import React, { ReactElement, HTMLAttributes, cloneElement, useState } from "react";
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
  const ariaLabel = index === 0 ? "Minimum price" : "Maximum price";
  return cloneElement(origin, {
    role: "slider",
    "aria-label": ariaLabel,
    "aria-valuemin": 1,
    "aria-valuemax": 200000,
    "aria-valuenow": value,
    style: { ...origin.props.style, borderColor: "#007bff", backgroundColor: "#fff" },
  });
}

/* ---------- prop types ---------- */
interface OptionItem {
  _id: string;
  name: string;
}

interface Props {
  /* selections */
  selectedCategorie: string | null;
  setSelectedCategorie: (id: string | null) => void;
  selectedSubCategorie: string | null;
  setSelectedSubCategorie: (id: string | null) => void;
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
  selectedBoutique: string | null;
  setSelectedBoutique: (id: string | null) => void;

  /* price */
  minPrice: number | null;
  setMinPrice: (v: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (v: number | null) => void;

  /* option lists */
  categories: OptionItem[];
  subcategories: OptionItem[];
  brands: OptionItem[];
  boutiques: OptionItem[];

  /* sort */
  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
}

const CollectionProductsFilter: React.FC<Props> = ({
  selectedCategorie,
  setSelectedCategorie,
  selectedSubCategorie,
  setSelectedSubCategorie,
  selectedBrand,
  setSelectedBrand,
  selectedBoutique,
  setSelectedBoutique,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  subcategories,
  brands,
  boutiques,
  sortOrder,
  setSortOrder,
}) => {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <>
      {/* mobile toggle */}
      <div className="xl:hidden flex justify-end">
        <button className="border rounded w-60 py-2" onClick={() => setOpenMobile(true)}>
          Filtres
        </button>
      </div>

      {openMobile && (
        <div className="fixed inset-0 bg-black/50 xl:hidden flex items-end z-40">
          <div className="bg-white w-[90%] mx-auto p-8 rounded-2xl mb-60">
            <button
              className="text-blue-600 font-bold w-full text-right mb-4"
              onClick={() => setOpenMobile(false)}
            >
              Fermer ✕
            </button>
            <div className="flex flex-col gap-4">{renderFilters()}</div>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <div className="hidden xl:flex flex-col 2xl:w-[15%] xl:w-[20%] px-4">
        {renderFilters()}
      </div>
    </>
  );

  /* ---------- helpers ---------- */
  function renderFilters() {
    return (
      <>
        <Select
          id="categorie"
          label="Catégorie"
          value={selectedCategorie}
          onChange={setSelectedCategorie}
          options={categories}
          placeholder="Toutes les catégories"
        />

        <Select
          id="subcategorie"
          label="Sous-catégorie"
          value={selectedSubCategorie}
          onChange={setSelectedSubCategorie}
          options={subcategories}
          placeholder="Toutes les sous-catégories"
        />

        <Select
          id="brand"
          label="Marque"
          value={selectedBrand}
          onChange={setSelectedBrand}
          options={brands}
          placeholder="Toutes les marques"
        />

        <Select
          id="boutique"
          label="Boutique"
          value={selectedBoutique}
          onChange={setSelectedBoutique}
          options={boutiques}
          placeholder="Toutes les boutiques"
        />

        {/* price */}
        <div className="mb-4">
          <label className="font-bold">Prix :</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded p-2"
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded p-2"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <Slider
            range
            min={1}
            max={10000}
            value={[minPrice ?? 1, maxPrice ?? 10000]}
            allowCross={false}
            onChange={(vals) => {
              const [min, max] = vals as number[];
              setMinPrice(min);
              setMaxPrice(max);
            }}
            handleRender={handleRender}
          />
        </div>

        {/* sort */}
        <div className="mb-4">
          <label htmlFor="sort" className="font-bold">
            Trier par prix :
          </label>
          <select
            id="sort"
            className="w-full border rounded p-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Du moins cher</option>
            <option value="desc">Du plus cher</option>
          </select>
        </div>
      </>
    );
  }
};

/* ---------- tiny reusable select ---------- */
interface SelectProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: OptionItem[];
  placeholder: string;
}
const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="font-bold">
      {label} :
    </label>
    <select
      id={id}
      className="w-full border rounded p-2"
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

export default CollectionProductsFilter;
