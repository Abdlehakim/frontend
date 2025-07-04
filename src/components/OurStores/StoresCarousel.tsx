/* ------------------------------------------------------------------ */
/*  app/components/StoresCarousel.tsx                                 */
/* ------------------------------------------------------------------ */
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FaRegClock,
  FaMapMarkerAlt,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

/* ---------- types ---------- */
interface OpeningHours {
  [day: string]: { open: string; close: string }[];
}

export interface StoreType {
  _id?: string;
  name: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: OpeningHours;
}

interface StoresProps {
  storesData: StoreType[];
}

interface StoresCardProps {
  store: StoreType;
  itemsPerSlide: number;
}

/* ---------- card ---------- */
const StoresCard: React.FC<StoresCardProps> = ({ store, itemsPerSlide }) => (
  /* merged the two .relative wrappers into one */
  <div
    className="relative group cursor-pointer"
    style={{ flex: `0 0 ${90 / itemsPerSlide}%` }}
  >
    {store.image && (
      <Image
        src={store.image}
        alt={store.name}
        width={640}
        height={540}
        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        className="w-full h-[400px] max-sm:h-[200px] object-cover rounded-xl"
      />
    )}

    <h2 className="bg-primary absolute top-0 w-full rounded-t-xl h-20 flex items-center justify-center text-2xl font-bold capitalize text-white tracking-wide border-b-8 border-secondary">
      {store.name}
    </h2>

    <div className="absolute top-20 h-72 w-full p-2 bg-black/80 flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="mt-4 ml-4 w-[90%]">
        <h3 className="font-semibold text-xl text-white">TEMPS OUVERT :</h3>
        <div className="h-[2px] w-full bg-white/40 my-1" />

        <ul className="text-sm divide-y divide-white/20">
          {Object.entries(store.openingHours).map(([day, hours]) => {
            const ranges =
              Array.isArray(hours) && hours.length
                ? hours
                    .map(({ open, close }) =>
                      open || close ? `${open} – ${close}` : ""
                    )
                    .filter(Boolean)
                : [];

            return (
              <li
                key={day}
                className="grid grid-cols-[auto_1fr] items-center gap-x-3 py-1 text-white tabular-nums"
              >
                {/* flattened: removed the inner span */}
                <span className="flex items-center gap-1.5 font-medium">
                  <FaRegClock size={12} />
                  {day}
                </span>

                {ranges.length ? (
                  <div className="flex items-center justify-end gap-x-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <BsSunFill size={12} />
                      {ranges[0]}
                    </span>
                    {ranges[1] && (
                      <span className="flex items-center gap-1.5">
                        <BsMoonFill size={12} />
                        {ranges[1]}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="justify-self-end">Fermé</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="h-[2px] w-full bg-white/40 my-1" />
      </div>
    </div>

    <div className="bg-primary h-12 absolute bottom-0 w-full flex items-center justify-center gap-4 text-xl text-white tracking-wide rounded-b-xl">
      <FaMapMarkerAlt size={20} />
      <span className="font-semibold">
        {store.address}, {store.city}
      </span>
    </div>
  </div>
);

/* ---------- indicator with 48-px hit-box ---------- */
function Dot({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative flex items-center justify-center w-12 h-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <span
        className={`block w-3 h-3 rounded-full ${
          active ? "bg-primary" : "bg-gray-300"
        }`}
      />
    </button>
  );
}

/* ---------- carousel ---------- */
const StoresCarousel: React.FC<StoresProps> = ({ storesData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  /* responsive break-points */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 1210) setItemsPerSlide(1);
      else if (w < 1620) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* slice stores into logical slides */
  const slides = useMemo(() => {
    const out: StoreType[][] = [];
    for (let i = 0; i < storesData.length; i += itemsPerSlide) {
      out.push(storesData.slice(i, i + itemsPerSlide));
    }
    return out;
  }, [storesData, itemsPerSlide]);

  const total = slides.length;

  const next = useCallback(
    () => setCurrentSlide((n) => (n + 1) % total),
    [total]
  );
  const prev = useCallback(
    () => setCurrentSlide((n) => (n - 1 + total) % total),
    [total]
  );

  return (
    <div className="py-8 w-full">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, i) => (
            /* ▶ only the active slide is populated to keep the DOM tiny */
            <div
              key={i}
              className="flex-shrink-0 w-full flex gap-4 justify-center"
            >
              {i === currentSlide &&
                slideItems.map((store) => (
                  <StoresCard
                    key={store._id ?? store.name}
                    store={store}
                    itemsPerSlide={itemsPerSlide}
                  />
                ))}
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-1 text-primary hover:text-secondary hover:scale-110"
        >
          <FaRegArrowAltCircleLeft size={40} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-1 text-primary hover:text-secondary hover:scale-110"
        >
          <FaRegArrowAltCircleRight size={40} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <Dot
            key={i}
            active={i === currentSlide}
            label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoresCarousel;
