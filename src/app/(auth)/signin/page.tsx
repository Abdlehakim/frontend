import SignInForm from "@/components/signin/SignInForm";

type SP = Record<string, string | string[] | undefined>;

interface Props {
  searchParams: SP | Promise<SP>;
}

export default async function SignInPage({ searchParams }: Props) {
  // Works for both Promise and non-Promise cases
  const params: SP = await Promise.resolve(searchParams);

  const raw = params.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
