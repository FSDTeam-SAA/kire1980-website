"use client";

import React, { useState } from "react";
import {
  Star,
  ChevronDown,
  Wifi,
  Coffee,
  Car,
  Clock,
  MapPin,
  Share2,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Business, Service, Staff } from "@/types/businessDetailsType";
import { ServiceDetailsSkeleton } from "./service-details-skeleton";

interface ServiceItemProps {
  service: Service;
  active?: boolean;
  onSelect?: () => void;
  staffList?: Staff[];
}

const ServiceDetails = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();

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

  // Get selected service details
  const selectedServiceDetails = selectedService || businessServices[0];

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

  // Calculate average rating from reviews
  const averageRating = business?.averageRating || 0;
  const totalReviews = business?.totalReviews || 0;

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Business Not Found
          </h2>
          <p className="text-slate-500">
            The business you&apos;re looking for doesn&apos;t exist.
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
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart size={18} />
            </Button>
            <Link href="#booking-continue">
              <Button className="bg-[#0096a1] hover:bg-[#007a83] text-white px-8 cursor-pointer">
                Book appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* 4. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* LEFT: Services & Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Services Header */}
            <section>
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
                      active={selectedServiceDetails?._id === service._id}
                      onSelect={() => setSelectedService(service)}
                      staffList={getStaffForService(service._id)}
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

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {selectedServiceDetails?.serviceName ||
                        "Select a service"}
                    </span>
                    <span className="text-xs text-slate-400 underline underline-offset-4 cursor-pointer">
                      Choose professional
                    </span>
                  </div>
                  <span className="font-bold">
                    ${selectedServiceDetails?.price || 0}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#0096a1]">
                    ${selectedServiceDetails?.price || 0}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Clock size={16} /> Date & Time
                </p>
                <div className="border rounded-lg p-2 flex justify-center bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                  />
                </div>
                <Button
                  id="booking-continue"
                  className="w-full bg-[#0096a1] hover:bg-[#007a83] py-6 text-md font-bold text-white cursor-pointer"
                  disabled={!selectedServiceDetails}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>

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
    </div>
  );
};

// --- Service Item Sub-component ---
const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  active = false,
  onSelect,
  staffList = [],
}) => {
  const [isOpen, setIsOpen] = useState(active);

  const handleSelect = () => {
    setIsOpen(!isOpen);
    onSelect?.();
  };

  return (
    <div
      className={`border rounded-xl bg-white overflow-hidden transition-all ${
        isOpen ? "ring-1 ring-[#0096a1]" : "shadow-sm hover:border-slate-300"
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
            className={`mt-2 ${
              isOpen
                ? "bg-[#0096a1] text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            {isOpen ? "Selected" : "Select"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
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
                      className="flex-shrink-0 text-center space-y-2 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-full bg-slate-200 mx-auto border-2 border-transparent group-hover:border-[#0096a1] p-0.5 overflow-hidden transition-all">
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
