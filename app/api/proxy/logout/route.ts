import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
	const token = req.cookies.get("auth_token")?.value;
	if (!token)
		return NextResponse.json({ message: "missing token" }, { status: 401 });

	const res = NextResponse.json(
		{ message: "Logged out successfully" },
		{ status: 200 },
	);
	res.cookies.set("auth_token", "", { maxAge: -1 });
	return res;
}
