import { useAuth } from "@/hooks/use-auth";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/topics": "Topics",
  "/problems": "Problems",
  "/progress": "Progress",
  "/reminders": "Reminders",
  "/profile": "Profile",
  "/ats-resume-checker": "ATS Resume Checker",
  "/admin": "Admin",
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/problems": "Problems",
  "/admin/revenue": "Revenue",
  "/about": "About",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/login": "Login",
  "/register": "Register",
  "/auth": "Authentication",
};

export function AppBreadcrumb() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const homePath = isAuthenticated
    ? isAdmin
      ? "/admin/dashboard"
      : "/dashboard"
    : "/";

  if (location.pathname === "/") return null;

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 text-sm">
        <li>
          <div>
            <Link
              to={homePath}
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name =
            breadcrumbNameMap[to] ||
            value.charAt(0).toUpperCase() + value.slice(1);

          if (isAdmin && to === "/admin") return null;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight
                  className="h-4 w-4 flex-shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <Link
                  to={to}
                  className={`ml-2 font-medium ${
                    isLast
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {name}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
