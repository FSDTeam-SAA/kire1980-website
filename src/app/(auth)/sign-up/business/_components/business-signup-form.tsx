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

// --- Schema Definition ---
const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  totalStaff: z.number().min(1, "At least 1 staff member is required"),
  country: z.string().min(1, "Select country"),
  city: z.string().min(1, "City/Address is required"),
  postalCode: z.string().optional(),
  sector: z.string().min(1, "Select sector"),
  openingHours: z.array(
    z.object({
      day: z.string(),
      openTime: z.string(),
      closeTime: z.string(),
      isOpen: z.boolean(),
    }),
  ),
  coverPhotos: z.array(z.instanceof(File)).optional(),
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
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
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
      sector: "",
      description: "",
      coverPhotos: [],
      openingHours: DAYS.map((day) => ({
        day,
        openTime: "09:00",
        closeTime: "17:00",
        isOpen: !["Saturday", "Sunday"].includes(day),
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "openingHours",
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

      // Extract access token from the nested response structure
      const token = result?.data?.data?.accessToken;
      if (!token) throw new Error("No access token received");

      // Store token in localStorage
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

  // --- Step 5: Business Profile Mutation ---
  const {
    mutate: businessProfileMutation,
    isPending: isBusinessProfilePending,
  } = useMutation({
    mutationFn: async (values: BusinessFormValues) => {
      const formData = new FormData();

      // Required fields - match exactly with backend DTO
      formData.append("businessName", values.businessName);
      formData.append("businessEmail", values.businessEmail);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("businessCategory", values.sector);
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

      formData.append("sector", values.sector);
      formData.append("description", values.description);

      // Format opening hours - only include days that are open, without isOpen field
      const formattedOpeningHours = values.openingHours
        .filter((hour) => hour.isOpen) // Only include open days
        .map(({ day, openTime, closeTime }) => ({
          day,
          openTime,
          closeTime,
        }));

      // Only send openingHours if there are open days
      if (formattedOpeningHours.length > 0) {
        formData.append("openingHour", JSON.stringify(formattedOpeningHours));
      }

      // Append cover photos
      if (values.coverPhotos && values.coverPhotos.length > 0) {
        values.coverPhotos.forEach((photo) => {
          formData.append("gallery", photo);
        });
      }

      const token = accessToken || localStorage.getItem("token");

      console.log("Sending data:", {
        businessName: values.businessName,
        businessEmail: values.businessEmail,
        phoneNumber: values.phoneNumber,
        businessCategory: values.sector,
        totalStaff: values.totalStaff,
        country: values.country,
        city: values.city,
        postalCode: values.postalCode,
        sector: values.sector,
        openingHour: formattedOpeningHours,
        description: values.description,
      });

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

  // --- Handle Photo Upload ---
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: File[] = [];
    const maxPhotos = 5;

    if (uploadedPhotos.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newPhotos.push(file);
      } else {
        toast.error(`${file.name} is not an image file`);
      }
    });

    const updatedPhotos = [...uploadedPhotos, ...newPhotos];
    setUploadedPhotos(updatedPhotos);
    form.setValue("coverPhotos", updatedPhotos);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updatedPhotos);
    form.setValue("coverPhotos", updatedPhotos);
  };

  // --- Multi-step Logic ---
  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];

    if (step === 1) {
      fieldsToValidate = ["businessName", "businessEmail", "password"];
      const isValid = await form.trigger(fieldsToValidate as any);
      if (isValid) {
        const values = form.getValues();
        // Call auth signup mutation
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
        "sector",
      ];
    if (step === 3) fieldsToValidate = ["openingHours"];
    if (step === 4) fieldsToValidate = ["coverPhotos"];
    if (step === 5) fieldsToValidate = ["description"];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      if (step === 5) {
        // Submit business profile
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

  // Show loading state while waiting for signup to complete
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

  // Show loading state while submitting business profile
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
        <button className="text-gray-400 hover:text-red-500 transition">
          <X size={24} />
        </button>
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

        {/* Form Card - Wider */}
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
                            Sector
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

              {/* STEP 3: Opening Hours */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Add your opening hours
                  </h2>
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
                                  `openingHours.${index}.isOpen`,
                                )}
                                onCheckedChange={(val) =>
                                  form.setValue(
                                    `openingHours.${index}.isOpen`,
                                    val,
                                  )
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </td>
                            <td className="p-4">
                              <Input
                                className="h-9 w-24 text-xs bg-[#F4F9F9] border-none"
                                {...form.register(
                                  `openingHours.${index}.openTime`,
                                )}
                                disabled={
                                  !form.watch(`openingHours.${index}.isOpen`)
                                }
                              />
                            </td>
                            <td className="p-4">
                              <Input
                                className="h-9 w-24 text-xs bg-[#F4F9F9] border-none"
                                {...form.register(
                                  `openingHours.${index}.closeTime`,
                                )}
                                disabled={
                                  !form.watch(`openingHours.${index}.isOpen`)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STEP 4: Showcase Your Venue - Photo Upload */}
              {step === 4 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Showcase your venue
                  </h2>

                  {/* Photo Upload Area */}
                  <div className="space-y-4">
                    <FormLabel className="font-semibold text-[#1A2E35]">
                      Cover Photos
                    </FormLabel>

                    {/* Upload Button */}
                    <div className="border-2 border-dashed border-[#E0F2F1] rounded-2xl p-8 text-center bg-[#F4F9F9]/50 hover:bg-[#F4F9F9] transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Upload className="text-primary" size={24} />
                      </div>
                      <h3 className="font-bold text-[#1A2E35]">
                        Upload Photos
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Drag and drop images, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Max 5 photos | Supported: JPG, PNG, GIF
                      </p>
                    </div>

                    {/* Photo Grid */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
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

              {/* STEP 5: Venue Description */}
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
                            className="bg-[#F4F9F9] border-none min-h-[200px] rounded-xl resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-2">
                          This description will help customers understand what
                          makes your venue unique. Minimum 10 characters.
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
