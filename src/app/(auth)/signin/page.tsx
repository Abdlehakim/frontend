import SignInForm from "@/components/signin/SignInForm";

type SP = Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const params: SP = await (searchParams ?? Promise.resolve({}));

  const raw = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo;
  const decoded = typeof raw === "string" ? decodeURIComponent(raw) : undefined;

  // prevent open redirects
  const redirectTo = decoded && decoded.startsWith("/") ? decoded : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
