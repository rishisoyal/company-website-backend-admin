"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  CircleUserRound,
  Building2,
  CardSim,
  Lightbulb,
  ContactRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import axios from "axios";

type SidebarItem = {
  title: string;
  icon?: React.ReactNode;
  children?: { title: string; path: string }[];
};

const menu: SidebarItem[] = [
  {
    title: "Home Page",
    icon: <Home size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=home&contentType=text",
      },
      {
        title: "Manage Media",
        path: "/admin/manage?page=home&contentType=media",
      },
      {
        title: "Manage Cards",
        path: "/admin/manage?page=home&contentType=card",
      },
    ],
  },
  {
    title: "About Page",
    icon: <CircleUserRound size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=about&contentType=text",
      },
      // { title: "Manage Media", path: "/admin/manage?page=about&contentType=media" },
      {
        title: "Manage Cards",
        path: "/admin/manage?page=about&contentType=card",
      },
    ],
  },
  {
    title: "Industries Page",
    icon: <Building2 size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=industries&contentType=text",
      },
      {
        title: "Manage Media",
        path: "/admin/manage?page=industries&contentType=media",
      },
      {
        title: "Manage Cards",
        path: "/admin/manage?page=industries&contentType=card",
      },
    ],
  },
  {
    title: "Services Page",
    icon: <CardSim size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=services&contentType=text",
      },
      // {
      //   title: "Manage Media",
      //   path: "/admin/manage?page=services&contentType=media",
      // },
      {
        title: "Manage Cards",
        path: "/admin/manage?page=services&contentType=card",
      },
    ],
  },
  {
    title: "Solutions Page",
    icon: <Lightbulb size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=solutions&contentType=text",
      },
      {
        title: "Manage Media",
        path: "/admin/manage?page=solutions&contentType=media",
      },
      {
        title: "Manage Cards",
        path: "/admin/manage?page=solutions&contentType=card",
      },
    ],
  },
  {
    title: "Contact Page",
    icon: <ContactRound size={18} />,
    children: [
      {
        title: "Manage Text",
        path: "/admin/manage?page=contact&contentType=text",
      },
      // { title: "Manage Media", path: "/admin/manage?page=contact&contentType=media" },
      // { title: "Manage Cards", path: "/admin/manage?page=contact&contentType=card" },
    ],
  },
];

export default function Sidebar() {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSideBar, setOpenSideBar] = useState(false);

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  async function handleLogOutClick() {
    const res = await axios.delete(`${BASE_API}/api/user/logout`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      redirect("/login");
    }
  }

  return (
    <aside className="left-0 w-fit lg:w-64 bg-[#181825] text-gray-200 h-screen fixed p-4 overflow-y-auto border-r border-gray-700 z-99">
      <button
        onClick={handleLogOutClick}
        className="text-red-700 bg-red-200 backdrop-blur-2xl rounded-sm p-2 mb-6 border-black cursor-pointer border-2 hover:border-red-700"
      >
        Log out
      </button>
      <h2 className="text-xl font-bold mb-6 hidden lg:block">Admin Panel</h2>
      {/* Burger Button (Mobile) */}
      <div
        className="block lg:hidden cursor-pointer text-latte-text text-3xl"
        onClick={() => setOpenSideBar(!openSideBar)}
      >
        {openSideBar ? "✖" : "☰"}
      </div>

      <nav className="space-y-2 hidden lg:block">
        {menu.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => toggleMenu(item.title)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>

              {openMenu === item.title ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenu === item.title && item.children && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.path}
                    className="block px-2 py-1 text-sm rounded hover:bg-gray-700/30 transition"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden z-10 ${
          openSideBar ? "max-w-64 opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        {menu.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => toggleMenu(item.title)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>

              {openMenu === item.title ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenu === item.title && item.children && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.path}
                    className="block px-2 py-1 text-sm rounded hover:bg-gray-700/30 transition"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
