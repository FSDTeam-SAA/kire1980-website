"use client";

import { Search, MapPin } from "lucide-react";

export default function Banner() {
  return (
    <section className="h-[calc(100vh-74px)] bg-[#F8FBFA] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="w-full text-center">
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1f2937] leading-tight">
              Book Services <br />
              Near You <span className="text-[#1aa39a]">Instantly.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-[#6b7280] text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover top-rated professionals for beauty, fitness, and wellness
              etc. Real-time availability, verified reviews, and seamless
              booking all in one place.
            </p>

            {/* Search Box */}
            <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 bg-white border border-gray-200 rounded-xl shadow-sm max-w-3xl mx-auto overflow-hidden">
              <div className="flex items-center gap-2 px-4 h-14 w-full">
                <Search className="text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full outline-none text-sm md:text-base bg-transparent"
                />
              </div>

              <div className="hidden md:block h-8 w-[1px] bg-gray-200" />

              <div className="flex items-center gap-2 px-4 h-14 w-full">
                <MapPin className="text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Zip code or city"
                  className="w-full outline-none text-sm md:text-base bg-transparent"
                />
              </div>

              <button className="h-14 px-8 bg-[#1aa39a] text-white font-semibold rounded-xl md:rounded-none md:rounded-r-xl hover:opacity-90 transition">
                Search
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-[#1aa39a] text-white px-8 py-3 rounded-md font-semibold hover:opacity-90 transition">
                Book Now
              </button>

              <button className="border border-[#1aa39a] text-[#1aa39a] px-8 py-3 rounded-md font-semibold hover:bg-[#1aa39a]/10 transition">
                Join as Business
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
