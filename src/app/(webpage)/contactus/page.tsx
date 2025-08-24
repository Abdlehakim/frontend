// src/app/contact/page.tsx
import Banner from "@/components/Banner";
import ContactUsForm from "@/components/ContactUsForm";
import { cache } from "react";
import { notFound } from "next/navigation";

interface ContactBannerData {
  title: string;
  bannercontacts: string;
}

const fetchContactBannerData = cache(async function <T>(endpoint: string): Promise<T | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const res = await fetch(`${backendUrl}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    return null; 
  }
  return res.json();
});

export default async function ContactPage() {
  const bannerData = await fetchContactBannerData<ContactBannerData | null>(
    `/api/NavMenu/contactus/ContactBanner`
  );

  if (!bannerData) {
    notFound();
  }

  return (
    <div>
      <Banner title={bannerData.title} imageBanner={bannerData.bannercontacts} />
      <ContactUsForm />
    </div>
  );
}
