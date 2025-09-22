"use client";

import React from "react";
import Image from "next/image";

interface BannerProps {
  title: string;
  imageBanner: string;
}

const Banner: React.FC<BannerProps> = ({ title, imageBanner }) => {
  return (
    <div className="relative w-full aspect-[16/4]">
      <Image
        src={imageBanner}
        alt={title}
        className="object-cover"
        fill
        priority
        loading="eager"
        sizes="(max-width: 768px) 100vw,
               (max-width: 1280px) 100vw,
               1280px"
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
      />
      <div
        className="
      absolute
      bottom-0
      max-md:bottom-0
      w-full  
      flex-col
      text-4xl
      text-white
      font-semibold    
      tracking-wide
      drop-shadow-lg
    "
      >
        <h1 className="h-16 flex items-center bg-primary pl-6 max-md:text-lg capitalize max-md:h-10 justify-center max-md:pl-0">
          {title}
        </h1>
        <div className="h-2 bg-secondary"></div>
      </div>
    </div>
  );
};

export default Banner;