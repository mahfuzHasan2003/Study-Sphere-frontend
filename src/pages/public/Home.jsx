import HomePageBanner from "@/components/my-components/HomePageBanner";
import LatestStudySessions from "@/components/my-components/LatestStudySessions";

const Home = () => {
   return (
      <div className='my-5 md:my-10'>
         <HomePageBanner />
         <LatestStudySessions />
      </div>
   );
};

export default Home;
