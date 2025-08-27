import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "./DashboardLayout";
import { PublicLayout } from "./PublicLayout";

/**
 * A layout that conditionally renders the DashboardLayout for authenticated users
 * and the PublicLayout for unauthenticated users.
 * Both layouts render their children via an <Outlet />, so this component
 * can be used as a parent route element.
 */
export function HybridLayout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <DashboardLayout /> : <PublicLayout />;
}
