import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_ROUTES = [
  "/profile",
  "/orders",
];

const ADMIN_ROUTES = [
  "/admin",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // Logged-in users shouldn't visit login/register
  if (AUTH_ROUTES.includes(pathname)) {
    if (token) {
      try {
        verifyToken(token);

        return NextResponse.redirect(new URL("/", request.url));
      } catch {
        // Invalid token — continue to login/register
      }
    }

    return NextResponse.next();
  }

  // Protect user routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      verifyToken(token);

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = verifyToken(token) as {
        role: string;
      };

      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};