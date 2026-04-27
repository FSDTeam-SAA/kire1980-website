"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, Star, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ================= TYPES =================

interface Provider {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ServiceInfo {
  _id: string;
  serviceName: string;
  serviceDuration: string;
  price: number;
}

interface BookingService {
  serviceId: ServiceInfo;
  dateAndTime: string;
  selectedProvider: Provider;
}

interface Business {
  _id: string;
  businessName: string;
}

interface Booking {
  _id: string;
  userId: string;
  services: BookingService[];
  businessId: Business;
  bookingStatus: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Booking[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// ================= MAIN COMPONENT =================

export default function MyBookings() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const [page] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Review States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= FETCH DATA =================

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["user-bookings", session?.user?.id, page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/user/${session?.user?.id}?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!token && !!session?.user?.id,
  });

  const bookings = data?.data?.data || [];

  // ================= REVIEW SUBMIT HANDLER =================

  const handleReviewSubmit = async () => {
    if (!reviewingBooking) return;

    if (rating === 0) {
      toast.error("Please select an overall rating!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessId: reviewingBooking.businessId._id,
            serviceId: reviewingBooking.services[0].serviceId._id,
            rating: rating,
            review: reviewText,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Thank you! Your review has been submitted.");
        setReviewModalOpen(false);
        setRating(0);
        setReviewText("");
      } else {
        // Backend Error Validation (e.g., "Review must be at least 10 characters long")
        toast.error(result.message || "Something went wrong while submitting.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= RENDER BOOKING CARD =================

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const service = booking.services[0];

    return (
      <Card className="mb-4 border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/images/booking.jpg"
              alt="booking"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {booking.businessId.businessName}
              </h3>
              <Badge
                className={`capitalize font-medium ${
                  booking.bookingStatus === "cancelled"
                    ? "bg-red-50 text-red-600 hover:bg-red-50"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {booking.bookingStatus}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              {service.serviceId.serviceName}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(service.dateAndTime).toDateString()}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(service.dateAndTime).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xl font-bold text-slate-900">
              ${service.serviceId.price}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[#26a69a] text-[#26a69a] hover:bg-emerald-50 h-10 px-6 rounded-lg font-medium"
                onClick={() => {
                  setReviewingBooking(booking);
                  setReviewModalOpen(true);
                }}
              >
                Review
              </Button>
              <Button
                className="bg-[#26a69a] hover:bg-[#1f8c82] text-white h-10 px-6 rounded-lg font-medium"
                onClick={() => setSelectedBooking(booking)}
              >
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen ">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">My Bookings</h1>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">
          Loading your bookings...
        </div>
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))
      )}

      {/* ================= REVIEW DIALOG ================= */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-start mb-2">
              <div>
                <DialogTitle className="text-2xl font-bold text-[#0f172a]">
                  Submit Your Review
                </DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Share your thoughts on{" "}
                  {reviewingBooking?.businessId.businessName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Overall Rating Section */}
            <div className="mt-8 bg-[#f5f8ff] rounded-2xl p-8 flex flex-col items-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Your Overall Rating
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 cursor-pointer transition-all duration-200 active:scale-90 ${
                      star <= rating
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-slate-300 fill-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8">
              <label className="text-lg font-semibold text-[#0f172a] block mb-3">
                Review Description
              </label>
              <Textarea
                placeholder="What did you like? What could be better? Your honest feedback helps others make informed decisions."
                className="min-h-[140px] border-slate-200 focus:ring-[#26a69a] focus:border-[#26a69a] rounded-xl text-base p-4 resize-none placeholder:text-slate-400"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 py-6 rounded-xl border-[#26a69a] text-[#26a69a] hover:bg-emerald-50 text-base font-bold transition-colors h-14"
                onClick={() => setReviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-6 rounded-xl bg-[#26a69a] hover:bg-[#1f8c82] text-white text-base font-bold transition-all h-14 shadow-lg shadow-emerald-100"
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog remains similar but cleaner */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Booking Details
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 pt-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Booking Info
                </p>
                <p className="text-sm">
                  <strong>Business:</strong>{" "}
                  {selectedBooking.businessId.businessName}
                </p>
                <p className="text-sm mt-1">
                  <strong>Notes:</strong> {selectedBooking.notes}
                </p>
              </div>
              <div className="space-y-3">
                {selectedBooking.services.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-100 rounded-xl"
                  >
                    <p className="font-bold text-slate-800">
                      {s.serviceId.serviceName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {s.selectedProvider.firstName}{" "}
                      {s.selectedProvider.lastName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
