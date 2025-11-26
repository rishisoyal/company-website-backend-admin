import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/UserModel";
import mongoose from "mongoose";

export default async function createProxy(req: NextRequest) {
  const url = new URL(req.url);

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {
    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    await connectDB();
    const user = await User.findOne({
      session_id: new mongoose.Types.ObjectId(sessionId),
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
