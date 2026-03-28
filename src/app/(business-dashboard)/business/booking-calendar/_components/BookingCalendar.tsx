"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------------- Stats ---------------- */

const stats = [
  { label: "Today Booking", value: "24", trend: null },
  {
    label: "Cancelled",
    value: "125",
    trend: "+ 36% ↑",
    trendColor: "text-green-500",
  },
  { label: "Completed", value: "22", trend: null },
  { label: "Today's Revenue", value: "$72", trend: null },
];

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
];

/* ---------------- Demo Events ---------------- */

const events = [
  {
    dayIdx: 0,
    timeIdx: 0,
    name: "Facial",
    duration: "60 min",
    color: "bg-[#E8F7F2] text-[#169C9F]",
  },
  {
    dayIdx: 1,
    timeIdx: 1,
    name: "Hair Cut",
    duration: "30 min",
    color: "bg-[#169C9F] text-white",
  },
  {
    dayIdx: 2,
    timeIdx: 2,
    name: "Massage",
    duration: "90 min",
    color: "bg-[#FDE7D2] text-[#D97706]",
  },
  {
    dayIdx: 3,
    timeIdx: 3,
    name: "Spa",
    duration: "45 min",
    color: "bg-[#FCE7E7] text-[#EF4444]",
  },
  {
    dayIdx: 4,
    timeIdx: 0,
    name: "Hair Cut",
    duration: "60 min",
    color: "bg-[#E8F7F2] text-[#169C9F]",
  },
];

/* ---------------- Helpers ---------------- */

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  return new Date(d.setDate(diff));
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ---------------- Component ---------------- */

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfWeek = getStartOfWeek(currentDate);

  const days = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);

    return {
      date: formatDate(d),
      bookings: `10 Booking`,
    };
  });

  const endDate = new Date(startOfWeek);
  endDate.setDate(startOfWeek.getDate() + 6);

  /* -------- Navigation -------- */

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="p-8 bg-[#F8FAFB] min-h-screen font-sans">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Booking Calendar</h1>

        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-1">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-slate-600">Service Management</span>
        </nav>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 rounded-xl border-slate-100 shadow-sm">
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">{stat.label}</p>
              {stat.trend && (
                <span className={`text-[10px] font-bold ${stat.trendColor}`}>
                  {stat.trend}
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-slate-800 mt-2">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Calendar */}

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Navigation */}

        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="rounded-none px-6 border-r"
              onClick={prevWeek}
            >
              Back
            </Button>

            <Button
              className="rounded-none px-6 bg-[#169C9F]"
              onClick={goToday}
            >
              Today
            </Button>

            <Button
              variant="ghost"
              className="rounded-none px-6 border-l"
              onClick={nextWeek}
            >
              Next
            </Button>
          </div>

          <span className="text-lg font-semibold text-slate-700">
            {formatDate(startOfWeek)} - {formatDate(endDate)}
          </span>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button variant="ghost" className="rounded-none px-6 border-r">
              Month
            </Button>
            <Button className="rounded-none px-6 bg-[#169C9F]">Week</Button>
            <Button variant="ghost" className="rounded-none px-6 border-l">
              Day
            </Button>
          </div>
        </div>

        {/* Days Header */}

        <div className="grid grid-cols-7 border-b">
          <div className="border-r h-20"></div>

          {days.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border-r h-20"
            >
              <p className="text-sm font-semibold">{day.date}</p>
              <p className="text-[11px] text-slate-400">{day.bookings}</p>
            </div>
          ))}
        </div>

        {/* Time Grid */}

        {timeSlots.map((time, timeIdx) => (
          <div key={timeIdx} className="grid grid-cols-7 border-b">
            <div className="flex items-center justify-center border-r h-20 text-sm">
              {time}
            </div>

            {Array.from({ length: 6 }).map((_, dayIdx) => {
              const event = events.find(
                (e) => e.dayIdx === dayIdx && e.timeIdx === timeIdx,
              );

              return (
                <div key={dayIdx} className="border-r h-20 relative">
                  {event && (
                    <div
                      className={`absolute inset-1 rounded-sm p-2 flex flex-col items-center justify-center text-center ${event.color}`}
                    >
                      <p className="text-[10px] font-bold">{event.name}</p>
                      <p className="text-[9px] opacity-80">{event.duration}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
