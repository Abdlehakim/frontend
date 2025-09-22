/* ------------------------------------------------------------------
   src/app/(webpage)/layout.tsx
------------------------------------------------------------------ */
import { Suspense } from "react";
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";
import StoreProviders from "@/components/Provider/StoreProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Providers from "@/components/Providers";
import GoogleIdentityLoader from "@/components/GoogleIdentityLoader";
import ClientShell from "@/components/ClientShell";
import { fetchData } from "@/lib/fetchData";
import { FooterLockProvider } from "@/contexts/FooterLockContext";
import FooterVisibilityController from "@/components/menu/FooterVisibilityController";

/** Revalidate this segment’s fetches every 10s by default (fallback if per-fetch not set) */
export const revalidate = 10;

/** Small helper: cached+tagged fetch so the layout can stream quickly */
async function getPrimaryCurrency() {
  try {
    const { primaryCurrency } = await fetchData<{ primaryCurrency: string }>(
      "/website/currency/primary",
      // Make sure your fetchData forwards these options to fetch():
      { next: { revalidate: 60, tags: ["currency"] } }
    );
    return primaryCurrency ?? "TND";
  } catch {
    return "TND";
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server Component work stays here; result is cached by Next per options above
  const primary = await getPrimaryCurrency();

  return (
    <div className="flex flex-col">
      {/* Keep only providers that truly must wrap everything */}
      <CurrencyProvider initial={primary}>
        <Providers>
          <FooterLockProvider>
            {/* If ClientShell doesn’t need to wrap Header, move it lower to reduce client JS */}
            <ClientShell requireAuth={false}>
              <StoreProviders>
                <Header />
                {children}

                {/* Stream the footer so header/content paint first */}
                <Suspense fallback={<div className="h-24" />}>
                  <div id="footer-container">
                    <Footer />
                  </div>
                </Suspense>

                {/* Client controller can remain */}
                <FooterVisibilityController />
              </StoreProviders>
            </ClientShell>
          </FooterLockProvider>
        </Providers>
      </CurrencyProvider>

      {/* Ensure this uses next/script with afterInteractive or lazyOnload */}
      <GoogleIdentityLoader />
    </div>
  );
}
