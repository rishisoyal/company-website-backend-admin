import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/UserModel";
import mongoose from "mongoose";

export default async function createProxy(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname } = url;

  // --- 1) GLOBAL CORS FOR ALL API ROUTES ---
  if (pathname.startsWith("/api")) {
    const res = NextResponse.next();

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle OPTIONS preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: res.headers });
    }

    return res;
  }

  // --- 2) ADMIN ROUTE PROTECTION ---
  if (pathname.startsWith("/admin")) {
    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // DB lookup
    await connectDB();

    const user = await User.findOne({
      session_id: new mongoose.Types.ObjectId(sessionId),
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Default pass-through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*", // apply CORS rules
    "/admin/:path*", // apply admin protection
  ],
};
