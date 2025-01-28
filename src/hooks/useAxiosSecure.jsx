import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
const axiosSecure = axios.create({
   baseURL: "https://study-sphere-backend-phi.vercel.app",
});
const useAxiosSecure = () => {
   const navigate = useNavigate();
   const { signOutUser } = useAuth();
   axiosSecure.interceptors.request.use(
      function (config) {
         const token = localStorage.getItem("access_token");
         config.headers.authorization = `Bearer ${token}`;
         return config;
      },
      function (err) {
         return Promise.reject(err);
      }
   );

   // for 401 and 403 responses
   axiosSecure.interceptors.response.use(
      function (response) {
         return response;
      },
      async function (err) {
         if (err.response?.status === 401 || err.response?.status === 403) {
            await signOutUser();
            navigate("/auth/signin");
         }
         return Promise.reject(err);
      }
   );
   return axiosSecure;
};

export default useAxiosSecure;
