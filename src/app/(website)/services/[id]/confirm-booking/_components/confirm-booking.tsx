"use client";

import React from "react";
import {
  Check,
  Calendar,
  User,
  FileText,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ConfirmBooking = () => {
  const appointmentDetails = {
    bookingId: "#BKL-2025-84721",
    studio: {
      name: "Lumière Beauty Studio",
      address: "142 W 57th St, Midtown, New York",
      category: "BEAUTY STUDIO",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400",
    },
    schedule: {
      date: "Monday, January 20, 2025",
      time: "2:00 PM – 4:30 PM",
      duration: "150 min",
    },
    staff: {
      name: "Sophie Laurent",
      image: "https://i.pravatar.cc/150?u=sophie",
    },
    services: [
      { name: "Balayage Color Treatment", price: 195.0 },
      { name: "Signature Blowout & Style", price: 55.0 },
    ],
    total: 272.19,
    email: "sophia.m@email.com",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-[#e0f4f5] rounded-2xl flex items-center justify-center mb-6">
            <Check className="text-[#0096a1] w-8 h-8 stroke-[3px]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Your appointment is confirmed.
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            A confirmation has been sent to your email address.
          </p>

          {/* Booking ID Badge */}
          <div className="bg-[#e0f4f5]/50 border border-[#0096a1]/20 px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0096a1]" />
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">
              BOOKING ID{" "}
              <span className="text-slate-800 ml-1">
                {appointmentDetails.bookingId}
              </span>
            </span>
          </div>
        </div>

        {/* Appointment Summary Card */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm tracking-tight uppercase">
              Appointment Summary
            </h2>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded">
              Confirmed
            </span>
          </div>

          <div className="p-0">
            {/* Studio Info Row */}
            <div className="p-6 flex justify-between items-center">
              <div className="flex gap-4">
                <img
                  src={appointmentDetails.studio.image}
                  className="w-14 h-14 rounded-lg object-cover"
                  alt="Studio"
                />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {appointmentDetails.studio.category}
                  </p>
                  <h3 className="font-bold text-slate-800">
                    {appointmentDetails.studio.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />{" "}
                    {appointmentDetails.studio.address}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0096a1] text-xs font-bold gap-1"
              >
                View <ChevronRight size={14} />
              </Button>
            </div>

            {/* Details Grid Rows */}
            <div className="border-t">
              {/* Date & Time */}
              <div className="p-6 flex gap-4 border-b">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Date & Time
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {appointmentDetails.schedule.date}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appointmentDetails.schedule.time} ·{" "}
                    <span className="text-[#0096a1]">
                      {appointmentDetails.schedule.duration}
                    </span>
                  </p>
                </div>
              </div>

              {/* Staff Member */}
              <div className="p-6 flex justify-between items-center border-b">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Your Stylist
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {appointmentDetails.staff.name}
                    </p>
                  </div>
                </div>
                <img
                  src={appointmentDetails.staff.image}
                  className="w-10 h-10 rounded-lg object-cover"
                  alt="Stylist"
                />
              </div>

              {/* Services List */}
              <div className="p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Services
                  </p>
                  <div className="space-y-2">
                    {appointmentDetails.services.map((service, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">
                          {service.name}
                        </span>
                        <span className="font-bold text-slate-800">
                          ${service.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="bg-slate-50/50 p-6 flex justify-between items-center border-t">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white border rounded shadow-sm">
                  <FileText size={14} className="text-slate-400" />
                </div>
                <span className="font-bold text-slate-800">Total Amount</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                ${appointmentDetails.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Helper Info */}
        <div className="bg-[#e0f4f5]/30 border border-[#0096a1]/10 rounded-xl p-4 flex items-center gap-3 mb-10 text-center justify-center">
          <Mail size={16} className="text-[#0096a1]" />
          <p className="text-xs text-slate-600">
            Confirmation email sent to{" "}
            <span className="font-bold">{appointmentDetails.email}</span> ·{" "}
            <span className="text-[#0096a1] font-bold cursor-pointer underline underline-offset-2">
              Add to calendar from your email
            </span>
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full bg-[#0096a1] hover:bg-[#007a83] py-7 text-md font-bold rounded-xl shadow-lg shadow-[#0096a1]/10 text-white">
            View Booking
          </Button>
          <Button
            variant="outline"
            className="w-full py-7 text-md font-bold rounded-xl border-slate-200 text-slate-600"
          >
            Back to Home
          </Button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-xs text-slate-400 font-medium">
            Looking for more services?
          </p>
          <button className="text-[#0096a1] text-sm font-bold flex items-center gap-1 mx-auto hover:underline">
            Explore more shops <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
