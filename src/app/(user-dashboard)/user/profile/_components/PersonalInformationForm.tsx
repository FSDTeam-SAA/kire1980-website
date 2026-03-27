"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera } from "lucide-react";

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
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod Schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneCountryCode: z.string(),
  phoneNumber: z.string().min(3, {
    message: "Phone number is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalInformationForm() {
  const [profileImagePreview, setProfileImagePreview] = React.useState<
    string | null
  >(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      fullName: "",
      phoneCountryCode: "MK",
      phoneNumber: "",
      email: "",
    },
  });

  // Submit Form (without image)
  const onSubmit = (data: FormValues) => {
    const formData = {
      fullName: data.fullName,
      phoneCountryCode: data.phoneCountryCode,
      phoneNumber: data.phoneNumber,
      email: data.email,
    };

    console.log("Submitted Form Data:", formData);
  };

  // Image Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB");
        return;
      }

      // ONLY IMAGE LOG
      console.log("Uploaded Image:", file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full my-8 shadow-sm rounded-lg border-muted">
      <CardHeader className="pb-8 border-b border-muted">
        <CardTitle className="text-2xl font-semibold">
          Personal Information
        </CardTitle>

        <CardDescription>
          Update your account profile details and contact info.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* PROFILE IMAGE */}

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImagePreview || ""} alt="profile" />

                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>

                <div
                  className="absolute -bottom-2 -right-2 bg-[#26a69a] text-white p-2 rounded-full cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <Camera size={18} />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Profile Photo</Label>

                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB
                </p>
              </div>

              <div className="ml-auto">
                <Button
                  type="button"
                  onClick={handleUploadClick}
                  className="bg-[#26a69a] hover:bg-[#1f8c82]"
                >
                  Upload
                </Button>
              </div>
            </div>

            {/* FULL NAME */}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE + EMAIL */}

            <div className="grid md:grid-cols-2 gap-6">
              {/* PHONE */}

              <div className="flex gap-2">
                {" "}
                {/* Reduced gap for closer look */}
                {/* Country Code Select */}
                <FormItem className="w-[110px]">
                  {" "}
                  {/* Slightly smaller width */}
                  <FormLabel>Phone Number</FormLabel>
                  <Select
                    value={form.watch("phoneCountryCode")}
                    onValueChange={(value) =>
                      form.setValue("phoneCountryCode", value)
                    }
                  >
                    <SelectTrigger className="!h-12">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="MK">MK (+389)</SelectItem>
                      <SelectItem value="US">US (+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
                {/* Phone Number Input */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="opacity-0 pointer-events-none">
                        {" "}
                        {/* Invisible label for alignment */}
                        Phone Number
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="123 456 789"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* EMAIL */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SUBMIT BUTTON */}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#26a69a] hover:bg-[#1f8c82] px-8 h-12"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
