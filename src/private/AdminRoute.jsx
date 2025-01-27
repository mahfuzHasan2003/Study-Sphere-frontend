import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import DashboardLoading from "@/pages/Dashboard/DashboardLoading";
import GetUserWithRole from "@/shared/GetUserWithRole";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
   const { userRole, isRoleLoading } = GetUserWithRole();
   const { user, authLoading, signOutUser } = useAuth();
   if (isRoleLoading || authLoading) {
      return <DashboardLoading />;
   }

   if (!user || userRole !== "admin") {
      signOutUser().then(() => {
         toast({
            variant: "warning",
            description:
               "please!!🙏 please brother, no illegal operation please. 😭",
         });
      });
      return <Navigate to='/auth/signin' />;
   }
   return children;
};

export default AdminRoute;
