import Footer from "@/components/my-components/Footer";
import NavBar from "@/components/my-components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-svh flex flex-col">
      <Helmet>
        <title> Study Sphere | Home</title>
      </Helmet>
      <Toaster />
      <NavBar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
