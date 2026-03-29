import React from "react";
import {
  Star,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from "lucide-react";

const reviews = [
  {
    name: "Sarah Jenkins",
    service: "Beauty - Hair",
    staff: "Senior Stylist",
    rating: 4,
    review: "Expressing creativity thr...",
  },
  {
    name: "Michael Thompson",
    service: "Beauty - Skin",
    staff: "Skincare Specialist",
    rating: 4,
    review: "Passionate about holisti...",
  },
  {
    name: "Emily Clark",
    service: "Beauty - Makeup",
    staff: "Makeup Artist",
    rating: 4,
    review: "Transforming looks with...",
  },
  {
    name: "James Rodriguez",
    service: "Beauty - Hair",
    staff: "Junior Stylist",
    rating: 4,
    review: "Eager to learn and mast...",
  },
  {
    name: "Sophia Turner",
    service: "Beauty - Nails",
    staff: "Nail Technician",
    rating: 4,
    review: "Creating intricate nail ar...",
  },
  {
    name: "Isabella Martinez",
    service: "Beauty - Makeup",
    staff: "Freelance Artist",
    rating: 4,
    review: "Focusing on bridal make...",
  },
  {
    name: "Liam Harris",
    service: "Beauty - Hair",
    staff: "Barber",
    rating: 4,
    review: "Blending classic and mo...",
  },
  {
    name: "Olivia Wilson",
    service: "Beauty - Skin",
    staff: "Aesthetician",
    rating: 4,
    review: "Dedicated to enhancing...",
  },
  {
    name: "Emma Scott",
    service: "Beauty - Nails",
    staff: "Nail Designer",
    rating: 4,
    review: "Innovating with eco-frie...",
  },
  {
    name: "Noah Lewis",
    service: "Beauty - Hair",
    staff: "Senior Colorist",
    rating: 4,
    review: "Expert in color transfor...",
  },
  {
    name: "Ava Young",
    service: "Beauty - Makeup",
    staff: "Makeup Educator",
    rating: 4,
    review: "Sharing knowledge and...",
  },
];

const ratingsDistribution = [
  { stars: 5, percentage: 85, count: "1,092", color: "bg-[#00A3A3]" },
  { stars: 4, percentage: 10, count: "128", color: "bg-blue-400" },
  { stars: 3, percentage: 3, count: "38", color: "bg-yellow-400" },
  { stars: 2, percentage: 1.5, count: "19", color: "bg-orange-400" },
  { stars: 1, percentage: 0.5, count: "7", color: "bg-red-400" },
];

export default function ReviewsRatings() {
  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <span>Dashboard</span> <ChevronRight size={12} />{" "}
        <span className="text-gray-600">Reviews & Ratings</span>
      </div>
      <h1 className="text-2xl font-bold text-[#1A2D2D] mb-8">
        Reviews & Ratings
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Reviews",
            value: "1282",
            trend: "+12%",
            icon: <MessageSquare size={18} />,
          },
          {
            label: "Avg. Rating",
            value: "4.9/5.0",
            trend: "Static",
            icon: <Star size={18} />,
          },
          {
            label: "Positive Reviews",
            value: "1,482",
            trend: "+12%",
            icon: <ThumbsUp size={18} />,
          },
          {
            label: "Negative Reviews",
            value: "50",
            trend: "+12%",
            icon: <ThumbsDown size={18} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                {stat.icon}
              </div>
              <span
                className={`text-[10px] font-bold ${stat.trend === "Static" ? "text-gray-300 bg-gray-50" : "text-[#00A3A3] bg-[#E6F6F4]"} px-2 py-0.5 rounded-full`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-base">
              Recent Customer Reviews
            </h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-50">
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#D1EAEA] overflow-hidden">
                        <div className="bg-[#4EA5A5] w-full h-full opacity-70" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.service}</td>
                  <td className="px-6 py-4 text-gray-500">{item.staff}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < item.rating
                              ? "fill-orange-400 text-orange-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 italic">
                    {item.review}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#00A3A3] hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar: Ratings Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <h3 className="font-bold text-gray-800 text-sm self-start mb-6">
            Ratings Overview
          </h3>

          <div className="w-full space-y-4 mb-10">
            {ratingsDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1 w-4">
                  {item.stars}{" "}
                  <Star size={10} className="fill-orange-400 text-orange-400" />
                </span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-16 text-right">
                  {item.percentage}% ({item.count})
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-5xl font-black text-gray-800 mb-2">4.8</p>
            <div className="flex gap-1 justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < 4
                      ? "fill-orange-400 text-orange-400"
                      : "fill-orange-400/30 text-orange-400/30"
                  }
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Global Satisfaction Score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
