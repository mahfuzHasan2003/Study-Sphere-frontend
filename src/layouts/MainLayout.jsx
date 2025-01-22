import NavBar from "@/components/my-components/NavBar";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
   const { pathname } = useLocation();
   useEffect(() => {
      window.scrollTo(0, 0);
   }, [pathname]);
   return (
      <div>
         <NavBar />
         <Outlet />
      </div>
   );
};

export default MainLayout;
