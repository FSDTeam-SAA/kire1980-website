"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

// Fetch function
const fetchStaffStats = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/businesses/dashboard/staff-management-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch staff stats");
  }

  const json = await res.json();
  console.log(json);
  return json?.data;
};

export default function StaffStats() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  // Pass a function to queryFn instead of calling it
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff-stats"],
    queryFn: () => fetchStaffStats(token),
    enabled: !!token, // only fetch if token exists
  });

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p>Failed to load statistics</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">
            Total Staff
          </CardTitle>
          <Users className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.totalStaff}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">
            Currently On Duty
          </CardTitle>
          <UserCheck className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.currentlyOnDuty}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">
            Booked Today
          </CardTitle>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.totalBookedToday}</p>
        </CardContent>
      </Card>
    </div>
  );
}
