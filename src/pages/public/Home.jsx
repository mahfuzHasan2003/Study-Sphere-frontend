import HomePageBanner from "@/components/my-components/HomePageBanner";
import LatestStudySessions from "@/components/my-components/LatestStudySessions";
import TutorSection from "@/components/my-components/TutorSection";

const Home = () => {
   return (
      <div className='my-5 md:my-10'>
         <HomePageBanner />
         <LatestStudySessions />
         <TutorSection />
      </div>
   );
};

export default Home;
