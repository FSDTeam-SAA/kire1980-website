import Banner from "@/features/Home/components/Banner";
import EverythingYouNeed from "@/features/Home/components/EverythingYouNeed";
import ExploreByCategory from "@/features/Home/components/ExploreByCategory";
import WhyCustomers from "@/features/Home/components/WhyCustomers";

export default function page() {
  return (
    <main className="relative bg-white">
      <Banner />
      <WhyCustomers />
      <ExploreByCategory />
      <EverythingYouNeed />
    </main>
  );
}
