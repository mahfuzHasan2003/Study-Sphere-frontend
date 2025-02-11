import axios from "axios";
const instance = axios.create({
  baseURL: "https://study-sphere-backend-phi.vercel.app",
});
const useAxiosPublic = () => {
  return instance;
};

export default useAxiosPublic;
