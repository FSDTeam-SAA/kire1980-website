"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const BusinessCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm animate-pulse">
      <div className="h-[220px] w-full bg-gray-200" />

      <div className="p-4 space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />

        <div className="pt-4 border-t border-[#e7efee]">
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

/* ---------------- Types ---------------- */
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

/* ---------------- API ---------------- */
const fetchBusinesses = async (
  filter: string,
  page: number,
  limit: number,
  token: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses?filterBy=${filter}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch businesses");
  }

  return res.json();
};

/* ---------------- Component ---------------- */
export default function AfterLoginComponent() {
  const [filter, setFilter] = useState("most_popular");
  const [page, setPage] = useState(1);
  const limit = 24;

  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: ["businesses", filter, page],
    queryFn: () => fetchBusinesses(filter, page, limit, token as string),
    enabled: !!token,
  });

  const businesses = data?.data?.items || [];
  const meta = data?.data?.meta;

  /* ---------------- Loading ---------------- */
  if (isLoading || !token) {
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

  return (
    <section id="business" className="bg-[#F0F9F8] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Toggle */}
        <div className="mb-10 flex flex-col items-center justify-center gap-4">
          {" "}
          <div className="inline-flex p-1 bg-white border border-[#dce6e4] rounded-xl shadow-sm">
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(val) => {
                if (val) setFilter(val);
              }}
              className="gap-1"
            >
              <ToggleGroupItem
                value="most_popular"
                className="rounded-lg px-5 py-2 text-sm font-medium transition-all
                data-[state=on]:bg-[#1aa39a] data-[state=on]:text-white
                data-[state=off]:text-[#1aa39a] hover:bg-[#F0F9F8]"
              >
                Most Popular
              </ToggleGroupItem>

              <ToggleGroupItem
                value="new"
                className="rounded-lg px-5 py-2 text-sm font-medium transition-all
                border border-transparent data-[state=off]:border-[#1aa39a]/20
                data-[state=on]:bg-[#1aa39a] data-[state=on]:text-white
                data-[state=off]:text-[#1aa39a] hover:bg-[#F0F9F8]"
              >
                New to Bookersi
              </ToggleGroupItem>

              <ToggleGroupItem
                value="book_again"
                className="rounded-lg px-5 py-2 text-sm font-medium transition-all
                border border-transparent data-[state=off]:border-[#1aa39a]/20
                data-[state=on]:bg-[#1aa39a] data-[state=on]:text-white
                data-[state=off]:text-[#1aa39a] hover:bg-[#F0F9F8]"
              >
                Book again
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {businesses.map((item: Business) => (
            <Link key={item._id} href={`/services/${item._id}`}>
              <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="relative h-[220px] w-full">
                  <Image
                    src={item.gallery?.[0]?.url || "/images/Beauty.png"}
                    alt={item.businessName}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute right-3 top-3 bg-white px-2 py-1 rounded-md">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    4.8
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-pink-500">
                    {item.businessCategory}
                  </p>

                  <h3 className="text-xl font-semibold">{item.businessName}</h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.description.slice(0, 60)}...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        {meta?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={!meta?.hasPreviousPage}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {meta?.page} of {meta?.totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta?.hasNextPage}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
