import Footer from "@/components/my-components/Footer";
import HomePageBanner from "@/components/my-components/HomePageBanner";
import LatestStudySessions from "@/components/my-components/LatestStudySessions";

const Home = () => {
   return (
      <div>
         <HomePageBanner />
         <LatestStudySessions />
         <Footer />
      </div>
   );
};

export default Home;
