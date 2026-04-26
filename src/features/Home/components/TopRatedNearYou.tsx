"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BusinessCardSkeleton } from "./AfterLOginComponent";

interface Gallery {
  url: string;
}

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  description: string;
  status: string;
  gallery: Gallery[];
}

const fetchBusinesses = async (): Promise<Business[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses`);
  const data = await res.json();
  // return only activated businesses
  return data.data.items.filter(
    (item: Business) => item.status === "activated",
  );
};

export default function TopRatedNearYou() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <section className="bg-[#F0F9F8] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex justify-center">
            <div className="h-10 w-[320px] bg-gray-200 rounded-xl animate-pulse" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <p className="text-center py-10">Something went wrong</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center py-10">No businesses found</p>;
  }

  return (
    <section id="business" className="bg-[#f8fbfa] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1f2937] md:text-5xl">
              Recommended
            </h2>
            <p className="mt-2 text-base text-[#6b7280] md:text-lg">
              Highly recommended by your community.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {data.slice(0, 8).map((item) => (
            <Link key={item._id} href={`/services/${item._id}`}>
              <div className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                {/* Image */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={item.gallery?.[0]?.url || "/images/Beauty.png"}
                    alt={item.businessName}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className="object-cover"
                  />

                  {/* Rating (static because API has no rating) */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                    <span className="text-xs font-semibold text-[#1f2937]">
                      4.8
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm font-medium text-[#ff5a7a]">
                    {item.businessCategory}
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-[#1f2937]">
                    {item.businessName}
                  </h3>

                  <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#6b7280] md:text-base">
                    {item.description.slice(0, 50) + "..."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
