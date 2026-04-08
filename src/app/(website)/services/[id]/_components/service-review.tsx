"use client";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface SelectedService {
  id: string;
  name: string;
  description: string;
  professional: {
    name: string;
    image: string;
  };
  duration: string;
  date: string;
  price: number;
}

const ServiceReview = () => {
  const selectedServices: SelectedService[] = [
    {
      id: "1",
      name: "Signature Haircut & Style",
      description: "Includes wash and blow-dry",
      professional: {
        name: "Sarah Jenkins",
        image: "https://i.pravatar.cc/150?u=sarah",
      },
      duration: "45 mins",
      date: "19 May 2026 1:00 pm",
      price: 85.0,
    },
    {
      id: "2",
      name: "Signature Haircut & Style",
      description: "Includes wash and blow-dry",
      professional: {
        name: "Sarah Jenkins",
        image: "https://i.pravatar.cc/150?u=sarah",
      },
      duration: "45 mins",
      date: "19 May 2026 1:00 pm",
      price: 85.0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      {/* Container with mx-auto and max-width for clear layout */}
      <div className="max-w-[700px] mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-[#1e293b] mb-8">
          Review Your Booking
        </h1>

        {/* Studio Info Card */}
        <div className="bg-[#f0f9f9] border border-slate-100 rounded-2xl p-6 mb-6 flex gap-5">
          <div className="w-32 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <Image
              src="/images/logo1.png"
              alt="Lumina Wellness Spa"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              Lumina Wellness Spa
            </h2>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <MapPin size={14} className="text-[#0096a1]" />
              <span>128 Market St, San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                  }
                />
              ))}
              <span className="text-sm font-bold ml-1 text-slate-600">4.5</span>
            </div>
          </div>
        </div>

        {/* Services Selection List */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm mb-8">
          <h3 className="text-xl font-serif font-semibold text-slate-700 mb-6">
            Services Selected
          </h3>

          <div className="space-y-8">
            {selectedServices.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <span className="font-bold text-slate-800">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={item.professional.image}
                    className="w-6 h-6 rounded-full"
                    alt={item.professional.name}
                  />
                  <span className="text-sm text-slate-600 font-medium">
                    {item.professional.name}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 border rounded-lg text-[11px] text-slate-500 font-medium">
                    <Clock size={12} /> {item.duration}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 border rounded-lg text-[11px] text-slate-500 font-medium">
                    <Calendar size={12} /> {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t flex justify-between items-center">
            <span className="text-2xl font-bold text-slate-800 font-serif">
              Total
            </span>
            <span className="text-2xl font-bold text-[#0096a1]">$132.70</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-7 border-[#0096a1] text-[#0096a1] hover:bg-slate-50 font-bold rounded-xl"
          >
            Edit Booking
          </Button>
          <Link href={`/services/adfasdf/payment-method`}>
            <Button className="flex-1 py-7 bg-[#0096a1] hover:bg-[#007a83] text-white font-bold rounded-xl shadow-lg shadow-[#0096a1]/20">
              Confirm Booking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceReview;
