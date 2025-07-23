// src/(auth)/signin/page.tsx
import SignInForm from "@/components/signin/SignInForm";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = searchParams.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  // decode & sanitize: must start with "/" to avoid open redirects
  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
