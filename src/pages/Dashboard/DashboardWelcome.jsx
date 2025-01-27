import dashboardWelcomeAnimation from "@/assets/Dashboard-welcome.json";
import GetUserWithRole from "@/shared/GetUserWithRole";
import Lottie from "lottie-react";
const DashboardWelcome = () => {
   const { userRole = "", userName = "Anonymous" } = GetUserWithRole();
   return (
      <div className='h-full grid place-items-center'>
         <div className='text-center space-y-2'>
            <Lottie
               animationData={dashboardWelcomeAnimation}
               loop={true}
               style={{ width: "50%", margin: "0 auto" }}
            />
            <h2 className='text-2xl font-bold'>
               Hey,{" "}
               <span className='text-muted-foreground font-semibold'>
                  {userName}
               </span>
            </h2>
            <p className='text-muted-foreground'>
               Let's explore your{" "}
               <span className='font-semibold'>{userRole}</span> dashboard
            </p>
         </div>
      </div>
   );
};

export default DashboardWelcome;
