import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// cache token
const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect /admin pages
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, TOKEN_SECRET);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Run middleware only for /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
