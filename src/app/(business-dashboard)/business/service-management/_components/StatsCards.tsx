"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Single stat card
type StatItem = {
  label: string;
  value: string | number;
};

// API response type
type ServiceStatsResponse = {
  statusCode: number;
  message: string;
  data: ServiceStats;
};

type ServiceStats = {
  totalServices: number;
  active: number;
  topCategory: string;
  avgBooking: number;
};

export default function StatsCards() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const { data: statsData, isLoading } = useQuery<ServiceStats>({
    queryKey: ["service-stats"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/dashboard/service-management-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch stats");

      const json: ServiceStatsResponse = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  // Prepare stats for rendering
  const stats: StatItem[] = statsData
    ? [
        { label: "Total Services", value: statsData.totalServices },
        { label: "Active", value: statsData.active },
        { label: "Top Category", value: statsData.topCategory },
        { label: "Avg. Booking", value: statsData.avgBooking },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm"
            >
              <p className="text-xs font-medium text-slate-400 mb-2">
                Loading...
              </p>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">
                --
              </p>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-400 mb-2">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
