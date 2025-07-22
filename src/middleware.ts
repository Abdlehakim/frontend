//// frontend middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token_FrontEnd")?.value;
  const { pathname } = request.nextUrl;

  // Handle protected routes:
  // if the user is not signed in (no token), redirect to /signin
  if (
    (
      pathname.startsWith("/settings") ||
      pathname.startsWith("/orderhistory")) &&
    !token
  ) {
    
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is already signed in and tries to access /signin, redirect to home
  if (pathname === "/signin" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/settings", "/orderhistory/:path*", "/signin"],
};