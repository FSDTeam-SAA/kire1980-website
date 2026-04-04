"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Service } from "@/types/serviceDataType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: Service;
}

export default function EditServiceModal({ open, setOpen, service }: Props) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    duration: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (open && service) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        serviceName: service.serviceName,
        category: service.category,
        duration: service.serviceDuration,
        price: String(service.price),
        description: service.description,
      });
    }
  }, [service, open]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services/${service._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceName: formData.serviceName,
            category: formData.category,
            serviceDuration: formData.duration,
            price: Number(formData.price),
            description: formData.description,
          }),
        },
      );

      return res.json();
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["business-services"],
      });

      toast.success(data?.message || "Service updated!");
      setOpen(false);
    },

    onError: () => {
      toast.error("Update failed");
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={formData.serviceName}
            onChange={(e) => handleChange("serviceName", e.target.value)}
            placeholder="Service Name"
          />

          <Select onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="w-full !h-12 mt-2">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="Duration"
          />

          <Input
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Price"
          />

          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
          />

          <Button
            className="w-full bg-[#169C9F]"
            onClick={() => updateMutation.mutate()}
          >
            Update Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
