// app/components/Footer/Footer.tsx (Server Component)

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaArrowRight } from "react-icons/fa";
import { fetchData } from "@/lib/fetchData";

export interface FooterData {
  name: string;
  logoImageUrl: string;
  address: string;
  city: string;
  zipcode: number;
  governorate: string;
  email: string;
  phone?: number;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export const revalidate = 60;

export default async function Footer() {
  const data: FooterData =
    await fetchData<FooterData>("/website/header/getFooterData")
      .catch(() => ({
        name: "",
        logoImageUrl: "",
        address: "",
        city: "",
        zipcode: 0,
        governorate: "",
        email: "",
        phone: undefined,
        facebook: undefined,
        linkedin: undefined,
        instagram: undefined,
      } as FooterData));

  const {
    name,
    logoImageUrl,
    address,
    city,
    zipcode,
    governorate,
    email,
    phone,
    facebook,
    linkedin,
    instagram,
  } = data;

  const formatPhoneNumber = (num: number): string => {
    const str = num.toString().trim();
    return str.length === 8
      ? `${str.slice(0, 2)} ${str.slice(2, 5)} ${str.slice(5)}`
      : str;
  };

  return (
    <div className="pt-8 flex flex-col justify-center items-center">
      {/* Top Section */}
      <div className="bg-primary gap-4 text-white flex justify-center py-8 max-md:py-6 w-full">
        <div className="flex items-start justify-between md:max-lg:justify-around w-[80%] max-xl:w-[90%] max-lg:w-[98%] max-md:w-[95%] max-md:flex-col max-md:items-center max-md:gap-[40px]">
          {/* Left */}
          <div className="flex flex-col gap-[32px] items-center">
            {logoImageUrl && (
              <Image
                src={logoImageUrl}
                alt={`${name} logo`}
                width={400}
                height={60}
                placeholder="blur"
                blurDataURL={logoImageUrl}
                sizes="(max-width: 640px) 15vw, (max-width: 1200px) 15vw"
                className="w-[400px] h-[60px] object-cover"
              />
            )}
            <div className="gap-[20px] flex flex-col max-md:items-center">
              <p className="flex items-center gap-[8px]">
                <FiMapPin className="w-10" size={25} />
              <span className='text-sm'> {address}, {zipcode} {city} {governorate}</span> 
              </p>
              {phone !== undefined && (
                <p className="flex items-center gap-[8px]">
                  <FiPhone size={25} />
                  +216 {formatPhoneNumber(phone)}
                </p>
              )}
              <p className="flex gap-[8px] items-center">
                <FiMail size={25} />
                {email}
              </p>
            </div>
          </div>

          {/* Middle */}
          <div className="flex w-1/5 max-md:w-full justify-between max-md:justify-center items-center gap-4 max-md:gap-20 md:max-lg:hidden">
            <div className="flex flex-col gap-[16px] max-md:text-sm">
              <Link href="/"><p className="hover:text-white cursor-pointer">Home</p></Link>
              <Link href="/about"><p className="hover:text-white cursor-pointer">À propos</p></Link>
              <Link href="/contactus"><p className="hover:text-white cursor-pointer">Contactez-nous</p></Link>
              <Link href="/blog"><p className="hover:text-white cursor-pointer">Blogs</p></Link>
            </div>
            <div className="flex flex-col gap-[16px]">
              <ul className="flex flex-col text-lg max-md:text-sm gap-[8px]">
                {["Monastir", "Sousse", "Mahdia", "Nabeul", "Sfax"].map((c) => (
                  <li key={c} className="hover:text-white cursor-pointer">{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-[16px] items-center">
            <p className="max-md:text-sm text-xl">Abonnez-vous à notre newsletter!</p>
            <div className="relative w-full">
              <input
                className="w-full h-12 px-4 py-2 max-md:h-12 rounded-full border text-black border-gray-300 pr-16"
                type="email"
                placeholder="Email address"
              />
              <div className="absolute right-2 top-1/2 group overflow-hidden -translate-y-1/2">
                <button
                  className="relative py-2 w-10 h-10 rounded-full text-white bg-primary hover:bg-[#15335D]"
                  aria-label="send"
                />
                <FaArrowRight className="absolute cursor-pointer top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[250%]" />
                <FaArrowRight className="absolute cursor-pointer top-1/2 right-[150%] -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[300%]" />
              </div>
            </div>
            <p className="text-xl max-md:text-sm">Suivez-nous sur :</p>
            <div className="flex items-center gap-[8px]">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition transform duration-200 hover:scale-110 hover:text-secondary"
                >
                  <FaLinkedinIn size={25} />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition transform duration-200 hover:scale-110 hover:text-secondary"
                >
                  <FaFacebookF size={25} />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition transform duration-200 hover:scale-110 hover:text-secondary"
                >
                  <FaInstagram size={25} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-[90%] text-[20px] items-center justify-between text-[#525566] py-2 flex max-md:flex-col gap-[8px]">
        <p className="font-bold text-sm max-lg:text-sm">© {name} - All rights reserved</p>
        <div className="flex items-center text-sm max-lg:text-[10px] gap-4 justify-between">
          <p>Terms and conditions</p>
          <p>Privacy Policy</p>
          <p>Disclaimer</p>
        </div>
      </div>
    </div>
  );
}
