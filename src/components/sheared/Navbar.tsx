"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-[#F8FBFA] sticky top-0 z-50">
      <div className="container mx-auto flex h-[74px] items-center justify-between px-4">
        {/* Left Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Bookersi Logo"
            width={70}
            height={70}
            className="h-auto w-[60px] md:w-[80px] object-contain"
          />
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Language */}
          <button className="flex h-[44px] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#1F2937] transition hover:bg-gray-50">
            <Globe className="h-5 w-5" />
            <span className="text-[16px] font-medium">English</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Login */}
          <Link href={"/login"} className="hover:cursor-pointer">
            <button className="text-[16px] font-semibold text-[#1F2937] transition hover:text-primary">
              Log in
            </button>
          </Link>

          {/* CTA */}
          <button className="h-[44px] rounded-xl bg-primary px-6 text-[16px] font-semibold text-white transition hover:opacity-90">
            List Your Business
          </button>
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full h-[54px] text-[16px] font-semibold text-[#1F2937] border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  Log in
                </button>
                <button className="w-full h-[54px] rounded-xl bg-primary text-[16px] font-semibold text-white hover:opacity-90 transition shadow-sm">
                  List Your Business
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
