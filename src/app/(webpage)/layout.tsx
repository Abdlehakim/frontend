/* ------------------------------------------------------------------
   src/app/(webpage)/Layout.tsx
------------------------------------------------------------------ */

import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";
import StoreProviders from "@/components/Provider/StoreProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Providers from "@/components/Providers";
import GoogleIdentityLoader from "@/components/GoogleIdentityLoader";
import ClientShell from "@/components/ClientShell";
import { fetchData } from "@/lib/fetchData";

export const revalidate = 10;

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  let primary = "TND";
  try {
    const { primaryCurrency } = await fetchData<{ primaryCurrency: string }>(
      "/website/currency/primary",
      { next: { revalidate } }
    );
    primary = primaryCurrency;
  } catch {}

  return (
    <div className="flex flex-col">
      <CurrencyProvider initial={primary}>
        <Providers>
          <ClientShell>
            <StoreProviders>
              <Header />
              {children}
              <Footer />
            </StoreProviders>
          </ClientShell>
        </Providers>
      </CurrencyProvider>
      <GoogleIdentityLoader />
    </div>
  );
}
