"use client";

import Image from "next/image";
import { Globe, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200  bg-[#F8FBFA]">
      <div className="container mx-auto flex h-[74px] items-center justify-between px-4">
        {/* Left Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Bookersi Logo"
            width={70}
            height={70}
            className="h-auto w-[80px] object-contain"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language */}
          <button className="flex h-[44px] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#1F2937] transition hover:bg-gray-50">
            <Globe className="h-5 w-5" />
            <span className="text-[16px] font-medium">English</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Login */}
          <button className="text-[16px] font-semibold text-[#1F2937] transition hover:text-[#1aa39a]">
            Log in
          </button>

          {/* CTA */}
          <button className="h-[44px] rounded-xl bg-[#1aa39a] px-6 text-[16px] font-semibold text-white transition hover:opacity-90">
            List Your Business
          </button>
        </div>
      </div>
    </header>
  );
}
