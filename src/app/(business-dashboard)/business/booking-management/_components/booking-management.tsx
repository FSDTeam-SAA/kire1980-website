import React from "react";
import { Check, X, ChevronRight } from "lucide-react";

const appointmentData = [
  {
    client: "Jenny Wilson",
    service: "Deep Tissue Massage",
    staff: "David Chen",
    date: "15 May 2020 8:00 am",
    status: "Confirm",
  },
  {
    client: "Michael Smith",
    service: "Swedish Massage",
    staff: "Emily Johnson",
    date: "16 May 2020 9:30 am",
    status: "Confirm",
  },
  {
    client: "Emma Brown",
    service: "Hot Stone Massage",
    staff: "Michael Lee",
    date: "17 May 2020 10:00 am",
    status: "Confirm",
  },
  {
    client: "Olivia Davis",
    service: "Aromatherapy Massage",
    staff: "Sophia Williams",
    date: "18 May 2020 11:30 am",
    status: "Confirm",
  },
  {
    client: "Liam Taylor",
    service: "Sports Massage",
    staff: "James Martinez",
    date: "19 May 2020 1:00 pm",
    status: "Confirm",
  },
  {
    client: "Emma Johnson",
    service: "Yoga Therapy",
    staff: "Sarah Clarke",
    date: "20 May 2020 2:00 pm",
    status: "Confirm",
  },
  {
    client: "Noah Smith",
    service: "Personal Training",
    staff: "Michael Brown",
    date: "21 May 2020 3:00 pm",
    status: "Confirm",
  },
  {
    client: "Olivia Davis",
    service: "Nutrition Consultation",
    staff: "Jessica Wilson",
    date: "22 May 2020 10:00 am",
    status: "Confirm",
  },
  {
    client: "Ethan Garcia",
    service: "Rehabilitation",
    staff: "Daniel Lee",
    date: "23 May 2020 11:00 am",
    status: "Confirm",
  },
  {
    client: "Ava Martinez",
    service: "Pilates Class",
    staff: "Angela Taylor",
    date: "24 May 2020 12:00 pm",
    status: "Confirm",
  },
  {
    client: "Mason Rodriguez",
    service: "Strength Training",
    staff: "Brian Anderson",
    date: "25 May 2020 4:00 pm",
    status: "Confirm",
  },
  {
    client: "Sophia Wilson",
    service: "Mindfulness Coaching",
    staff: "Ashley Thomas",
    date: "26 May 2020 5:00 pm",
    status: "Confirm",
  },
  {
    client: "Lucas White",
    service: "Cardio Fitness",
    staff: "Thomas Jackson",
    date: "27 May 2020 6:00 pm",
    status: "Confirm",
  },
];

export default function BookingManagement() {
  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-wider">
        <span>Dashboard</span> <ChevronRight size={10} />{" "}
        <span className="text-gray-600">Service Management</span>
      </div>
      <h1 className="text-2xl font-bold text-[#1A2D2D] mb-8">
        Booking Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today Booking", value: "24" },
          { label: "Cancelled", value: "125", trend: "+ 36% ↑" },
          { label: "Completed", value: "22" },
          { label: "Today's Revenue", value: "$72" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative"
          >
            <p className="text-gray-400 text-[11px] font-bold mb-4">
              {stat.label}
            </p>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              {stat.trend && (
                <span className="text-[#00A3A3] text-[10px] font-bold mb-1">
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800 text-base">
            Upcoming Appointments
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold">
            Next 48 hours activity
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-50 uppercase tracking-tight">
                <th className="px-6 py-5">Client Name</th>
                <th className="px-6 py-5">Service Type</th>
                <th className="px-6 py-5">Staff Name</th>
                <th className="px-6 py-5">Time & Date</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointmentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {row.client}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.service}</td>
                  <td className="px-6 py-4 text-gray-500">{row.staff}</td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#E6F6F4] text-[#00A3A3] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#00A3A3]/20">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button className="w-7 h-7 rounded-full bg-[#00A3A3] text-white flex items-center justify-center hover:bg-[#008B8B] transition-colors shadow-sm">
                        <Check size={14} />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-[#FF4D4D] text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm">
                        <X size={14} />
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
