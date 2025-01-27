import Lottie from "lottie-react";
import dashboardLoadingAnimation from "@/assets/loading-animation.json";

const DashboardLoading = () => {
   return (
      <div className='h-full grid place-items-center'>
         <Lottie
            animationData={dashboardLoadingAnimation}
            loop={true}
            style={{ width: "300px", height: "300px" }}
         />
      </div>
   );
};

export default DashboardLoading;
