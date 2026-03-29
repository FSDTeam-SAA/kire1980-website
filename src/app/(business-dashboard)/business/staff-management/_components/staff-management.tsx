import React from "react";
import { Eye, Trash2, Plus } from "lucide-react";
import Link from "next/link";

const staffData = [
  {
    name: "Sarah Jenkins",
    role: "Senior Stylist",
    services: ["Haircut", "Styling"],
    extra: 2,
    booked: 8,
  },
  {
    name: "Sarah Jenkins",
    role: "Senior Stylist",
    services: ["Haircut", "Styling"],
    extra: 2,
    booked: 8,
  },
  {
    name: "Michael Brown",
    role: "Junior Stylist",
    services: ["Coloring", "Treatment"],
    extra: 1,
    booked: 5,
  },
  {
    name: "Emily Clark",
    role: "Senior Stylist",
    services: ["Haircut", "Coloring"],
    extra: 3,
    booked: 10,
  },
  {
    name: "James Wilson",
    role: "Junior Stylist",
    services: ["Shampooing", "Styling"],
    extra: 1,
    booked: 4,
  },
  {
    name: "Olivia Martinez",
    role: "Senior Stylist",
    services: ["Coloring", "Treatment"],
    extra: 2,
    booked: 7,
  },
  {
    name: "David Taylor",
    role: "Junior Stylist",
    services: ["Haircut", "Shampooing"],
    extra: 1,
    booked: 3,
  },
  {
    name: "Sophia Anderson",
    role: "Senior Stylist",
    services: ["Styling", "Haircut"],
    extra: 2,
    booked: 9,
  },
  {
    name: "Daniel Thomas",
    role: "Junior Stylist",
    services: ["Treatment", "Coloring"],
    extra: 1,
    booked: 6,
  },
  {
    name: "Isabella Moore",
    role: "Senior Stylist",
    services: ["Styling", "Shampooing"],
    extra: 3,
    booked: 12,
  },
  {
    name: "Lucas Jackson",
    role: "Junior Stylist",
    services: ["Haircut", "Styling"],
    extra: 1,
    booked: 2,
  },
];

export default function StaffManagement() {
  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A2D2D]">
            Staff Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your team and their schedules.
          </p>
        </div>
        <Link href={`/business/staff-management/add-staff`}>
          <button className="bg-[#00A3A3] hover:bg-[#008B8B] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium">
            Add Staff
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Staff", value: "24" },
          { label: "Currently On Duty", value: "22" },
          { label: "Total Booked Today", value: "22" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <p className="text-gray-500 text-sm mb-4">{stat.label}</p>
            <p className="text-3xl font-bold text-[#333]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Role / Position
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Assigned Services
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Today&apos;s Booked
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staffData.map((staff, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D1EAEA] flex items-center justify-center overflow-hidden">
                        {/* Placeholder for Avatar */}
                        <div className="bg-[#4EA5A5] w-full h-full opacity-80" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {staff.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      {staff.services.map((service, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 bg-[#F0F9F9] text-[#4EA5A5] text-xs rounded-full border border-[#D1EAEA]"
                        >
                          {service}
                        </span>
                      ))}
                      <span className="text-xs text-[#4EA5A5] font-medium">
                        +{staff.extra}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {staff.booked}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-[#4EA5A5]">
                      <Link href={`/business/staff-management/adfaf`}>
                        <button className="hover:text-[#008B8B] transition-colors">
                          <Eye size={18} />
                        </button>
                      </Link>
                      <button className="hover:text-red-500 transition-colors">
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
