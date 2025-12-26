"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn, LogOut, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [menu, openMenu] = useState(false);
  const { user, loading, isAuth, logoutUser } = useAppData();

  const router = useRouter();
  const pathname = usePathname();

  const closeMenu = () => openMenu(false);

  // ✅ hide on /blogs/new and /blogs/edit/[id]
  const hidePostButton =
    pathname === "/blogs/new" ||
    pathname.startsWith("/blogs/edit/");

  return (
    <nav className="sticky top-0 z-50 h-20 bg-white/80 backdrop-blur-xl border-b border-orange-100">
      <div className="container mx-auto relative flex h-full items-center justify-between px-4">

        <div className="hidden md:block w-35" />

        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="
            flex items-center gap-1 font-extrabold tracking-tight
            text-2xl md:text-3xl
            md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Tech
          </span>
          <span className="text-gray-900">Bloggy</span>
          <span className="hidden sm:inline text-red-600 text-4xl leading-none">
            .
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center h-12 gap-3">

          {/* NOT AUTHENTICATED */}
          {!loading && !isAuth && (
            <>
              {!hidePostButton && (
                <Button
                  onClick={() => router.push("/login")}
                  className="cursor-pointer flex items-center gap-2 h-10 px-4 rounded-full
                  bg-orange-500 text-white text-sm font-medium
                  hover:bg-orange-600 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Post a Blog</span>
                </Button>
              )}

              <Link
                href="/login"
                className="flex items-center gap-2 h-12 px-5 rounded-full
                bg-orange-500 text-sm md:text-base font-medium text-white
                hover:bg-orange-600 transition shadow-sm"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </>
          )}

          {/* AUTHENTICATED */}
          {!loading && isAuth && (
  <>
    {/* POST BLOG — completely separate */}
    {!hidePostButton && (
      <Button
        onClick={() => router.push("/blogs/new")}
        className="cursor-pointer flex items-center gap-2 h-10 px-4 rounded-full
        bg-orange-500 text-white text-sm font-medium
        hover:bg-orange-600 transition"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Post a Blog</span>
      </Button>
    )}

    {/* AVATAR + DROPDOWN — UNCHANGED */}
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => openMenu(!menu)}
        className="cursor-pointer h-12 w-12 rounded-full p-0
        hover:bg-orange-50 flex items-center justify-center"
      >
        {menu ? (
          <X className="w-7 h-7 text-orange-600" />
        ) : user?.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile"}
            className="w-10 h-10 rounded-full object-cover border border-orange-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-orange-500
          flex items-center justify-center text-white font-semibold">
            {user?.name?.[0] || "U"}
          </div>
        )}
      </Button>

      {/* DROPDOWN — EXACT SAME AS WORKING VERSION */}
      <div
        className={cn(
          "absolute right-0 mt-3 w-52 origin-top-right rounded-xl border border-orange-100 bg-white shadow-lg transition-all duration-200",
          menu
            ? "opacity-100 scale-100 translate-y-0"
            : "pointer-events-none opacity-0 scale-95 -translate-y-1"
        )}
      >
        <ul className="py-2 text-sm font-medium text-gray-700">
          <li>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              My Profile
            </Link>
          </li>

          <li>
            <Link
              href="/blogs/myblogs"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              My Blogs
            </Link>
          </li>

          <li>
            <Link
              href="/blogs/saved"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              Saved Blogs
            </Link>
          </li>

          <li className="border-t border-orange-100 mt-1 pt-1">
            <button
              onClick={() => {
                openMenu(false);
                logoutUser();
              }}
              className="cursor-pointer flex w-full items-center gap-2 px-4 py-2
              text-red-500 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </>
)}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
