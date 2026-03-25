"use client";

import Image from "next/image";
import { Clock3, ShieldCheck, Bell, CreditCard, Check } from "lucide-react";

const features = [
  {
    icon: Clock3,
    title: "Real-Time Availability",
    description:
      "See live slots and book instantly — no back-and-forth calls or waiting for confirmation.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Businesses",
    description:
      "Every business is vetted and reviewed. Book with confidence knowing you're in safe hands.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Automated SMS and email reminders so you never miss an appointment again.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay online or in-person. All transactions are encrypted and protected.",
  },
];

export default function EverythingYouNeed() {
  return (
    <section className="bg-[#F0F9F8] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-[#1f2937] md:text-5xl">
            Everything You Need to Book or Grow
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6b7280] md:text-lg">
            BookEase is built for both customers who want frictionless booking
            and businesses that want to scale effortlessly.
          </p>

          {/* Tabs */}
          <div className="mt-8 inline-flex rounded-xl border border-[#b9ddda] bg-white p-1 shadow-sm">
            <button className="rounded-lg bg-[#1aa39a] px-6 py-3 text-sm font-semibold text-white">
              For Customers
            </button>
            <button className="rounded-lg px-6 py-3 text-sm font-semibold text-[#1aa39a]">
              For Businesses
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* Left Features */}
          <div className="space-y-4">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-[#d9e8e6] bg-white px-5 py-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1f7f6]">
                    <Icon className="h-5 w-5 text-[#1f2937]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#1f2937]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6b7280] md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Image Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[22px] shadow-lg">
              <Image
                src="/images/EverythingYouNeed.jpg"
                alt="Everything You Need"
                width={900}
                height={700}
                className="h-[320px] w-full object-cover md:h-[420px]"
              />

              {/* Top badge */}
              <div className="absolute right-[-10px] top-[-12px] rounded-full bg-[#1aa39a] px-5 py-2 text-sm font-medium text-white shadow-md">
                2M+ Bookings
              </div>

              {/* Bottom floating card */}
              <div className="absolute bottom-5 left-1/2 flex w-[92%] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#f8f5f1] px-4 py-3 shadow-xl md:w-[86%] md:px-5 md:py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src="/images/user.jpg"
                      alt="User"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-[#1f2937] md:text-xl">
                      Booking Confirmed!
                    </h4>
                    <p className="text-xs text-[#6b7280] md:text-sm">
                      Luxe Hair Studio · Tomorrow at 2:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <Check className="h-4 w-4 text-[#1f2937]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
