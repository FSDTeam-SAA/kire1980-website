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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// --- Types ---
interface ServiceItemProps {
  title: string;
  price: number;
  duration: string;
  description?: string;
  active?: boolean;
}

const topRatedData = [
  {
    id: 1,
    category: "Beauty",
    title: "Luxe Hair Studio",
    description: "Premium hair styling and coloring services in downtown.",
    price: "$45",
    rating: "4.9",
    image: "/images/Beauty.png",
  },
  {
    id: 2,
    category: "Fitness",
    title: "Luxe Hair Studio",
    description: "24/7 access gym with state-of-the-art equipment.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon.png",
  },
  {
    id: 3,
    category: "Wellness",
    title: "Luxe Hair Studio",
    description: "Relaxing massages and aromatherapy sessions.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon1.png",
  },
  {
    id: 4,
    category: "Fitness",
    title: "Luxe Hair Studio",
    description: "Vinyasa, Hatha, and Yin yoga classes for all levels.",
    price: "$45",
    rating: "4.9",
    image: "/images/Salon2.png",
  },
];

const ServiceDetails = () => {
  const [selectedService] = useState("Deep Tissue Massage");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Shared container class for consistency
  const containerClasses = "container mx-auto";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <div className="relative h-72 w-full">
        <Image
          src="/cover.jpg"
          alt="Spa Header"
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
            <div className="w-16 h-16 rounded-lg overflow-hidden border shadow-sm">
              <Image
                src="/images/logo1.png"
                width={1000}
                height={1000}
                alt="Logo"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Open Now
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin size={12} /> Manhattan, New York
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Lumina Wellness Studio
              </h1>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="font-bold">4.9</span>
                <span className="text-slate-400">(1,248 reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart size={18} />
            </Button>
            <Button className="bg-[#0096a1] hover:bg-[#007a83] text-white px-8">
              Book appointment
            </Button>
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="flex gap-8 border-b mt-6 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["Services", "Staff", "Reviews", "Gallery", "About"].map(
            (tab, i) => (
              <button
                key={tab}
                className={`pb-4 px-2 ${i === 0 ? "text-[#0096a1] border-b-2 border-[#0096a1]" : "hover:text-slate-800"}`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* 4. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* LEFT: Services & Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Services Header */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Services</h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search service"
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-1 ring-[#0096a1] outline-none w-full sm:w-64"
                  />
                </div>
              </div>

              {/* Service List */}
              <div className="space-y-4">
                <ServiceItem
                  title="Deep Tissue Massage"
                  price={120}
                  duration="60 min"
                  active={true}
                  description="Therapeutic massage focusing on realigning deeper layers of muscles and connective tissue."
                />
                <ServiceItem
                  title="Swedish Massage"
                  price={85}
                  duration="50 min"
                />
                <ServiceItem
                  title="Hot Stone Massage"
                  price={150}
                  duration="90 min"
                />
              </div>
            </section>

            {/* Meet the Team */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white border p-4 rounded-xl text-center space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/150?u=${i}`}
                        alt="Staff"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Leslie Alexander</p>
                      <p className="text-xs text-slate-400">
                        Massage Specialist
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-1 text-xs">
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={12}
                      />{" "}
                      4.9
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[400px]">
                <div className="md:col-span-1 md:row-span-2 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    alt="Gallery 1"
                  />
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    alt="Gallery 2"
                  />
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    alt="Gallery 3"
                  />
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    alt="Gallery 4"
                  />
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover"
                    alt="Gallery 5"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 bg-white border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-xl">Your Booking</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold">{selectedService}</span>
                    <span className="text-xs text-slate-400 underline underline-offset-4 cursor-pointer">
                      Choose professional
                    </span>
                  </div>
                  <span className="font-bold">$120</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#0096a1]">$120</span>
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
                <Link href={`/services/adfasdf/service-review`}>
                  <Button className="w-full bg-[#0096a1] hover:bg-[#007a83] py-6 text-md font-bold">
                    Continue
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5. AMENITIES & LOCATION */}
        <section className="py-16 border-t mt-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6">Amenities</h3>
              <div className="grid grid-cols-2 gap-y-4">
                {[
                  { icon: <Wifi size={16} />, label: "Free Wi-Fi" },
                  { icon: <Coffee size={16} />, label: "Free Drink" },
                  { icon: <Car size={16} />, label: "Free Parking" },
                  { icon: <Clock size={16} />, label: "24/7 Access" },
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

          <div>
            <h3 className="text-xl font-bold mb-6">Location & Hours</h3>
            <div className="w-full h-48 bg-slate-200 rounded-xl mb-6 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover"
                alt="Map"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold cursor-pointer hover:bg-slate-50">
                  <MapPin size={14} className="text-[#0096a1]" /> Open in Google
                  Maps
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start text-sm">
              <div className="space-y-1">
                <p className="font-bold">123 Wellness Blvd, Suite 100</p>
                <p className="text-slate-500">New York, NY 10012</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-slate-400">Monday - Friday</p>
                <p className="font-bold">9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. NEARBY VENUES */}
        <section className="py-12 border-t">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Venues nearby</h2>
            <Button variant="ghost" className="text-[#0096a1] font-bold">
              See all <ChevronRight size={16} />
            </Button>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {topRatedData.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                  {/* Rating */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                    <span className="text-xs font-semibold text-[#1f2937]">
                      {item.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm font-medium text-[#ff5a7a]">
                    {item.category}
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-[#1f2937]">
                    {item.title}
                  </h3>

                  <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#6b7280] md:text-base">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#e7efee] pt-4">
                    <p className="text-3xl font-medium text-[#6b7280]">
                      From {item.price}
                    </p>

                    <button className="inline-flex items-center gap-1 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
                      Book
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Sub-component ---
const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  price,
  duration,
  description,
  active = false,
}) => {
  const [isOpen, setIsOpen] = useState(active);

  return (
    <div
      className={`border rounded-xl bg-white overflow-hidden transition-all ${isOpen ? "ring-1 ring-[#0096a1]" : "shadow-sm hover:border-slate-300"}`}
    >
      <div className="p-5 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-slate-400 max-w-md line-clamp-2">
            {description ||
              "Classic treatment for muscle relaxation and stress relief."}
          </p>
          <span className="text-xs text-slate-400 block pt-2 underline underline-offset-4 decoration-dotted">
            {duration}
          </span>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">${price}</p>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`mt-2 ${isOpen ? "bg-[#0096a1] text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
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
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 text-center space-y-2 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-200 mx-auto border-2 border-transparent group-hover:border-[#0096a1] p-0.5 overflow-hidden transition-all">
                      <img
                        src={`https://i.pravatar.cc/150?u=s${i}`}
                        className="rounded-full w-full h-full object-cover"
                        alt="Avatar"
                      />
                    </div>
                    <p className="text-[11px] font-bold">Staff Member</p>
                    <div className="flex items-center justify-center text-[10px] text-slate-400">
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={10}
                      />{" "}
                      4.9
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;
