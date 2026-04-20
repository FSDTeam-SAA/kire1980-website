"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useBusinessId } from "../../../../../../../zustand/useServiceId";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddServiceForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const router = useRouter();
  const { businessId } = useBusinessId();

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    duration: "30 mins",
    price: "",
    description: "",
    features: [] as string[],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addServiceMutation = useMutation({
    mutationFn: async (values: {
      serviceName: string;
      category: string;
      serviceDuration: string;
      price: number;
      description: string;
      businessId: string;
      isFeatured: boolean;
    }) => {
      console.log(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-services"],
      });
      router.push("/business/service-management");
    },

    onError: (err) => {
      console.log("Add service error", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceMutation.mutate({
      serviceName: formData.serviceName,
      category: formData.category,
      serviceDuration: formData.duration,
      price: parseFloat(formData.price),
      description: formData.description,
      isFeatured: true,
      businessId: businessId || "",
    });
  };

  return (
    <div className=" min-h-screen">
      <div className="mx-auto bg-white rounded-[24px] border border-slate-100 shadow-sm p-10">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-[#0D3B3F]">Add New Service</h1>
          <p className="text-sm text-slate-400 font-medium">
            Set up your service details, duration, and pricing.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Name */}

          <div>
            <label className="text-sm font-bold text-slate-700">
              Service Name
            </label>
            <Input
              className="h-12 mt-2"
              placeholder="Signature Facial Treatment"
              value={formData.serviceName}
              onChange={(e) => handleChange("serviceName", e.target.value)}
            />
          </div>

          {/* Category + Duration */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Category
              </label>

              <Select
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger className="w-full !h-12 mt-2">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Service Duration
              </label>
              <Input
                className="h-12 mt-2"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>
          </div>

          {/* Price */}

          <div>
            <label className="text-sm font-bold text-slate-700">
              Starting Price
            </label>
            <Input
              className="h-12 mt-2"
              placeholder="$0.00"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          {/* Description */}

          <div>
            <label className="text-sm font-bold text-slate-700">
              Description
            </label>
            <Textarea
              className="mt-2 min-h-[120px]"
              placeholder="Describe the service..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Submit */}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#169C9F] text-white px-10 py-6 rounded-xl"
            >
              Save Service{" "}
              {addServiceMutation.isPending && (
                <Loader2 className="animate-spin mr-2" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
