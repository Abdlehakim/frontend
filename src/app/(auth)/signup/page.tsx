import SignUpForm from "@/components/signin/SignUpForm";


// Next 15 passes `searchParams` as a *Promise* in server components.
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Wait for the promise to resolve, then extract redirectTo
  const params = await searchParams;
  const redirectTo =
    typeof params.redirectTo === "string" ? params.redirectTo : "/";

  return <SignUpForm redirectTo={redirectTo} />;
}