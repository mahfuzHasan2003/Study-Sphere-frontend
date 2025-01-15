import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import GetUserWithRole from "@/shared/GetUserWithRole";
import TutorRoutes from "./DashboardRoutes/TutorRoutes";
import AdminRoutes from "./DashboardRoutes/AdminRoutes";
import StudentRoutes from "./DashboardRoutes/StudentRoutes";
import { BiBookAlt, BiHomeAlt } from "react-icons/bi";
import { Link, Outlet } from "react-router-dom";
import { NavUser } from "@/components/nav-user";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = () => {
   const userWithRole = GetUserWithRole();
   const publicRoutes = [
      { label: "Home", href: "/", icon: BiHomeAlt },
      { label: "All Sessions", href: "/sessions/all", icon: BiBookAlt },
   ];
   const dashboardRoutes =
      userWithRole?.userRole === "tutor"
         ? TutorRoutes
         : userWithRole?.userRole === "admin"
         ? AdminRoutes
         : StudentRoutes;
   return (
      <>
         <SidebarProvider>
            <div className='flex'>
               <Sidebar>
                  <SidebarHeader>
                     <SidebarMenu>
                        <SidebarMenuItem>
                           <div className='text-center py-2'>
                              <p className='font-semibold'> Study Sphere</p>
                              <Badge variant='default'>
                                 {userWithRole?.userRole} dashboard
                              </Badge>
                           </div>
                        </SidebarMenuItem>
                     </SidebarMenu>
                  </SidebarHeader>
                  <Separator />
                  <SidebarContent>
                     <SidebarGroup>
                        <SidebarGroupLabel>Public Routes</SidebarGroupLabel>
                        <SidebarGroupContent>
                           <SidebarMenu>
                              {publicRoutes.map((menuIntem) => (
                                 <SidebarMenuItem key={menuIntem.label}>
                                    <SidebarMenuButton asChild>
                                       <Link to={menuIntem.href}>
                                          <menuIntem.icon />
                                          <span>{menuIntem.label}</span>
                                       </Link>
                                    </SidebarMenuButton>
                                 </SidebarMenuItem>
                              ))}
                           </SidebarMenu>
                        </SidebarGroupContent>
                     </SidebarGroup>
                     <SidebarGroup>
                        <SidebarGroupLabel>
                           {userWithRole?.userRole?.charAt(0).toUpperCase() +
                              userWithRole?.userRole?.slice(1)}{" "}
                           Routes
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                           <SidebarMenu>
                              {dashboardRoutes.map((menuIntem) => (
                                 <SidebarMenuItem key={menuIntem.label}>
                                    <SidebarMenuButton asChild>
                                       <Link to={menuIntem.href}>
                                          <menuIntem.icon />
                                          <span>{menuIntem.label}</span>
                                       </Link>
                                    </SidebarMenuButton>
                                 </SidebarMenuItem>
                              ))}
                           </SidebarMenu>
                        </SidebarGroupContent>
                     </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter>
                     <NavUser
                        user={{
                           name: userWithRole?.userName,
                           email: userWithRole?.userEmail,
                           avatar: userWithRole?.userPhotoURL,
                        }}
                     />
                  </SidebarFooter>
               </Sidebar>
               <div className='flex-1'>
                  <SidebarTrigger />
                  <div className='p-10 mt-10 lg:mt-0'>
                     <Outlet />
                  </div>
               </div>
            </div>
         </SidebarProvider>
      </>
   );
};

export default DashboardLayout;
