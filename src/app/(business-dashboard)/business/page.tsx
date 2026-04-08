import React from "react";
import { DashboardStats } from "./_components/home/DashboardStats";
import { BookingChart } from "./_components/home/BookingChart";
import UpcomingAppointments from "./_components/home/UpcomingAppointments";

const page = () => {
  return (
    <div className="space-y-[24px]">
      <DashboardStats />
      <BookingChart />
      <UpcomingAppointments />
    </div>
  );
};

export default page;
