import mongoose from "mongoose";
import User from "@/models/UserModel";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateHash } from "@/lib/hashGenerator";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.password || !body.role) {
    return NextResponse.json(
      {
        message: "please provide name, password and role fields",
      },
      { status: 400 }
    );
  }
	await connectDB()
  const passwordHash = await generateHash(body.password);
  const user = await User.create({
    _id: new mongoose.Types.ObjectId(),
    name: body.name,
    password_hash: passwordHash,
    role: body.role,
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "could not create user",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "successfully created user",
    },
    { status: 201 }
  );
}
