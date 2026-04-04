"use client";
import { useState } from "react";
import {
  Star,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface Review {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  businessId: {
    _id: string;
    businessName: string;
  };
  serviceId: {
    _id: string;
    serviceName: string;
  };
  rating: number;
  review: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Review[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

const fetchReviews = async (token: string): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

const deleteReview = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }

  return response.json();
};

// Loading Skeletons
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
      >
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-24" />
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-50">
      <Skeleton className="h-7 w-48" />
    </div>
    <div className="divide-y divide-gray-50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <Skeleton className="h-6 w-32 mb-6" />
    <div className="space-y-4 mb-10">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="flex-1 h-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
    <div className="text-center">
      <Skeleton className="h-14 w-20 mx-auto mb-2" />
      <Skeleton className="h-8 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  </div>
);

// Delete Confirmation Modal
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReviewsRatings() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => fetchReviews(token as string),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setDeleteModalOpen(false);
      setSelectedReviewId(null);
    },
  });

  const reviews = data?.data?.data || [];
  const totalReviews = data?.data?.meta?.total || 0;

  // Calculate everything from actual data
  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        avgRating: 0,
        positiveCount: 0,
        negativeCount: 0,
        distribution: [
          { stars: 5, percentage: 0, count: 0, color: "bg-[#00A3A3]" },
          { stars: 4, percentage: 0, count: 0, color: "bg-blue-400" },
          { stars: 3, percentage: 0, count: 0, color: "bg-yellow-400" },
          { stars: 2, percentage: 0, count: 0, color: "bg-orange-400" },
          { stars: 1, percentage: 0, count: 0, color: "bg-red-400" },
        ],
      };
    }

    const total = reviews.length;
    const sumRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = sumRatings / total;

    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const negativeCount = reviews.filter((r) => r.rating <= 2).length;

    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      const colors = {
        5: "bg-[#00A3A3]",
        4: "bg-blue-400",
        3: "bg-yellow-400",
        2: "bg-orange-400",
        1: "bg-red-400",
      };
      return {
        stars,
        percentage,
        count,
        color: colors[stars as keyof typeof colors],
      };
    });

    return { avgRating, positiveCount, negativeCount, distribution };
  };

  const stats = calculateStats();

  const handleDeleteClick = (id: string) => {
    setSelectedReviewId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedReviewId) {
      deleteMutation.mutate({ id: selectedReviewId, token: token as string });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-red-500 mb-4 text-base">Failed to load reviews</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00A3A3] text-white rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedReviewId(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />

      <div className="min-h-screen bg-[#F0F7F7]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Dashboard</span> <ChevronRight size={14} />{" "}
          <span className="text-gray-600">Reviews & Ratings</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1A2D2D] mb-8">
          Reviews & Ratings
        </h1>

        {isLoading ? (
          <>
            <StatsSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <TableSkeleton />
              <SidebarSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards - All dynamic from API */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Reviews",
                  value: totalReviews.toLocaleString(),
                  icon: <MessageSquare size={20} />,
                },
                {
                  label: "Avg. Rating",
                  value: `${stats.avgRating.toFixed(1)}/5.0`,
                  icon: <Star size={20} />,
                },
                {
                  label: "Positive Reviews",
                  value: stats.positiveCount.toLocaleString(),
                  icon: <ThumbsUp size={20} />,
                },
                {
                  label: "Negative Reviews",
                  value: stats.negativeCount.toLocaleString(),
                  icon: <ThumbsDown size={20} />,
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
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Table Section */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Recent Customer Reviews
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-gray-400 border-b border-gray-50">
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Business</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Review</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reviews.map((review) => (
                        <tr
                          key={review._id}
                          className="text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#D1EAEA] flex items-center justify-center">
                                <span className="text-[#4EA5A5] font-semibold text-sm">
                                  {review.userId.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium">
                                {review.userId.email.split("@")[0]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {review.serviceId.serviceName}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {review.businessId.businessName}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "fill-orange-400 text-orange-400"
                                      : "text-gray-200"
                                  }
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs">
                            <div className="truncate" title={review.review}>
                              {review.review.length > 50
                                ? `${review.review.substring(0, 50)}...`
                                : review.review}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {formatDate(review.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteClick(review._id)}
                              disabled={deleteMutation.isPending}
                              className="text-[#00A3A3] hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reviews.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      No reviews found
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar: Ratings Overview - All dynamic from API */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                <h3 className="font-bold text-gray-800 text-base self-start mb-6">
                  Ratings Overview
                </h3>

                <div className="w-full space-y-4 mb-10">
                  {stats.distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-600 flex items-center gap-1 w-6">
                        {item.stars}{" "}
                        <Star
                          size={12}
                          className="fill-orange-400 text-orange-400"
                        />
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-20 text-right">
                        {item.percentage.toFixed(1)}% ({item.count})
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-6xl font-black text-gray-800 mb-2">
                    {stats.avgRating.toFixed(1)}
                  </p>
                  <div className="flex gap-1 justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={
                          i < Math.floor(stats.avgRating)
                            ? "fill-orange-400 text-orange-400"
                            : i < stats.avgRating
                              ? "fill-orange-400/50 text-orange-400/50"
                              : "fill-orange-400/30 text-orange-400/30"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                    Based on {totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
