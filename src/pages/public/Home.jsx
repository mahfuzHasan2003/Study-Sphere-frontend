import HomePageBanner from "@/components/my-components/HomePageBanner";
import FeaturedSessions from "@/components/my-components/FeaturedSessions";
import TutorSection from "@/components/my-components/TutorSection";
import OngoingSessions from "@/components/my-components/OngoingSessions";
import WhyStudySphere from "@/components/my-components/WhyStudySphere";
import NewsletterSection from "@/components/my-components/NewsletterSection";

const Home = () => {
  return (
    <div className="mt-5 md:mt-8 md:space-y-5">
      <HomePageBanner />
      <FeaturedSessions />
      <OngoingSessions />
      <WhyStudySphere />
      <TutorSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
