import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.text();

	const backendRes = await fetch("http://localhost:8000/api/user/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body,
	});

	const data = await backendRes.text();

	// Forward cookies
	const response = new NextResponse(data, {
		status: backendRes.status,
		headers: backendRes.headers,
	});

	return response;
}
