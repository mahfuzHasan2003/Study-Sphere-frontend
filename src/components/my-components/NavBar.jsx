import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import UserAvatar from "@/shared/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const NavBar = () => {
   const { user, signOutUser, authLoading } = useAuth();
   // console.log(user);
   const { toast } = useToast();
   const navigate = useNavigate();

   const NavBarSkeleton = () => {
      return (
         <div className='flex items-center justify-between max-w-8xl mx-auto py-5 px-5 lg:px-0'>
            <Skeleton className='w-36 h-6' />

            <div className='hidden md:inline-flex items-center gap-3'>
               <Skeleton className='w-8 h-5' />
               <Skeleton className='w-10 h-6' />
               <Skeleton className='w-8 h-5' />
            </div>

            <div className='flex items-center gap-2'>
               <div className='flex gap-2'>
                  <Skeleton className='w-24 h-10' />
                  <Skeleton className='w-24 h-10 hidden md:inline-flex' />
               </div>
               <Skeleton className='w-10 h-10 rounded-full' />
            </div>
         </div>
      );
   };

   return authLoading ? (
      <NavBarSkeleton />
   ) : (
      <div className='flex items-center justify-between max-w-8xl mx-auto py-5 px-5'>
         <Link to='/'>
            <h4 className='text-xl md:text-2xl font-semibold'>StudySphere</h4>
         </Link>
         <div className='hidden md:inline-flex items-center gap-3'>
            <span>Dark</span>
            <ModeToggle />
            <span>Light</span>
         </div>
         <div className='flex items-center gap-2'>
            {user ? (
               <>
                  <Link to='dashboard'>
                     <Button>Dashboard</Button>
                  </Link>
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
                     }}
                     className='hidden md:inline-flex'>
                     Log Out
                  </Button>
                  <UserAvatar
                     userName={user.displayName}
                     imageURL={user.photoURL}
                  />
               </>
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
