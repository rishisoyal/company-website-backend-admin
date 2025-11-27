import { connectDB } from "@/lib/mongodb";
import User from "@/models/UserModel";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  await connectDB();
  const user = await User.findOne({ name });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  // const passwordHash = await generateHash(password);
  const valid = bcrypt.compare(password, user.password_hash);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await new SignJWT({ uid: user._id.toString(), role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2d")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET));

  const res = NextResponse.json({ success: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",// allow navigation between same-site ports
    path: "/",
  });

  return res;
}
