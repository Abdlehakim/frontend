import SignUpForm from "@/components/signin/SignUpForm";

type SP = Record<string, string | string[] | undefined>;

export default async function SignUpPage({
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

  return <SignUpForm redirectTo={redirectTo} />;
}
