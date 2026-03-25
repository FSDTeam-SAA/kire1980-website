"use client";

import { ArrowRight } from "lucide-react";

const stats = [
  { value: "3,000+", label: "Active Businesses" },
  { value: "98%", label: "Booking Fill Rate" },
  { value: "98%", label: "Booking Fill Rate" },
  { value: "24/7", label: "Online Bookings" },
];

export default function GrowYourBusiness() {
  return (
    <section className="bg-[#eef6f5] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937] leading-tight">
              Grow Your Business With <br />
              Online Booking
            </h2>

            <p className="mt-5 text-sm md:text-lg text-[#6b7280] leading-relaxed">
              Join 3,000+ service providers already using Bookersi to fill their
              calendars, reduce no-shows, and get paid faster.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-[#1aa39a] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                Start Selling Services
                <ArrowRight size={16} />
              </button>

              <button className="border border-[#1aa39a] text-[#1aa39a] px-6 py-3 rounded-md font-semibold hover:bg-[#1aa39a]/10 transition">
                See How It Works
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white border border-[#dce6e4] p-6 shadow-sm text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#1f2937]">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm md:text-base text-[#6b7280]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
