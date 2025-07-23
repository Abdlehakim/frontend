import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [/^\/checkout(?:\/|$)/, /^\/settings(?:\/|$)/, /^\/orderhistory(?:\/|$)/];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token_FrontEnd")?.value;
  const { pathname, search } = request.nextUrl;

  // Unauthed to protected pages -> signin
  if (!token && PROTECTED.some((re) => re.test(pathname))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirectTo", pathname + search); // keep querystring
    return NextResponse.redirect(redirectUrl);
  }

  // Already authed -> block signin/signup
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/settings",
    "/orderhistory/:path*",
    "/checkout/:path*",
    "/signin",
    "/signup",
  ],
};
