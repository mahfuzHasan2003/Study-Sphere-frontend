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
import ManageAllMaterials from "@/pages/Dashboard/Admin/ManageAllMaterials";
import BookedSessions from "@/pages/Dashboard/Student/BookedSessions";
import AdminRoute from "@/private/AdminRoute";
import TutorRoute from "@/private/TutorRoute";
import StudentRoute from "@/private/StudentRoute";
import StudyMaterials from "@/pages/Dashboard/Student/StudyMaterials";
import Payment from "@/pages/payment/Payment";
import PrivateRoute from "@/private/PrivateRoute";
import DashboardWelcome from "@/pages/Dashboard/DashboardWelcome";

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
            index: true,
            element: (
               <PrivateRoute>
                  <DashboardWelcome />
               </PrivateRoute>
            ),
         },
         // ------------- student routes ----------
         {
            path: "booked-sessions",
            element: (
               <StudentRoute>
                  <BookedSessions />
               </StudentRoute>
            ),
         },
         {
            path: "make-payment/:id",
            element: (
               <StudentRoute>
                  <Payment />
               </StudentRoute>
            ),
         },
         {
            path: "notes/manage",
            element: (
               <StudentRoute>
                  <CreateOrManageNotes />
               </StudentRoute>
            ),
         },
         {
            path: "materials",
            element: (
               <StudentRoute>
                  <StudyMaterials />
               </StudentRoute>
            ),
         },

         // ----------- tutor routes -----------
         {
            path: "tutor-sessions",
            element: (
               <TutorRoute>
                  <TutorSessions />
               </TutorRoute>
            ),
         },
         {
            path: "create-session",
            element: (
               <TutorRoute>
                  <CreateStudySession />
               </TutorRoute>
            ),
         },
         {
            path: "upload-and-manage-materials",
            element: (
               <TutorRoute>
                  <UploadAndManageMaterials />
               </TutorRoute>
            ),
         },
         {
            path: "update-material/:id",
            element: (
               <TutorRoute>
                  <UpdateMaterial />
               </TutorRoute>
            ),
         },

         // ------------ admin routes ------------
         {
            path: "users/all",
            element: (
               <AdminRoute>
                  <AllUsers />
               </AdminRoute>
            ),
         },
         {
            path: "all-study-sessions/manage",
            element: (
               <AdminRoute>
                  <ManageAllStudySessions />
               </AdminRoute>
            ),
         },
         {
            path: "materials/all/manage",
            element: (
               <AdminRoute>
                  <ManageAllMaterials />
               </AdminRoute>
            ),
         },
      ],
   },
   {
      path: "*",
      element: <ErrorPage />,
   },
]);

export default routes;
