"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    rating: 4,
    text: "“BookEase completely changed how I manage my salon appointments. My no-show rate dropped by 60% and I'm fully booked every week. Absolute game-changer.”",
    name: "Sarah Mitchell",
    role: "Owner, Luxe Hair Studio",
    image: "/images/image1.jpg",
    featured: false,
  },
  {
    id: 2,
    rating: 5,
    text: "“I found my personal trainer in under 2 minutes. The booking was seamless, the reminders kept me on track, and the whole experience felt premium. I use it every week now.”",
    name: "James Kowalski",
    role: "Fitness Enthusiast, NYC",
    image: "/images/image5.jpg",
    featured: true,
  },
  {
    id: 3,
    rating: 4,
    text: "“Our wellness center grew 40% in 3 months after listing on BookEase. The analytics dashboard is incredibly insightful and the client management tools save us hours every week.”",
    name: "Priya Rajan",
    role: "Director, Zen Garden Spa",
    image: "/images/imag-23.jpg",
    featured: false,
  },
];

export default function RealPeople() {
  return (
    <section className="bg-[#f8fbfa] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#1f2937] md:text-5xl">
            Real People. Real Results.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6b7280] md:text-lg">
            Hear from customers and business owners who&apos;ve transformed how
            they book and manage services.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border border-[#dce6e4] p-6 shadow-sm ${
                item.featured ? "bg-[#eef6f5]" : "bg-white"
              }`}
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < item.rating
                        ? "fill-[#f4b400] text-[#f4b400]"
                        : "fill-[#d1d5db] text-[#d1d5db]"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="mt-5 text-sm leading-6 text-[#374151] md:text-base">
                {item.text}
              </p>

              {/* User */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#1f2937]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#6b7280]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
