import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const businessRoutes = ["/business"];
const userRoutes = ["/user"];

const authRoutes = ["/login", "/signup", "/otp"];

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isGuest = !token;
  const userRole = token?.role;

  const isBusinessRoute = businessRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if it's the homepage
  const isHomepage = pathname === "/";

  // 1️⃣ Guest → dashboard block
  if (isGuest && (isBusinessRoute || isUserRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2️⃣ BUSINESSOWNER restrictions - only allowed on /business routes
  if (!isGuest && userRole === "businessowner") {
    // Block access to homepage
    if (isHomepage) {
      return NextResponse.redirect(new URL("/business", request.url));
    }

    // Block access to user routes
    if (isUserRoute) {
      return NextResponse.redirect(new URL("/business", request.url));
    }

    // Block access to auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/business", request.url));
    }

    // Block access to any non-business route (except API, static files handled by matcher)
    if (!isBusinessRoute) {
      return NextResponse.redirect(new URL("/business", request.url));
    }
  }

  // 3️⃣ CUSTOMER restrictions - can access homepage, /user routes, but not /business
  if (!isGuest && userRole === "customer") {
    // Block access to business routes
    if (isBusinessRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Block access to auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 4️⃣ BUSINESS dashboard protection (general - keep as fallback)
  if (!isGuest && isBusinessRoute && userRole !== "businessowner") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5️⃣ USER dashboard protection (general - keep as fallback)
  if (!isGuest && isUserRoute && userRole !== "customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 6️⃣ Logged-in user → auth page block
  if (!isGuest && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
