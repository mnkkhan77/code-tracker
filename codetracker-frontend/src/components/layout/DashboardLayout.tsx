import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { Footer } from "./Footer";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar } from "./Sidebar";
import { UserNav } from "./UserNav";

export function DashboardLayout() {
  const { isAdmin } = useAuth();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card">
          <Sidebar />
        </div>
      </div>

      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top Header for mobile and desktop */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-background px-4 sm:px-6 lg:px-8">
          {/* Left section */}
          <div className="flex flex-1 items-center justify-start">
            <MobileSidebar />
          </div>

          {/* Centered Logo for ALL screens */}
          <div className="flex-shrink-0">
            <Link
              to={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                CodeTracker
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex flex-1 items-center justify-end gap-x-4">
            <ThemeToggleButton />
            <UserNav />
          </div>
        </div>

        {/* Page Content */}
        <motion.main
          className="py-6 px-4 lg:px-8 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AppBreadcrumb />
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
