import { AiOutlineLogout, AiOutlineCheckCircle } from "react-icons/ai";
import { RiExpandUpDownLine } from "react-icons/ri";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import UserAvatar from "@/shared/UserAvatar";

export function NavUser({ user }) {
   const { isMobile } = useSidebar();
   const { signOutUser } = useAuth();
   const navigate = useNavigate();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size='lg'
                     className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                     <UserAvatar userName={user.name} imageURL={user.avatar} />
                     <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                           {user.name}
                        </span>
                        <span className='truncate text-xs'>{user.email}</span>
                     </div>
                     <RiExpandUpDownLine className='ml-auto size-4' />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                  side={isMobile ? "bottom" : "right"}
                  align='end'
                  sideOffset={4}>
                  <DropdownMenuLabel className='p-0 font-normal'>
                     <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <UserAvatar
                           userName={user.name}
                           imageURL={user.avatar}
                        />
                        <div className='grid flex-1 text-left text-sm leading-tight'>
                           <span className='truncate font-semibold'>
                              {user.name}
                           </span>
                           <span className='truncate text-xs'>
                              {user.email}
                           </span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <AiOutlineCheckCircle />
                        Account
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuItem
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
                     <AiOutlineLogout />
                     Log out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
