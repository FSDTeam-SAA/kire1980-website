"use client";

import { Search, CircleCheckBig, CalendarDays, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Search",
    description:
      "Find the service you need in your area using filters and smart search.",
  },
  {
    icon: CircleCheckBig,
    title: "2. Choose",
    description:
      "Compare ratings, prices, and verified reviews from real customers.",
  },
  {
    icon: CalendarDays,
    title: "3. Pick Time",
    description:
      "Select a real-time available slot that fits your schedule perfectly.",
  },
  {
    icon: ThumbsUp,
    title: "4. Confirm",
    description: "Book instantly and receive confirmation with reminders.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F0F9F8] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937]">
            How It Works
          </h2>
          <p className="mt-4 text-sm md:text-lg text-[#6b7280]">
            Simple, fast, and hassle-free booking in 4 steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* line */}
          <div className="hidden md:block absolute left-0 right-0 top-6 h-[1px] bg-[#d9e7e5]" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* icon */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9e7e5] bg-white shadow-sm">
                    <Icon
                      className="h-6 w-6 text-[#1f2937]"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* title */}
                  <h3 className="mt-5 text-2xl font-medium text-[#1f2937]">
                    {step.title}
                  </h3>

                  {/* desc */}
                  <p className="mt-3 max-w-[240px] text-sm md:text-base leading-relaxed text-[#6b7280]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
