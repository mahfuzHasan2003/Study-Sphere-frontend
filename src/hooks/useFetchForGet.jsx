import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

export const useFetchForGet = (
   privacyType = "public",
   keys,
   url,
   options = {}
) => {
   const axiosPublic = useAxiosPublic();
   const axiosSecure = useAxiosSecure();
   const axiosModified = privacyType === "secure" ? axiosSecure : axiosPublic;
   const fetchData = async () => {
      const response = await axiosModified.get(url);
      return response.data;
   };

   return useQuery({
      queryKey: keys,
      queryFn: fetchData,
      ...options,
   });
};
