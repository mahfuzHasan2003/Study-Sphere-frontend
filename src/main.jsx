import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./router/Routes.jsx";
import AuthProvider from "./providers/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <AuthProvider>
               <RouterProvider router={routes} />
               <Toaster />
            </AuthProvider>
         </ThemeProvider>
      </QueryClientProvider>
   </StrictMode>
);
