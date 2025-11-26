import Sidebar from "@/components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user = loca
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
