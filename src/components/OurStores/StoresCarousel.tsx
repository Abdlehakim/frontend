"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

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
    flex: `0 0 ${90 / itemsPerSlide}%`
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

        {/* Overlay Info – hidden until hover */}
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-start items-start px-20 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h2 className="text-2xl font-bold uppercase text-white mb-4">
            {store.name}
          </h2>

          <div className="flex flex-col gap-2 text-white">
            <div className="flex items-center gap-2">
              <FaPhoneAlt size={20} />
              <span className="font-semibold">{store.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt size={20} />
              <span className="font-semibold">
                {store.address}, {store.city}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg text-white mb-2">
              TEMPS OUVERT :
            </h3>
            <ul className="text-sm text-white space-y-1">
              {Object.entries(store.openingHours).map(([day, hours]) => (
                <li key={day} className="flex gap-2">
                  <span className="font-medium">{day}:</span>
                  {Array.isArray(hours) && hours.length > 0
                    ? hours
                        .map(({ open, close }) =>
                          open || close ? `${open} - ${close}` : ""
                        )
                        .filter(Boolean)
                        .join(" / ") || "fermé"
                    : "fermé"}
                </li>
              ))}
            </ul>
          </div>
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 p-1"
          aria-label="Previous slide"
        >
          <FaRegArrowAltCircleLeft size={40} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 p-1 "
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
              idx === currentSlide ? "bg-black" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StoresCarousel;
