/*  src/components/menu/Headerbottomleft.tsx                          */

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";

/* Data shapes returned by /api/categories/getAllName */
export interface SubCategorie {
  name: string;
  slug: string;
}
export interface Categorie {
  name: string;
  slug: string;
  subcategories: SubCategorie[];
}

interface HeaderbottomleftProps {
  categories: Categorie[];
}

const Headerbottomleft: React.FC<HeaderbottomleftProps> = ({ categories }) => {
  const router = useRouter();

  // store the category slug (not _id)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (catSlug: string) => setActiveCategory(catSlug);

  const handleCategoryClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    cat: Categorie
  ) => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) {
      // desktop → navigate and close
      closeMenu();
      return;
    }

    // mobile:
    const hasSubs = (cat.subcategories?.length || 0) > 0;
    if (!hasSubs) {
      e.preventDefault();
      closeMenu();
      router.push(`/${cat.slug}`);
      return;
    }

    // has subcats → toggle accordion
    e.preventDefault();
    setActiveCategory((prev) => (prev === cat.slug ? null : cat.slug));
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((p) => !p);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        !menuWrapperRef.current?.contains(e.target as Node) &&
        !toggleButtonRef.current?.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    const handleScroll = () => isMenuOpen && closeMenu();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <div
      className="relative w-[300px] h-[70%] bg-white text-primary font-bold flex justify-center items-center cursor-pointer"
      onClick={toggleMenu}
      ref={toggleButtonRef}
    >
      <div className="flex gap-6 items-center select-none">
        <FaBars />
        <p>TOUTES NOS CATEGORIES</p>
      </div>

      {isMenuOpen && (
        <div
          ref={menuWrapperRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-30 top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg mt-4 border-2 border-white select-none"
        >
          <div className="flex flex-col w-[300px] bg-white">
            {categories.map((cat) => {
              const hasSubs = (cat.subcategories?.length || 0) > 0;
              const mobileOpen = activeCategory === cat.slug && hasSubs;

              return (
                <div
                  key={cat.slug} // 👈 use slug as unique key
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* Category row */}
                  <Link
                    href={`/${cat.slug}`}
                    onClick={(e) => handleCategoryClick(e, cat)}
                    className="group flex items-center gap-3 px-4 py-2 duration-300 hover:bg-primary hover:text-white"
                  >
                    <span className="font-bold text-base">{cat.name}</span>
                  </Link>

                  {/* Desktop sub-cats (hover) */}
                  {activeCategory === cat.slug && hasSubs && (
                    <div className="hidden lg:block absolute top-0 left-full pl-4 w-[300px]">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug} // 👈 use sub slug as unique key
                          href={`/${sub.slug}`}
                          onClick={closeMenu}
                          className="flex items-center gap-3 bg-white px-4 py-2 border-2 border-white duration-300 hover:bg-primary hover:text-white"
                        >
                          <span className="font-bold text-base">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Mobile sub-cats (accordion) */}
                  <div
                    className={`lg:hidden flex flex-col pl-8 bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileOpen ? "max-h-96 py-2" : "max-h-0 py-0"
                    }`}
                  >
                    {cat.subcategories?.map((sub) => (
                      <Link
                        key={sub.slug} // 👈 use sub slug as unique key
                        href={`/${sub.slug}`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-2 duration-300 hover:bg-primary hover:text-white"
                      >
                        <span className="font-bold text-base">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Headerbottomleft;
