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
import { Link, Outlet, useLocation } from "react-router-dom";
import { NavUser } from "@/components/nav-user";
import { GiTeacher } from "react-icons/gi";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardLayout = () => {
  const {
    userRole,
    isRoleLoading,
    isAuthLoading,
    userName,
    userEmail,
    userPhotoURL,
  } = GetUserWithRole();

  const publicRoutes = [
    { label: "Home", href: "/", icon: BiHomeAlt },
    { label: "All Sessions", href: "/all-sessions", icon: GiTeacher },
  ];
  const dashboardRoutes =
    userRole === "tutor"
      ? TutorRoutes
      : userRole === "admin"
      ? AdminRoutes
      : StudentRoutes;

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // sidebar skeleton
  const SidebarSkeleton = () => (
    <div className="w-64 bg-sidebar min-h-screen p-4 flex flex-col gap-4">
      <div className="p-6 bg-gradient-to-b from-purple-600 to-blue-500 dark:from-purple-700 dark:to-blue-600 rounded-lg">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`public-${index}`}
                className="h-6 w-full rounded-md"
              />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`private-${index}`}
                className="h-6 w-full rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <Toaster />
      <SidebarProvider>
        {isRoleLoading || isAuthLoading ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="py-6 px-6 bg-gradient-to-b from-purple-600 to-blue-500 dark:from-purple-700 dark:to-blue-600 text-white rounded-lg">
                    <p className="text-3xl font-semibold">Study Sphere</p>
                    <p className="text-sm text-gray-200 mt-2">
                      Welcome, {userRole}
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
                  {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}{" "}
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
                  name: userName,
                  email: userEmail,
                  avatar: userPhotoURL,
                }}
              />
            </SidebarFooter>
          </Sidebar>
        )}

        <div className="flex-1 flex flex-col">
          <SidebarTrigger className="z-20 w-max" />
          <div className="p-5 md:p-10 mt-10 lg:mt-0 flex-grow">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
