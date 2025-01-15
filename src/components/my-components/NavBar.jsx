import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import UserAvatar from "@/shared/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

const NavBar = () => {
   const { user, signOutUser } = useAuth();
   // console.log(user);
   const { toast } = useToast();
   const navigate = useNavigate();

   return (
      <div className='flex items-center justify-between max-w-8xl mx-auto py-5'>
         <Link to='/'>
            <h4 className='text-xl md:text-2xl font-semibold'>StudySphere</h4>
         </Link>
         <div></div>
         <div className='flex items-center gap-2'>
            <ModeToggle />
            {user ? (
               <Popover>
                  <PopoverTrigger>
                     <UserAvatar
                        userName={user.displayName}
                        imageURL={user.photoURL}
                     />
                  </PopoverTrigger>
                  <PopoverContent>
                     Place content for the popover here.
                     <Button
                        variant='destructive'
                        onClick={() => {
                           signOutUser()
                              .then(() => {
                                 toast({
                                    variant: "success",
                                    description: `Logout Success!`,
                                 });
                                 navigate("/");
                              })
                              .catch((err) =>
                                 toast({
                                    variant: "error",
                                    description: `Logout Failed : ${err.message}`,
                                 })
                              );
                        }}>
                        Log Out
                     </Button>
                  </PopoverContent>
               </Popover>
            ) : (
               <div>
                  <Link to='/auth/signin'>
                     <Button>Sign In</Button>
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
};

export default NavBar;
