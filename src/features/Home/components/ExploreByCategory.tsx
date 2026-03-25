"use client";

import Image from "next/image";

const categories = [
  {
    title: "Beauty",
    subtitle: "Hair, nails, skin & more",
    image: "/images/Beauty.png",
  },
  {
    title: "Fitness",
    subtitle: "Gyms, yoga, personal training",
    image: "/images/Fitness.png",
  },
  {
    title: "Wellness",
    subtitle: "Massage, therapy & mindfulness",
    image: "/images/Wellness.png",
  },
];

export default function ExploreByCategory() {
  return (
    <section className="bg-[#f8fbfa] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937]">
            Explore by Category
          </h2>
          <p className="mt-4 text-sm md:text-lg text-[#6b7280] max-w-2xl mx-auto">
            Find the perfect service across our three core wellness verticals.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, index) => (
            <div
              key={index}
              className="group relative h-[320px] overflow-hidden rounded-[26px]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <div className="text-white">
                  <h3 className="mt-1 text-3xl font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm md:text-base text-white/85">
                    {item.subtitle}
                  </p>
                </div>

                <button className="shrink-0 rounded-lg bg-[#1aa39a] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
