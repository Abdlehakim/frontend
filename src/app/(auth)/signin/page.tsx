// src/app/(auth)/signin/page.tsx
import SignInForm from "@/components/signin/SignInForm";

type SP = Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const params: SP = await (searchParams ?? Promise.resolve({}));

  const raw = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo;
  // decode twice in case it’s double-encoded somewhere in the chain
  const decodedOnce  = typeof raw === "string" ? decodeURIComponent(raw) : undefined;
  const decodedTwice = decodedOnce ? decodeURIComponent(decodedOnce) : undefined;

  const target = decodedTwice || decodedOnce;
  const redirectTo = target && target.startsWith("/") ? target : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
