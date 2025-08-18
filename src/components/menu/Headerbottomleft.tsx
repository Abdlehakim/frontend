/*  src/components/menu/Headerbottomleft.tsx                          */

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

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

  const [activeCategory, setActiveCategory] = useState<string | null>(null); // slug
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  // used to avoid double-trigger (pointerdown + click on iOS)
  const suppressNextClickRef = useRef(false);

  const isDesktop = () =>
    typeof window !== "undefined" && window.innerWidth >= 1024;

  const hasSubs = (cat: Categorie) => (cat.subcategories?.length || 0) > 0;

  const handleMouseEnter = (catSlug: string) => {
    if (isDesktop()) setActiveCategory(catSlug);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((p) => !p);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  };

  // Mobile: open/close on POINTER DOWN (so one tap opens immediately)
  const handleRowPointerDown = (
    e: React.PointerEvent<HTMLAnchorElement>,
    cat: Categorie
  ) => {
    if (isDesktop()) return; // desktop uses hover/click
    if (!hasSubs(cat)) return; // let normal navigation happen for leaf cats

    e.preventDefault();
    e.stopPropagation();
    setActiveCategory((prev) => (prev === cat.slug ? null : cat.slug));
    suppressNextClickRef.current = true; // prevent subsequent click from navigating
  };

  // Click: desktop navigates; mobile navigates only if no subs
  const handleRowClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    cat: Categorie
  ) => {
    if (suppressNextClickRef.current) {
      // ignore the click that follows our pointerdown toggle
      suppressNextClickRef.current = false;
      return;
    }

    if (isDesktop()) {
      closeMenu();
      return; // let Link navigate
    }

    if (!hasSubs(cat)) {
      e.preventDefault();
      closeMenu();
      router.push(`/${cat.slug}`);
      return;
    }

    // If it has subs on mobile, pointerdown already handled the toggle.
    e.preventDefault();
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
              const open = activeCategory === cat.slug && hasSubs(cat);

              return (
                <div
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.slug)}
                  onMouseLeave={() => isDesktop() && setActiveCategory(null)}
                >
                  {/* Category row */}
                  <Link
                    href={`/${cat.slug}`}
                    role={!isDesktop() && hasSubs(cat) ? "button" : undefined}
                    aria-expanded={!isDesktop() && hasSubs(cat) ? open : undefined}
                    onPointerDown={(e) => handleRowPointerDown(e, cat)}
                    onClick={(e) => handleRowClick(e, cat)}
                    className="group flex items-center justify-between lg:justify-start gap-3 px-4 py-2 duration-300 hover:bg-primary hover:text-white"
                  >
                    <span className="font-bold text-base">{cat.name}</span>

                    {/* Mobile-only expand/collapse icon */}
                    {hasSubs(cat) && (
                      <span className="lg:hidden ml-auto" aria-hidden="true">
                        {open ? (
                          <AiOutlineMinus className="text-base font-bold text-primary" />
                        ) : (
                          <AiOutlinePlus className="text-base font-bold text-primary" />
                        )}
                      </span>
                    )}
                  </Link>

                  {/* Desktop sub-cats (hover) */}
                  {isDesktop() && open && (
                    <div className="hidden lg:block absolute top-0 left-full pl-4 w-[300px]">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
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
                      open ? "max-h-96 py-2" : "max-h-0 py-0"
                    }`}
                  >
                    {cat.subcategories?.map((sub) => (
                      <Link
                        key={sub.slug}
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
