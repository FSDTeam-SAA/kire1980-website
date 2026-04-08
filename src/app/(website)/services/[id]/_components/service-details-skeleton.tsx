import { Skeleton } from "@/components/ui/skeleton";

export const ServiceDetailsSkeleton = () => {
  const containerClasses = "container mx-auto px-4 md:px-6";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Skeleton */}
      <div className="relative h-72 w-full bg-slate-200 animate-pulse" />

      <div className={`${containerClasses} -mt-12 relative z-10`}>
        {/* Header Card Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <Skeleton className="h-7 w-48 mt-1" />
                <div className="flex items-center gap-1 mt-1">
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-8 border-b mt-6">
          {["Services", "Staff", "Reviews", "Gallery", "About"].map(
            (tab, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ),
          )}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Services Header Skeleton */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-64 rounded-lg" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-xl bg-white p-5">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20 mt-2 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Meet the Team Skeleton */}
            <section>
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white border p-4 rounded-xl text-center"
                  >
                    <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto mt-2" />
                    <Skeleton className="h-3 w-20 mx-auto mt-1" />
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Skeleton */}
            <section>
              <Skeleton className="h-8 w-32 mb-6" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 bg-white border rounded-xl p-6 shadow-sm">
              <Skeleton className="h-7 w-32 mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <hr />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
