// 'use client'

// import * as React from 'react'
// import Image from 'next/image'
// import { MapPin, Star, Trash2, Heart } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { useQuery } from '@tanstack/react-query'
// import { useSession } from 'next-auth/react'
// import { WishlistResponse } from '@/types/wishlistDataType'

// const WishlistComponent = () => {
//   const { data: session } = useSession()
//   const token = session?.user?.accessToken || ''

//   const { data, isLoading } = useQuery<WishlistResponse>({
//     queryKey: ['user-wishlist'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlists/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (!res.ok) throw new Error('Failed to fetch wishlist')
//       return res.json()
//     },
//     enabled: !!token,
//   })

//   const handleRemove = (id: string) => {
//     console.log(`Removing item ${id} from wishlist`)
//   }

//   const handleBook = (id: string) => {
//     console.log(`Booking item ${id}`)
//   }

//   if (isLoading) return <p>Loading wishlist...</p>

//   return (
//     <div className="p-6 space-y-6 min-h-screen">
//       <header className="space-y-1">
//         <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">My Wishlist</h1>
//         <p className="text-muted-foreground text-sm md:text-base">
//           Manage your favorite businesses for quick booking.
//         </p>
//       </header>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data?.data?.map((item) => {
//           const business = item.businessId
//           const imageUrl = business?.gallery?.[0]?.url || '/spa-image.jpg'

//           return (
//             <Card key={item._id} className="border-none shadow-sm rounded-2xl overflow-hidden group">
//               <CardContent className="p-3 space-y-4">
//                 {/* Image */}
//                 <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
//                   <Image
//                     src={imageUrl}
//                     alt={business.businessName}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                   {/* Heart Overlay */}
//                   <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm">
//                     <Heart className="w-5 h-5 text-red-500 fill-red-500" />
//                   </div>
//                 </div>

//                 {/* Text Info */}
//                 <div className="px-1 space-y-1.5">
//                   <h3 className="text-lg font-bold text-[#1a1a1a]">{business.businessName}</h3>
//                   <div className="flex items-center text-muted-foreground gap-1 text-sm">
//                     <MapPin className="w-4 h-4" />
//                     <span>
//                       {business.city}, {business.country}
//                     </span>
//                   </div>
//                   <p className="text-muted-foreground text-sm">{business.description}</p>
//                 </div>

//                 {/* Booking Info */}
//                 <div className="px-1 flex items-center justify-between">
//                   <div className="text-xl font-bold text-[#1a1a1a]">
//                     Staff: <span className="text-[#1a1a1a]">{business.totalStaff}</span>
//                   </div>
//                   <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
//                     <Star className="w-5 h-5 fill-amber-500" />
//                     {business.reviews?.length || 0}
//                   </div>
//                 </div>
//               </CardContent>

//               <CardFooter className="p-3 pt-0 flex gap-2">
//                 <Button
//                   onClick={() => handleBook(item._id)}
//                   className="flex-1 bg-[#14a39a] hover:bg-[#0f8a82] text-white font-semibold h-11 rounded-lg"
//                 >
//                   Book Now
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => handleRemove(item._id)}
//                   className="border-[#14a39a] text-[#14a39a] hover:bg-teal-50 h-11 w-11 shrink-0 rounded-lg"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default WishlistComponent

"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Star, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { WishlistResponse } from "@/types/wishlistDataType";

const WishlistComponent = () => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const queryClient = useQueryClient();

  // Fetch Wishlist
  const { data, isLoading } = useQuery<WishlistResponse>({
    queryKey: ["user-wishlist"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlists/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
    enabled: !!token,
  });

  // Mutation for Removing Wishlist Item
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlists/business/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to remove item");
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["user-wishlist"] });
      const previousData = queryClient.getQueryData<WishlistResponse>([
        "user-wishlist",
      ]);
      if (previousData) {
        queryClient.setQueryData<WishlistResponse>(["user-wishlist"], {
          ...previousData,
          data: previousData.data.filter((item) => item._id !== id),
        });
      }
      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["user-wishlist"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-wishlist"] });
    },
  });

  const handleRemove = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleBook = (id: string) => {
    console.log(`Booking item ${id}`);
  };

  if (isLoading) return <p>Loading wishlist...</p>;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
          My Wishlist
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your favorite businesses for quick booking.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((item) => {
          const business = item.businessId;
          const imageUrl = business?.gallery?.[0]?.url || "/spa-image.jpg";

          return (
            <Card
              key={item._id}
              className="border-none shadow-sm rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-3 space-y-4">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={business.businessName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Heart Overlay */}
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                </div>

                {/* Text Info */}
                <div className="px-1 space-y-1.5">
                  <h3 className="text-lg font-bold text-[#1a1a1a]">
                    {business.businessName}
                  </h3>
                  <div className="flex items-center text-muted-foreground gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {business.city}, {business.country}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {business.description}
                  </p>
                </div>

                {/* Booking Info */}
                <div className="px-1 flex items-center justify-between">
                  <div className="text-xl font-bold text-[#1a1a1a]">
                    Staff:{" "}
                    <span className="text-[#1a1a1a]">
                      {business.totalStaff}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                    <Star className="w-5 h-5 fill-amber-500" />
                    {business.reviews?.length || 0}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 flex gap-2">
                <Button
                  onClick={() => handleBook(item._id)}
                  className="flex-1 bg-[#14a39a] hover:bg-[#0f8a82] text-white font-semibold h-11 rounded-lg"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(item.businessId._id)}
                  className="border-[#14a39a] text-[#14a39a] hover:bg-teal-50 h-11 w-11 shrink-0 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistComponent;
