import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./router/Routes.jsx";
import AuthProvider from "./providers/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
         <AuthProvider>
            <RouterProvider router={routes} />
            <Toaster />
         </AuthProvider>
      </ThemeProvider>
   </StrictMode>
);
