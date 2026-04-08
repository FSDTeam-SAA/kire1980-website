/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Mail, Phone, MapPin, UserCheck, Calendar, Wallet } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

// Fetch staff profile
const fetchStaffProfile = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/${id}`);
  const data = await res.json();
  return data.data;
};

// Fetch staff stats
const fetchStaffStats = async (id: string, token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/dashboard/staff-individual-stats/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await res.json();
  return data.data;
};

export default function StaffDetails() {
  const params = useParams();
  const session = useSession();
  const token = session?.data?.user?.accessToken || "";
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  // Profile query
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["staff-profile", userId],
    queryFn: () => fetchStaffProfile(userId),
  });

  // Stats query
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["staff-stats", userId],
    queryFn: () => fetchStaffStats(userId, token as string),
    enabled: !!token,
  });

  if (profileLoading || statsLoading) return <p className="p-8">Loading...</p>;

  const bookings = profileData?.recentBookings || [];
  const schedule = profileData?.schedule || [];
  const stats = statsData || {};

  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      <h1 className="text-2xl font-bold text-[#1A2D2D] mb-6">Staff Details</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100">
            <Image
              width={100}
              height={100}
              src={profileData?.avatar?.url || "/api/placeholder/80/80"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">
                {profileData?.firstName} {profileData?.lastName}
              </h2>

              {profileData?.isActive && (
                <span className="bg-[#E6F6F4] text-[#00A3A3] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00A3A3]/20">
                  ● ACTIVE
                </span>
              )}
            </div>

            <p className="text-gray-600 font-medium mb-2">
              {profileData?.businessId?.businessName}
            </p>

            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Mail size={14} /> {profileData?.email}
              </span>

              <span className="flex items-center gap-1">
                <Phone size={14} /> {profileData?.phoneNumber}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={14} /> {profileData?.businessId?.businessEmail}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Bookings",
            value: stats?.totalBookings ?? 0,
            icon: <UserCheck size={20} className="text-gray-400" />,
          },
          {
            label: "Completed Services",
            value: stats?.completedServices ?? 0,
            icon: <Calendar size={20} className="text-gray-400" />,
          },
          {
            label: "Revenue Generated",
            value: `$${stats?.revenueGenerated ?? 0}`,
            icon: <Wallet size={20} className="text-gray-400" />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="mb-4">{stat.icon}</div>
            <p className="text-gray-400 text-xs font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Recent Bookings</h3>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {bookings.map((item: any, idx: number) => (
                <tr
                  key={idx}
                  className="text-xs text-gray-600 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{item.customerName}</td>
                  <td className="px-6 py-4">{item.serviceName}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(item.dateAndTime).toLocaleString()}
                  </td>
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

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-6">
            Working Schedule
          </h3>
          <div className="space-y-4">
            {schedule.map((row: any, i: number) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-400">{row.day}</span>
                <span
                  className={`font-bold ${!row.isAvailable ? "text-gray-300" : "text-gray-800"}`}
                >
                  {row.isAvailable ? `${row.from} - ${row.to}` : "Off Day"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
