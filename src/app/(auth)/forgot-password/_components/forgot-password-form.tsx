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
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Loader2, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormType = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (payload: FormType) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "OTP sent successfully!");
      const encodedEmail = encodeURIComponent(variables.email);
      router.push(`/otp?email=${encodedEmail}`);
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
          Forgot your password?
        </h1>
        <p className="text-gray-500 max-w-[350px] mx-auto leading-relaxed">
          No worries — it happens. Enter your email address and we&apos;ll send
          you a link to reset your password.
        </p>
      </div>

      {/* Card Section */}
      <div className="w-full bg-white border border-[#F0F5F5] rounded-3xl p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1A2E35] font-semibold">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-[52px] bg-[#F4F9F9] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-400 mt-1">
                    We&apos;ll send the reset link to this address.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="h-[52px] w-full bg-primary hover:bg-primary text-white rounded-xl text-lg font-semibold transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Verification Code"
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
            <Lock size={18} className="text-gray-400" /> Secure & encrypted
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-gray-400" /> Privacy
            protected
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
