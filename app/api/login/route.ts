export const runtime = "nodejs";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateHash } from "@/lib/hashGenerator";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user_name: string = body.name;
  const password: string = body.password;
  if (!user_name || !password) {
    return NextResponse.json(
      {
        message: "user name and password is required",
      },
      { status: 400 }
    );
  }
  // console.log(user_name, password);

  try {
    await connectDB();
    const passwordHash = await generateHash(password);
    if (!passwordHash) {
      return NextResponse.json(
        {
          message: "could not generate password hash",
        },
        { status: 400 }
      );
    }
    console.log(passwordHash);

    // validate user
    const data = await User.findOne({
      name: user_name,
    });
    if (!data) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        { status: 401 }
      );
    }

    const isCorrect = await bcrypt.compare(password, data.password_hash);

    if (!isCorrect) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 401 }
      );
    }

    // Generate session ID
    const sessionId = new mongoose.Types.ObjectId();

    // Save session in DB
    await User.updateOne(
      { _id: data._id },
      { $set: { session_id: sessionId } }
    );

    // Create secure cookie
    const response = NextResponse.json(
      { message: "login successful" },
      { status: 200 }
    );

    response.cookies.set("session_id", sessionId.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "internal error occured",
        error: error,
      },
      { status: 500 }
    );
  }
}
