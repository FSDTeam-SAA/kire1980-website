"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, Wallet, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useBusinessId } from "../../../../../../zustand/useServiceId";

export function DashboardStats() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const { setBusinessId } = useBusinessId();

  // USER PROFILE
  useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setBusinessId(data?.data?.businessId?._id || null);
      return data;
    },
    enabled: !!token && !!session?.user?.id,
  });

  // BUSINESS STATISTICS
  const { data: business } = useQuery({
    queryKey: ["bussiness-statistic"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/me/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch business");

      return res.json();
    },
    enabled: !!token,
  });

  console.log();

  const stats = [
    {
      label: "New Customers",
      value: business?.data?.newCustomer ?? 0,
      trend: "+12%",
      icon: Users,
      isStatic: false,
    },
    {
      label: "Today Bookings",
      value: business?.data?.todaysBookings ?? 0,
      trend: "+12%",
      icon: Calendar,
      isStatic: false,
    },
    {
      label: "Monthly Revenue",
      value: `$${business?.data?.monthlyRevenue ?? 0}`,
      trend: "+12%",
      icon: Wallet,
      isStatic: false,
    },
    {
      label: "Avg. Rating",
      value: `${business?.data?.averageRating ?? 0}`,
      trend: "Static",
      icon: Star,
      isStatic: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white border-[1px] border-slate-100 rounded-[20px] p-6 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 rounded-xl">
              <stat.icon className="w-5 h-5 text-slate-500" />
            </div>

            <span
              className={`text-sm font-bold ${
                stat.isStatic
                  ? "bg-slate-100 text-slate-400 px-2 py-1 rounded-md text-[10px]"
                  : "text-[#22C55E]"
              }`}
            >
              {stat.trend}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-slate-400 text-xs font-medium mb-1">
              {stat.label}
            </p>

            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
