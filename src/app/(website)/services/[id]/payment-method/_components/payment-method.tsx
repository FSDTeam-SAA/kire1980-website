"use client";

import React, { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Standard shadcn utility
import Link from "next/link";

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] =
    useState<string>("pay-at-location");

  const paymentOptions: PaymentOption[] = [
    {
      id: "pay-at-location",
      title: "Pay at Location",
      description: "Pay directly at the business location when you arrive.",
      enabled: true,
    },
    {
      id: "pay-online",
      title: "Pay Online",
      description: "Secure payment via platform.",
      enabled: false, // Grayed out in figma
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto">
        {/* Success Icon Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#e0f4f5] rounded-2xl flex items-center justify-center mb-6">
            <Check className="text-[#0096a1] w-8 h-8 stroke-[3px]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1e293b] mb-2">
            Payment Method
          </h1>
          <p className="text-slate-500 text-sm">
            Select how you&apos;d like to pay for your booking.
          </p>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="p-8 space-y-4">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => option.enabled && setSelectedMethod(option.id)}
                className={cn(
                  "relative flex items-center gap-4 p-6 rounded-xl border-2 transition-all cursor-pointer",
                  selectedMethod === option.id
                    ? "border-[#0096a1] bg-[#f0f9f9]/30"
                    : "border-slate-100 bg-white",
                  !option.enabled &&
                    "opacity-50 cursor-not-allowed bg-slate-50",
                )}
              >
                {/* Custom Radio Button */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedMethod === option.id
                      ? "border-[#0096a1]"
                      : "border-slate-300",
                  )}
                >
                  {selectedMethod === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0096a1]" />
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-bold text-lg",
                      selectedMethod === option.id
                        ? "text-slate-800"
                        : "text-slate-400",
                    )}
                  >
                    {option.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary Footer */}
          <div className="bg-slate-50/50 p-8 border-t space-y-3">
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold text-slate-800">
                Total Due
              </span>
              <span className="text-2xl font-bold text-slate-800">$125.00</span>
            </div>

            <Link href={`/services/sadfads/confirm-booking`}>
              <Button className="w-full bg-[#0096a1] hover:bg-[#007a83] text-white py-7 text-lg font-bold rounded-xl mt-6 shadow-lg shadow-[#0096a1]/10">
                Confirm Booking
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-4">
              <ShieldCheck size={14} />
              <span>Secure 256-bit SSL Encrypted Booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
