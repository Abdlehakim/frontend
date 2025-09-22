// ------------------------------------------------------------------
// app/components/Headertop.tsx  (Server Component • A11y fixed)
// ------------------------------------------------------------------
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
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

/* Format 8-digit Tunisian phone: "XX XXX XXX" */
const formatPhoneTN = (phone: number): string => {
  const s = String(phone ?? "").replace(/\D+/g, "");
  return s.length === 8 ? `${s.slice(0,2)} ${s.slice(2,5)} ${s.slice(5)}` : s;
};

/** Icon-only link with a discernible name (best practice)
 *  - anchor gets aria-label + title
 *  - SVG is decorative: aria-hidden + focusable=false
 *  - hidden <span className="sr-only"> provides text for AT
 */
function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  // Normalize URLs so they’re absolute (helps audits/tools)
  const normalized =
    href.startsWith("http://") || href.startsWith("https://")
      ? href
      : `https://${href.replace(/^\/+/, "")}`;

  return (
    <a
      href={normalized}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="text-white transition-transform duration-200 hover:scale-110 hover:text-secondary
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary rounded-sm"
    >
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default async function Headertop() {
  const data: HeaderData = await fetchData<HeaderData>(
    "/website/header/getHeadertopData"
  ).catch(() => ({
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
  }));

  const {
    address, zipcode, city, governorate, phone, email,
    facebook, instagram, linkedin,
  } = data;

  const phoneDisplay = formatPhoneTN(phone);
  const phoneHref = phoneDisplay ? `tel:+216${phoneDisplay.replace(/\s/g, "")}` : undefined;
  const emailHref = email ? `mailto:${email}` : undefined;

  return (
    <div className="w-full h-[40px] bg-primary max-lg:hidden flex justify-center">
      <div className="flex w-[90%] text-white justify-between max-2xl:text-base text-sm items-center">
        {/* Left: Address, Phone, Email */}
        <div className="flex gap-2 items-center text-sm max-2xl:text-xs">
          <p className="flex gap-2 items-center">
            <span className="font-semibold uppercase tracking-wider">ADRESSE:</span>
            <span>
              {address}{address && (zipcode || city || governorate) ? "," : ""}{" "}
              {zipcode ? `${zipcode} ` : ""}{city}{city && governorate ? ", " : ""}{governorate}
              {(address || zipcode || city || governorate) && ", Tunisie"}
            </span>
          </p>

          {phoneHref && (
            <p className="flex gap-2 items-center px-4">
              <span className="font-semibold uppercase tracking-wider">TÉLÉ:</span>
              <a
                href={phoneHref}
                aria-label={`Téléphone : +216 ${phoneDisplay}`}
                className="underline underline-offset-2 hover:no-underline
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary rounded-sm"
              >
                +216 {phoneDisplay}
              </a>
            </p>
          )}

          {emailHref && (
            <p className="flex gap-2 items-center px-4">
              <span className="font-semibold uppercase tracking-wider">EMAIL:</span>
              <a
                href={emailHref}
                aria-label={`Envoyer un email à ${email}`}
                className="underline underline-offset-2 hover:no-underline break-all
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary rounded-sm"
              >
                {email}
              </a>
            </p>
          )}
        </div>

        {/* Right: Social Icons */}
        <div className="flex w-[200px] gap-4 justify-center items-center px-4">
          {linkedin && (
            <SocialIconLink href={linkedin} label="LinkedIn">
              {/* react-icons renders an SVG; we make it decorative explicitly */}
              <FaLinkedinIn size={18} aria-hidden="true" focusable="false" />
            </SocialIconLink>
          )}
          {facebook && (
            <SocialIconLink href={facebook} label="Facebook">
              <FaFacebookF size={18} aria-hidden="true" focusable="false" />
            </SocialIconLink>
          )}
          {instagram && (
            <SocialIconLink href={instagram} label="Instagram">
              <FaInstagram size={18} aria-hidden="true" focusable="false" />
            </SocialIconLink>
          )}
        </div>
      </div>
    </div>
  );
}
