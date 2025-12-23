"use client";

import {useState} from 'react';
import Link from "next/link";
import { Button } from "./ui/button";
import { CircleUserRoundIcon, LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useAppData } from "@/context/AppContext";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  // const {loading, isAuth} = useAppData();
  const loading = false;
  const isAuth = false;

  const closeMenu = () => setMenu(false);
return (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100">
    <div className="container mx-auto flex items-center justify-between px-4 py-3">

      {/* Logo */}
      <Link
        href="/"
        onClick={closeMenu}
        className="text-xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition"
      >
        TechBloggy
      </Link>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenu(!menu)}
          className="rounded-full text-orange-600 hover:bg-orange-50"
        >
          {menu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-3 text-sm font-medium">

        {!loading && isAuth && (
          <>
            <li>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
              >
                My Profile
              </Link>
            </li>

            <li>
              <Link
                href="/blogs/saved"
                className="px-4 py-2 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
              >
                Saved Blogs
              </Link>
            </li>

            <li>
              <Button
                // onClick={handleLogout}
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </li>
          </>
        )}

        {!loading && !isAuth && (
          <li>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>

    {/* Mobile dropdown */}
    <div
      className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        menu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <ul className="flex flex-col gap-2 px-6 py-6 bg-white border-t border-orange-100 text-sm font-medium">

        {!loading && isAuth && (
          <>
            <li>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition"
              >
                My Profile
              </Link>
            </li>

            <li>
              <Link
                href="/blogs/saved"
                onClick={closeMenu}
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition"
              >
                Saved Blogs
              </Link>
            </li>

            <li>
              <Button
                // onClick={handleLogout}
                variant="ghost"
                className="flex items-center gap-2 w-full justify-start px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </li>
          </>
        )}

        {!loading && !isAuth && (
          <li>
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  </nav>
);

}


export default Navbar;
