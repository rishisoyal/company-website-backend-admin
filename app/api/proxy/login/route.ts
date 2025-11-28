import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/user/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "include",
    }
  );

  // Get body
  const data = await backendRes.text();

  // Extract Set-Cookie header(s) manually
  const rawCookies = backendRes.headers.get("set-cookie");

  const response = new NextResponse(data, {
    status: backendRes.status,
  });

  // Re-attach cookies explicitly
  if (rawCookies) {
    response.headers.set("set-cookie", rawCookies);
  }

  return response;
}
