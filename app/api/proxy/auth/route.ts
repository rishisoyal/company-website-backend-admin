import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "missing token" }, { status: 401 });
  }

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/user/auth`,
    {
      headers: {
        Cookie: `auth_token=${token}`,
      },
      cache: "no-store",
    }
  );

  return new NextResponse(backendRes.body, backendRes);
}
