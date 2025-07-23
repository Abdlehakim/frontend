// src/app/(auth)/signin/page.tsx
import SignInForm from "@/components/signin/SignInForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams,
}: {
  /** In Next 14/15 this can be either a plain object or a Promise */
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  // handle both Promise and plain object
  const params = await Promise.resolve(searchParams);

  const raw = params.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  // keep it on-site, default to home
  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
