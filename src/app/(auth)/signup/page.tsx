// src/app/(auth)/signup/page.tsx
import SignUpForm from "@/components/signin/SignUpForm";

type SP = Record<string, string | string[] | undefined>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const params: SP = await (searchParams ?? Promise.resolve({}));

  const raw = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo;
  const decodedOnce  = typeof raw === "string" ? decodeURIComponent(raw) : undefined;
  const decodedTwice = decodedOnce ? decodeURIComponent(decodedOnce) : undefined;

  const target = decodedTwice || decodedOnce;
  const redirectTo = target && target.startsWith("/") ? target : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
