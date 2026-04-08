"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

type Dataset = {
  label: string;
  data: number[];
};

type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

export function BookingChart() {
  const session = useSession();
  const token = session.data?.user?.accessToken;
  const [viewType, setViewType] = useState<"yearly" | "monthly" | "weekly">(
    "yearly",
  );

  const { data, isLoading, error } = useQuery<ChartData>({
    queryKey: ["revenue-chart", viewType],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/dashboard/revenue-chart?viewType=${viewType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch chart data");
      const json = await res.json();
      return json.data;
    },
  });

  const chartData =
    data?.labels.map((label, idx) => ({
      name: label,
      total: data.datasets[0].data[idx] || 0,
      commission: data.datasets[1].data[idx] || 0,
      payouts: data.datasets[2].data[idx] || 0,
    })) || [];

  return (
    <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bookings</h2>

          <p className="text-xs text-slate-400 font-medium">
            Track total revenue, platform commission, and payouts over time.
          </p>
        </div>
        <Select
          defaultValue={viewType}
          onValueChange={(val) =>
            setViewType(val as "yearly" | "monthly" | "weekly")
          }
        >
          <SelectTrigger className="w-28 h-8 text-xs bg-slate-50 border-none rounded-lg font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <p className="text-center text-slate-400 mt-20">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-20">Failed to load chart</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#169C9F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#169C9F" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorCommission"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#F1F5F9"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-xl text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {p.name}
                        </p>
                        <p className="text-sm font-black text-[#169C9F]">
                          Total: {p.total}
                        </p>
                        <p className="text-sm font-black text-[#F59E0B]">
                          Commission: {p.commission}
                        </p>
                        <p className="text-sm font-black text-[#EF4444]">
                          Payouts: {p.payouts}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#169C9F"
                strokeWidth={2}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="commission"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#colorCommission)"
              />
              <Area
                type="monotone"
                dataKey="payouts"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#colorPayouts)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
