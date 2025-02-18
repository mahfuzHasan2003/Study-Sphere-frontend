import HomePageBanner from "@/components/my-components/HomePageBanner";
import FeaturedSessions from "@/components/my-components/FeaturedSessions";
import TutorSection from "@/components/my-components/TutorSection";
import OngoingSessions from "@/components/my-components/OngoingSessions";

const Home = () => {
  return (
    <div className="my-5 md:my-10">
      <HomePageBanner />
      <FeaturedSessions />
      <OngoingSessions />
      <TutorSection />
    </div>
  );
};

export default Home;
