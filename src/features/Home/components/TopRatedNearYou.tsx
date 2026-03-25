"use client";

import Image from "next/image";
import { ArrowRight, Star, ChevronRight } from "lucide-react";

const topRatedData = [
  {
    id: 1,
    category: "Beauty",
    title: "Luxe Hair Studio",
    description: "Premium hair styling and coloring services in downtown.",
    price: "$45",
    rating: "4.9",
    image: "/images/Beauty.png",
  },
  {
    id: 2,
    category: "Fitness",
    title: "Luxe Hair Studio",
    description: "24/7 access gym with state-of-the-art equipment.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon.png",
  },
  {
    id: 3,
    category: "Wellness",
    title: "Luxe Hair Studio",
    description: "Relaxing massages and aromatherapy sessions.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon1.png",
  },
  {
    id: 4,
    category: "Fitness",
    title: "Luxe Hair Studio",
    description: "Vinyasa, Hatha, and Yin yoga classes for all levels.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon2.png",
  },
];

export default function TopRatedNearYou() {
  return (
    <section className="bg-[#f8fbfa] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1f2937] md:text-5xl">
              Top Rated Near You
            </h2>
            <p className="mt-2 text-base text-[#6b7280] md:text-lg">
              Highly recommended by your community.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
            View all
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {topRatedData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-[220px] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* Rating */}
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                  <span className="text-xs font-semibold text-[#1f2937]">
                    {item.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm font-medium text-[#ff5a7a]">
                  {item.category}
                </p>

                <h3 className="mt-1 text-2xl font-semibold text-[#1f2937]">
                  {item.title}
                </h3>

                <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#6b7280] md:text-base">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#e7efee] pt-4">
                  <p className="text-3xl font-medium text-[#6b7280]">
                    From {item.price}
                  </p>

                  <button className="inline-flex items-center gap-1 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
                    Book
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
