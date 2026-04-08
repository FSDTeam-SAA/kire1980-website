"use client";

import { MoreVertical, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Service, ServiceResponse } from "@/types/serviceDataType";
import { toast } from "sonner";
import { useBusinessId } from "../../../../../../zustand/useServiceId";
import { useState } from "react";
import EditServiceModal from "./EditServiceModal";
import StatsCards from "./StatsCards";

const stats = [
  { label: "Total Services", value: "24" },
  { label: "Active", value: "22" },
  { label: "Top Category", value: "Wellness" },
  { label: "Avg. Booking", value: "$72" },
];

export default function ServiceManagement() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const queryClient = useQueryClient();
  const { businessId } = useBusinessId();
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data, isLoading, error } = useQuery<ServiceResponse>({
    queryKey: ["business-services", businessId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services/business/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch services");

      return res.json();
    },
    enabled: !!token && !!businessId,
  });

  const services = data?.data || [];

  const { mutate } = useMutation({
    mutationKey: ["delete-service"],
    mutationFn: async (serviceId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong.");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["business-services"],
      });
      toast.success(data?.message || "Service deleted successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setOpenEdit(true);
  };

  const { mutate: changeStatus } = useMutation({
    mutationKey: ["change-status"],
    mutationFn: async (serviceId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services/${serviceId}/toggle-active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["business-services"],
      });

      toast.success(data?.message || "Service status updated!");
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleDelete = (serviceId: string) => {
    mutate(serviceId);
  };

  const handleStatusChange = (serviceId: string) => {
    changeStatus(serviceId);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Service Management
          </h1>

          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-1">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-600">Service Management</span>
          </nav>
        </div>

        <Link href="/business/service-management/add">
          <button className="bg-[#169C9F] hover:bg-[#138689] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
            Add New Service
          </button>
        </Link>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Services Table */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-50">
              <TableHead className="py-5 px-6 font-bold text-slate-800">
                Service Name
              </TableHead>

              <TableHead className="font-bold text-slate-800">
                Category
              </TableHead>

              <TableHead className="font-bold text-slate-800">
                Duration
              </TableHead>

              <TableHead className="font-bold text-slate-800">Price</TableHead>

              <TableHead className="font-bold text-slate-800 text-right">
                Status
              </TableHead>

              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading services...
                </TableCell>
              </TableRow>
            )}

            {/* Error */}
            {error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-red-500"
                >
                  Failed to load services
                </TableCell>
              </TableRow>
            )}

            {/* Empty */}
            {!isLoading && services.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No services found
                </TableCell>
              </TableRow>
            )}

            {/* Data */}
            {services.map((service) => (
              <TableRow
                key={service._id}
                className="border-slate-50 hover:bg-slate-50/50"
              >
                <TableCell className="py-5 px-6">
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm leading-tight">
                      {service.serviceName}
                    </p>

                    <p className="text-[10px] font-bold text-[#94A3B8] mt-0.5 uppercase tracking-wider">
                      ID: {service._id}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className="bg-[#E8F7F7] text-[#169C9F] border-none px-3 py-1 rounded-full text-[10px] font-bold">
                    {service.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm font-medium text-slate-500">
                  {service.serviceDuration}
                </TableCell>

                <TableCell className="text-sm font-bold text-slate-700">
                  ${service.price}
                </TableCell>

                <TableCell className="text-right">
                  <Switch
                    checked={service.isActive}
                    className="data-[state=checked]:bg-[#169C9F] scale-90"
                    onCheckedChange={() => handleStatusChange(service._id)}
                  />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical size={18} className="text-slate-400" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-slate-100"
                    >
                      <DropdownMenuItem
                        onClick={() => handleEdit(service)}
                        className="text-xs font-bold py-2"
                      >
                        Edit Service
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleDelete(service._id)}
                        className="text-xs font-bold py-2 text-red-500"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <EditServiceModal
          open={openEdit}
          setOpen={setOpenEdit}
          service={selectedService as Service}
        />
      </div>
    </div>
  );
}
