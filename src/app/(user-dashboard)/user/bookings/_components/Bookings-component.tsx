// "use client";

// import React from "react";
// import Image from "next/image";
// import { Calendar, Clock } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";

// // 1. Define the Data Structure
// interface Booking {
//   id: string;
//   studioName: string;
//   service: string;
//   date: string;
//   time: string;
//   price: string;
//   status: "Confirmed" | "Completed" | "Cancelled";
//   image: string;
// }

// // 2. Mock Data
// const BOOKINGS_DATA: Booking[] = [
//   {
//     id: "1",
//     studioName: "Luxe Hair Studio",
//     service: "Hair Cut & Styling",
//     date: "Tue, Jul 22, 2025",
//     time: "10:00 AM - 11:30 AM",
//     price: "$85.00",
//     status: "Confirmed",
//     image: "/images/booking.jpg",
//   },
//   {
//     id: "2",
//     studioName: "Luxe Hair Studio",
//     service: "Hair Cut & Styling",
//     date: "Mon, Jun 10, 2025",
//     time: "12:00 PM - 01:30 PM",
//     price: "$85.00",
//     status: "Completed",
//     image: "/images/booking.jpg",
//   },
//   {
//     id: "3",
//     studioName: "Luxe Hair Studio",
//     service: "Hair Cut & Styling",
//     date: "Fri, May 05, 2025",
//     time: "02:00 PM - 03:30 PM",
//     price: "$85.00",
//     status: "Cancelled",
//     image: "/images/booking.jpg",
//   },
// ];

// export default function MyBookings() {
// const { data: session } = useSession();
//   const queryClient = useQueryClient();
//   const token = session?.user?.accessToken || "";

//   const { data } = useQuery({
//     queryKey: ["user-bookings", session?.user?.id],
//     queryFn: async () => {

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/user/${session?.user?.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Failed to fetch profile");

//       return res.json();
//     },
//     enabled: !!token && !!session?.user?.id,
//   });

//   console.log(data)

//   const BookingCard = ({ booking }: { booking: Booking }) => (
//     <Card className="mb-4 border-none shadow-sm overflow-hidden">
//       <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">

//         {/* Image */}
//         <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
//           <Image
//             src={booking.image}
//             alt={booking.studioName}
//             fill
//             className="object-cover"
//           />
//         </div>

//         {/* Details */}
//         <div className="flex-1 space-y-1">
//           <div className="flex items-center gap-3">
//             <h3 className="text-lg font-semibold text-[#1a1a1a]">
//               {booking.studioName}
//             </h3>

//             <Badge
//               variant="secondary"
//               className={`font-medium ${
//                 booking.status === "Confirmed"
//                   ? "bg-emerald-50 text-emerald-600"
//                   : booking.status === "Completed"
//                   ? "bg-emerald-50 text-emerald-600"
//                   : "bg-red-50 text-red-600"
//               }`}
//             >
//               {booking.status}
//             </Badge>
//           </div>

//           <p className="text-muted-foreground text-sm">{booking.service}</p>

//           <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1.5">
//               <Calendar className="w-4 h-4" />
//               <span>{booking.date}</span>
//             </div>

//             <div className="flex items-center gap-1.5">
//               <Clock className="w-4 h-4" />
//               <span>{booking.time}</span>
//             </div>
//           </div>
//         </div>

//         {/* Price and Action */}
//         <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4">
//           <span className="text-xl font-bold text-[#1a1a1a]">
//             {booking.price}
//           </span>

//           <Button
//             className="bg-[#26a69a] hover:bg-[#1f8c82] text-white px-6 rounded-md"
//             onClick={() => console.log(`Action for booking: ${booking.id}`)}
//           >
//             View Details
//           </Button>
//         </div>

//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="p-6 min-h-screen">
//       <h1 className="text-2xl font-serif font-bold mb-6 text-[#1a1a1a]">
//         My Bookings
//       </h1>

//       {BOOKINGS_DATA.map((booking) => (
//         <BookingCard key={booking.id} booking={booking} />
//       ))}
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
  bookingStatus: "confirmed" | "completed" | "cancelled";
  notes: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Booking[];
    meta: Meta;
  };
}

// ================= COMPONENT =================

export default function MyBookings() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ================= FETCH =================

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["user-bookings", session?.user?.id, page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/user/${session?.user?.id}?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch bookings");

      return res.json();
    },
    enabled: !!token && !!session?.user?.id,
  });

  const bookings = data?.data?.data || [];
  const meta = data?.data?.meta;

  // ================= SMART PAGINATION =================

  const getPagination = (current: number, total: number) => {
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);

      if (current > 4) pages.push("...");

      if (current > 3 && current < total - 2) pages.push(current);

      if (current < total - 3) pages.push("...");

      pages.push(total - 1, total);
    }

    return pages;
  };

  // ================= BOOKING CARD =================

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const service = booking.services[0];

    return (
      <Card className="mb-4 border-none shadow-sm overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Image */}
          <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/images/booking.jpg"
              alt="booking"
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {booking.businessId.businessName}
              </h3>

              <Badge
                className={`capitalize ${
                  booking.bookingStatus === "cancelled"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {booking.bookingStatus}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {service.serviceId.serviceName}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(service.dateAndTime).toDateString()}
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(service.dateAndTime).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Price + Button */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-xl font-bold">
              ${service.serviceId.price}
            </span>

            <Button
              className="bg-[#26a69a] hover:bg-[#1f8c82]"
              onClick={() => setSelectedBooking(booking)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ================= UI =================

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {isLoading && <p>Loading bookings...</p>}

      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}

      {/* ================= PAGINATION ================= */}

      {meta && (
        <div className="flex justify-between items-center  gap-2 mt-8 flex-wrap">
          <p className="text-center text-sm text-muted-foreground">
            Page {meta?.page} of {meta?.totalPages} • {meta?.total} bookings
          </p>

          <div className="flex gap-2.5">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            {getPagination(page, meta.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={i}
                  variant={page === p ? "default" : "outline"}
                  className={page === p ? "bg-[#26a69a] text-white" : ""}
                  onClick={() => setPage(Number(p))}
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              disabled={page === meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}

      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 text-sm">
              <p>
                <strong>Business:</strong>{" "}
                {selectedBooking.businessId.businessName}
              </p>

              <p>
                <strong>Status:</strong> {selectedBooking.bookingStatus}
              </p>

              <p>
                <strong>Notes:</strong> {selectedBooking.notes}
              </p>

              {selectedBooking.services.map((service, i) => (
                <div key={i} className="border rounded p-3 space-y-1">
                  <p>
                    <strong>Service:</strong> {service.serviceId.serviceName}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {service.serviceId.serviceDuration}
                  </p>

                  <p>
                    <strong>Price:</strong> ${service.serviceId.price}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(service.dateAndTime).toLocaleString()}
                  </p>

                  <p>
                    <strong>Provider:</strong>{" "}
                    {service.selectedProvider.firstName}{" "}
                    {service.selectedProvider.lastName}
                  </p>
                </div>
              ))}

              {selectedBooking.cancellationReason && (
                <p className="text-red-500">
                  <strong>Cancellation Reason:</strong>{" "}
                  {selectedBooking.cancellationReason}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
