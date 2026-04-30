/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  X,
  Upload,
  Loader2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Building2,
  Image as ImageIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";

// --- Schema Definition (Matches backend DTO exactly) ---
const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  totalStaff: z.number().min(1, "At least 1 staff member is required"),
  country: z.string().min(1, "Select country"),
  city: z.string().min(1, "City/Address is required"),
  postalCode: z.string().optional(),
  businessCategory: z.string().min(1, "Select business category"),
  sector: z.string().optional(),
  openingHour: z
    .array(
      z.object({
        day: z.string(),
        openTime: z.string(),
        closeTime: z.string(),
        isOpen: z.boolean(),
      }),
    )
    .min(1, "At least one day must be open"),
  logo: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).optional(),
  description: z.string().min(10, "Description is too short"),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const BusinessSignUpForm = () => {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<
    Array<{ name: string; code: string }>
  >([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [uploadedGallery, setUploadedGallery] = useState<File[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      password: "",
      phoneNumber: "",
      totalStaff: 5,
      country: "",
      city: "",
      postalCode: "",
      businessCategory: "",
      sector: "",
      description: "",
      gallery: [],
      openingHour: DAYS.map((day) => ({
        day,
        openTime: "09:00", // Default open at 9 AM
        closeTime: "18:00", // Default close at 6 PM
        isOpen: !["Saturday", "Sunday"].includes(day), // Closed on weekends
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "openingHour",
  });

  // --- Fetch Countries from Free API ---
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
        );
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
        setIsLoadingCountries(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([
          { name: "United Kingdom", code: "GB" },
          { name: "United States", code: "US" },
          { name: "Canada", code: "CA" },
          { name: "Australia", code: "AU" },
          { name: "Germany", code: "DE" },
          { name: "France", code: "FR" },
          { name: "Spain", code: "ES" },
          { name: "Italy", code: "IT" },
          { name: "Netherlands", code: "NL" },
          { name: "Sweden", code: "SE" },
        ]);
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      uploadedGallery.forEach((photo) =>
        URL.revokeObjectURL(URL.createObjectURL(photo)),
      );
    };
  }, [logoPreview, uploadedGallery]);

  // --- Step 1: Auth Signup Mutation ---
  const { mutate: signupMutation, isPending: isSignupPending } = useMutation({
    mutationFn: async (values: {
      businessName: string;
      businessEmail: string;
      password: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: values.businessName,
            email: values.businessEmail,
            password: values.password,
            role: "businessowner",
          }),
        },
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result?.message || "Registration failed");

      const token = result?.data?.data?.accessToken;
      if (!token) throw new Error("No access token received");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(result?.data?.data?.user));

      return { token, user: result?.data?.data?.user };
    },
    onSuccess: (data) => {
      toast.success("Business account created successfully!");
      setAccessToken(data.token);
      setStep(2);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // --- Step 5: Business Profile Mutation (Matches backend DTO exactly) ---
  const {
    mutate: businessProfileMutation,
    isPending: isBusinessProfilePending,
  } = useMutation({
    mutationFn: async (values: BusinessFormValues) => {
      const formData = new FormData();

      // Required fields - match exactly with backend CreateBusinessDto
      formData.append("businessName", values.businessName);
      formData.append("businessEmail", values.businessEmail);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("businessCategory", values.businessCategory);
      formData.append("totalStaff", String(values.totalStaff));
      formData.append("country", values.country);
      formData.append("city", values.city);

      // Postal code as integer (only if provided and not empty)
      if (values.postalCode && values.postalCode.trim() !== "") {
        const postalCodeNum = parseInt(values.postalCode);
        if (!isNaN(postalCodeNum)) {
          formData.append("postalCode", String(postalCodeNum));
        }
      }

      // Optional fields
      if (values.sector) {
        formData.append("sector", values.sector);
      }

      if (values.description) {
        formData.append("description", values.description);
      }

      // Format opening hours - Use "openingHour" (singular)
      // Only include days that are open, and don't send isOpen field
      const formattedOpeningHours = values.openingHour
        .filter((hour) => hour.isOpen) // Only include open days
        .map(({ day, openTime, closeTime }) => ({
          day,
          openTime,
          closeTime,
        }));

      // openingHour must be a non-empty array
      if (formattedOpeningHours.length === 0) {
        throw new Error("Please set opening hours for at least one day");
      }

      formData.append("openingHour", JSON.stringify(formattedOpeningHours));

      // Upload logo (single file)
      if (values.logo) {
        formData.append("logo", values.logo);
      }

      // Upload gallery images (multiple files)
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((photo) => {
          formData.append("gallery", photo);
        });
      }

      const token = accessToken || localStorage.getItem("token");

      console.log("Sending data - openingHour:", formattedOpeningHours);
      console.log("Has logo:", !!values.logo);
      console.log("Gallery count:", values.gallery?.length || 0);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Business creation error:", data);
        throw new Error(data?.message || "Business profile creation failed");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Business profile completed successfully!");
      router.push("/business");
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      toast.error(err.message);
    },
  });

  // --- Handle Logo Upload ---
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for the logo");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo should be less than 2MB");
      return;
    }

    // Clean up previous preview
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setUploadedLogo(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    form.setValue("logo", file);
  };

  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setUploadedLogo(null);
    setLogoPreview(null);
    form.setValue("logo", undefined);
  };

  // --- Handle Gallery Upload ---
  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: File[] = [];
    const maxPhotos = 5;

    if (uploadedGallery.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} gallery photos`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);
          return;
        }
        newPhotos.push(file);
      } else {
        toast.error(`${file.name} is not an image file`);
      }
    });

    const updatedPhotos = [...uploadedGallery, ...newPhotos];
    setUploadedGallery(updatedPhotos);
    form.setValue("gallery", updatedPhotos);
  };

  const removeGalleryPhoto = (index: number) => {
    const updatedPhotos = uploadedGallery.filter((_, i) => i !== index);
    setUploadedGallery(updatedPhotos);
    form.setValue("gallery", updatedPhotos);
  };

  // --- Function to apply default hours to all days ---
  const applyDefaultHours = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    days.forEach((day, index) => {
      form.setValue(`openingHour.${index}.openTime`, "09:00");
      form.setValue(`openingHour.${index}.closeTime`, "18:00");
      form.setValue(
        `openingHour.${index}.isOpen`,
        !["Saturday", "Sunday"].includes(day),
      );
    });
    toast.success("Default hours (9 AM - 6 PM) applied to all days");
  };

  // --- Function to apply same hours to weekdays ---
  const applyWeekdayHours = () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weekdayIndices = [0, 1, 2, 3, 4];
    weekdayIndices.forEach((index) => {
      form.setValue(`openingHour.${index}.openTime`, "09:00");
      form.setValue(`openingHour.${index}.closeTime`, "18:00");
      form.setValue(`openingHour.${index}.isOpen`, true);
    });
    toast.success("Weekday hours (9 AM - 6 PM) applied");
  };

  // --- Multi-step Logic ---
  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];

    if (step === 1) {
      fieldsToValidate = ["businessName", "businessEmail", "password"];
      const isValid = await form.trigger(fieldsToValidate as any);
      if (isValid) {
        const values = form.getValues();
        signupMutation({
          businessName: values.businessName,
          businessEmail: values.businessEmail,
          password: values.password,
        });
      }
      return;
    }

    if (step === 2)
      fieldsToValidate = [
        "phoneNumber",
        "totalStaff",
        "country",
        "city",
        "businessCategory",
      ];
    if (step === 3) fieldsToValidate = ["openingHour"];
    if (step === 4) fieldsToValidate = ["logo", "gallery"];
    if (step === 5) fieldsToValidate = ["description"];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      if (step === 5) {
        const values = form.getValues();
        businessProfileMutation(values);
      } else {
        setStep((s) => s + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Check if at least one day is open for Step 3
  const hasAtLeastOneOpenDay = () => {
    const openingHours = form.getValues("openingHour");
    return openingHours?.some((hour) => hour.isOpen) || false;
  };

  // Loading states
  if (step === 1 && isSignupPending) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm text-center">
            <Loader2 className="animate-spin h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-serif text-[#1A2E35] font-medium mb-2">
              Creating your account...
            </h2>
            <p className="text-gray-500">
              Please wait while we set up your business account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 5 && isBusinessProfilePending) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm text-center">
            <Loader2 className="animate-spin h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-serif text-[#1A2E35] font-medium mb-2">
              Setting up your business profile...
            </h2>
            <p className="text-gray-500">
              Please wait while we save your business information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="max-w-[1000px] mx-auto mb-8 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center text-gray-500 font-medium hover:text-primary transition"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex flex-col items-center flex-1">
          <span className="text-[12px] font-bold text-primary uppercase tracking-widest">
            Step {step} of 5
          </span>
          <div className="w-64 h-1.5 bg-gray-200 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
        <Link href={`/sign-up`}>
          <button className="text-gray-400 hover:text-red-500 transition cursor-pointer">
            <X size={24} />
          </button>
        </Link>
      </div>

      <div className="max-w-[800px] mx-auto">
        {step === 1 && (
          <div className="text-center mb-8">
            <span className="bg-[#E0F2F1] text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
              For Professionals
            </span>
            <h1 className="text-4xl font-serif text-[#1A2E35] mt-4 font-medium">
              Create your business account
            </h1>
            <p className="text-gray-500 mt-2">
              Join 8,000+ wellness businesses growing with BOOKERSI.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Tell us about your business
                  </h2>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1A2E35]">
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Wellness Center"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1A2E35]">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="business@example.com"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl focus-visible:ring-primary"
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
                        <FormLabel className="font-semibold text-[#1A2E35]">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Min 8 characters"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 2: Location & Business Details */}
              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Business Contact & Location
                  </h2>

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1234567890"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Business Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F4F9F9] border-none h-12 rounded-xl !w-full">
                              <SelectValue placeholder="Select business category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wellness">
                              Wellness & Spa
                            </SelectItem>
                            <SelectItem value="fitness">
                              Fitness & Gym
                            </SelectItem>
                            <SelectItem value="beauty">
                              Beauty & Salon
                            </SelectItem>
                            <SelectItem value="health">
                              Health & Medical
                            </SelectItem>
                            <SelectItem value="yoga">
                              Yoga & Meditation
                            </SelectItem>
                            <SelectItem value="nutrition">
                              Nutrition & Diet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalStaff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Total Staff
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Number of staff members"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F4F9F9] border-none h-12 rounded-xl !w-full">
                              <SelectValue
                                placeholder={
                                  isLoadingCountries
                                    ? "Loading countries..."
                                    : "Select country"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {countries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.name}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          City / Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Street, London"
                            className="bg-[#F4F9F9] border-none h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Postal Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SW1A 1AA"
                              className="bg-[#F4F9F9] border-none h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Sector (Optional)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F4F9F9] border-none h-12 rounded-xl">
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wellness">
                                Wellness & Spa
                              </SelectItem>
                              <SelectItem value="fitness">
                                Fitness & Gym
                              </SelectItem>
                              <SelectItem value="beauty">
                                Beauty & Salon
                              </SelectItem>
                              <SelectItem value="health">
                                Health & Medical
                              </SelectItem>
                              <SelectItem value="yoga">
                                Yoga & Meditation
                              </SelectItem>
                              <SelectItem value="nutrition">
                                Nutrition & Diet
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Opening Hours - With quick action buttons */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                      Add your opening hours
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={applyDefaultHours}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Reset to 9-6
                      </Button>
                      <Button
                        type="button"
                        onClick={applyWeekdayHours}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Set Weekdays
                      </Button>
                    </div>
                  </div>

                  {!hasAtLeastOneOpenDay() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                      Please ensure at least one day is marked as open
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F4F9F9] text-gray-400 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-4 text-left">Day</th>
                          <th className="p-4 text-left">Status</th>
                          <th className="p-4 text-left">Open</th>
                          <th className="p-4 text-left">Close</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {fields.map((field, index) => (
                          <tr key={field.id}>
                            <td className="p-4 font-semibold text-[#1A2E35]">
                              {field.day}
                            </td>
                            <td className="p-4">
                              <Switch
                                checked={form.watch(
                                  `openingHour.${index}.isOpen`,
                                )}
                                onCheckedChange={(val) =>
                                  form.setValue(
                                    `openingHour.${index}.isOpen`,
                                    val,
                                  )
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </td>
                            <td className="p-4">
                              <Input
                                type="time"
                                className="h-9 w-28 text-xs bg-[#F4F9F9] border-none"
                                {...form.register(
                                  `openingHour.${index}.openTime`,
                                )}
                                disabled={
                                  !form.watch(`openingHour.${index}.isOpen`)
                                }
                              />
                            </td>
                            <td className="p-4">
                              <Input
                                type="time"
                                className="h-9 w-28 text-xs bg-[#F4F9F9] border-none"
                                {...form.register(
                                  `openingHour.${index}.closeTime`,
                                )}
                                disabled={
                                  !form.watch(`openingHour.${index}.isOpen`)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    💡 Tip: Click &quot;Reset to 9-6&quot; to set all days to 9
                    AM - 6 PM, or &quot;Set Weekdays&quot; for Monday-Friday
                    only
                  </p>
                </div>
              )}

              {/* STEP 4: Logo & Gallery Upload */}
              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Brand your business
                  </h2>

                  {/* Logo Upload Section */}
                  <div className="space-y-4">
                    <FormLabel className="font-semibold text-[#1A2E35] flex items-center gap-2">
                      <Building2 size={18} /> Business Logo (Optional)
                    </FormLabel>

                    {!logoPreview ? (
                      <div className="border-2 border-dashed border-[#E0F2F1] rounded-2xl p-6 text-center bg-[#F4F9F9]/50 hover:bg-[#F4F9F9] transition cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Upload className="text-primary" size={24} />
                        </div>
                        <h3 className="font-bold text-[#1A2E35]">
                          Upload Logo
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG or GIF (Max 2MB)
                        </p>
                        <p className="text-xs text-gray-400">
                          Recommended: Square image, 500x500px
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6 p-4 bg-[#F4F9F9] rounded-2xl">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/20">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1A2E35]">
                            {uploadedLogo?.name || "Logo file"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {uploadedLogo?.size
                              ? `${(uploadedLogo.size / 1024).toFixed(0)} KB`
                              : "File size unknown"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={removeLogo}
                          variant="destructive"
                          size="sm"
                          className="rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Gallery Upload Section */}
                  <div className="space-y-4">
                    <FormLabel className="font-semibold text-[#1A2E35] flex items-center gap-2">
                      <ImageIcon size={18} /> Gallery Photos (Optional)
                    </FormLabel>

                    <div className="border-2 border-dashed border-[#E0F2F1] rounded-2xl p-8 text-center bg-[#F4F9F9]/50 hover:bg-[#F4F9F9] transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Upload className="text-primary" size={24} />
                      </div>
                      <h3 className="font-bold text-[#1A2E35]">
                        Upload Gallery Photos
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Drag and drop images, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Max 5 photos | Max 5MB each | Supported: JPG, PNG, GIF
                      </p>
                    </div>

                    {/* Gallery Grid */}
                    {uploadedGallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {uploadedGallery.map((photo, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square"
                          >
                            <Image
                              width={1000}
                              height={1000}
                              src={URL.createObjectURL(photo)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryPhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Description */}
              {step === 5 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Tell us about your venue
                  </h2>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1A2E35]">
                          Venue Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your atmosphere, services, unique features, and what makes your venue special..."
                            className="bg-[#F4F9F9] border-none min-h-[150px] rounded-xl resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-1">
                          This description will help customers understand what
                          makes your venue unique.
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-primary/90 h-[52px] text-lg font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-white"
                  disabled={isSignupPending || isBusinessProfilePending}
                >
                  {isSignupPending || isBusinessProfilePending ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  {step === 5 ? "Complete Setup" : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Security Badges */}
        <div className="mt-10 flex flex-col items-center gap-4 text-gray-400 text-sm">
          <div className="flex flex-col text-center space-y-[10px] mb-4">
            <span>
              Already have an account?{" "}
              <Link href="/login" className="text-[#159A9C] font-medium">
                Log in here{" "}
                <ArrowRight size={20} className="inline-block" />{" "}
              </Link>
            </span>
            <span className="text-[#5F7D7D] text-[14px]">
              Are you a wellness professional?{" "}
              <span className="text-[#1E2A2A] font-semibold text-[16px]">
                Create a customer account{" "}
              </span>
            </span>
          </div>

          <div className="flex gap-6 font-medium">
            <span className="flex items-center gap-2">
              <Lock size={18} /> Secure & encrypted
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} /> Privacy protected
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={18} className="text-primary" /> 8,000+
            businesses trust BOOKERSI
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignUpForm;
