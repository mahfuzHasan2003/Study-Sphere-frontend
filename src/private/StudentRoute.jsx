import useAuth from "@/hooks/useAuth";
import DashboardLoading from "@/pages/Dashboard/DashboardLoading";
import GetUserWithRole from "@/shared/GetUserWithRole";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
   const { userRole, isRoleLoading } = GetUserWithRole();
   const { user, authLoading, signOutUser } = useAuth();
   if (isRoleLoading || authLoading) {
      return <DashboardLoading />;
   }
   if (!user || userRole !== "student") {
      signOutUser();
      return <Navigate to='/auth/signin' />;
   }
   return children;
};

export default StudentRoute;
