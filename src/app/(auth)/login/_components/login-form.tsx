"use client";

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
import { Checkbox } from "@/components/ui/checkbox"; // Checkbox component add kora lagte pare
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

type FormType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSignIn = async (payload: FormType) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(`login error : ${error}`);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(payload: FormType) {
    await handleSignIn(payload);
  }

  return (
    <div className="w-full mx-auto p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-8">
        <span className="bg-[#E0F2F1] text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Welcome Back
        </span>
        <h1 className="text-4xl font-bold text-[#1A2E35] mt-4">
          Login to Bookersi
        </h1>
        <p className="text-gray-500 mt-2">
          Your wellness journey continues here.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
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
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-[#1A2E35] font-semibold">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-gray-300 data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-gray-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="h-[52px] w-full bg-primary hover:bg-primary text-white rounded-xl text-lg font-semibold transition-all"
            >
              {isLoading ? <Spinner className="mr-2" /> : "Login"}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        {/* <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400">Or sign up with</span>
          </div>
        </div> */}

        {/* Social Buttons */}
        {/* <div>
          <Button
            variant="outline"
            className="h-[52px] w-full rounded-xl border-gray-100 flex gap-2 font-medium hover:bg-gray-100"
          >
            <Image
              src="/images/google-icon.png"
              width={20}
              height={20}
              alt="Google"
            />{" "}
            Google
          </Button>
        </div> */}
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#009688] font-bold inline-flex items-center hover:underline"
          >
            Sign up for free <ArrowRight size={16} className="ml-1" />
          </Link>
        </p>
      </div>

      <div className="mt-8 flex gap-6 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Lock size={16} /> Secure & encrypted
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} /> Privacy protected
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
