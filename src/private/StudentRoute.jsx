import GetUserWithRole from "@/shared/GetUserWithRole";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
   const { userRole, isRoleLoading, isAuthLoading } = GetUserWithRole();
   if (isRoleLoading || isAuthLoading) {
      // TODO: use loader here
      return <p>loading ...</p>;
   }
   return userRole === "student" ? children : <Navigate to='/auth/signin' />;
};

export default StudentRoute;
