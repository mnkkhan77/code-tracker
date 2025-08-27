import App from "@/App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { AuthProvider } from "@/hooks/use-auth";
import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
