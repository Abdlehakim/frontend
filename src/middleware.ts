// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [/^\/checkout(?:\/|$)/, /^\/settings(?:\/|$)/, /^\/orderhistory(?:\/|$)/];

export function middleware(request: NextRequest) {
  const token   = request.cookies.get("token_FrontEnd")?.value;
  const { pathname, search } = request.nextUrl;

  // If route is protected and no token → redirect to signin with full path+query
  if (!token && PROTECTED.some((re) => re.test(pathname))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirectTo", pathname + search); // keep query too
    return NextResponse.redirect(redirectUrl);
  }

  // Already signed in, block signin/signup pages
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
