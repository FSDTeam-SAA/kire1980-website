"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  ChevronDown,
  Wifi,
  Coffee,
  Car,
  Clock,
  MapPin,
  Heart,
  Search,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Business, Service, Staff } from "@/types/businessDetailsType";
import { ServiceDetailsSkeleton } from "./service-details-skeleton";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import BusinessMap from "./business-map";

interface ServiceItemProps {
  service: Service;
  isSelected?: boolean;
  onSelect?: () => void;
  onUnselect?: () => void;
  staffList?: Staff[];
  selectedStaff?: Staff | null;
  onStaffSelect?: (staff: Staff | null) => void;
}

interface BookingItem {
  service: Service;
  staff: Staff | null;
}

interface BookingPayload {
  services: {
    serviceId: string;
    dateAndTime: string;
    selectedProvider: string;
  }[];
  businessId: string;
  notes: string;
}

const ServiceDetails = () => {
  const [selectedServices, setSelectedServices] = useState<
    Map<string, BookingItem>
  >(new Map());
  const [globalDate, setGlobalDate] = useState<Date | undefined>(undefined);
  const [globalTimeSlot, setGlobalTimeSlot] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const isAuthenticated = !!session?.data?.user;

  // Check authentication and show dialog if needed
  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setPendingAction(() => action);
      setIsAuthDialogOpen(true);
    } else {
      action();
    }
  };

  const containerClasses = "container mx-auto";

  // Fetch single business details
  const { data: businessData, isLoading: businessLoading } = useQuery({
    queryKey: ["business-details", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/${id}`,
      );
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });

  // Fetch services for this business
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/services/business/${id}`,
      );
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });

  // Fetch staff for this business
  const { data: staffsData, isLoading: staffsLoading } = useQuery({
    queryKey: ["staffs", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/business/${id}`,
      );
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });

  //wishlist mutation
  const { mutateAsync: wishListMutation, isPending: wishListPending } =
    useMutation({
      mutationKey: ["wishlist"],
      mutationFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlists/business/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.message || "Something went wrong");
        }

        return await res.json();
      },
      onSuccess: () => {
        toast.success("Business added to wishlist");
      },
      onError: (data) => {
        toast.error(data?.message);
      },
    });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: BookingPayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      return data;
    },
    onSuccess: () => {
      setIsBookingModalOpen(false);
      setSelectedServices(new Map());
      setGlobalDate(undefined);
      setGlobalTimeSlot("");
      setNotes("");
      setIsSuccessModalOpen(true);
    },
    onError: (error: Error) => {
      toast.error("Booking Failed", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const business: Business | undefined = businessData?.data;
  const businessServices: Service[] = servicesData?.data || [];
  const businessStaffs: Staff[] = staffsData?.data?.data || [];

  // Filter services based on search term
  const filteredServices = businessServices.filter((service: Service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isLoading = businessLoading || servicesLoading || staffsLoading;

  // Get staff for a specific service
  const getStaffForService = (serviceId: string) => {
    return businessStaffs.filter((staff) =>
      staff.serviceIds?.some((sid) => sid._id === serviceId),
    );
  };

  // Handle service selection - protected
  const handleServiceSelect = (service: Service) => {
    requireAuth(() => {
      setSelectedServices((prev) => {
        const newMap = new Map(prev);
        newMap.set(service._id, { service, staff: null });
        return newMap;
      });
    });
  };

  // Handle service unselection
  const handleServiceUnselect = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);
      newMap.delete(serviceId);
      return newMap;
    });
  };

  // Handle staff selection for a service
  const handleStaffSelect = (serviceId: string, staff: Staff | null) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(serviceId);
      if (existing) {
        newMap.set(serviceId, { ...existing, staff });
      }
      return newMap;
    });
  };

  // Calculate total price
  const totalPrice = Array.from(selectedServices.values()).reduce(
    (sum, item) => sum + item.service.price,
    0,
  );

  // Generate time slots (9 AM to 8 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push(time);
      if (hour !== 20) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle date selection - protected
  const handleDateSelect = (date: Date | undefined) => {
    if (selectedServices.size === 0) {
      toast.error("No Services Selected", {
        description: "Please select at least one service first.",
      });
      return;
    }
    requireAuth(() => {
      setGlobalDate(date);
      if (date) {
        setIsTimeSlotOpen(true);
      }
    });
  };

  // Handle confirm booking - protected
  const handleConfirmBooking = () => {
    requireAuth(() => {
      if (!globalDate) {
        toast.error("Date Required", {
          description: "Please select a date for your booking.",
        });
        return;
      }
      if (!globalTimeSlot) {
        toast.error("Time Slot Required", {
          description: "Please select a time slot for your booking.",
        });
        return;
      }
      if (selectedServices.size === 0) {
        toast.error("No Services Selected", {
          description: "Please select at least one service to book.",
        });
        return;
      }

      // Check if all selected services have staff assigned
      const missingStaff = Array.from(selectedServices.values()).some(
        (item) => !item.staff,
      );
      if (missingStaff) {
        toast.error("Staff Required", {
          description: "Please select a professional for each service.",
        });
        return;
      }

      setIsBookingModalOpen(true);
    });
  };

  // Handle wishlist - protected
  const handleWishlist = () => {
    requireAuth(() => {
      wishListMutation();
    });
  };

  // Submit booking with new payload structure
  const submitBooking = async () => {
    const dateTime = new Date(globalDate!);
    const [hours, minutes] = globalTimeSlot.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0);

    // Validate that the selected date and time is in the future
    const now = new Date();
    if (dateTime <= now) {
      toast.error("Invalid Date & Time", {
        description: "Please select a future date and time for your booking.",
      });
      return;
    }

    const isoDateTime = dateTime.toISOString();

    // Prepare services array for the new payload structure
    const servicesArray = Array.from(selectedServices.values()).map((item) => ({
      serviceId: item.service._id,
      dateAndTime: isoDateTime,
      selectedProvider: item.staff!._id,
    }));

    const payload: BookingPayload = {
      services: servicesArray,
      businessId: business!._id,
      notes: notes,
    };

    await bookingMutation.mutateAsync(payload);
  };

  // Get today's opening hours
  const getTodayHours = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayHours = business?.openingHours?.find(
      (hours) => hours.day === today,
    );
    return todayHours;
  };

  const todayHours = getTodayHours();
  const isOpenNow = todayHours?.isOpen || false;
  const averageRating = business?.averageRating || 0;
  const totalReviews = business?.totalReviews || 0;

  // Disable today and all previous dates - only future dates allowed
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Service Not Found
          </h2>
          <p className="text-slate-500">
            The service you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const coverImage = business.gallery?.[0]?.url || "/cover.jpg";
  const uniqueStaff = businessStaffs;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <div className="relative h-72 w-full">
        <Image
          src={coverImage}
          alt={business.businessName}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 2. HEADER INFO CARD */}
      <div className={`${containerClasses} -mt-12 relative z-10`}>
        <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    isOpenNow
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isOpenNow ? "Open Now" : "Closed"}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin size={12} /> {business.city}, {business.country}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {business.businessName}
              </h1>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-slate-400">
                  ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              disabled={wishListPending}
              onClick={handleWishlist}
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer hover:bg-[#0096a1] hover:text-white"
            >
              {wishListPending ? <Spinner /> : <Heart size={18} />}
            </Button>
            <Button
              onClick={() => {
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#0096a1] hover:bg-[#007a83] text-white px-8 cursor-pointer"
            >
              Book appointment
            </Button>
          </div>
        </div>

        {/* 4. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* LEFT: Services & Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Services Header */}
            <section id="services">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Services</h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search service"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-1 ring-[#0096a1] outline-none w-full sm:w-64"
                  />
                </div>
              </div>

              {/* Service List */}
              <div className="space-y-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No services found
                  </div>
                ) : (
                  filteredServices.map((service: Service) => (
                    <ServiceItem
                      key={service._id}
                      service={service}
                      isSelected={selectedServices.has(service._id)}
                      onSelect={() => handleServiceSelect(service)}
                      onUnselect={() => handleServiceUnselect(service._id)}
                      staffList={getStaffForService(service._id)}
                      selectedStaff={
                        selectedServices.get(service._id)?.staff || null
                      }
                      onStaffSelect={(staff) =>
                        handleStaffSelect(service._id, staff)
                      }
                    />
                  ))
                )}
              </div>
            </section>

            {/* Meet the Team */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uniqueStaff.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-slate-500">
                    No staff members found
                  </div>
                ) : (
                  uniqueStaff.map((staff: Staff) => (
                    <div
                      key={staff._id}
                      className="bg-white border p-4 rounded-xl text-center space-y-2 hover:shadow-md transition-shadow"
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto overflow-hidden">
                        {staff.avatar?.url ? (
                          <Image
                            src={staff.avatar.url}
                            alt={`${staff.firstName} ${staff.lastName}`}
                            width={1000}
                            height={1000}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0096a1]/10 text-[#0096a1] font-bold text-xl">
                            {staff.firstName?.[0] || "S"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {staff.serviceIds?.length || 0}{" "}
                          {staff.serviceIds?.length === 1
                            ? "Service"
                            : "Services"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              {business.reviews && business.reviews.length > 0 ? (
                <div className="space-y-4">
                  {business.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="font-bold text-slate-600">
                            {review.userId.fullName?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {review.userId.fullName}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{review.review}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 bg-white border rounded-xl">
                  No reviews yet
                </div>
              )}
            </section>

            {/* Gallery */}
            {business.gallery && business.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.gallery.slice(0, 5).map((image, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl overflow-hidden ${
                        idx === 0 ? "md:col-span-1 md:row-span-2" : ""
                      }`}
                    >
                      <Image
                        src={image.url}
                        className="w-full h-full object-cover aspect-square"
                        width={1000}
                        height={1000}
                        alt={`Gallery ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* About Section */}
            {business.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed">
                  {business.description}
                </p>
              </section>
            )}
          </div>

          {/* RIGHT: Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 bg-white border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-xl">Your Booking</h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedServices.size === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No services selected
                  </p>
                ) : (
                  Array.from(selectedServices.values()).map((item) => (
                    <div
                      key={item.service._id}
                      className="flex justify-between items-start text-sm border-b pb-3"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {item.service.serviceName}
                          </span>
                          <button
                            onClick={() =>
                              handleServiceUnselect(item.service._id)
                            }
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <span className="text-xs text-slate-400 block">
                          {item.staff
                            ? `${item.staff.firstName} ${item.staff.lastName}`
                            : "No professional selected"}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          {item.service.serviceDuration}
                        </span>
                      </div>
                      <span className="font-bold">${item.service.price}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Clock size={16} /> Date & Time
                </p>
                <div className="border rounded-lg p-2 flex justify-center bg-white">
                  <Calendar
                    mode="single"
                    selected={globalDate}
                    onSelect={handleDateSelect}
                    className="w-full"
                    disabled={disabledDays}
                    modifiers={{
                      selected: (date) =>
                        globalDate?.toDateString() === date.toDateString(),
                    }}
                    modifiersClassNames={{
                      selected: "bg-[#0096a1] text-white hover:bg-[#007a83]",
                    }}
                  />
                </div>
                {globalDate && globalTimeSlot && (
                  <p className="text-xs text-slate-600 text-center">
                    Selected: {globalDate.toLocaleDateString()} at{" "}
                    {globalTimeSlot}
                  </p>
                )}

                {selectedServices.size > 0 && (
                  <>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#0096a1]">${totalPrice}</span>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleConfirmBooking}
                  className="w-full bg-[#0096a1] hover:bg-[#007a83] py-6 text-md font-bold text-white cursor-pointer"
                  disabled={selectedServices.size === 0}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Add this after About section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Location</h2>

          {/* Map Component */}
          <BusinessMap
            businessName={business.businessName}
            address={business.address}
            city={business.city}
            country={business.country}
            className="w-full"
          />

          {/* Location Details */}
          <div className="mt-4 flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <MapPin size={18} className="text-[#0096a1]" />
            </div>
            <div>
              <p className="font-medium text-slate-800">Address</p>
              <p className="text-sm text-slate-600 mt-0.5">
                {business.address ? `${business.address}, ` : ""}
                {business.city && `${business.city}`}
                {business.postalCode && `, ${business.postalCode}`}
                {business.country && `, ${business.country}`}
              </p>
              {(!business.address || !business.city) && (
                <p className="text-xs text-slate-400 mt-1">
                  * Exact street address may vary. Please contact the business
                  for precise location.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 5. AMENITIES & LOCATION */}
        <section className="py-16 border-t mt-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6">Amenities</h3>
              <div className="grid grid-cols-2 gap-y-4">
                {[
                  { icon: <Wifi size={16} />, label: "Free Wi-Fi" },
                  { icon: <Coffee size={16} />, label: "Free Drink" },
                  { icon: <Car size={16} />, label: "Free Parking" },
                  { icon: <Clock size={16} />, label: "Flexible Hours" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-slate-600"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg text-[#0096a1]">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Cancellation Policy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your appointment is very important to us. We understand that
                sometimes schedule changes are necessary. We request at least 24
                hours notice for cancellations.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Time Slot Selection Dialog */}
      <Dialog open={isTimeSlotOpen} onOpenChange={setIsTimeSlotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Time Slot</DialogTitle>
            <p className="text-sm text-slate-500 mt-2">
              Selected date: {globalDate?.toLocaleDateString()}
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setGlobalTimeSlot(slot);
                      setIsTimeSlotOpen(false);
                    }}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      globalTimeSlot === slot
                        ? "bg-[#0096a1] text-white border-[#0096a1]"
                        : "hover:border-[#0096a1] hover:bg-[#0096a1]/5"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimeSlotOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Services:</h4>
              {Array.from(selectedServices.values()).map((item) => (
                <div key={item.service._id} className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>{item.service.serviceName}</span>
                    <span>${item.service.price}</span>
                  </div>
                  <div className="text-xs text-slate-500 pl-2">
                    Professional: {item.staff?.firstName} {item.staff?.lastName}
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Date & Time:</h4>
              <p className="text-sm">
                {globalDate?.toLocaleDateString()} at {globalTimeSlot}
              </p>
            </div>
            <div className="space-y-2">
              <label className="font-semibold">
                Additional Notes (Optional):
              </label>
              <Textarea
                placeholder="Any special requests or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submitBooking}
              disabled={bookingMutation.isPending}
              className="bg-[#0096a1] hover:bg-[#007a83] text-white cursor-pointer"
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal - Popup instead of toast */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-600">
                Booking Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-center">
              <p className="text-slate-600">
                Your appointment has been successfully booked.
              </p>
              <p className="text-sm text-slate-500">
                You will receive a confirmation email shortly with all the
                details.
              </p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push(`/services/${id}`);
                }}
                className="bg-[#0096a1] hover:bg-[#007a83] text-white px-8 cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Required Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Login Required
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-center">
              <p className="text-slate-600">
                Please login or sign up to continue with your booking.
              </p>
              <p className="text-sm text-slate-500">
                Create an account to save your favorite businesses and manage
                your appointments.
              </p>
            </div>
            <div className="flex gap-3 mt-4 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAuthDialogOpen(false);
                  setPendingAction(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsAuthDialogOpen(false);
                  router.push("/login");
                }}
                className="flex-1 bg-[#0096a1] hover:bg-[#007a83] text-white cursor-pointer"
              >
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Service Item Sub-component ---
const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  isSelected = false,
  onSelect,
  onUnselect,
  staffList = [],
  selectedStaff,
  onStaffSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = () => {
    if (isSelected) {
      onUnselect?.();
      setIsOpen(false);
    } else {
      onSelect?.();
      setIsOpen(true);
    }
  };

  return (
    <div
      className={`border rounded-xl bg-white overflow-hidden transition-all ${
        isSelected
          ? "ring-1 ring-[#0096a1]"
          : "shadow-sm hover:border-slate-300"
      }`}
    >
      <div className="p-5 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{service.serviceName}</h3>
          <p className="text-sm text-slate-400 max-w-md line-clamp-2">
            {service.description ||
              "Professional service tailored to your needs."}
          </p>
          <span className="text-xs text-slate-400 block pt-2 underline underline-offset-4 decoration-dotted">
            {service.serviceDuration}
          </span>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">${service.price}</p>
          <Button
            onClick={handleSelect}
            className={`mt-2 cursor-pointer ${
              isSelected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#0096a1] hover:bg-[#007a83] text-white"
            }`}
          >
            {isSelected ? "Remove" : "Select"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50/80 border-t"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-slate-700">
                  Select a Professional
                </p>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {staffList.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No staff available for this service
                  </p>
                ) : (
                  staffList.map((staff) => (
                    <div
                      key={staff._id}
                      onClick={() => onStaffSelect?.(staff)}
                      className={`flex-shrink-0 text-center space-y-2 cursor-pointer group transition-all ${
                        selectedStaff?._id === staff._id
                          ? "opacity-100 scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full mx-auto border-2 transition-all overflow-hidden ${
                          selectedStaff?._id === staff._id
                            ? "border-[#0096a1] ring-2 ring-[#0096a1]/20"
                            : "border-transparent group-hover:border-[#0096a1]"
                        }`}
                      >
                        {staff.avatar?.url ? (
                          <Image
                            src={staff.avatar.url}
                            className="rounded-full w-full h-full object-cover"
                            width={1000}
                            height={1000}
                            alt={`${staff.firstName} ${staff.lastName}`}
                          />
                        ) : (
                          <div className="rounded-full w-full h-full flex items-center justify-center bg-[#0096a1]/10 text-[#0096a1] font-bold">
                            {staff.firstName?.[0] || "S"}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold">
                        {staff.firstName} {staff.lastName}
                      </p>
                      {selectedStaff?._id === staff._id && (
                        <p className="text-[10px] text-[#0096a1] font-semibold">
                          Selected
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;
