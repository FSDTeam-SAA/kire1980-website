"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const featureOptions = [
  { id: "waiting-area", label: "Comfortable Waiting Area" },
  { id: "free-wifi", label: "Free Wi-Fi" },
  { id: "locker", label: "Locker / Storage" },
  { id: "parking", label: "Parking Available" },
  { id: "drinks", label: "Refreshments / Drinks" },
  { id: "wheelchair", label: "Wheelchair Accessible" },
];

export default function AddServiceForm() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    duration: "60 min",
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

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(featureId);

      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== featureId)
          : [...prev.features, featureId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted Data:", formData);
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
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="therapeutic">Therapeutic</SelectItem>
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

          {/* Features */}

          <div>
            <h3 className="text-sm font-bold text-slate-700">Features</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {featureOptions.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center space-x-3 p-4 border rounded-xl"
                >
                  <Checkbox
                    checked={formData.features.includes(feature.id)}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#169C9F] text-white px-10 py-6 rounded-xl"
            >
              Save Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
