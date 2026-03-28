"use client";

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

const data = [
  { name: "Feb", total: 400 },
  { name: "Mar", total: 450 },
  { name: "Apr", total: 420 },
  { name: "May", total: 500 },
  { name: "Jun", total: 800 },
  { name: "Jul", total: 550 },
  { name: "Aug", total: 580 },
  { name: "Sep", total: 520 },
  { name: "Oct", total: 700 },
  { name: "Nov", total: 680 },
  { name: "Dec", total: 720 },
  { name: "Jan", total: 900 },
];

export function BookingChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm ">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Today Bookings</h2>
          <p className="text-xs text-slate-400 font-medium">
            Track total revenue, platform commission, and payouts over time.
          </p>
        </div>
        <Select defaultValue="yearly">
          <SelectTrigger className="w-24 h-8 text-xs bg-slate-50 border-none rounded-lg font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#169C9F" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#169C9F" stopOpacity={0} />
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
                  return (
                    <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-xl text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        June 2025
                      </p>
                      <p className="text-sm font-black text-[#169C9F]">
                        12,000
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
              stroke="#159A9C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="#F0F9F8BF"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
