import SignInForm from "@/components/signin/SignInForm";


/** In Next 15 the framework passes `searchParams` as a *Promise* in
 *  server components – see vercel/next.js #77609 and related threads. */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Wait for the promise to resolve, then pick out `redirectTo`
  const params = await searchParams;
  const redirectTo =
    typeof params.redirectTo === "string" ? params.redirectTo : "/";

  return <SignInForm redirectTo={redirectTo} />;
}