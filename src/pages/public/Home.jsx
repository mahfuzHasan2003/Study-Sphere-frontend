import FeaturedSessions from "@/components/my-components/FeaturedSessions";
import TutorSection from "@/components/my-components/TutorSection";
import OngoingSessions from "@/components/my-components/OngoingSessions";
import WhyStudySphere from "@/components/my-components/WhyStudySphere";
import NewsletterSection from "@/components/my-components/NewsletterSection";
import HomeSlider from "@/components/my-components/HomeSlider";

const Home = () => {
  return (
    <div className="md:mt-5">
      <HomeSlider />
      <FeaturedSessions />
      <OngoingSessions />
      <WhyStudySphere />
      <TutorSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
