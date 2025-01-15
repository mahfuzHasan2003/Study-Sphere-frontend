import { Divider } from "./Divider";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const SocialLogin = () => {
   const { signInWithGoogle } = useAuth();
   const { toast } = useToast();
   const navigate = useNavigate();
   const axiosPublic = useAxiosPublic();

   return (
      <div>
         <Divider text='OR' />
         <div className='text-center'>
            <h3 className='font-semibold text-lg'>
               Continue with social accounts
            </h3>
            <div className='flex gap-3 justify-center mt-3'>
               <Button
                  variant='outline'
                  size='iconLG'
                  onClick={() => {
                     signInWithGoogle()
                        .then((result) => {
                           toast({
                              variant: "success",
                              description: "Login Successful",
                           });
                           navigate("/");
                           axiosPublic.post("/post-user?social=true", {
                              userName: result.user.displayName,
                              userEmail: result.user.email,
                              userPhotoURL: result.user.photoURL,
                              userRole: "student",
                           });
                        })
                        .catch((err) =>
                           toast({
                              variant: "error",
                              description: `Login Failed : ${err.message}`,
                           })
                        );
                  }}>
                  <FaGoogle size={20} />
               </Button>
               <Button variant='outline' size='iconLG'>
                  <FaGithub size={20} />
               </Button>
            </div>
         </div>
      </div>
   );
};

export default SocialLogin;
