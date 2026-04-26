"use client";

import { MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function GetIntouch() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Message sent successfully");
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <section className="bg-[#F8FBFA] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Side */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              {/* <div className="relative flex h-8 w-8 items-end gap-[3px]">
                <span className="h-5 w-[6px] bg-[#1aa39a]" />
                <span className="h-7 w-[6px] bg-[#1aa39a]" />
                <span className="h-3 w-[6px] bg-[#1aa39a]" />
              </div>
              <span className="text-2xl font-bold text-[#1f2937]">
                Medixo365
              </span> */}
            </div>

            <h2 className="mt-8 text-4xl font-bold leading-tight text-[#1f2937] md:text-5xl">
              Get in touch with our
            </h2>

            <p className="mt-5 max-w-sm text-base leading-7 text-[#6b7280]">
              Whether you have a question about our services, pricing, or
              anything else, our team is ready to answer all your questions.
            </p>

            {/* <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef6f5]">
                  <MapPin className="h-5 w-5 text-[#1aa39a]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1f2937]">
                    Physical Address
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    Narodni Heroj 30-9 Bitola N.Macedonia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef6f5]">
                  <Phone className="h-5 w-5 text-[#1aa39a]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1f2937]">
                    Phone Number
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7280]">+38978376808</p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Side Form */}
          <div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-[#1f2937]"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jon Dhen"
                  className="h-14 w-full rounded-lg border border-[#d9e7e5] px-4"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#1f2937]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-lg border border-[#d9e7e5] px-4"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#1f2937]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  className="w-full rounded-lg border border-[#d9e7e5] px-4 py-4"
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="h-14 w-full rounded-lg bg-[#1aa39a] text-white font-semibold"
              >
                {mutation.isPending ? "Sending..." : "Send Message"}
              </button>

              <p className="text-center text-xs text-[#94a3b8]">
                By clicking send, you agree to our{" "}
                <span className="underline">Terms of Service</span> and{" "}
                <span className="underline">Privacy Policy</span>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
