"use client";

import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8fbfa] pb-8">
      <div className="container mx-auto px-4">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Description */}
          <div>
            <div className=" gap-3">
              <Image
                src="/images/logo.png"
                alt="Bookersi"
                width={80}
                height={80}
              />
              <span className="text-xl font-bold text-primary">BOOKERSI</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6b7280] max-w-xs">
              The easiest way to find and book local services. Connecting you
              with the best professionals in your area.
            </p>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#eef6f5]">
                <Facebook size={16} className="text-[#1aa39a]" />
              </div>
              <div className="p-2 rounded-md bg-[#eef6f5]">
                <Twitter size={16} className="text-[#1aa39a]" />
              </div>
              <div className="p-2 rounded-md bg-[#eef6f5]">
                <Instagram size={16} className="text-[#1aa39a]" />
              </div>
              <div className="p-2 rounded-md bg-[#eef6f5]">
                <Linkedin size={16} className="text-[#1aa39a]" />
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-[#1f2937]">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#6b7280]">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Press</li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-lg font-semibold text-[#1f2937]">Discover</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#6b7280]">
              <li>Beauty & Spa</li>
              <li>Fitness & Gym</li>
              <li>Wellness</li>
              <li>Trending</li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-lg font-semibold text-[#1f2937]">
              For Business
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#6b7280]">
              <li>List Your Business</li>
              <li>Partner Support</li>
              <li>Success Stories</li>
              <li>Resources</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-[#e5eceb] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <p className="text-sm text-[#6b7280]">
            © 2026 Bookersi. All Rights Reserved.
          </p>

          {/* Right */}
          <div className="flex items-center gap-6 text-sm text-[#6b7280]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
