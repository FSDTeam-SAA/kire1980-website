/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password should be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormType = z.infer<typeof formSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (payload: FormType) => {
      const requestBody = email ? { ...payload, email } : payload;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful!");
      router.push(`/login`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  async function onSubmit(payload: FormType) {
    try {
      await mutateAsync(payload);
    } catch (error) {
      console.log(`error : ${error}`);
    }
  }

  return (
    <div className="w-full max-w-[500px] mx-auto p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-medium text-[#1A2E35] mb-4">
          New Password
        </h1>
        <p className="text-gray-500">Please create your new password</p>
      </div>

      {/* Card Section */}
      <div className="w-full bg-white border border-[#F0F5F5] rounded-3xl p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1A2E35] font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-[52px] bg-[#F4F9F9] border-none rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[#009688]"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1A2E35] font-semibold">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="h-[52px] bg-[#F4F9F9] border-none rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[#009688]"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="h-[52px] w-full bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-lg font-semibold transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Changing...
                </div>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-4">
        <p className="text-gray-500 text-[15px]">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#009688] font-bold inline-flex items-center hover:underline"
          >
            Sign Up <ArrowRight size={16} className="ml-1" />
          </Link>
        </p>

        <p className="text-sm text-gray-500">
          Are you a wellness professional?{" "}
          <Link
            href="/create-customer"
            className="text-[#1A2E35] font-bold hover:underline"
          >
            Create a customer account
          </Link>
        </p>
      </div>

      {/* Security Badges */}
      <div className="mt-10 pt-6 border-t border-gray-100 w-full flex flex-col items-center gap-4">
        <div className="flex gap-6 text-gray-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Lock size={18} /> Secure & encrypted
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} /> Privacy protected
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <BadgeCheck size={20} />
          50,000+ users trust Bookersi
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
