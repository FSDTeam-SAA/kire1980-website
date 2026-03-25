import Banner from "@/features/Home/components/Banner";
import EverythingYouNeed from "@/features/Home/components/EverythingYouNeed";
import ExploreByCategory from "@/features/Home/components/ExploreByCategory";
import GetIntouch from "@/features/Home/components/GetIntouch";
import GrowYourBusiness from "@/features/Home/components/GrowYourBusiness";
import HowItWorks from "@/features/Home/components/HowItWorks";
import OnlineBooking from "@/features/Home/components/OnlineBooking";
import RealPeople from "@/features/Home/components/RealPeople";
import TopRatedNearYou from "@/features/Home/components/TopRatedNearYou";
import WhyCustomers from "@/features/Home/components/WhyCustomers";

export default function page() {
  return (
    <main className="relative bg-white">
      <Banner />
      <WhyCustomers />
      <ExploreByCategory />
      <EverythingYouNeed />
      <TopRatedNearYou />
      <HowItWorks />
      <GrowYourBusiness />
      <RealPeople />
      <OnlineBooking />
      <GetIntouch />
    </main>
  );
}
