import SignUpForm from "@/components/signin/SignUpForm";

type SP = Record<string, string | string[] | undefined>;

interface Props {
  searchParams: SP | Promise<SP>;
}

export default async function SignUpPage({ searchParams }: Props) {
  const params: SP = await Promise.resolve(searchParams);

  const raw = params.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
