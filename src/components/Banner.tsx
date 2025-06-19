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
  <h1
    className="
      absolute
      bottom-4
      h-16
      w-full
      flex
      justify-center
      items-center
      bg-primary
      px-6
      text-4xl
      text-white
      font-semibold
      capitalize
      aline
      max-md:text-lg
      max-md:h-10
      max-md:bottom-0
      tracking-wide
      drop-shadow-lg
    "
  >
    {title}
  </h1>
  <div className="w-full h-full">
    <Image
      src={imageBanner}
      alt={title}
      className="object-cover w-full h-full"
      height={400}
      width={1920}
      priority
      sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={100}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
    />
  </div>
</div>



  );
};

export default Banner;
