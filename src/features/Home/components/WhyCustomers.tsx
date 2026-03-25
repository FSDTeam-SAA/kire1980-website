"use client";

import { ShieldCheck, Lock, RefreshCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "Every business is manually reviewed",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "256-bit SSL encryption",
  },
  {
    icon: RefreshCcw,
    title: "Free Cancellation",
    desc: "Cancel up to 24h before",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Always here when you need us",
  },
];

export default function WhyCustomers() {
  return (
    <section className="bg-[#F0F9F8] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937]">
          Why Customers Trust BookEase
        </h2>

        {/* Items */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Icon Box */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm mb-4">
                  <Icon className="text-[#1f2937]" size={22} />
                </div>

                {/* Title */}
                <p className="text-lg font-semibold text-[#1f2937]">
                  {item.title}
                </p>

                {/* Description */}
                <p className="text-sm text-[#6b7280] mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
