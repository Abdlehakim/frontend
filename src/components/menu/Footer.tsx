// app/components/Footer/Footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CiPhone, CiMail } from "react-icons/ci";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { fetchData } from "@/lib/fetchData";

interface WebsiteInfo {
  _id?: string;
  name: string;
  address: string;
  city: string;
  zipcode: number;
  governorate: string;
  logoUrl: string;
  imageUrl?: string;
  bannerContacts?: string;
  email: string;
  phone: string | number;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export default async function Footer() {
  // fallback to null
  let websiteInfo: WebsiteInfo | null = null;

  try {
    // calls `${BACKEND_URL}/api/websiteinfo`
    websiteInfo = await fetchData<WebsiteInfo>("websiteinfo");
  } catch (err) {
    console.error("Error fetching website info:", err);
  }

  // if fetch failed or returned nothing, render nothing
  if (!websiteInfo) {
    return null;
  }

  const formatPhoneNumber = (phone: string | number): string => {
    const phoneStr = phone.toString().trim();
    if (phoneStr.length === 8) {
      return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(5)}`;
    }
    return phoneStr;
  };

  return (
    <div className="pt-8 flex flex-col justify-center items-center">
      {/* Top Section (Background) */}
      <div className="bg-[#15335D] text-white flex justify-center py-16 max-md:py-8 w-full">
        <div className="flex items-start justify-between md:max-lg:justify-around w-[80%] max-xl:w-[90%] max-lg:w-[98%] max-md:w-[95%] max-md:flex-col max-md:items-center max-md:gap-[40px]">
          
          {/* Left column: Logo + Address + Phone + Email */}
          <div className="flex flex-col gap-[32px] items-center">
            {websiteInfo.logoUrl && (
              <Image
                src={websiteInfo.logoUrl}
                alt={websiteInfo.name}
                width={261}
                height={261}
              />
            )}
            <div className="gap-[20px] flex flex-col max-md:items-center">
              <p>
                {websiteInfo.zipcode} {websiteInfo.city} {websiteInfo.governorate}, Tunisie
              </p>
              <p className="flex items-center gap-[8px]">
                <CiPhone size={25} />
                +216 {formatPhoneNumber(websiteInfo.phone)}
              </p>
              <p className="flex gap-[8px] items-center">
                <CiMail size={25} />
                {websiteInfo.email}
              </p>
            </div>
          </div>

          {/* Middle column: Navigation (hidden on some breakpoints) */}
          <div className="flex w-1/3 max-md:w-full justify-between max-md:justify-center items-center max-md:gap-20 md:max-lg:hidden">
            <div className="flex flex-col gap-[16px]">
              <Link href="/"><p className="hover:text-white cursor-pointer">Home</p></Link>
              <Link href="/about"><p className="hover:text-white cursor-pointer">À propos</p></Link>
              <Link href="/contactus"><p className="hover:text-white cursor-pointer">Contactez-nous</p></Link>
              <Link href="/blog"><p className="hover:text-white cursor-pointer">Blogs</p></Link>
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-white text-xl max-md:text-2xl">Découverte</p>
              <ul className="flex flex-col text-xs max-md:text-base gap-[8px]">
                <li className="hover:text-white cursor-pointer">Monastir</li>
                <li className="hover:text-white cursor-pointer">Sousse</li>
                <li className="hover:text-white cursor-pointer">Mahdia</li>
                <li className="hover:text-white cursor-pointer">Nabeul</li>
                <li className="hover:text-white cursor-pointer">Sfax</li>
              </ul>
            </div>
          </div>

          {/* Right column: Newsletter + Socials */}
          <div className="flex flex-col gap-[16px] items-center">
            <p className="max-md:text-2xl max-sm:text-xl">Abonnez-vous à notre newsletter!</p>
            <div className="relative w-full">
              <input
                className="w-full h-12 px-4 py-2 max-md:h-16 rounded-full border text-black border-gray-300 pr-16"
                type="text"
                placeholder="Email address"
              />
              <div className="absolute right-2 top-1/2 group overflow-hidden -translate-y-1/2">
                <button
                  className="relative py-2 w-[40px] h-[40px] max-md:w-[50px] max-md:h-[50px] rounded-full text-white bg-primary hover:bg-[#15335D]"
                  aria-label="send"
                />
                <FaArrowRight className="absolute cursor-pointer top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[250%]" />
                <FaArrowRight className="absolute cursor-pointer top-1/2 right-[150%] -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[300%]" />
              </div>
            </div>
            <p className="max-md:text-xl">Suivez-nous sur</p>
            <div className="flex items-center gap-[8px]">
              {websiteInfo.linkedin && (
                <a href={websiteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn className="hover:text-[#0077b5]" size={25} />
                </a>
              )}
              {websiteInfo.facebook && (
                <a href={websiteInfo.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="hover:text-black" size={25} />
                </a>
              )}
              {websiteInfo.instagram && (
                <a href={websiteInfo.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram
                    className="hover:bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 rounded-lg"
                    size={25}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Terms & Conditions */}
      <div className="w-[85%] text-[20px] items-center justify-between text-[#525566] font-bold max-lg:w-[95%] max-md:text-[16px] py-2 flex max-md:flex-col gap-[8px]">
        <p>© {websiteInfo.name} - All rights reserved</p>
        <div className="flex items-center gap-[32px] mx-4 text-[16px]">
          <p>Terms and conditions</p>
          <p>Privacy Policy</p>
          <p>Disclaimer</p>
        </div>
      </div>
    </div>
  );
}
