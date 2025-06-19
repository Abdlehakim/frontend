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
                  className="flex items-center gap-[12px] duration-300 hover:bg-primary hover:text-white p-4"
                >
                  {categorie.iconUrl && (
                    <Image
                      src={categorie.iconUrl}
                      alt={categorie.name}
                      width={20}
                      height={20}
                      className="w-[20px] h-[20px]"
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
                            <Image
                              src={subCat.iconUrl}
                              alt={subCat.name}
                              width={20}
                              height={20}
                              className="w-[20px] h-[20px]"
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
