"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/* -------------------- TYPES -------------------- */

type User = {
  _id: string;
  email: string;
};

type Service = {
  _id: string;
  serviceName: string;
};

type Review = {
  _id: string;
  rating: number;
  review: string;
  userId: User;
  serviceId: Service;
};

/* -------------------- API CALL -------------------- */

const fetchReviews = async (): Promise<Review[]> => {
  const res = await fetch("http://localhost:5000/reviews");

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data = await res.json();
  return data?.data?.data || [];
};

/* -------------------- COMPONENT -------------------- */

export default function RealPeople() {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading reviews...</div>;
  }

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

        {/* Carousel */}
        <div className="mt-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((item) => (
                <CarouselItem
                  key={item._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="rounded-2xl border border-[#dce6e4] bg-white p-6 shadow-sm">
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

                    {/* Review Text */}
                    <p className="mt-5 text-sm leading-6 text-[#374151] md:text-base">
                      {item.review}
                    </p>

                    {/* User */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src="/images/image1.jpg"
                          alt="user"
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-[#1f2937]">
                          {item.userId?.email}
                        </h3>
                        <p className="text-sm text-[#6b7280]">
                          {item.serviceId?.serviceName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
