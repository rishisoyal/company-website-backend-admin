import mongoose from "mongoose";
import User from "@/models/UserModel";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jwtVerify } from "jose";

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token)
    return Response.json({ error: "Token not found" }, { status: 401 });

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.TOKEN_SECRET)
  );

  if (payload) {
    await connectDB();
    await User.deleteOne({
      _id: new mongoose.Types.ObjectId(payload.uid as string),
    });
  }

  const res = NextResponse.json({ message: "logged out" }, { status: 202 });
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return res;
}
