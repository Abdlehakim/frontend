"use client";

import React from "react";
import Image from "next/image";

interface BannerProps {
  title: string;
  imageBanner: string;
}

const Banner: React.FC<BannerProps> = ({ title, imageBanner }) => {
  return (
    <div className="relative w-full">
      <h1 className="text-2xl text-white transform -translate-x-1/4 -translate-y-1/2 top-1/2 left-1/4 absolute font-bold capitalize">
        {title}
      </h1>
      <div className="w-full h-fit flex items-center justify-center">
        <Image
          src={imageBanner}
          alt={title}
          className="object-cover w-full h-[200px]"
          height={400}
          width={1920}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75} // Adjust quality for better performance
          placeholder="blur" // Optional: add a placeholder while the image loads
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
        />
      </div>
    </div>
  );
};

export default Banner;
