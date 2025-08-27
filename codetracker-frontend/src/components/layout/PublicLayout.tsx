import { Outlet } from "react-router-dom";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { Footer } from "./Footer";
import { PublicNavbar } from "./PublicNavbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-24 pb-6 px-4 lg:px-8">
        <AppBreadcrumb />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
