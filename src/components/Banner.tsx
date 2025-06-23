"use client";

import React from "react";
import Image from "next/image";

interface BannerProps {
  title: string;
  imageBanner: string;
}

const Banner: React.FC<BannerProps> = ({ title, imageBanner }) => {
  return (
    <div className="relative w-full h-[400px] max-md:h-[200px]">
      
        <Image
          src={imageBanner}
          alt={title}
          className="object-cover h-full w-full"
          fill
          priority
          sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
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
