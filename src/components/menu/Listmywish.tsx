"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaRegTrashAlt, FaRegEye } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/wishlistSlice";
import PaginationClient from "@/components/PaginationClient";

/* --- Type Definitions for Listmywish --- */
export interface WishlistProduct {
  name: string;
  mainImageUrl?: string;
  price: number;
  categorie: { name: string; slug: string };
  slug: string;
}

interface ListmywishProps {
  data: WishlistProduct[];
}

const Listmywish: React.FC<ListmywishProps> = ({ data }) => {
  const [isListVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const toggleListVisibility = () => {
    setListVisible((prev) => !prev);
  };

  const handleLinkClick = () => {
    setListVisible(false);
  };

  const handleDeleteFavorite = (slug: string) => {
    dispatch(removeFromWishlist(slug));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isListVisible) {
        setListVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isListVisible]);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;
  const totalPages = useMemo(
    () => Math.ceil(data.length / dataPerPage),
    [data.length]
  );

  const paginatedData = useMemo(() => {
    return data.slice(
      (currentPage - 1) * dataPerPage,
      currentPage * dataPerPage
    );
  }, [data, currentPage, dataPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [currentPage, totalPages]);

  if (data.length === 0) return null;

  return (
    <div>
      <div
        onClick={toggleListVisibility}
        className="flex w-[200px] max-2xl:w-[150px] items-center justify-center gap-[8px] max-lg:w-fit text-white cursor-pointer select-none max-xl:hidden"
      >
        <div className="relative my-auto mx-2">
          <AiOutlineHeart size={45} className="text-white" />
          <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
            {data.length}
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-[#C1C4D6] text-sm max-2xl:text-xs">Préféré</p>
          <p className="text-white font-bold max-md:hidden max-2xl:text-sm">Liste souhaits</p>
        </div>
      </div>

      {isListVisible && (
        <div
          ref={listRef}
          className="absolute flex flex-col mt-2 w-[400px] h-fit max-md:w-[350px] max-h-[600px] overflow-y-auto border-[#15335D] border-4 rounded-lg bg-white z-30 right-52"
        >
          <h1 className="text-lg font-bold text-black border-b-2 text-center max-md:text-sm p-2 mx-4">
            Liste souhaits
          </h1>
          <div className="text-gray-500 border-b-2 mx-4">
            <PaginationClient
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {paginatedData.map((item) => (
            <div
              key={item.slug}
              className="mx-auto h-[80px] max-md:mx-[10%] border-b-2 w-[90%] flex justify-between items-center"
            >
              <div className="relative h-10 aspect-[16/16]  bg-gray-200">
                <Image
                  fill
                  src={item.mainImageUrl ?? ""}
                  alt={item.name}
                  className="object-cover"
                  quality={75}
                  placeholder="empty"
                  priority
                  sizes="(max-width: 600px) 100vw, 600px"
                />
              </div>
              <span>{item.name}</span>
              <span className="text-gray-400">{item.price.toFixed(2)} TND</span>
<div className='flex gap-2'>
              <Link
                href={`/${item.categorie.slug}/${item.slug}`}
                onClick={handleLinkClick}
              >
                <button
                  type="button"
                  className="p-2 hover:bg-[#15335E] border-2 max-md:border-none border-[#15335E] rounded text-black hover:text-white cursor-pointer"
                >
                  <FaRegEye />
                </button>
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteFavorite(item.slug)}
                className="p-2 hover:bg-[#15335E] border-2 max-md:border-none border-[#15335E] rounded text-black hover:text-white cursor-pointer"
              >
                <FaRegTrashAlt />
              </button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listmywish;
