"use client";
import AfterLOginComponent from "@/features/Home/components/AfterLOginComponent";
import Banner from "@/features/Home/components/Banner";
import EverythingYouNeed from "@/features/Home/components/EverythingYouNeed";
import ExploreByCategory from "@/features/Home/components/ExploreByCategory";
import GetIntouch from "@/features/Home/components/GetIntouch";
import GrowYourBusiness from "@/features/Home/components/GrowYourBusiness";
import HowItWorks from "@/features/Home/components/HowItWorks";
import OnlineBooking from "@/features/Home/components/OnlineBooking";
import RealPeople from "@/features/Home/components/RealPeople";
import WhyCustomers from "@/features/Home/components/WhyCustomers";
import { useSession } from "next-auth/react";
import TopRatedNearYou from "./TopRatedNearYou";

export default function MainPage() {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  return (
    <main className="relative bg-white">
      <Banner />
      {!isAuthenticated && <WhyCustomers />}

      {!isAuthenticated && <EverythingYouNeed />}
      {!isAuthenticated && <ExploreByCategory />}
      {!isAuthenticated && <TopRatedNearYou />}
      {isAuthenticated && <AfterLOginComponent />}
      <HowItWorks />
      <GrowYourBusiness />
      <RealPeople />
      <OnlineBooking />
      <GetIntouch />
    </main>
  );
}
