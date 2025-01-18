import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "@/pages/Home";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import DashboardLayout from "@/layouts/DashboardLayout";
import TutorSessions from "@/pages/Dashboard/Tutor/TutorSessions";
import CreateStudySession from "@/pages/Dashboard/Tutor/CreateStudySession";
import CreateOrManageNotes from "@/pages/Dashboard/Student/CreateOrManageNotes";
import AllUsers from "@/pages/Dashboard/Admin/AllUsers";

const routes = createBrowserRouter([
   {
      path: "/",
      element: <MainLayout />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "auth/signin",
            element: <SignIn />,
         },
         {
            path: "auth/signup",
            element: <SignUp />,
         },
      ],
   },
   {
      path: "dashboard",
      element: <DashboardLayout />,
      children: [
         // dashboard welcome page
         {
            path: "/dashboard",
            element: <h1> Dashboard Home</h1>,
         },

         // student routes
         {
            path: "notes/manage",
            element: <CreateOrManageNotes />,
         },

         // tutor routes
         {
            path: "tutor-sessions",
            element: <TutorSessions />,
         },
         {
            path: "create-session",
            element: <CreateStudySession />,
         },

         // admin routes
         {
            path: "users/all",
            element: <AllUsers />,
         },
      ],
   },
   {
      path: "*",
      element: <ErrorPage />,
   },
]);

export default routes;
