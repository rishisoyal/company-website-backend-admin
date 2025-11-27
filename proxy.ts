import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function createProxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const origin = req.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://company-website-backend-admin.vercel.app",
    "https://company-website-frontend-woad.vercel.app",
  ];

  const isAllowed = origin && allowedOrigins.includes(origin);

  // 1. CORS for API
  if (pathname.startsWith("/api")) {
    // --------------------------
    // PRE-FLIGHT (OPTIONS)
    // --------------------------
    if (req.method === "OPTIONS") {
      const res = new NextResponse(null, {
        status: 204,
      });

      res.headers.set("Access-Control-Allow-Origin", isAllowed ? origin! : "");
      res.headers.set("Access-Control-Allow-Credentials", "true");
      res.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.headers.set("Vary", "Origin");
      res.headers.set("Cache-Control", "no-store"); 

      return res;
    }

    // --------------------------
    // NON-OPTIONS REQUESTS
    // --------------------------
    const res = NextResponse.next();

    if (isAllowed) {
      res.headers.set("Access-Control-Allow-Origin", origin!);
    }

    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Vary", "Origin");
    res.headers.set("Cache-Control", "no-store");

    return res;
  }

  // 2. PROTECT ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
