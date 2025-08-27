import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
