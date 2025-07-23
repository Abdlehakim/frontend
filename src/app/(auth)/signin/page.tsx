import SignInForm from "@/components/signin/SignInForm";

type SP = Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const params: SP = await (searchParams ?? Promise.resolve({}));

  const raw = params.redirectTo;
  const val = Array.isArray(raw) ? raw[0] : raw;

  const redirectTo =
    typeof val === "string" && val.startsWith("/")
      ? decodeURIComponent(val)
      : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
