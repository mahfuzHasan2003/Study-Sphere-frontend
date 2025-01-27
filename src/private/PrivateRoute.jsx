import useAuth from "@/hooks/useAuth";
import DashboardLoading from "@/pages/Dashboard/DashboardLoading";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
   const { user, authLoading } = useAuth();
   if (authLoading) {
      return <DashboardLoading />;
   }
   if (!user) {
      return <Navigate to='/auth/signin' />;
   }
   return children;
};

export default PrivateRoute;
