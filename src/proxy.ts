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

  // 1️⃣ Guest → dashboard block
  if (isGuest && (isBusinessRoute || isUserRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2️⃣ BUSINESS dashboard protection
  if (!isGuest && isBusinessRoute && userRole !== "businessowner") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3️⃣ USER dashboard protection
  if (!isGuest && isUserRoute && userRole !== "customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4️⃣ Logged-in user → auth page block
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
