"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, Loader2 } from "lucide-react";

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

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* --------------------------
SCHEMA
--------------------------- */

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalInformationForm() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const token = session?.user?.accessToken || "";

  const [profileImagePreview, setProfileImagePreview] = React.useState<
    string | null
  >(null);

  const [imageLoading, setImageLoading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /* --------------------------
  FORM
  --------------------------- */

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  });

  /* --------------------------
  FETCH PROFILE
  --------------------------- */

  const { data } = useQuery<UserProfileResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch profile");

      return res.json();
    },
    enabled: !!token && !!session?.user?.id,
  });

  /* --------------------------
  SET FORM DATA
  --------------------------- */

  React.useEffect(() => {
    if (data?.data) {
      form.setValue("fullName", data.data.fullName);
      form.setValue("phoneNumber", data.data.phoneNumber || "");
      form.setValue("email", data.data.email);

      setProfileImagePreview(data.data.avatar);
    }
  }, [data, form]);

  /* --------------------------
  UPDATE TEXT INFO
  --------------------------- */

  const updateProfileMutation = useMutation({
    mutationFn: async (values: { fullName: string; phoneNumber: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });

      console.log("Profile updated");
    },

    onError: (err) => {
      console.log("Update error", err);
    },
  });

  /* --------------------------
  UPDATE IMAGE
  --------------------------- */

  const updateImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });

      console.log("Image updated");
    },

    onError: (err) => {
      console.log("Upload error", err);
    },

    onSettled: () => {
      setImageLoading(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || "",
    };

    updateProfileMutation.mutate(payload);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Max size 10MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    setImageLoading(true);

    updateImageMutation.mutate(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /* --------------------------
  UI
  --------------------------- */

  return (
    <Card className="w-full my-8 shadow-sm rounded-lg border-muted">
      <CardHeader className="pb-8 border-b border-muted">
        <CardTitle className="text-2xl font-semibold">
          Personal Information
        </CardTitle>

        <CardDescription>Update your account profile details</CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* PROFILE IMAGE */}

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImagePreview || ""} />

                  <AvatarFallback>
                    {data?.data?.fullName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {imageLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <Loader2 className="animate-spin text-white" />
                  </div>
                )}

                <div
                  onClick={handleUploadClick}
                  className="absolute -bottom-2 -right-2 bg-[#26a69a] text-white p-2 rounded-full cursor-pointer"
                >
                  <Camera size={18} />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Profile Photo</Label>

                <p className="text-sm text-muted-foreground">
                  JPG or PNG (max 10MB)
                </p>
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
                    <Input {...field} className="h-12" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>

                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input disabled {...field} className="h-12" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SAVE BUTTON */}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-[#26a69a] hover:bg-[#1f8c82]"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
