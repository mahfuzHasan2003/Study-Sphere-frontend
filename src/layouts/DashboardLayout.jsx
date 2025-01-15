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
import GetUserRole from "@/shared/GetUserRole";
import TutorRoutes from "./DashboardRoutes/TutorRoutes";
import AdminRoutes from "./DashboardRoutes/AdminRoutes";
import StudentRoutes from "./DashboardRoutes/StudentRoutes";
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { BiBookAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
   const role = GetUserRole();
   const publicRoutes = [
      { label: "Home", href: "/", icon: AiFillHome },
      { label: "All Sessions", href: "/sessions/all", icon: BiBookAlt },
   ];
   const dashboardRoutes =
      role === "tutor"
         ? TutorRoutes
         : role === "admin"
         ? AdminRoutes
         : StudentRoutes;
   return (
      <>
         <SidebarProvider>
            <div className='flex'>
               <Sidebar>
                  <SidebarHeader>Heyy</SidebarHeader>
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
                           {role?.charAt(0).toUpperCase() + role?.slice(1)}{" "}
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
                  <SidebarFooter>Foot</SidebarFooter>
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
