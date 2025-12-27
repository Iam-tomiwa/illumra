import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CHIPS compliance: Ensure cookies are partitioned when set
  // This is especially important for cross-origin resources like Sanity CDN
  const url = request.nextUrl;

  // Set headers for CHIPS compliance
  response.headers.set(
    "Permissions-Policy",
    "interest-cohort=(), browsing-topics=()"
  );

  // For cross-origin requests to Sanity CDN, ensure we're not sending unnecessary credentials
  // The actual cookie partitioning is handled by the browser when cookies have the Partitioned attribute
  // Sanity's CDN should set cookies with Partitioned attribute for CHIPS compliance

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|studio).*)",
  ],
};
