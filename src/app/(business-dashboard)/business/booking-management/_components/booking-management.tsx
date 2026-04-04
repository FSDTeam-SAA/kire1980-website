"use client";
import { useState } from "react";
import { Check, X, ChevronRight, Clock, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

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

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

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

  if (!response.ok) {
    throw new Error("Failed to confirm booking");
  }

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
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationReason: reason }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to cancel booking");
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

  if (!response.ok) {
    throw new Error("Failed to complete booking");
  }

  return response.json();
};

// Stats Skeleton
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

// Table Skeleton
const TableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

// Cancel Reason Modal
const CancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isCancelling: boolean;
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Cancel Booking
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A3A3] focus:border-transparent resize-none"
            rows={4}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isCancelling || !reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BookingManagement() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(token as string),
    enabled: !!token,
  });

  const confirmMutation = useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setCancelModalOpen(false);
      setSelectedBookingId(null);
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const bookings = data?.data?.data || [];
  const totalBookings = data?.data?.meta?.total || 0;

  // Calculate stats from actual data
  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    const todayBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.services[0]?.dateAndTime);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    }).length;

    const cancelledBookings = bookings.filter(
      (b) => b.bookingStatus === "cancelled",
    ).length;

    const completedBookings = bookings.filter(
      (b) => b.bookingStatus === "completed",
    ).length;

    // Calculate today's revenue from completed bookings
    const todayRevenue = bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.services[0]?.dateAndTime);
        bookingDate.setHours(0, 0, 0, 0);
        return (
          bookingDate.getTime() === today.getTime() &&
          booking.bookingStatus === "completed"
        );
      })
      .reduce((sum, booking) => {
        const price = booking.services[0]?.serviceId?.price || 0;
        return sum + price;
      }, 0);

    return {
      todayBookings,
      cancelledBookings,
      completedBookings,
      todayRevenue,
    };
  };

  const stats = calculateStats();

  const handleConfirm = (id: string) => {
    if (window.confirm("Are you sure you want to confirm this booking?")) {
      confirmMutation.mutate({ id, token: token as string });
    }
  };

  const handleCancelClick = (id: string) => {
    setSelectedBookingId(id);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reason: string) => {
    if (selectedBookingId) {
      cancelMutation.mutate({
        id: selectedBookingId,
        token: token as string,
        reason,
      });
    }
  };

  const handleComplete = (id: string) => {
    if (
      window.confirm("Are you sure you want to mark this booking as completed?")
    ) {
      completeMutation.mutate({ id, token: token as string });
    }
  };

  // Format date
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F7F7] p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-red-500 mb-4 text-base">Failed to load bookings</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#00A3A3] text-white rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBookingId(null);
        }}
        onConfirm={handleCancelConfirm}
        isCancelling={cancelMutation.isPending}
      />

      <div className="min-h-screen bg-[#F0F7F7]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
          <span>Dashboard</span> <ChevronRight size={12} />{" "}
          <span className="text-gray-600">Booking Management</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1A2D2D] mb-8">
          Booking Management
        </h1>

        {isLoading ? (
          <>
            <StatsSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Today's Bookings",
                  value: stats.todayBookings.toString(),
                },
                {
                  label: "Cancelled",
                  value: stats.cancelledBookings.toString(),
                  trend: `+${Math.round((stats.cancelledBookings / (totalBookings || 1)) * 100)}% ↑`,
                },
                {
                  label: "Completed",
                  value: stats.completedBookings.toString(),
                },
                {
                  label: "Today's Revenue",
                  value: `$${stats.todayRevenue.toLocaleString()}`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative"
                >
                  <p className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <span className="text-[#00A3A3] text-xs font-bold mb-1">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="font-bold text-gray-800 text-lg">
                  All Bookings
                </h2>
                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wide">
                  Total {totalBookings} bookings found
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
                          <div className="flex flex-col">
                            <span>{booking.userId.email.split("@")[0]}</span>
                            <span className="text-xs text-gray-400">
                              {booking.userId.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex flex-col">
                            <span>
                              {booking.services[0]?.serviceId?.serviceName}
                            </span>
                            <span className="text-xs text-gray-400">
                              ${booking.services[0]?.serviceId?.price}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {booking.services[0]?.selectedProvider?.firstName}{" "}
                          {booking.services[0]?.selectedProvider?.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>
                              {formatDateTime(booking.services[0]?.dateAndTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${getStatusColor(
                              booking.bookingStatus,
                            )}`}
                          >
                            {booking.bookingStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {booking.bookingStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleConfirm(booking._id)}
                                  disabled={confirmMutation.isPending}
                                  className="w-8 h-8 rounded-full bg-[#00A3A3] text-white flex items-center justify-center hover:bg-[#008B8B] transition-colors shadow-sm disabled:opacity-50"
                                  title="Confirm Booking"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleCancelClick(booking._id)}
                                  disabled={cancelMutation.isPending}
                                  className="w-8 h-8 rounded-full bg-[#FF4D4D] text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50"
                                  title="Cancel Booking"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            {booking.bookingStatus === "confirmed" && (
                              <button
                                onClick={() => handleComplete(booking._id)}
                                disabled={completeMutation.isPending}
                                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
                                title="Mark as Completed"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            {booking.bookingStatus === "cancelled" && (
                              <span className="text-xs text-gray-400">
                                Cancelled
                              </span>
                            )}
                            {booking.bookingStatus === "completed" && (
                              <span className="text-xs text-green-600">
                                Completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No bookings found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
