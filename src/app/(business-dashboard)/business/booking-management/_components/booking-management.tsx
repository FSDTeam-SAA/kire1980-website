"use client";
import { ChevronRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useBusinessId } from "../../../../../../zustand/useServiceId";

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
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Booking[];
    meta: {
      total: number;
    };
  };
}

interface StatsResponse {
  statusCode: number;
  message: string;
  data: {
    todayBookings: number;
    cancelled: number;
    completed: number;
    todaysRevenue: number;
  };
}

const fetchBookings = async (
  token: string,
  businessId: string,
): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/business/${businessId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

const fetchStats = async (token: string): Promise<StatsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/dashboard/booking-management-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};

export default function BookingManagement() {
  const { businessId } = useBusinessId();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(token as string, businessId as string),
    enabled: !!token && !!businessId,
  });

  const { data: statsData } = useQuery({
    queryKey: ["booking-stats"],
    queryFn: () => fetchStats(token as string),
    enabled: !!token,
  });

  const bookings = data?.data?.data || [];
  const totalBookings = data?.data?.meta?.total || 0;

  const stats = statsData?.data || {
    todayBookings: 0,
    cancelled: 0,
    completed: 0,
    todaysRevenue: 0,
  };

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
    <div className="min-h-screen bg-[#F0F7F7]">
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
                value: stats.cancelled.toString(),
              },
              {
                label: "Completed",
                value: stats.completed.toString(),
              },
              {
                label: "Today's Revenue",
                value: `$${stats.todaysRevenue.toLocaleString()}`,
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
                </div>
              </div>
            ))}
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-bold text-gray-800 text-lg">All Bookings</h2>
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4">
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
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${getStatusColor(
                            booking.bookingStatus,
                          )}`}
                        >
                          {booking.bookingStatus.toUpperCase()}
                        </span>
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
  );
}

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
      >
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <Skeleton className="h-6 w-48 mb-4" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-6 w-full mb-2" />
    ))}
  </div>
);
