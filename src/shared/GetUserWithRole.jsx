import useAuth from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useEffect, useState } from "react";

const GetUserWithRole = () => {
   const axiosPublic = useAxiosPublic();
   const { user } = useAuth();
   const [role, setRole] = useState(null);
   // TODO: make some update here
   useEffect(() => {
      const fetchUserRole = async () => {
         if (user?.email) {
            const { data } = await axiosPublic.get(
               `/get-user-role?email=${user?.email}`
            );
            setRole(data);
         }
      };
      fetchUserRole();
   }, [axiosPublic, user?.email]);

   return role;
};

export default GetUserWithRole;
