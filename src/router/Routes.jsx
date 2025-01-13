import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
const routes = createBrowserRouter([
   {
      path: "/",
      element: <MainLayout />,
   },
   {
      path: "*",
      element: <ErrorPage />,
   },
]);

export default routes;
