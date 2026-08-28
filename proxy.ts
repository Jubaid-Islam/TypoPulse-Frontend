import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that authenticated users should not visit
const authRoutes = ["/login", "/register"];

// Protected routes that require authentication
const protectedRoutes = ["/game", "/history"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated via cookie
  const authCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session");

  const isAuthenticated = !!authCookie?.value;

  // Redirect to login if unauthenticated user tries to access protected routes
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if authenticated user tries to access login or register
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};