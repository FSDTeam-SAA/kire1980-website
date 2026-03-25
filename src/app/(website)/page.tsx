import Banner from "@/features/Home/components/Banner";
import EverythingYouNeed from "@/features/Home/components/EverythingYouNeed";
import ExploreByCategory from "@/features/Home/components/ExploreByCategory";
import HowItWorks from "@/features/Home/components/HowItWorks";
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
    </main>
  );
}
