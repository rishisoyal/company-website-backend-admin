import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/user/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/json",
      },
      body: req.body,
			// Node.js requires this for streamed bodies
      // but TS does not have the type
      // so we suppress it
      // @ts-ignore
      duplex: "half",
      credentials: "include",
      cache: "no-store",
    }
  );

  // Create a streaming passthrough response
  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: {
      "Content-Type":
        backendRes.headers.get("Content-Type") || "application/json",
    },
  });

  const cookies = backendRes.headers.get("set-cookie");
  if (cookies) {
    response.headers.set("set-cookie", cookies);
  }

  return response;
}
