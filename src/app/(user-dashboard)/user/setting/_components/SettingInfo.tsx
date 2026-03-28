"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const session = useSession();
  const token = session?.data?.user?.accessToken || "";

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const requirements = [
    { label: "At least 8 characters", met: passwords.new.length >= 8 },
    { label: "One number", met: /\d/.test(passwords.new) },
    { label: "One uppercase letter", met: /[A-Z]/.test(passwords.new) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(passwords.new) },
  ];

  const strengthScore = requirements.filter((r) => r.met).length;

  const { mutate } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong.");
        return;
      }
      toast.success(data?.message || "Password changed successfully!");
      router.push("/login");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password Change Data:", passwords);
    if (passwords.new !== passwords.confirm) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    mutate({
      oldPassword: passwords.current,
      newPassword: passwords.new,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Change Password Card */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-serif">Change Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Keep your account secure with a strong password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  className="bg-[#f8fcfc] h-12 pr-10 border-none"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className="bg-[#f8fcfc] h-12 pr-10 border-none"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="bg-[#f8fcfc] h-12 pr-10 border-none"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            <div className="space-y-2">
              <div className="flex gap-2 h-1.5 w-full max-w-sm">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strengthScore >= step ? "bg-[#26a69a]" : "bg-slate-100"
                    }`}
                  />
                ))}
                <span className="text-xs text-[#26a69a] ml-2 font-medium">
                  Fair
                </span>
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-[#f8fcfc] p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              <p className="col-span-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Password requirements:
              </p>
              {requirements.map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${req.met ? "text-[#26a69a]" : "text-slate-400"}`}
                >
                  <Check
                    size={14}
                    className={req.met ? "opacity-100" : "opacity-40"}
                  />
                  {req.label}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-[#26a69a] hover:bg-[#1f8c82] text-white px-8 h-11 rounded-md"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
