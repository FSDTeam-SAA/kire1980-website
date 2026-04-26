"use client";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { StaffResponse } from "@/types/staffDataType";
import { useSession } from "next-auth/react";
import StaffStats from "./StaffStats";

export default function StaffManagement() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const session = useSession();
  const tokne = session.data?.user?.accessToken;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<StaffResponse>({
    queryKey: ["staff", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/staff?page=${page}&limit=${limit}`,
      );

      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    },
  });

  /* ---------------- DELETE MUTATION ---------------- */

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${tokne}` },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete staff");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };
  const confirmDelete = () => {
    if (selectedId) {
      deleteStaffMutation.mutate(selectedId);
    }
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const staff = data?.data?.data || [];
  const meta = data?.data?.meta;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading staff</p>;

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
          <button className="bg-[#00A3A3] hover:bg-[#008B8B] text-white px-6 py-2.5 rounded-lg">
            Add Staff
          </button>
        </Link>
      </div>

      <StaffStats />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Staff Member
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Assigned Services
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {staff.map((member) => (
                <tr key={member._id}>
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        alt="Profile"
                        width={50}
                        height={50}
                        src={member.avatar?.url}
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <span className="text-sm font-medium">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.email}
                  </td>

                  {/* Services */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {member.serviceIds?.map((service) => (
                        <span
                          key={service._id}
                          className="px-3 py-1 bg-[#F0F9F9] text-[#4EA5A5] text-xs rounded-full border"
                        >
                          {service.serviceName}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-sm">
                    {member.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-[#4EA5A5]">
                      <Link href={`/business/staff-management/${member._id}`}>
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(member._id)}
                        className="hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="flex justify-between items-center p-4 border-t">
          <p className="text-sm text-gray-500">
            Page {meta?.page} of {meta?.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(meta?.totalPages || 1)].map((_, i) => {
              const pageNumber = i + 1;

              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 border rounded ${
                    page === pageNumber ? "bg-[#00A3A3] text-white" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === meta?.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this staff member? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
