/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Schema definition
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Must contain letters" })
    .regex(/[0-9]/, { message: "Must contain numbers" }),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

type FormType = z.infer<typeof formSchema>;

// Password strength calculation
type PasswordStrength = "weak" | "medium" | "strong";

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (!password) return "weak";

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Determine strength based on score
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
};

const getStrengthConfig = (strength: PasswordStrength) => {
  switch (strength) {
    case "weak":
      return {
        label: "Weak",
        color: "bg-red-500",
        textColor: "text-red-500",
        width: "33%",
      };
    case "medium":
      return {
        label: "Medium",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
        width: "66%",
      };
    case "strong":
      return {
        label: "Strong",
        color: "bg-green-500",
        textColor: "text-green-500",
        width: "100%",
      };
    default:
      return {
        label: "Weak",
        color: "bg-red-500",
        textColor: "text-red-500",
        width: "33%",
      };
  }
};

const CustomerSignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>("weak");

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      agreeToTerms: true,
    },
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    if (passwordValue) {
      const strength = calculatePasswordStrength(passwordValue);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength("weak");
    }
  }, [passwordValue]);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customer-signup"],
    mutationFn: async (payload: FormType) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  const strengthConfig = getStrengthConfig(passwordStrength);

  return (
    <div className="w-full max-w-[500px] mx-auto p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-8">
        <span className="bg-[#E0F2F1] text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          For Customers
        </span>
        <h1 className="text-4xl font-serif font-medium text-[#1A2E35] mt-4">
          Create your account
        </h1>
        <p className="text-gray-500 mt-2">
          Join 50,000+ wellness seekers on Velura.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full bg-white border border-[#F0F5F5] rounded-4xl p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1A2E35] font-semibold">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Doe"
                      className="h-[52px] bg-[#F4F9F9] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="you@example.com"
                      className="h-[52px] bg-[#F4F9F9] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
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
                        className="h-[52px] bg-[#F4F9F9] border-none rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-primary"
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

                  {/* Password Strength Indicator */}
                  {passwordValue && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        <div
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            width: strengthConfig.width,
                            backgroundColor:
                              strengthConfig.color === "bg-red-500"
                                ? "#ef4444"
                                : strengthConfig.color === "bg-yellow-500"
                                  ? "#eab308"
                                  : "#22c55e",
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p
                          className={`text-[11px] font-medium ${strengthConfig.textColor}`}
                        >
                          Password Strength: {strengthConfig.label}
                        </p>
                        {passwordStrength === "strong" && (
                          <BadgeCheck size={14} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-gray-400 mt-1">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-[#F4F9F9] p-4 rounded-xl">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-tight">
                    <p className="text-[13px] text-gray-600">
                      I agree to Velura&apos;s{" "}
                      <Link href="/terms" className="text-primary underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                      . I consent to receiving wellness updates.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="h-[52px] w-full bg-primary hover:bg-primary text-white rounded-xl text-lg font-semibold transition-all mt-4"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-4">
        <p className="text-gray-500 text-[15px]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-bold inline-flex items-center hover:underline"
          >
            Log in here <ArrowRight size={16} className="ml-1" />
          </Link>
        </p>

        <p className="text-sm text-gray-500">
          Are you a wellness professional?{" "}
          <Link
            href="/business-signup"
            className="text-[#1A2E35] font-bold hover:underline"
          >
            Create a business account
          </Link>
        </p>
      </div>

      {/* Security Badges */}
      <div className="mt-10 pt-6 border-t border-gray-100 w-full flex flex-col items-center gap-4 text-gray-400">
        <div className="flex gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Lock size={18} /> Secure & encrypted
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} /> Privacy protected
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BadgeCheck size={18} /> Free to get started
        </div>
      </div>
    </div>
  );
};

export default CustomerSignUpForm;
