// src/app/(auth)/signin/page.tsx
import SignInForm from "@/components/signin/SignInForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function DashboardSignInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.redirectTo) ? sp.redirectTo[0] : sp.redirectTo;
  const decoded = typeof raw === "string" ? decodeURIComponent(raw) : undefined;
  const redirectTo = decoded && decoded.startsWith("/") ? decoded : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
