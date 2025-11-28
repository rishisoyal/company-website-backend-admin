import Sidebar from "@/components/SideBar";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	// const token = NextRequest.cookies.get("auth_token")?.value;

 //    if (!token) {
 //      return redirect("/login");
 //    }

 //    try {
 //      await jwtVerify(
 //        token,
 //        new TextEncoder().encode(process.env.TOKEN_SECRET)
 //      );
 //    } catch {
 //      return redirect("/login");
 //    }
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
