import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export const useFetchForGet = (keys, url, options = {}) => {
   const axiosPublic = useAxiosPublic();
   const fetchData = async () => {
      const response = await axiosPublic.get(url);
      return response.data;
   };

   return useQuery({
      queryKey: keys,
      queryFn: fetchData,
      ...options,
   });
};
