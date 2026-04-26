"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  serviceDuration: string;
  price: number;
  description: string;
  serviceImages: string[];
  businessId: {
    _id: string;
    businessName: string;
    businessEmail: string;
  };
  businessOwnerId: {
    _id: string;
    email: string;
  };
  isFeatured: boolean;
  averageRating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Banner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedLocationTerm, setDebouncedLocationTerm] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search terms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLocationTerm(locationTerm), 400);
    return () => clearTimeout(timer);
  }, [locationTerm]);

  // Fetching data using TanStack Query
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["search-service", debouncedSearchTerm, debouncedLocationTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm && !debouncedLocationTerm) return { data: [] };

      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append("title", debouncedSearchTerm);
      if (debouncedLocationTerm)
        params.append("location", debouncedLocationTerm);

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/services?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedSearchTerm.length > 0 || debouncedLocationTerm.length > 0,
  });

  const services: Service[] = servicesData?.data || [];

  // Show popup logic
  useEffect(() => {
    if (debouncedSearchTerm || debouncedLocationTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [debouncedSearchTerm, debouncedLocationTerm]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
    setShowPopup(false);
    setSearchTerm("");
    setLocationTerm("");
  };

  return (
    <section className="relative min-h-screen flex items-center py-12 md:py-0 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/background-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
          Book Services <br />
          Near You <span className="text-[#1aa39a]">Instantly.</span>
        </h1>

        <p className="mt-6 text-white text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
          Discover top-rated professionals for beauty, fitness, and wellness.
          Real-time availability and seamless booking all in one place.
        </p>

        {/* Search Box Container */}
        <div
          ref={searchContainerRef}
          className="relative mt-10 max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl md:rounded-xl shadow-lg overflow-hidden p-2 md:p-0">
            <div className="flex items-center gap-2 px-4 h-14 w-full">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full outline-none text-gray-700 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden md:block h-8 w-[1px] bg-gray-200" />

            <div className="flex items-center gap-2 px-4 h-14 w-full">
              <MapPin className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Location or business"
                className="w-full outline-none text-gray-700 bg-transparent"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>

            <button className="h-14 w-full md:w-auto px-10 bg-[#1aa39a] text-white font-bold hover:bg-[#15857d] transition">
              Search
            </button>
          </div>

          {/* Search Results Popup */}
          {showPopup && (searchTerm || locationTerm) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-8 flex flex-col items-center">
                  <Loader2 className="animate-spin text-[#1aa39a]" size={32} />
                  <p className="mt-2 text-gray-500">Searching services...</p>
                </div>
              ) : services.length > 0 ? (
                <div>
                  <div className="sticky top-0 bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results ({services.length})
                    </span>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {services.map((service) => (
                    <Link
                      key={service._id}
                      href={`/services/${service?.businessId?._id}`}
                    >
                      <div className="p-4 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-0 transition text-left">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {service.serviceName}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {service.businessId.businessName}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                {service.category}
                              </span>
                              <span className="text-xs font-bold text-[#1aa39a] mt-1">
                                ${service.price}
                              </span>
                            </div>
                          </div>
                          {service.isFeatured && (
                            <span className="h-fit bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-gray-500 font-medium">No results found</p>
                  <p className="text-sm text-gray-400">
                    Try checking for typos or use broader terms.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#business">
            <button className="w-full sm:w-auto bg-[#1aa39a] text-white px-10 py-3.5 rounded-lg font-bold hover:scale-105 transition shadow-lg cursor-pointer">
              Book Now
            </button>
          </Link>
          <Link href="/list-your-business">
            <button className="w-full sm:w-auto border-2 border-white text-white px-10 py-3.5 rounded-lg font-bold hover:bg-white/10 transition cursor-pointer">
              Join as Business
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
