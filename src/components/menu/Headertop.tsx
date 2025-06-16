// app/components/Headertop.tsx (Server Component)

import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

// Define the interface for the data you expect from your route
interface WebsiteInfo {
  _id?: string;
  name: string;
  address: string;
  city: string;
  zipcode: number;
  governorate: string;
  logoUrl?: string;
  imageUrl?: string;
  bannerContacts?: string;
  email: string;
  phone: string | number;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export default async function Headertop() {
  let companyData: WebsiteInfo | null = null;
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/api/websiteinfo`, {
      cache: "no-store", // always fetch fresh data on each request
    });

    if (!res.ok) {
      console.error("Failed to fetch website info:", res.status, res.statusText);
      return null; // or some fallback UI
    }
    companyData = await res.json();
  } catch (error) {
    console.error("Error fetching website info:", error);
    return null; // or some fallback UI
  }


  if (!companyData) {
    return <div>Loading...</div>;
  }

  // 3. Optional phone number formatting helper
  const formatPhoneNumber = (phone: string | number): string => {
    const phoneStr = phone.toString().trim();
    // Example format if exactly 8 digits: "XX XXX XXX"
    if (phoneStr.length === 8) {
      return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(5)}`;
    }
    return phoneStr; // fallback
  };

  return (
    <div className="w-full h-[40px] flex bg-primary max-lg:hidden justify-center">
      <div className="flex w-[90%] text-white justify-between max-2xl:text-base text-sm">
        
        {/* Left: Address, Phone, Email */}
        <div className="flex gap-[8px] items-center text-sm max-xl:text-xs">
          <p className="flex gap-[8px] items-center">
            <span className="font-semibold uppercase tracking-wider">ADRESSE:</span>
            {companyData.address}, {companyData.zipcode} {companyData.city},{" "}
            {companyData.governorate}, Tunisie
          </p>
          <p className="flex gap-[8px] items-center px-4">
            <span className="font-semibold uppercase tracking-wider">TÉLÉ:</span>
            +216 {formatPhoneNumber(companyData.phone)}
          </p>
          <p className="flex gap-[8px] items-center px-4">
            <span className="font-semibold uppercase tracking-wider">EMAIL:</span>
            {companyData.email}
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex w-[200px] gap-[16px] justify-center items-center px-4">
          {companyData.facebook && (
            <a
              href={companyData.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
            >
              <FaFacebookF className="text-white hover:text-blue-500 transition-colors" />
            </a>
          )}
          {/* Replace with your actual Twitter link if you store it, or remove if unused */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Twitter profile"
          >
            <FaTwitter className="text-white hover:text-blue-400 transition-colors" />
          </a>
          {companyData.linkedin && (
            <a
              href={companyData.linkedin}
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
