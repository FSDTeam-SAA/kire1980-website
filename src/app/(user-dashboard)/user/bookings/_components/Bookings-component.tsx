"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. Define the Data Structure
interface Booking {
  id: string;
  studioName: string;
  service: string;
  date: string;
  time: string;
  price: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  image: string;
  type: "upcoming" | "past";
}

// 2. Mock Data
const BOOKINGS_DATA: Booking[] = [
  {
    id: "1",
    studioName: "Luxe Hair Studio",
    service: "Hair Cut & Styling",
    date: "Tue, Jul 22, 2025",
    time: "10:00 AM - 11:30 AM",
    price: "$85.00",
    status: "Confirmed",
    image: "/salon-placeholder.jpg", // Replace with your actual path
    type: "upcoming",
  },
  {
    id: "2",
    studioName: "Luxe Hair Studio",
    service: "Hair Cut & Styling",
    date: "Mon, Jun 10, 2025",
    time: "12:00 PM - 01:30 PM",
    price: "$85.00",
    status: "Completed",
    image: "/salon-placeholder.jpg",
    type: "past",
  },
  {
    id: "3",
    studioName: "Luxe Hair Studio",
    service: "Hair Cut & Styling",
    date: "Fri, May 05, 2025",
    time: "02:00 PM - 03:30 PM",
    price: "$85.00",
    status: "Cancelled",
    image: "/salon-placeholder.jpg",
    type: "past",
  },
];

export default function MyBookings() {
  // Reusable Card Component
  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4 border-none shadow-sm overflow-hidden">
      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Image */}
        <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src="/images/booking.jpg"
            alt={booking.studioName}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-[#1a1a1a]">
              {booking.studioName}
            </h3>
            <Badge
              variant="secondary"
              className={`font-medium ${
                booking.status === "Confirmed"
                  ? "bg-emerald-50 text-emerald-600"
                  : booking.status === "Completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
              }`}
            >
              {booking.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{booking.service}</p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4">
          <span className="text-xl font-bold text-[#1a1a1a]">
            {booking.price}
          </span>
          <Button
            className="bg-[#26a69a] hover:bg-[#1f8c82] text-white px-6 rounded-md"
            onClick={() => console.log(`Action for booking: ${booking.id}`)}
          >
            {booking.type === "upcoming" ? "View Details" : "Book Again"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className=" p-6 min-h-screen ">
      <h1 className="text-2xl font-serif font-bold mb-6 text-[#1a1a1a]">
        My Bookings
      </h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6 gap-8">
          <TabsTrigger
            value="upcoming"
            className="rounded-none  border-t-0 border-r-0 border-l-0  border-transparent data-[state=active]:border-[#26a69a] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 text-base"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="rounded-none  border-t-0 border-r-0 border-l-0  border-transparent data-[state=active]:border-[#26a69a] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 text-base"
          >
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          {BOOKINGS_DATA.filter((b) => b.type === "upcoming").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {BOOKINGS_DATA.filter((b) => b.type === "past").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
