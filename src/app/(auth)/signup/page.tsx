// src/app/(auth)/signup/page.tsx
import SignUpForm from "@/components/signin/SignUpForm";

type SP = Record<string, string | string[] | undefined>;

interface Props {
  searchParams?: SP | Promise<SP>;
}

export default async function SignUpPage({ searchParams }: Props) {
  const params: SP = await Promise.resolve(searchParams ?? {});

  const raw = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo;
  const d1  = typeof raw === "string" ? decodeURIComponent(raw) : undefined;
  const d2  = d1 ? decodeURIComponent(d1) : undefined; // in case it's double-encoded

  const redirectTo = d2 && d2.startsWith("/") ? d2 : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}
