// src/app/(auth)/signup/page.tsx
import SignUpForm from "@/components/signin/SignUpForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams);

  const raw = params.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
