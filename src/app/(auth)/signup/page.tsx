import SignUpForm from "@/components/signin/SignUpForm";

type Search = { [key: string]: string | string[] | undefined };

export default function SignUpPage({ searchParams }: { searchParams: Search }) {
  const raw = searchParams.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
