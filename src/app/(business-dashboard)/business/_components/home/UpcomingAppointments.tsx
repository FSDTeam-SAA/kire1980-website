/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, X, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useBusinessId } from "../../../../../../zustand/useServiceId";

// ================= TYPES =================

interface Booking {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  services: Array<{
    serviceId: {
      _id: string;
      serviceName: string;
      serviceDuration: string;
      price: number;
    };
    dateAndTime: string;
    selectedProvider: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  businessId: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
  };
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
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

// ================= API FUNCTIONS =================

const fetchBookings = async (
  token: string,
  businessId: string,
): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/business/${businessId}?page=1&limit=5`,
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

const confirmBooking = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingStatus: "confirmed" }),
    },
  );
  if (!response.ok) throw new Error("Failed to confirm booking");
  return response.json();
};

const cancelBooking = async ({
  id,
  token,
  reason,
}: {
  id: string;
  token: string;
  reason: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationReason: reason }),
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to cancel booking");
  }
  return response.json();
};

const completeBooking = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingStatus: "completed" }),
    },
  );
  if (!response.ok) throw new Error("Failed to complete booking");
  return response.json();
};

// ================= SKELETONS =================

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
      >
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="flex justify-between items-end">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden m-8">
    <div className="p-6 border-b border-gray-50">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
    <div className="divide-y divide-gray-50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-16 mx-auto" />
            <div className="flex justify-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ================= MAIN COMPONENT =================

export default function UpcomingAppointments() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [actionType, setActionType] = useState<
    "confirm" | "cancel" | "complete"
  >("confirm");
  const [cancelReason, setCancelReason] = useState("");

  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;
  const queryClient = useQueryClient();
  const { businessId } = useBusinessId();

  // Renamed isLoading to isInitialLoading to avoid conflict
  const {
    data,
    isLoading: isInitialLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(token as string, businessId as string),
    enabled: !!token,
  });

  const confirmMutation = useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking confirmed successfully");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking cancelled");
      setDialogOpen(false);
      setCancelReason("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const completeMutation = useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking marked as completed");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const allBookings = data?.data?.data || [];
  const bookings = allBookings.filter(
    (booking) =>
      booking.bookingStatus === "pending" ||
      booking.bookingStatus === "confirmed",
  );

  const handleActionClick = (
    id: string,
    action: "confirm" | "cancel" | "complete",
  ) => {
    setSelectedBookingId(id);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedBookingId || !token) return;

    if (actionType === "confirm") {
      confirmMutation.mutate({ id: selectedBookingId, token });
    } else if (actionType === "cancel") {
      cancelMutation.mutate({
        id: selectedBookingId,
        token,
        reason: cancelReason,
      });
    } else if (actionType === "complete") {
      completeMutation.mutate({ id: selectedBookingId, token });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getDialogContent = () => {
    switch (actionType) {
      case "confirm":
        return {
          title: "Confirm Booking",
          description: "Are you sure you want to confirm this booking?",
          confirmText: "Confirm",
          confirmButtonClass: "bg-[#00A3A3] hover:bg-[#008585] text-white",
        };
      case "cancel":
        return {
          title: "Cancel Booking",
          description:
            "Are you sure you want to cancel this booking? This action cannot be undone.",
          confirmText: "Cancel Booking",
          confirmButtonClass: "bg-red-500 hover:bg-red-600 text-white",
        };
      case "complete":
        return {
          title: "Complete Booking",
          description: "Mark this booking as completed?",
          confirmText: "Complete",
          confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
        };
      default:
        return {
          title: "",
          description: "",
          confirmText: "",
          confirmButtonClass: "",
        };
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-red-500 mb-4">Error loading bookings</p>
          <Button onClick={() => refetch()} className="bg-[#00A3A3]">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { title, description, confirmText, confirmButtonClass } =
    getDialogContent();

  // Loading check for mutations
  const isActionPending =
    confirmMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending;

  return (
    <div className="min-h-screen  bg-[#F0F7F7] py-8">
      {isInitialLoading ? (
        <>
          <StatsSkeleton />
          <TableSkeleton />
        </>
      ) : (
        <div className="bg-white  rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-800 text-lg">
              Upcoming Appointments
            </h2>
            <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wide">
              Total {bookings.length} bookings found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 border-b border-gray-50 uppercase tracking-tight">
                  <th className="px-6 py-5">Client Name</th>
                  <th className="px-6 py-5">Service Type</th>
                  <th className="px-6 py-5">Staff Name</th>
                  <th className="px-6 py-5">Date & Time</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {booking.userId.email.split("@")[0]}
                    </td>
                    <td className="px-6 py-4">
                      {booking.services[0]?.serviceId?.serviceName}
                    </td>
                    <td className="px-6 py-4">
                      {booking.services[0]?.selectedProvider?.firstName}{" "}
                      {booking.services[0]?.selectedProvider?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDateTime(booking.services[0]?.dateAndTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${getStatusColor(booking.bookingStatus)}`}
                      >
                        {booking.bookingStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {booking.bookingStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleActionClick(booking._id, "confirm")
                              }
                              className="w-8 h-8 rounded-full bg-[#00A3A3] text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(booking._id, "cancel")
                              }
                              className="w-8 h-8 rounded-full bg-[#FF4D4D] text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {booking.bookingStatus === "confirmed" && (
                          <button
                            onClick={() =>
                              handleActionClick(booking._id, "complete")
                            }
                            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No upcoming bookings
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {actionType === "cancel" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cancelReason">
                  Cancellation Reason (Optional)
                </Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isActionPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isActionPending}
              className={confirmButtonClass}
            >
              {isActionPending ? "Processing..." : confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
