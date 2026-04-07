/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// --- Types ---
interface Booking {
  _id: string;
  services: Array<{
    serviceId: {
      serviceName: string;
      serviceDuration: string;
      price: number;
    };
    dateAndTime: string;
  }>;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
}

interface ApiResponse {
  data: {
    data: Booking[];
  };
}

const fetchBookings = async (token: string): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-03-20"));
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  console.log(session);
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings-calendar"],
    queryFn: () => fetchBookings(token as string),
    enabled: !!token,
  });

  const allBookings = useMemo(() => data?.data?.data || [], [data]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      slots.push(`${displayHour}:00 ${ampm}`);
    }
    return slots;
  }, []);

  const startOfWeek = getStartOfWeek(currentDate);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const count = allBookings.filter(
      (b) =>
        new Date(b.services[0]?.dateAndTime).toDateString() ===
        d.toDateString(),
    ).length;
    return {
      label: d
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .replace(/ /g, "-"),
      fullDate: d,
      count,
    };
  });

  const getBookingForSlot = (day: Date, timeSlot: string) => {
    return allBookings.find((b) => {
      const bDate = new Date(b.services[0]?.dateAndTime);
      let hours = bDate.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;
      const formattedTime = `${displayHour}:00 ${ampm}`;

      return (
        formattedTime === timeSlot &&
        bDate.toDateString() === day.toDateString()
      );
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#009296] text-white";
      case "completed":
        return "bg-[#E6F4F4] text-[#009296] border border-[#009296]/20";
      case "cancelled":
        return "bg-[#FFEBEB] text-[#FF4D4D] border border-[#FF4D4D]/20";
      default:
        return "bg-[#FFF4E5] text-[#FF9900] border border-[#FF9900]/20";
    }
  };

  if (error)
    return (
      <div className="p-10 text-center text-red-500">Error loading data.</div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Booking Calendar</h1>
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-1">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-[#374151] font-medium">Service Management</span>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[700px] w-full rounded-2xl" />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {/* Controls */}
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b">
            <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() - 7)),
                  )
                }
                className="px-4 py-2 text-sm font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-6 py-2 text-sm font-bold bg-[#009296] text-white rounded-md"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() + 7)),
                  )
                }
                className="px-4 py-2 text-sm font-semibold"
              >
                Next
              </button>
            </div>

            <div className="text-lg font-bold text-[#111827]">
              {days[0].fullDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}{" "}
              -{" "}
              {days[6].fullDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
              <button className="px-4 py-2 text-sm font-semibold">Month</button>
              <button className="px-6 py-2 text-sm font-bold bg-[#009296] text-white rounded-md">
                Week
              </button>
              <button className="px-4 py-2 text-sm font-semibold">Day</button>
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
            <table className="w-full border-collapse sticky-header">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="w-28 py-5 border-b bg-[#FCFDFD]"></th>
                  {days.map((day, i) => (
                    <th
                      key={i}
                      className="p-5 border-l border-b text-center min-w-[160px] bg-[#FCFDFD]"
                    >
                      <p className="text-[14px] font-bold text-[#111827]">
                        {day.label}
                      </p>
                      <p className="text-[12px] text-[#6B7280] font-medium">
                        {day.count} Booking
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, tIdx) => (
                  <tr
                    key={tIdx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-6 px-4 text-center text-[13px] font-bold text-[#4B5563] border-b bg-[#FCFDFD]">
                      {time}
                    </td>
                    {days.map((day, dIdx) => {
                      const booking = getBookingForSlot(day.fullDate, time);
                      return (
                        <td
                          key={dIdx}
                          className="border-l border-b h-28 p-1.5 relative"
                        >
                          {booking && (
                            <div
                              className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-center p-3 shadow-sm ${getStatusStyles(booking.bookingStatus)}`}
                            >
                              <p className="text-[12px] font-extrabold uppercase leading-tight">
                                {booking.services[0].serviceId.serviceName}
                              </p>
                              <p className="text-[10px] mt-1.5 font-bold opacity-80">
                                {booking.services[0].serviceId.serviceDuration}
                              </p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
