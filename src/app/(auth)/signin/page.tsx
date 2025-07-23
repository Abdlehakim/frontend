import SignInForm from "@/components/signin/SignInForm";

type Search = { [key: string]: string | string[] | undefined };

export default function SignInPage({ searchParams }: { searchParams: Search }) {
  const raw = searchParams.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
