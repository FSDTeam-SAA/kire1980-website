"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const session = useSession();
  const role = session?.data?.user?.role;

  return (
    <header className="w-full border-b border-gray-200 bg-[#F8FBFA] sticky top-0 z-50">
      <div className="container mx-auto flex h-[74px] items-center justify-between px-4">
        {/* Left Logo */}
        <Link href={`/`}>
          {" "}
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Bookersi Logo"
              width={70}
              height={70}
              className="h-auto w-[60px] md:w-[80px] object-contain"
            />
          </div>
        </Link>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Language */}
          <button className="flex h-[44px] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#1F2937] transition hover:bg-gray-50">
            <Globe className="h-5 w-5" />
            <span className="text-[16px] font-medium">English</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Login / User Menu */}
          {session?.data?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                {session.data.user.profileImage ? (
                  <Image
                    src={session.data.user.profileImage}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-3 w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <Link
                    href={
                      role === "customer"
                        ? "/user/profile"
                        : role === "businessowner"
                          ? "/business"
                          : "#"
                    }
                    className="block px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={"/login"} className="hover:cursor-pointer">
              <button className="text-[16px] font-semibold text-[#1F2937] transition hover:text-primary cursor-pointer">
                Log in
              </button>
            </Link>
          )}

          {/* CTA */}
          {role === "businessowner" && (
            <Link href={`/list-your-business`}>
              {" "}
              <button className="h-[44px] rounded-xl bg-primary px-6 text-[16px] font-semibold text-white transition hover:opacity-90 cursor-pointer">
                List Your Business
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#1F2937] p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {/* Language */}
              <button className="flex items-center justify-between w-full h-[54px] px-4 rounded-xl border border-gray-100 bg-gray-50 text-[#1F2937]">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <span className="text-[16px] font-medium">English</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Action Buttons / User Menu */}
              {session?.data?.user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    className="w-full h-[54px] flex items-center justify-center text-[16px] font-semibold text-[#1F2937] border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/business-profile"
                    className="w-full h-[54px] flex items-center justify-center text-[16px] font-semibold text-[#1F2937] border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    Business Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full h-[54px] flex items-center justify-center text-[16px] font-semibold text-red-500 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    Logout
                  </button>
                  <button className="w-full h-[54px] rounded-xl bg-primary text-[16px] font-semibold text-white hover:opacity-90 transition shadow-sm">
                    List Your Business
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="w-full cursor-pointer h-[54px] flex items-center justify-center text-[16px] font-semibold text-[#1F2937] border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    Log in
                  </Link>
                  <button className="w-full h-[54px] rounded-xl bg-primary text-[16px] font-semibold text-white hover:opacity-90 transition shadow-sm">
                    List Your Business
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
