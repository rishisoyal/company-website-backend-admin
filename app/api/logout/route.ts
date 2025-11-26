import mongoose from "mongoose";
import User from "@/models/UserModel";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/session_id=([^;]+)/);
  const sessionId = match ? decodeURIComponent(match[1]) : null;

  if (sessionId) {
    await connectDB();
    await User.deleteOne({
      session_id: new mongoose.Types.ObjectId(sessionId),
    });
  }

  const res = NextResponse.json({ message: "logged out" }, {status: 202});
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set({
    name: "session_id",
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return res;
}
