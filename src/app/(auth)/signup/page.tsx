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
  const decoded = typeof raw === "string" ? decodeURIComponent(raw) : undefined;

  const redirectTo = decoded && decoded.startsWith("/") ? decoded : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
