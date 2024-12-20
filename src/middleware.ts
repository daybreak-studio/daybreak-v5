import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the URL matches our project pattern
  if (
    request.nextUrl.pathname.startsWith("/work/") &&
    request.nextUrl.pathname.split("/").length > 3
  ) {
    // Store the full URL
    const fullUrl = request.nextUrl.pathname;

    // Create a response that redirects to /work first
    const response = NextResponse.redirect(new URL("/work", request.url));

    // Set a header with the final destination
    response.headers.set("x-redirect-to", fullUrl);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/work/:client/:category*",
};
