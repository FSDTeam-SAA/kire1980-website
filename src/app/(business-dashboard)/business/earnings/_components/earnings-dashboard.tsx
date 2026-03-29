"use client";
import {
  Eye,
  Trash2,
  CreditCard,
  Banknote,
  ChevronRight,
  Calendar,
  Wallet,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Sample data for the Line Chart
const chartData = [
  { name: "Feb", revenue: 4000 },
  { name: "Mar", revenue: 5200 },
  { name: "Apr", revenue: 4800 },
  { name: "May", revenue: 7000 },
  { name: "Jun", revenue: 6500 },
  { name: "Jul", revenue: 8200 },
  { name: "Aug", revenue: 7800 },
  { name: "Sep", revenue: 8500 },
  { name: "Oct", revenue: 12000 },
  { name: "Nov", revenue: 10500 },
  { name: "Dec", revenue: 11000 },
  { name: "Jan", revenue: 14000 },
];

const tableData = [
  {
    id: "#TR1023",
    client: "Sarah Wilson",
    service: "Deep Tissue Massage",
    staff: "David Chen",
    method: "Card",
    amount: "$85.00",
    date: "15 May 2026",
  },
  {
    id: "#TR1024",
    client: "Michael Smith",
    service: "Swedish Massage",
    staff: "Emily Johnson",
    method: "Cash",
    amount: "$70.00",
    date: "16 May 2026",
  },
  {
    id: "#TR1025",
    client: "Jessica Lee",
    service: "Hot Stone Massage",
    staff: "Chris Martin",
    method: "Card",
    amount: "$95.00",
    date: "17 May 2026",
  },
  {
    id: "#TR1026",
    client: "Daniel Brown",
    service: "Aromatherapy",
    staff: "Lisa White",
    method: "Cash",
    amount: "$80.00",
    date: "18 May 2026",
  },
  {
    id: "#TR1027",
    client: "Emily Davis",
    service: "Sports Massage",
    staff: "John Doe",
    method: "Card",
    amount: "$100.00",
    date: "19 May 2026",
  },
];

export default function EarningsDashboard() {
  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 uppercase font-bold">
        <span>Dashboard</span> <ChevronRight size={10} />{" "}
        <span className="text-gray-600">Earnings</span>
      </div>
      <h1 className="text-2xl font-bold text-[#1A2D2D] mb-8">Earnings</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Today's Revenue",
            value: "$720",
            trend: "+12%",
            icon: <Calendar size={18} />,
          },
          {
            label: "This Week Revenue",
            value: "$4,250",
            trend: "Static",
            icon: <Calendar size={18} />,
          },
          {
            label: "This Month Revenue",
            value: "$18,640",
            trend: "+12%",
            icon: <Calendar size={18} />,
          },
          {
            label: "Total Earnings",
            value: "$96,320",
            trend: "+12%",
            icon: <Wallet size={18} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                {stat.icon}
              </div>
              <span
                className={`text-[10px] font-bold ${stat.trend === "Static" ? "text-gray-300 bg-gray-50" : "text-[#00A3A3] bg-[#E6F6F4]"} px-2 py-0.5 rounded-full`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-bold text-gray-800 text-base">Total Earnings</h2>
          <select className="bg-white border border-gray-100 rounded text-xs px-2 py-1 text-gray-500 outline-none">
            <option>Yearly</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mb-8">
          Track total revenue, platform commission, and payouts over time.
        </p>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A3A3" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#00A3A3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                dy={10}
              />
              <YAxis hide={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 shadow-lg rounded border border-gray-50 text-center">
                        <p className="text-[10px] text-gray-400">June 2025</p>
                        <p className="text-sm font-bold text-[#00A3A3] tracking-tighter">
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
                dataKey="revenue"
                stroke="#00A3A3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">
            Recent Customer Reviews
          </h2>
          <button className="bg-[#00A3A3] text-white px-6 py-2 rounded-lg text-sm font-medium">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-50 uppercase">
                <th className="px-6 py-5">Transaction ID</th>
                <th className="px-6 py-5">Client Name</th>
                <th className="px-6 py-5">Service</th>
                <th className="px-6 py-5">Staff</th>
                <th className="px-6 py-5">Paymen Method</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-400">{row.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {row.client}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.service}</td>
                  <td className="px-6 py-4 text-gray-500">{row.staff}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-500">
                    {row.method === "Card" ? (
                      <CreditCard size={14} />
                    ) : (
                      <Banknote size={14} />
                    )}
                    {row.method}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#E6F6F4] text-[#00A3A3] text-[9px] font-black px-2 py-0.5 rounded border border-[#00A3A3]/20">
                      PAID
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-[#4EA5A5]">
                      <button className="hover:text-[#008B8B]">
                        <Eye size={18} />
                      </button>
                      <button className="hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
