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
  LogOut,
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
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";

// --- Schema Definition ---
const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid email address"),
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

const AddYourBusiness = () => {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<
    Array<{ name: string; code: string }>
  >([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
  const role = session?.data?.user?.role;
  const token = session?.data?.user?.accessToken;
  const status = session?.status;

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phoneNumber: "",
      totalStaff: 5,
      country: "",
      city: "",
      postalCode: "",
      sector: "wellness", // Set default value to "wellness"
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

  // --- Business Profile Mutation ---
  const {
    mutate: businessProfileMutation,
    isPending: isBusinessProfilePending,
  } = useMutation({
    mutationFn: async (values: BusinessFormValues) => {
      const formData = new FormData();

      // Required fields - match exactly with backend DTO
      formData.append("businessName", values.businessName);
      formData.append("businessEmail", values.email);
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
      setIsSuccessModalOpen(true);
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
      fieldsToValidate = [
        "businessName",
        "email",
        "phoneNumber",
        "totalStaff",
        "country",
        "city",
        "sector",
      ];
      const isValid = await form.trigger(fieldsToValidate as any);
      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) fieldsToValidate = ["openingHours"];
    if (step === 3) fieldsToValidate = ["coverPhotos"];
    if (step === 4) fieldsToValidate = ["description"];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      if (step === 4) {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    signOut({ callbackUrl: "/sign-up" });
  };

  // ========== ACCESS CONTROL ==========

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 mt-24 mb-10">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm text-center">
            <Loader2 className="animate-spin h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-serif text-[#1A2E35] font-medium mb-2">
              Loading...
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-up if not authenticated or not a customer
  if (!session || role !== "customer") {
    router.push("/sign-up");
    return null;
  }

  // Show loading state while submitting business profile
  if (isBusinessProfilePending) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 mt-28 mb-10">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm text-center">
            <Loader2 className="animate-spin h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-serif text-[#1A2E35] font-medium mb-2">
              Creating your business profile...
            </h2>
            <p className="text-gray-500">
              Please wait while we set up your business.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN COMPONENT RENDER (Only for customers) ==========

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-24">
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
            Step {step} of 4
          </span>
          <div className="w-64 h-1.5 bg-gray-200 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="text-gray-400 hover:text-red-500 transition flex items-center gap-2"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="max-w-[800px] mx-auto">
        {step === 1 && (
          <div className="text-center mb-8">
            <span className="bg-[#E0F2F1] text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
              For Professionals
            </span>
            <h1 className="text-4xl font-serif text-[#1A2E35] mt-4 font-medium">
              Add your business
            </h1>
            <p className="text-gray-500 mt-2">
              Join 8,000+ wellness businesses growing with Velura.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-[#F0F5F5] rounded-[32px] p-10 shadow-sm">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* STEP 1: Business Contact & Location */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-serif text-[#1A2E35] font-medium">
                    Business Contact & Location
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1A2E35]">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F4F9F9] border-none h-12 rounded-xl w-full">
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wellness">Wellness</SelectItem>
                              <SelectItem value="fitness">Fitness</SelectItem>
                              <SelectItem value="beauty">Beauty</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Opening Hours */}
              {step === 2 && (
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

              {/* STEP 3: Showcase Your Venue - Photo Upload */}
              {step === 3 && (
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
                            <Image
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-xl border border-gray-200"
                              width={1000}
                              height={1000}
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

              {/* STEP 4: Venue Description */}
              {step === 4 && (
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
                  className="w-full bg-primary hover:bg-primary/90 h-[52px] text-lg font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-white cursor-pointer"
                  disabled={isBusinessProfilePending}
                >
                  {isBusinessProfilePending ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  {step === 4 ? "Complete Setup" : "Continue"}
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
            businesses trust Velura
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-600">
                Business Created Successfully!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-center">
              <p className="text-slate-600">
                Your business profile has been successfully created.
              </p>
              <p className="text-sm text-slate-500">
                You can now manage your business and start accepting
                appointments.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push("/business");
                }}
                className="bg-[#0096a1] hover:bg-[#007a83] text-white px-6"
              >
                Go to Business
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut className="w-10 h-10 text-red-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">
                Confirm Logout
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-center">
              <p className="text-slate-600">Are you sure you want to logout?</p>
              <p className="text-sm text-slate-500">
                You will be redirected to the sign-up page.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 cursor-pointer"
              >
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddYourBusiness;
