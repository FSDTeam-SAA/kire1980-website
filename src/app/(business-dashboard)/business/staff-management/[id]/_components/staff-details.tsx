import React from "react";
import { Mail, Phone, MapPin, UserCheck, Calendar, Wallet } from "lucide-react";

const bookings = [
  {
    customer: "Deep Tissue Massage",
    service: "Massage",
    date: "Dec 4, 2019 21:42",
    status: "CONFIRMED",
  },
  {
    customer: "Swedish Massage",
    service: "Massage",
    date: "Dec 30, 2019 05:18",
    status: "CANCELED",
  },
  {
    customer: "Hot Stone Therapy",
    service: "Massage",
    date: "Mar 20, 2019 23:14",
    status: "CONFIRMED",
  },
  {
    customer: "Aromatherapy Massage",
    service: "Massage",
    date: "Feb 2, 2019 19:28",
    status: "CANCELED",
  },
  {
    customer: "Sports Massage",
    service: "Massage",
    date: "Dec 30, 2019 07:52",
    status: "CONFIRMED",
  },
  {
    customer: "Prenatal Massage",
    service: "Massage",
    date: "Dec 7, 2019 23:26",
    status: "CONFIRMED",
  },
];

const schedule = [
  { day: "Monday", time: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", time: "9:00 AM - 5:00 PM" },
  { day: "Thursday", time: "11:00 AM - 8:00 PM" },
  { day: "Friday", time: "9:00 AM - 5:00 PM" },
  { day: "Saturday", time: "Off Day", isOff: true },
  { day: "Sunday", time: "Off Day", isOff: true },
];

export default function StaffDetails() {
  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      <h1 className="text-2xl font-bold text-[#1A2D2D] mb-6">Staff Details</h1>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100">
            <img
              src="/api/placeholder/80/80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">Alex Johnson</h2>
              <span className="bg-[#E6F6F4] text-[#00A3A3] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00A3A3]/20">
                ● ACTIVE
              </span>
            </div>
            <p className="text-gray-600 font-medium mb-2">Senior Stylist</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Mail size={14} /> alex.johnson@example.com
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> +1 (555) 123-4567
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> New York, USA
              </span>
            </div>
          </div>
        </div>
        <button className="bg-[#00A3A3] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#008B8B] transition-colors">
          Remove Staff
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Bookings",
            value: "128",
            icon: <UserCheck size={20} className="text-gray-400" />,
          },
          {
            label: "Completed Services",
            value: "220",
            icon: <Calendar size={20} className="text-gray-400" />,
          },
          {
            label: "Revenue Generated",
            value: "$2015",
            icon: <Wallet size={20} className="text-gray-400" />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden"
          >
            <div className="mb-4">{stat.icon}</div>
            <p className="text-gray-400 text-xs font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bookings Table */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Recent Bookings</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr className="text-xs font-semibold text-gray-500">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-xs text-gray-600 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{item.customer}</td>
                  <td className="px-6 py-4">{item.service}</td>
                  <td className="px-6 py-4 text-gray-400">{item.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        item.status === "CONFIRMED"
                          ? "bg-[#E6F6F4] text-[#00A3A3] border-[#00A3A3]/20"
                          : "bg-red-50 text-red-500 border-red-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Working Schedule Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-6">
            Working Schedule
          </h3>
          <div className="space-y-4">
            {schedule.map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-400">{row.day}</span>
                <span
                  className={`font-bold ${row.isOff ? "text-gray-300" : "text-gray-800"}`}
                >
                  {row.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
