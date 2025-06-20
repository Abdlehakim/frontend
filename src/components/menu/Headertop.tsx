// app/components/Headertop.tsx (Server Component)

import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { fetchData } from "@/lib/fetchData";

export interface HeaderData {
  address: string;
  city: string;
  governorate: string;
  zipcode: number;
  phone: number;
  email: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export const revalidate = 60;

export default async function Headertop() {
  const data: HeaderData = await fetchData<HeaderData>(
    "/website/header/getHeadertopData"
  ).catch(
    () =>
      ({
        address: "",
        city: "",
        governorate: "",
        zipcode: 0,
        phone: 0,
        email: "",
        facebook: undefined,
        twitter: undefined,
        linkedin: undefined,
        instagram: undefined,
      } as HeaderData)
  );

  // Format 8-digit Tunisian phone: "XX XXX XXX"
  const formatPhoneNumber = (phone: number): string => {
    const str = phone.toString().trim();
    return str.length === 8
      ? `${str.slice(0, 2)} ${str.slice(2, 5)} ${str.slice(5)}`
      : str;
  };

  const { address, zipcode, city, governorate, phone, email, facebook, twitter, linkedin } =
    data;

  return (
    <div className="w-full h-[40px] flex bg-primary max-lg:hidden justify-center">
      <div className="flex w-[90%] text-white justify-between max-2xl:text-base text-sm">
        {/* Left: Address, Phone, Email */}
        <div className="flex gap-[8px] items-center text-sm max-xl:text-xs">
          <p className="flex gap-[8px] items-center">
            <span className="font-semibold uppercase tracking-wider">ADRESSE:</span>
            {address}, {zipcode} {city}, {governorate}, Tunisie
          </p>
          <p className="flex gap-[8px] items-center px-4">
            <span className="font-semibold uppercase tracking-wider">TÉLÉ:</span>
            +216 {formatPhoneNumber(phone)}
          </p>
          <p className="flex gap-[8px] items-center px-4">
            <span className="font-semibold uppercase tracking-wider">EMAIL:</span>
            {email}
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex w-[200px] gap-[16px] justify-center items-center px-4">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
            >
              <FaFacebookF className="text-white hover:text-blue-500 transition-colors" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Twitter profile"
            >
              <FaTwitter className="text-white hover:text-blue-400 transition-colors" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn profile"
            >
              <FaLinkedinIn className="text-white hover:text-blue-600 transition-colors" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
