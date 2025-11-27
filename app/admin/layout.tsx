import Sidebar from "@/components/SideBar";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return redirect("/login");
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.TOKEN_SECRET));
  } catch (err) {
    redirect("/login");
  }

  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
