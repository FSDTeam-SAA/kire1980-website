"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const GetStartedPage = () => {
  return (
    <div className="min-h-screen bg-[#FBFDFD] py-16 px-4 flex flex-col items-center">
      {/* Top Badge & Header */}
      <div className="text-center mb-12">
        <span className="bg-[#E0F2F1] text-[#009688] px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          Welcome to Bookersi
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A2E35] mt-6 mb-4">
          How would you like to get started?
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Choose your path — whether you&apos;re looking to book your next
          wellness experience or grow your business.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* For Customers Card */}
        <div className="group bg-white border border-[#F0F5F5] rounded-4xl p-10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="mb-6 rounded-2xl overflow-hidden w-20 h-20">
              {/* Replace with your local image path */}
              <div className="bg-[#E0F2F1] w-full h-full flex items-center justify-center">
                <Image
                  src="/images/customer.jpg"
                  alt="Customer"
                  width={1000}
                  height={1000}
                  className="h-80 w-80 object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <span className="text-[#009688] text-xs font-bold uppercase tracking-widest">
                For Customers
              </span>
              <ArrowRight
                className="text-gray-300 group-hover:text-[#009688] transition-colors"
                size={24}
              />
            </div>

            <h2 className="text-3xl font-serif font-medium text-[#1A2E35] mb-6">
              Book & Discover
            </h2>

            <p className="text-gray-500 mb-8 leading-relaxed">
              Explore top-rated salons, gyms, spas, and wellness studios. Book
              appointments instantly and manage your self-care routine.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Book salons, gyms & spas",
                "Discover wellness near you",
                "Track appointments & history",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-[#1A2E35] font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link
              href="/sign-up/customer"
              className="text-[#009688] font-bold flex items-center gap-2 group/btn"
            >
              Create customer account{" "}
              <ArrowRight
                size={18}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* For Professionals Card */}
        <div className="group bg-white border border-[#F0F5F5] rounded-4xl p-10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="mb-6 rounded-2xl overflow-hidden w-20 h-20">
              {/* Replace with your local image path */}
              <div className="bg-[#E0F2F1] w-full h-full flex items-center justify-center">
                <Image
                  src="/images/business.jpg"
                  alt="Professional"
                  width={1000}
                  height={1000}
                  className="h-80 w-80 object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <span className="text-[#009688] text-xs font-bold uppercase tracking-widest">
                For Professionals
              </span>
              <ArrowRight
                className="text-gray-300 group-hover:text-[#009688] transition-colors"
                size={24}
              />
            </div>

            <h2 className="text-3xl font-serif font-medium text-[#1A2E35] mb-6">
              Manage & Grow
            </h2>

            <p className="text-gray-500 mb-8 leading-relaxed">
              List your business, manage bookings, and reach thousands of
              wellness seekers. Grow your client base effortlessly.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "List & manage your business",
                "Accept & track bookings",
                "Analytics & growth tools",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-[#1A2E35] font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link
              href="/sign-up/business"
              className="text-[#009688] font-bold flex items-center gap-2 group/btn"
            >
              Create business account{" "}
              <ArrowRight
                size={18}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
