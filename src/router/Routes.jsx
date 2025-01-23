import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/public/ErrorPage";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import DashboardLayout from "@/layouts/DashboardLayout";
import TutorSessions from "@/pages/Dashboard/Tutor/TutorSessions";
import CreateStudySession from "@/pages/Dashboard/Tutor/CreateStudySession";
import CreateOrManageNotes from "@/pages/Dashboard/Student/CreateOrManageNotes";
import AllUsers from "@/pages/Dashboard/Admin/AllUsers";
import ManageAllStudySessions from "@/pages/Dashboard/Admin/ManageAllStudySessions";
import AllStudySessions from "@/pages/public/AllStudySessions";
import SessionDetails from "@/pages/public/SessionDetails";
import Home from "@/pages/public/Home";
import UploadAndManageMaterials from "@/pages/Dashboard/Tutor/UploadAndManageMaterials";
import UpdateMaterial from "@/pages/UpdateMaterial";

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
            path: "all-sessions",
            element: <AllStudySessions />,
         },
         {
            path: "session-details/:id",
            element: <SessionDetails />,
         },
         {
            path: "all-sessions",
            element: <AllStudySessions />,
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
         {
            path: "update-material/:id",
            element: <UpdateMaterial />,
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
         {
            path: "upload-and-manage-materials",
            element: <UploadAndManageMaterials />,
         },

         // admin routes
         {
            path: "users/all",
            element: <AllUsers />,
         },
         {
            path: "all-study-sessions/manage",
            element: <ManageAllStudySessions />,
         },
      ],
   },
   {
      path: "*",
      element: <ErrorPage />,
   },
]);

export default routes;
