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
import { BiHomeAlt } from "react-icons/bi";
import { Link, Outlet } from "react-router-dom";
import { NavUser } from "@/components/nav-user";
import { GiTeacher } from "react-icons/gi";

const DashboardLayout = () => {
   const userWithRole = GetUserWithRole();
   const publicRoutes = [
      { label: "Home", href: "/", icon: BiHomeAlt },
      { label: "All Sessions", href: "/sessions/all", icon: GiTeacher },
   ];
   const dashboardRoutes =
      userWithRole?.userRole === "tutor"
         ? TutorRoutes
         : userWithRole?.userRole === "admin"
         ? AdminRoutes
         : StudentRoutes;
   return (
      <div>
         <SidebarProvider>
            <Sidebar>
               <SidebarHeader>
                  <SidebarMenu>
                     <SidebarMenuItem>
                        <div className='py-6 px-6 bg-gradient-to-b from-purple-600 to-blue-500 dark:from-purple-700 dark:to-blue-600 text-white rounded-lg'>
                           <p className='text-3xl font-semibold'>
                              Study Sphere
                           </p>
                           <p className='text-sm text-gray-200 mt-2'>
                              Welcome, {userWithRole?.userRole}
                           </p>
                        </div>
                     </SidebarMenuItem>
                  </SidebarMenu>
               </SidebarHeader>
               <SidebarContent>
                  {/* Public routes */}
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
                  {/* private routes */}
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
               <SidebarTrigger className='z-20' />
               <div className='p-5 md:p-10 mt-10 lg:mt-0'>
                  <Outlet />
               </div>
            </div>
         </SidebarProvider>
      </div>
   );
};

export default DashboardLayout;
