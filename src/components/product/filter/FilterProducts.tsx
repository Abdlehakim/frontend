"use client";

import React, { useState, useEffect, ReactElement, HTMLAttributes, cloneElement } from "react";
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
) {
  const ariaLabel = index === 0 ? "Minimum price" : "Maximum price";
  return cloneElement(origin, {
    role: "slider",
    "aria-label": ariaLabel,
    "aria-valuemin": 1,
    "aria-valuemax": 100000,
    "aria-valuenow": value,
    style: {
      ...origin.props.style,
      borderColor: "#007bff",
      backgroundColor: "#fff",
    },
  });
}

/* ---------- types ---------- */
interface OptionItem {
  _id: string;
  name: string;
}
interface Props {
  /** catégorie, optional when hidden */
  selectedCategorie?: string | null;
  setSelectedCategorie?: (id: string | null) => void;
  /** sous-catégorie */
  selectedSubCategorie: string | null;
  setSelectedSubCategorie: (id: string | null) => void;
  /** marque */
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
  /** boutique */
  selectedBoutique: string | null;
  setSelectedBoutique: (id: string | null) => void;

  minPrice: number | null;
  setMinPrice: (v: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (v: number | null) => void;

  /** list of catégories, optional when hidden */
  categories?: OptionItem[];
  /** list of sous-catégories */
  subcategories: OptionItem[];
  brands: OptionItem[];
  boutiques: OptionItem[];

  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
  /** hide sous-catégorie select */
  hideSubcategorie?: boolean;
  /** hide catégorie select */
  hideCategorie?: boolean;
}

const ProductsFilter: React.FC<Props> = ({
  selectedCategorie = null,
  setSelectedCategorie = () => {},
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
  categories = [],
  subcategories,
  brands,
  boutiques,
  sortOrder,
  setSortOrder,
  hideSubcategorie = false,
  hideCategorie = false,
}) => {
  /* local draft state */
  const [categDraft, setCategDraft] = useState<string | null>(selectedCategorie);
  const [subDraft, setSubDraft] = useState<string | null>(selectedSubCategorie);
  const [brandDraft, setBrandDraft] = useState<string | null>(selectedBrand);
  const [boutiqueDraft, setBoutiqueDraft] = useState<string | null>(selectedBoutique);
  const [minDraft, setMinDraft] = useState<number | null>(minPrice);
  const [maxDraft, setMaxDraft] = useState<number | null>(maxPrice);
  const [sortDraft, setSortDraft] = useState<"asc" | "desc">(sortOrder);

  /* sync drafts when parent resets */
  useEffect(() => setCategDraft(selectedCategorie), [selectedCategorie]);
  useEffect(() => setSubDraft(selectedSubCategorie), [selectedSubCategorie]);
  useEffect(() => setBrandDraft(selectedBrand), [selectedBrand]);
  useEffect(() => setBoutiqueDraft(selectedBoutique), [selectedBoutique]);
  useEffect(() => setMinDraft(minPrice), [minPrice]);
  useEffect(() => setMaxDraft(maxPrice), [maxPrice]);
  useEffect(() => setSortDraft(sortOrder), [sortOrder]);

  /* UI state */
  const [openMobile, setOpenMobile] = useState(false);

  /* commit drafts */
  function applyFilters() {
    setSelectedCategorie?.(categDraft);
    setSelectedSubCategorie(subDraft);
    setSelectedBrand(brandDraft);
    setSelectedBoutique(boutiqueDraft);
    setMinPrice(minDraft);
    setMaxPrice(maxDraft);
    setSortOrder(sortDraft);
    setOpenMobile(false);
  }

  /* render filters UI */
  function renderFilters() {
    return (
      <div className="flex flex-col gap-4">
        {!hideCategorie && (
          <Select
            id="categorie"
            label="Catégorie"
            value={categDraft}
            onChange={setCategDraft}
            options={categories}
            placeholder="Toutes les catégories"
          />
        )}

        {!hideSubcategorie && (
          <Select
            id="subcategorie"
            label="Sous-catégorie"
            value={subDraft}
            onChange={setSubDraft}
            options={subcategories}
            placeholder="Toutes les sous-catégories"
          />
        )}

        <Select
          id="brand"
          label="Marque"
          value={brandDraft}
          onChange={setBrandDraft}
          options={brands}
          placeholder="Toutes les marques"
        />

        <Select
          id="boutique"
          label="Boutique"
          value={boutiqueDraft}
          onChange={setBoutiqueDraft}
          options={boutiques}
          placeholder="Toutes les boutiques"
        />

        {/* price */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Prix :</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded p-2"
              value={minDraft ?? ""}
              onChange={(e) => setMinDraft(e.target.value ? Number(e.target.value) : null)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded p-2"
              value={maxDraft ?? ""}
              onChange={(e) => setMaxDraft(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <Slider
            range
            min={1}
            max={100000}
            value={[minDraft ?? 1, maxDraft ?? 100000]}
            allowCross={false}
            onChange={(vals) => {
              const [min, max] = vals as number[];
              setMinDraft(min);
              setMaxDraft(max);
            }}
            handleRender={handleRender}
          />
        </div>

        {/* sort */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sort" className="font-bold">Trier par prix :</label>
          <select
            id="sort"
            className="w-full border rounded p-2"
            value={sortDraft}
            onChange={(e) => setSortDraft(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Du moins cher</option>
            <option value="desc">Du plus cher</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* mobile toggle */}
      <div className="xl:hidden flex w-full justify-end">
        <button className="py-2 rounded w-60 border" onClick={() => setOpenMobile(true)}>Filtres</button>
      </div>

      {openMobile && (
        <div className="fixed inset-0 bg-black/50 flex items-end xl:hidden z-50">
          <div className="bg-white absolute top-8 left-1/2 transform -translate-x-1/2 w-[90%] p-8 rounded-2xl">
            <button className="text-blue-600 font-bold w-full text-right mb-4" onClick={() => setOpenMobile(false)}>Fermer ✕</button>
            <div className="flex flex-col gap-4">{renderFilters()}</div>
            <button className="mt-6 w-full bg-primary text-white py-2 rounded" onClick={applyFilters}>Appliquer</button>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <div className="hidden xl:flex flex-col 2xl:w-[20%] xl:w-[20%] h-fit overflow-y-auto px-4 my-8 border-2 border-primary rounded-md py-4 mx-4 sticky top-8">
        {renderFilters()}
        <button className="mt-6 w-full bg-primary text-white py-2 rounded" onClick={applyFilters}>Appliquer</button>
      </div>
    </>
  );
};

/* ---------- reusable select ---------- */
interface SelectProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options?: OptionItem[];
  placeholder: string;
}
const Select: React.FC<SelectProps> = ({ id, label, value, onChange, options = [], placeholder }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-bold">{label} :</label>
    <select id={id} className="w-full p-2 border rounded" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o._id} value={o._id}>{o.name}</option>
      ))}
    </select>
  </div>
);

export default ProductsFilter;
