import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useTutorSessionsData = ({ status }) => {
   const { user } = useAuth();
   const axiosPublic = useAxiosPublic();

   const { data: tutorSessions } = useQuery({
      queryKey: ["tutorsessions", status, user],
      queryFn: async () => {
         const { data } = await axiosPublic.get(
            `/tutor-study-sessions?email=${user.email}&status=${status}`
         );
         return data;
      },
   });
   return tutorSessions;
};

export default useTutorSessionsData;
