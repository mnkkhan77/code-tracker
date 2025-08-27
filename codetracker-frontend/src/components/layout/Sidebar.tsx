import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  DollarSign,
  FileCheck,
  Home,
  Target,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const allNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Topics", href: "/topics", icon: BookOpen },
  { name: "Problems", href: "/problems", icon: Target },
  { name: "Progress", href: "/progress", icon: Target },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "ATS Resume Checker", href: "/ats-resume-checker", icon: FileCheck },
  { name: "Profile", href: "/profile", icon: User },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
];

const adminHiddenLinks = ["/progress", "/reminders", "/ats-resume-checker"];

interface SidebarProps {
  onLinkClick?: () => void;
}

export const Sidebar = ({ onLinkClick }: SidebarProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigation = isAdmin
    ? allNavigation.filter((item) => !adminHiddenLinks.includes(item.href))
    : allNavigation;

  return (
    <div className="flex flex-col h-full p-6">
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const href =
            isAdmin && item.name === "Dashboard"
              ? "/admin/dashboard"
              : item.href;
          const isActive =
            location.pathname === href ||
            (isAdmin &&
              item.name === "Dashboard" &&
              location.pathname.startsWith("/admin"));

          return (
            <motion.div key={item.name} whileHover={{ x: 4 }}>
              <Link
                to={href}
                onClick={onLinkClick}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
};
