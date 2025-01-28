import useAuth from "@/hooks/useAuth";
import { useFetchForGet } from "@/hooks/useFetchForGet";

const GetUserWithRole = () => {
   const { user, authLoading: isAuthLoading } = useAuth();
   const { data: userDetails = {}, isLoading: isRoleLoading } = useFetchForGet(
      "secure",
      ["fetchUserRole", user?.email],
      `/get-user-with-role?email=${user?.email}`,
      { enabled: !!user?.email }
   );
   return { ...userDetails, isRoleLoading, isAuthLoading };
};

export default GetUserWithRole;
