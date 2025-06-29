/* ------------------------------------------------------------------ */
/*  src/components/product/filter/SubCategorieFilterProducts.tsx       */
/*  (Sub-category sidebar — now with an “Appliquer” button)            */
/* ------------------------------------------------------------------ */
"use client";

import React, {
  useState,
  useEffect,
  ReactElement,
  HTMLAttributes,
  cloneElement,
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
) {
  return cloneElement(origin, {
    role: "slider",
    "aria-label":
      index === 0
        ? "Minimum price slider handle"
        : "Maximum price slider handle",
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

/* ---------- prop types ---------- */
interface OptionItem {
  _id: string;
  name: string;
}
interface Props {
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
  selectedBoutique: string | null;
  setSelectedBoutique: (id: string | null) => void;
  minPrice: number | null;
  setMinPrice: (v: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (v: number | null) => void;

  brands: OptionItem[];
  boutiques: OptionItem[];

  sortOrder: "asc" | "desc";
  setSortOrder: (o: "asc" | "desc") => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const SubCategorieFilterProducts: React.FC<Props> = (props) => {
  /* ---------- local “draft” state ---------- */
  const [draftBrand,    setDraftBrand]    = useState(props.selectedBrand);
  const [draftBoutique, setDraftBoutique] = useState(props.selectedBoutique);
  const [draftMin,      setDraftMin]      = useState(props.minPrice);
  const [draftMax,      setDraftMax]      = useState(props.maxPrice);
  const [draftSort,     setDraftSort]     = useState<"asc" | "desc">(props.sortOrder);

  /* keep drafts in sync when parent resets */
  useEffect(() => setDraftBrand(props.selectedBrand),        [props.selectedBrand]);
  useEffect(() => setDraftBoutique(props.selectedBoutique),  [props.selectedBoutique]);
  useEffect(() => setDraftMin(props.minPrice),               [props.minPrice]);
  useEffect(() => setDraftMax(props.maxPrice),               [props.maxPrice]);
  useEffect(() => setDraftSort(props.sortOrder),             [props.sortOrder]);

  /* ---------- commit drafts ---------- */
  function applyFilters() {
    props.setSelectedBrand(draftBrand);
    props.setSelectedBoutique(draftBoutique);
    props.setMinPrice(draftMin);
    props.setMaxPrice(draftMax);
    props.setSortOrder(draftSort);
    setShowMobileFilters(false); // close mobile sheet
  }

  /* ---------- UI ---------- */
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      {/* mobile toggle */}
      <div className="xl:hidden flex justify-end">
        <button
          className="py-2 rounded w-60 border"
          onClick={() => setShowMobileFilters(true)}
        >
          Filtres
        </button>
      </div>

      {/* mobile sheet */}
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

            <button
              className="mt-6 w-full bg-primary text-white py-2 rounded"
              onClick={applyFilters}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <div
        className="hidden xl:flex flex-col
                    2xl:w-[20%] xl:w-[20%]
                    h-fit overflow-y-auto
                    px-4 my-8 border-2 border-primary rounded-md py-4 mx-4
                    sticky top-8"
      >
        {renderFilters()}

        <button
          className="mt-6 w-full bg-primary text-white py-2 rounded"
          onClick={applyFilters}
        >
          Appliquer
        </button>
      </div>
    </>
  );

  /* ---------- helpers ---------- */
  function renderFilters() {
    return (
      <div className="flex flex-col gap-4">
          {/* sort order */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sort-order" className="font-bold">
            Trier par prix :
          </label>
          <select
            id="sort-order"
            className="w-full p-2 border rounded"
            value={draftSort}
            onChange={(e) => setDraftSort(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Du moins cher</option>
            <option value="desc">Du plus cher</option>
          </select>
        </div>
        {/* brand */}
        <Select
          id="brand-filter"
          label="Marque"
          value={draftBrand}
          onChange={setDraftBrand}
          options={props.brands}
          placeholder="Toutes les marques"
        />

        {/* boutique */}
        <Select
          id="boutique-filter"
          label="Boutique"
          value={draftBoutique}
          onChange={setDraftBoutique}
          options={props.boutiques}
          placeholder="Toutes les boutiques"
        />

        {/* price range */}
        <div className="flex flex-col gap-2">
          <label className="font-bold">Prix :</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 p-2 border rounded"
              value={draftMin ?? ""}
              onChange={(e) =>
                setDraftMin(e.target.value ? Number(e.target.value) : null)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 p-2 border rounded"
              value={draftMax ?? ""}
              onChange={(e) =>
                setDraftMax(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
          <Slider
            range
            min={1}
            max={100000}
            value={[draftMin ?? 1, draftMax ?? 100000]}
            onChange={(vals) => {
              const [min, max] = vals as number[];
              setDraftMin(min);
              setDraftMax(max);
            }}
            allowCross={false}
            handleRender={handleRender}
          />
        </div>
      </div>
    );
  }
};

/* ---------- reusable select ---------- */
interface SelectProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
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

export default SubCategorieFilterProducts;
