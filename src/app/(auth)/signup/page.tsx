// src/(auth)/signup/page.tsx
import SignUpForm from "@/components/signin/SignUpForm";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function SignUpPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = searchParams.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  // decode & sanitize to avoid open redirects
  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
