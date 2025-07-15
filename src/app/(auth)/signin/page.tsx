// src/(auth)/signin/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "@/components/signin/SignInForm";

/** 
 * In Next 15 the framework passes `searchParams` as a *Promise* in
 * server components – see vercel/next.js#77609 and related threads.
 */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 1. Await the cookie store, then check for your auth token
  const cookieStore = await cookies();
  const token = cookieStore.get("token_FrontEnd")?.value;
  if (token) {
    // 2. If present, redirect immediately
    redirect("/");
  }

  // 3. Otherwise parse redirectTo and render the form
  const params = await searchParams;
  const redirectTo =
    typeof params.redirectTo === "string" ? params.redirectTo : "/";

  return <SignInForm redirectTo={redirectTo} />;
}
