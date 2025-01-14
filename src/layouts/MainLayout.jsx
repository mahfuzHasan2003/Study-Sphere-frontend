import NavBar from "@/components/my-components/NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
   return (
      <div className='px-5'>
         <NavBar />
         <Outlet />
      </div>
   );
};

export default MainLayout;
