"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars } from "react-icons/fa6";
import { fetchData } from "@/lib/fetchData";

// Follow src/models/stock/Categorie.ts interface
export interface Categorie {
  _id: string;
  reference: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
}

// Added iconUrl to subcategories interface
export interface SubCategorie {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
}

interface HeaderbottomleftProps {
  categories: Categorie[];
}
interface InlineOrImgProps {
  url: string;
  className?: string;
  alt?: string;
}

const InlineOrImg: React.FC<InlineOrImgProps> = ({
  url,
  className,
  alt,
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  const isSvg = /\.svg($|\?)/i.test(url);

  useEffect(() => {
    if (!isSvg) return;
    let canceled = false;

    fetch(url)
      .then((r) => r.text())
      .then((txt) => {
        if (canceled) return;
        // remove any hard-coded fill, stroke, width or height
        const cleaned = txt
          .replace(/(fill|stroke)="[^"]*"/gi, "")
          .replace(/(width|height)="[^"]*"/gi, "")
          // inject Tailwind classes to drive both fill & stroke from currentColor
          .replace(
            /<svg([^>]*)>/i,
            `<svg$1 class="fill-current stroke-current w-full h-full">`
          );
        setSvg(cleaned);
      })
      .catch(() => {
        /* ignore fetch errors */
      });

    return () => {
      canceled = true;
    };
  }, [url, isSvg]);

  if (isSvg && svg) {
    return (
      <span
        className={className}
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  // fallback for PNG/JPG/etc.
  return (
    <Image
      src={url}
      alt={alt || ""}
      width={20}
      height={20}
      unoptimized
      className={className}
    />
  );
};

const Headerbottomleft: React.FC<HeaderbottomleftProps> = ({ categories }) => {
  const [subcategories, setSubcategories] = useState<Record<string, SubCategorie[]>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  // Fetch subcategories for a given category ID
  const fetchSubcategories = async (categoryId: string) => {
    try {
      const data = await fetchData<SubCategorie[]>(
        `categories/${categoryId}/subcategories`
      );
      setSubcategories(prev => ({ ...prev, [categoryId]: data }));
    } catch (error) {
      console.error("fetchSubcategories error:", error);
    }
  };

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (!subcategories[categoryId]) {
      fetchSubcategories(categoryId);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        !menuWrapperRef.current?.contains(event.target as Node) &&
        !toggleButtonRef.current?.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) closeMenu();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  return (
    <div
      className="relative w-[300px] h-[70%] bg-white text-primary font-bold flex justify-center items-center cursor-pointer"
      onClick={toggleMenu}
      ref={toggleButtonRef}
    >
      <div className="flex gap-[24px] items-center select-none">
        <FaBars />
        <p>TOUTES NOS CATEGORIES</p>
      </div>

      {isMenuOpen && (
        <div
          className="absolute z-30 top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg mt-4 select-none"
          ref={menuWrapperRef}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col w-[300px] bg-white z-30">
            {categories.map(categorie => (
              <div
                key={categorie._id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(categorie._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/${categorie.slug}`}
                  onClick={closeMenu}
                 className="group flex items-center gap-[12px] p-4 duration-300 hover:bg-primary hover:text-white"
                >
                  {categorie.iconUrl && (
                   <InlineOrImg
                      url={categorie.iconUrl}
                      alt={categorie.name}
                    className="w-[20px] h-[20px] group-hover:text-white"
                    />
                  )}
                  <span className="font-bold text-base">{categorie.name}</span>
                </Link>

                                {activeCategory === categorie._id &&
                  subcategories[categorie._id]?.length > 0 && (
                    <div className="absolute top-0 left-full pl-4 w-[300px]">
                      {subcategories[categorie._id].map(subCat => (
                        <Link
                          key={subCat._id}
                          href={`/${categorie.slug}/${subCat.slug}`}
                         onClick={closeMenu}
                          className="flex bg-white items-center gap-[12px] duration-300 hover:bg-primary hover:text-white p-4"
                        >
                          {subCat.iconUrl && (
                           <InlineOrImg
                              url={subCat.iconUrl}
                              alt={subCat.name}
                              className="w-[20px] h-[20px] group-hover:text-white"
                            />
                          )}
                          <span className="font-bold text-base">{subCat.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Headerbottomleft;
