"use client";

export default function OnlineBooking() {
  return (
    <section className="bg-[#eef6f5] py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937] leading-tight">
          Grow Your Business With Online Booking
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-lg text-[#6b7280] leading-relaxed">
          Join thousands of professionals who use Bookersi to manage
          appointments, attract new clients, and grow their revenue — starting
          for free.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-[#1aa39a] text-white px-8 py-3 rounded-md font-semibold hover:opacity-90 transition">
            List Your Business
          </button>

          <button className="border border-[#1aa39a] text-[#1aa39a] px-8 py-3 rounded-md font-semibold hover:bg-[#1aa39a]/10 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
