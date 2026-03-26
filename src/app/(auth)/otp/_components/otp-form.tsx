/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Loader2,
  Lock,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
});

type FormType = z.infer<typeof formSchema>;

const OtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (payload: FormType) => {
      const requestBody = email ? { ...payload, email } : payload;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-reset-otp`,
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
      toast.success(data?.message || "OTP Verified!");
      const targetUrl = email
        ? `/reset-password?email=${encodeURIComponent(email)}`
        : "/reset-password";
      router.push(targetUrl);
    },
    onError: (error: any) => {
      toast.error(error?.message);
      form.setValue("otp", "");
    },
  });

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found.");
      return;
    }
    try {
      setIsResending(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) throw new Error("Failed to resend OTP");
      toast.success("OTP resent successfully!");
      form.setValue("otp", "");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-medium text-[#1A2E35] mb-4">
          Enter OTP
        </h1>
        <p className="text-gray-500 max-w-[380px] mx-auto leading-relaxed">
          An OTP has been sent to your email address please verify it below
        </p>
      </div>

      {/* OTP Card */}
      <div className="w-full bg-white border border-[#F0F5F5] rounded-3xl p-8 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((val) => mutateAsync(val))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2 sm:gap-3">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-[60px] w-[45px] sm:h-[70px] sm:w-[52px] bg-[#F4F9F9] border-none rounded-lg text-xl font-medium text-[#1A2E35]"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                Didn&apos;t Receive OTP?
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-[#1A2E35] font-bold hover:underline disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </p>
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="h-[52px] w-full bg-primary hover:bg-primary text-white rounded-xl text-lg font-semibold transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify OTP"
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
            className="text-primary font-bold inline-flex items-center hover:underline"
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

export default OtpForm;
