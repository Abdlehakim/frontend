/* ------------------------------------------------------------------ */
/*  src/components/menu/Headerbottomleft.tsx                          */
/* ------------------------------------------------------------------ */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars } from "react-icons/fa6";
import { fetchData } from "@/lib/fetchData";

/* ───────── interfaces ───────── */
export interface Categorie {
  _id: string;
  reference: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
}

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

/* ───────── helpers ───────── */
const InlineOrImg: React.FC<InlineOrImgProps> = ({ url, className, alt }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const isSvg = /\.svg($|\?)/i.test(url);

  useEffect(() => {
    if (!isSvg) return;
    let canceled = false;

    fetch(url)
      .then((r) => r.text())
      .then((txt) => {
        if (canceled) return;
        const cleaned = txt
          .replace(/(fill|stroke)="[^"]*"/gi, "")
          .replace(/(width|height)="[^"]*"/gi, "")
          .replace(
            /<svg([^>]*)>/i,
            `<svg$1 class="fill-current stroke-current w-full h-full">`
          );
        setSvg(cleaned);
      })
      .catch(() => {});

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

/* ───────── component ───────── */
const Headerbottomleft: React.FC<HeaderbottomleftProps> = ({ categories }) => {
  /** map<catId, subCats[]> */
  const [subcategories, setSubcategories] = useState<
    Record<string, SubCategorie[]>
  >({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  /* --- fetch sub-cats --- */
  const fetchSubcategories = async (catId: string) => {
    try {
      const data = await fetchData<SubCategorie[]>(
        `categories/${catId}/subcategories`
      );
      setSubcategories((prev) => ({ ...prev, [catId]: data }));
    } catch (err) {
      console.error("fetchSubcategories error:", err);
    }
  };

  /* --- desktop hover (≥ lg) --- */
  const handleMouseEnter = (catId: string) => {
    setActiveCategory(catId);
    if (!subcategories[catId]) fetchSubcategories(catId);
  };

  /* --- mobile click (< lg) --- */
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    catId: string
  ) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      e.preventDefault(); // keep menu open
      setActiveCategory(catId); // open clicked, close others
      if (!subcategories[catId]) fetchSubcategories(catId);
      return;
    }
    // desktop navigate
    closeMenu();
  };

  /* --- menu visibility --- */
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((p) => !p);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  };

  /* --- click outside & scroll hide --- */
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

  /* ───────── render ───────── */
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

      {/* ---------------- dropdown ---------------- */}
      {isMenuOpen && (
        <div
          ref={menuWrapperRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-30 top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg mt-4 border-2 border-white select-none"
        >
          <div className="flex flex-col w-[300px] bg-white">
            {categories.map((cat) => {
              const mobileOpen =
                activeCategory === cat._id &&
                (subcategories[cat._id]?.length || 0) > 0;

              return (
                <div
                  key={cat._id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat._id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* ---- category row ---- */}
                  <Link
                    href={`/${cat.slug}`}
                    onClick={(e) => handleCategoryClick(e, cat._id)}
                    className="group flex items-center gap-3 px-4 py-2 duration-300 hover:bg-primary hover:text-white"
                  >
                    {cat.iconUrl && (
                      <InlineOrImg
                        url={cat.iconUrl}
                        alt={cat.name}
                        className="w-5 h-5 group-hover:text-white"
                      />
                    )}
                    <span className="font-bold text-base">{cat.name}</span>
                  </Link>

                  {/* ---- desktop sub-cats (hover) ---- */}
                  {activeCategory === cat._id &&
                    subcategories[cat._id]?.length > 0 && (
                      <div className="hidden lg:block absolute top-0 left-full pl-4 w-[300px]">
                        {subcategories[cat._id].map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/${sub.slug}`}
                            onClick={closeMenu}
                            className="flex items-center gap-3 bg-white px-4 py-2 border-2 border-white duration-300 hover:bg-primary hover:text-white"
                          >
                            {sub.iconUrl && (
                              <InlineOrImg
                                url={sub.iconUrl}
                                alt={sub.name}
                                className="w-5 h-5 group-hover:text-white"
                              />
                            )}
                            <span className="font-bold text-base">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                  {/* ---- mobile sub-cats (< lg) – smooth accordion ---- */}
                  <div
                    className={`lg:hidden flex flex-col pl-8 bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileOpen ? "max-h-96 py-2" : "max-h-0 py-0"
                    }`}
                  >
                    {subcategories[cat._id]?.map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/${sub.slug}`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-2 duration-300 hover:bg-primary hover:text-white"
                      >
                        {sub.iconUrl && (
                          <InlineOrImg
                            url={sub.iconUrl}
                            alt={sub.name}
                            className="w-5 h-5 group-hover:text-white"
                          />
                        )}
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
