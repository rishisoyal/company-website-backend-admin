import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function createProxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ----------------------------
  // 1. GLOBAL CORS FOR ALL /api
  // ----------------------------
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin");

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://company-website-backend-admin.vercel.app",
      "https://company-website-frontend-woad.vercel.app",
    ];

    const isAllowed = origin && allowedOrigins.includes(origin);

    // ----------------------------
    // OPTIONS (Preflight request)
    // ----------------------------
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": isAllowed ? origin! : "",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          Vary: "Origin",
        },
      });
    }

    // ----------------------------
    // NORMAL REQUESTS
    // ----------------------------
    const res = NextResponse.next();

    if (isAllowed) {
      res.headers.set("Access-Control-Allow-Origin", origin!);
      res.headers.set("Vary", "Origin");
    }

    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // ----------------------------
  // 2. PROTECT ADMIN ROUTES
  // ----------------------------
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
