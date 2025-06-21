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

// Reuse the same interface from your server component,
// or define a local copy that matches exactly.
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

// Props for the main Carousel
interface StoresProps {
  storesData: StoreType[];
}

// Props for the individual card
interface StoresCardProps {
  store: StoreType;
  itemsPerSlide: number;
}

const StoresCard: React.FC<StoresCardProps> = ({ store, itemsPerSlide }) => {
  return (
    <div
      className="relative group"
      style={{
        flex: `0 0 ${90 / itemsPerSlide}%`,
      }}
    >
      {/* Image + overlay container */}
      <div className="relative">
        {store.image && (
          <Image
            src={store.image}
            alt={store.name}
            width={640}
            height={540}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-[400px] object-cover max-sm:h-[200px] rounded-xl"
          />
        )}

        <h2 className="bg-primary absolute top-0 w-full rounded-t-xl h-20 flex justify-center items-center text-2xl font-bold capitalize text-white tracking-wide border-b-8 border-secondary">
          {store.name}
        </h2>

        {/* Overlay Info – hidden until hover */}
        <div className="absolute top-20 h-72 w-full p-2 bg-black bg-opacity-80 flex flex-col justify-start items-start opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* <div className="flex flex-col gap-2 text-white">
            <div className="flex items-center gap-2">
              <FaPhoneAlt size={20} />
              <span className="font-semibold">{store.phoneNumber}</span>
            </div>
            
          </div> */}

          <div className="mt-4 ml-4 w-[90%]">
  <h3 className="font-semibold text-xl text-white">
    TEMPS OUVERT :
  </h3>

  {/* thin separator */}
  <div className="h-[2px] w-full bg-white/40 my-1" />

<ul className="text-sm divide-y divide-white/20">
  {Object.entries(store.openingHours).map(([day, hours]) => {
    // Build an array of non-empty ranges
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
        className="
          grid grid-cols-[auto_1fr] items-center gap-x-3 py-1
          text-white tabular-nums
        "
      >
        {/* left column: clock icon + day */}
        <span className="flex items-center gap-1.5">
          <FaRegClock size={12} />
          <span className="font-medium">{day}</span>
        </span>

        {/* right column: 1-or-2 ranges on ONE line */}
        {ranges.length ? (
          <div
            className="
              flex items-center justify-end gap-x-4
              whitespace-nowrap
            "
          >
            {/* first (morning) shift */}
            <span className="flex items-center gap-1.5">
              <BsSunFill size={12} />
              {ranges[0]}
            </span>

            {/* second (afternoon/evening) shift — render only if it exists */}
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



  {/* bottom separator */}
  <div className="h-[2px] w-full bg-white/40 my-1" />
</div>
        </div>
        <div className='bg-primary h-12 absolute bottom-0 w-full flex justify-center text-xl items-center gap-4 text-white tracking-wide rounded-b-xl'>
              <FaMapMarkerAlt size={20} />
              <span className="font-semibold">
                {store.address}, {store.city}
              </span>  
        </div>
      </div>
    </div>
  );
};

const StoresCarousel: React.FC<StoresProps> = ({ storesData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Dynamically update itemsPerSlide based on window width
  useEffect(() => {
    function updateItemsPerSlide() {
      const width = window.innerWidth;
      if (width < 1210) {
        setItemsPerSlide(1);
      } else if (width < 1620) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    }

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // Chunk storesData into slides
  const slides = useMemo(() => {
    const chunked: StoreType[][] = [];
    for (let i = 0; i < storesData.length; i += itemsPerSlide) {
      chunked.push(storesData.slice(i, i + itemsPerSlide));
    }
    return chunked;
  }, [storesData, itemsPerSlide]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return (
    <div className="py-8 w-full">
      <div className="relative overflow-hidden">
        {/* Slides Wrapper */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={`slide-${slideIndex}`}
              className="flex-shrink-0 w-full flex gap-4 justify-center"
            >
              {slideItems.map((store) => (
                <StoresCard
                  key={store._id}
                  store={store}
                  itemsPerSlide={itemsPerSlide}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 p-1 text-primary"
          aria-label="Previous slide"
        >
          <FaRegArrowAltCircleLeft size={40} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 p-1 text-primary"
          aria-label="Next slide"
        >
          <FaRegArrowAltCircleRight size={40} />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === currentSlide ? "bg-primary" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StoresCarousel;
