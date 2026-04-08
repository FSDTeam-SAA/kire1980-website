// "use client";

// import Image from "next/image";
// import { ArrowRight, Star, ChevronRight } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";

// interface Gallery {
//   url: string;
// }

// interface Business {
//   _id: string;
//   businessName: string;
//   businessCategory: string;
//   description: string;
//   gallery: Gallery[];
// }

// const fetchBusinesses = async (): Promise<Business[]> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses`);
//   const data = await res.json();
//   return data.data;
// };

// export default function TopRatedNearYou() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["businesses"],
//     queryFn: fetchBusinesses,
//   });

//   if (isLoading) {
//     return <p className="text-center py-10">Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-center py-10">Something went wrong</p>;
//   }

//   console.log(data)
//   return (
//     <section className="bg-[#f8fbfa] py-16 md:py-24">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//           <div>
//             <h2 className="text-3xl font-bold text-[#1f2937] md:text-5xl">
//               Top Rated Near You
//             </h2>
//             <p className="mt-2 text-base text-[#6b7280] md:text-lg">
//               Highly recommended by your community.
//             </p>
//           </div>

//           <button className="inline-flex items-center gap-2 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
//             View all
//             <ArrowRight className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
//           {data?.map((item) => (
//             <div
//               key={item._id}
//               className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//             >
//               {/* Image */}
//               <div className="relative h-[220px] w-full overflow-hidden">
//                 <Image
//                   src={item.gallery?.[0]?.url || "/images/Beauty.png"}
//                   alt={item.businessName}
//                   fill
//                   className="object-cover"
//                 />

//                 {/* Rating (static because API has no rating) */}
//                 <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
//                   <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
//                   <span className="text-xs font-semibold text-[#1f2937]">
//                     4.8
//                   </span>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 <p className="text-sm font-medium text-[#ff5a7a]">
//                   {item.businessCategory}
//                 </p>

//                 <h3 className="mt-1 text-2xl font-semibold text-[#1f2937]">
//                   {item.businessName}
//                 </h3>

//                 <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#6b7280] md:text-base">
//                   {item.description}
//                 </p>

//                 <div className="mt-5 flex items-center justify-between border-t border-[#e7efee] pt-4">
//                   <Link href={`/`}>
//                     <button className="inline-flex items-center gap-1 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
//                       Book
//                       <ChevronRight className="h-4 w-4" />
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Gallery {
  url: string;
}

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  description: string;
  status: string;
  gallery: Gallery[];
}

const fetchBusinesses = async (): Promise<Business[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses`);
  const data = await res.json();
  // return only activated businesses
  return data.data.items.filter(
    (item: Business) => item.status === "activated",
  );
};

export default function TopRatedNearYou() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-10">Something went wrong</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center py-10">No businesses found</p>;
  }

  return (
    <section className="bg-[#f8fbfa] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1f2937] md:text-5xl">
              Top Rated Near You
            </h2>
            <p className="mt-2 text-base text-[#6b7280] md:text-lg">
              Highly recommended by your community.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a]">
            View all
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {data.slice(0, 8).map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-[#dce6e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-[220px] w-full overflow-hidden">
                <Image
                  src={item.gallery?.[0]?.url || "/images/Beauty.png"}
                  alt={item.businessName}
                  fill
                  sizes="(max-width:768px) 100vw, 25vw"
                  className="object-cover"
                />

                {/* Rating (static because API has no rating) */}
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                  <span className="text-xs font-semibold text-[#1f2937]">
                    4.8
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm font-medium text-[#ff5a7a]">
                  {item.businessCategory}
                </p>

                <h3 className="mt-1 text-2xl font-semibold text-[#1f2937]">
                  {item.businessName}
                </h3>

                <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#6b7280] md:text-base">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#e7efee] pt-4">
                  <Link href={`/services/${item?._id}`}>
                    <button className="inline-flex items-center gap-1 text-lg font-medium text-[#1f2937] transition hover:text-[#1aa39a] cursor-pointer">
                      Book
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
