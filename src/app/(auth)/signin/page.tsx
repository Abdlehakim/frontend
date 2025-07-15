// src/(auth)/signin/page.tsx

import SignInForm from "@/components/signin/SignInForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 1. Await the cookie store, then check for your auth token

  // 3. Otherwise parse redirectTo and render the form
  const params = await searchParams;
  const redirectTo =
    typeof params.redirectTo === "string" ? params.redirectTo : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
