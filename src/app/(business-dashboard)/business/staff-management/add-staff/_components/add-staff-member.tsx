"use client";

import { useState } from "react";
import { ServiceResponse } from "@/types/serviceDataType";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useBusinessId } from "../../../../../../../zustand/useServiceId";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function AddStaffMember() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const { businessId } = useBusinessId();
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [schedule, setSchedule] = useState([
    { day: "monday", from: "09:00", to: "17:00", isAvailable: true },
    { day: "tuesday", from: "09:00", to: "17:00", isAvailable: true },
    { day: "wednesday", from: "09:00", to: "17:00", isAvailable: true },
    { day: "thursday", from: "09:00", to: "17:00", isAvailable: true },
    { day: "friday", from: "09:00", to: "17:00", isAvailable: true },
    { day: "saturday", from: "09:00", to: "17:00", isAvailable: false },
    { day: "sunday", from: "09:00", to: "17:00", isAvailable: false },
  ]);

  const { data: services } = useQuery<ServiceResponse>({
    queryKey: ["services"],
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
  });

  const servicesData = services?.data || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleServiceChange = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const updateSchedule = (
    index: number,
    field: "from" | "to" | "isAvailable",
    value: string | boolean,
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-staff"],
    mutationFn: async () => {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("phoneNumber", formData.phoneNumber);
      form.append("businessId", businessId || "");

      selectedServices.forEach((id) => {
        form.append("serviceIds[]", id);
      });

      form.append("schedule", JSON.stringify(schedule));

      if (image) {
        form.append("avatar", image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      return res.json();
    },

    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        router.push("/business/staff-management");
      }
    },

    onError: () => {
      console.log("first");
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8">
      {/* HEADER */}

      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Add New Staff Member</h1>
        </div>

        <Button
          disabled={isPending}
          onClick={() => mutate()}
          className="bg-[#00A3A3] text-white px-6 py-2 rounded-lg"
        >
          {isPending ? "Saving..." : "Save Member"}
        </Button>
      </div>

      {/* PERSONAL INFO */}

      <section className="bg-white p-8 rounded-xl border">
        <h2 className="font-semibold mb-6">Personal Information</h2>

        {/* IMAGE */}

        <div className="mb-6">
          <label className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden">
              {image ? (
                <Image
                  width={100}
                  height={100}
                  alt="staff"
                  src={URL.createObjectURL(image)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Upload</span>
              )}
            </div>

            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* INPUTS */}

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            type="text"
            className="h-14"
            placeholder="First Name"
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />

          <Input
            className="h-14"
            placeholder="Last Name"
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />

          <Input
            className="h-14"
            placeholder="Email"
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            className="h-14"
            placeholder="Phone"
            type="number"
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>
      </section>

      {/* SERVICES */}

      <section className="bg-white p-8 rounded-xl border mt-6">
        <h2 className="font-semibold mb-6">Assigned Services</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {servicesData.map((service) => (
            <label
              key={service._id}
              className="flex items-center gap-3 border p-4 rounded-lg"
            >
              <Checkbox
                onCheckedChange={() => handleServiceChange(service._id)}
              />

              <span>{service.serviceName}</span>
            </label>
          ))}
        </div>
      </section>

      {/* WEEKLY AVAILABILITY */}

      <section className="bg-white p-8 rounded-xl border mt-6">
        <h2 className="font-semibold mb-6">Weekly Availability</h2>

        <div className="space-y-4">
          {schedule.map((day, i) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="w-24 capitalize font-medium">{day.day}</span>

              <Select
                value={day.isAvailable ? "available" : "off"}
                onValueChange={(value) =>
                  updateSchedule(i, "isAvailable", value === "available")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="off">Off Day</SelectItem>
                </SelectContent>
              </Select>

              {day.isAvailable ? (
                <>
                  <Input
                    type="time"
                    value={day.from}
                    onChange={(e) => updateSchedule(i, "from", e.target.value)}
                    className="w-[140px]"
                  />

                  <span>to</span>

                  <Input
                    type="time"
                    value={day.to}
                    onChange={(e) => updateSchedule(i, "to", e.target.value)}
                    className="w-[140px]"
                  />
                </>
              ) : (
                <span className="text-gray-400">Not Available</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
